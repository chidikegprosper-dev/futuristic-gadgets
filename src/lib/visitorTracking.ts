import { supabase } from '@/lib/supabase';
import type { CartItem } from '@/types';

const SESSION_KEY = 'protech-session-id';
const VISITOR_SIGNED_IN = 'protech-visitor-signed-in';
const VISITOR_INFO_KEY = 'protech-visitor-info';

export interface VisitorInfo {
  name: string;
  email: string;
  phone: string;
}

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function isVisitorSignedIn(): boolean {
  return localStorage.getItem(VISITOR_SIGNED_IN) === 'true';
}

export function getStoredVisitorInfo(): VisitorInfo | null {
  try {
    const raw = localStorage.getItem(VISITOR_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeVisitorInfo(info: VisitorInfo) {
  localStorage.setItem(VISITOR_INFO_KEY, JSON.stringify(info));
  localStorage.setItem(VISITOR_SIGNED_IN, 'true');
}

/**
 * Check if a visitor exists in the database by email.
 * If found, update their session and increment visit count.
 * If not found, create a new record.
 * Returns whether the visitor is known (returning) and their info.
 */
export async function checkVisitorByEmail(email: string): Promise<{ returning: boolean; info: VisitorInfo | null }> {
  const { data } = await supabase
    .from('visitor_carts')
    .select('id, customer_name, customer_email, customer_phone, visit_count')
    .eq('customer_email', email)
    .maybeSingle();

  if (data) {
    const sessionId = getSessionId();
    const info: VisitorInfo = {
      name: data.customer_name || '',
      email: data.customer_email || email,
      phone: data.customer_phone || '',
    };

    await supabase
      .from('visitor_carts')
      .update({
        session_id: sessionId,
        visit_count: (data.visit_count || 1) + 1,
        last_page: 'home',
        status: 'browsing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id);

    storeVisitorInfo(info);
    return { returning: true, info };
  }

  return { returning: false, info: null };
}

/**
 * Register a new visitor with their contact info.
 */
export async function registerVisitor(info: VisitorInfo): Promise<void> {
  const sessionId = getSessionId();

  const { data: existing } = await supabase
    .from('visitor_carts')
    .select('id, visit_count')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('visitor_carts')
      .update({
        customer_name: info.name,
        customer_email: info.email,
        customer_phone: info.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);
  } else {
    await supabase.from('visitor_carts').insert({
      session_id: sessionId,
      customer_name: info.name,
      customer_email: info.email,
      customer_phone: info.phone,
      cart_items: [],
      cart_total: 0,
      status: 'browsing',
      last_page: 'home',
      visit_count: 1,
      products_viewed: [],
    });
  }

  storeVisitorInfo(info);
}

/**
 * Check if the current session belongs to a known visitor.
 * Used on page load to detect returning visitors without showing the sign-in popup.
 */
export async function checkSessionVisitor(): Promise<{ known: boolean; info: VisitorInfo | null }> {
  const stored = getStoredVisitorInfo();
  if (stored && isVisitorSignedIn()) {
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('visitor_carts')
      .select('id, visit_count, customer_email')
      .eq('customer_email', stored.email)
      .maybeSingle();

    if (data) {
      await supabase
        .from('visitor_carts')
        .update({
          session_id: sessionId,
          visit_count: (data.visit_count || 1) + 1,
          last_page: 'home',
          status: 'browsing',
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);
      return { known: true, info: stored };
    }
  }

  return { known: false, info: null };
}

/**
 * Initialize a browsing session for a known visitor (already signed in).
 */
export async function initKnownVisitor(page: string): Promise<void> {
  const sessionId = getSessionId();
  const { data } = await supabase
    .from('visitor_carts')
    .select('id')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (data) {
    await supabase
      .from('visitor_carts')
      .update({
        last_page: page,
        updated_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId);
  }
}

/**
 * Track a product view by adding it to the products_viewed array.
 */
export async function trackProductView(productId: string, productName: string): Promise<void> {
  const sessionId = getSessionId();

  const { data } = await supabase
    .from('visitor_carts')
    .select('id, products_viewed')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (!data) return;

  const viewed: Array<{ product_id: string; name: string; viewed_at: string }> =
    Array.isArray(data.products_viewed) ? data.products_viewed : [];

  const entry = { product_id: productId, name: productName, viewed_at: new Date().toISOString() };
  const updated = [...viewed, entry].slice(-50);

  await supabase
    .from('visitor_carts')
    .update({
      products_viewed: updated,
      updated_at: new Date().toISOString(),
    })
    .eq('session_id', sessionId);
}

export async function syncCart(
  items: CartItem[],
  subtotal: number,
  page: string,
  status: string = 'browsing'
): Promise<void> {
  const sessionId = getSessionId();

  const cartItems = items.map((item) => ({
    product_id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    image_url: item.product.image_url,
  }));

  await supabase
    .from('visitor_carts')
    .update({
      cart_items: cartItems,
      cart_total: subtotal,
      last_page: page,
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('session_id', sessionId);
}

export async function updateVisitorInfo(
  name: string,
  email: string,
  phone: string | null,
  status: string = 'checkout'
): Promise<void> {
  const sessionId = getSessionId();

  await supabase
    .from('visitor_carts')
    .update({
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('session_id', sessionId);

  storeVisitorInfo({ name, email, phone: phone || '' });
}
