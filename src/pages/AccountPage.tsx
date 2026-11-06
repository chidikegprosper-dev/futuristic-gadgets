import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronRight, LogOut, Mail, Package, Phone, Receipt, Star, UserRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import type { Order, ProductReview } from '@/types';

interface AccountPageProps {
  onNavigate: (page: string) => void;
  onSignedOut: () => void;
}

interface ReviewProduct {
  id: string;
  name: string;
  image_url: string;
}

function ReviewStars({ rating }: { rating: number }) {
  return <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`w-4 h-4 ${index < rating ? 'fill-[var(--accent-amber)] text-[var(--accent-amber)]' : 'text-[var(--border-light)]'}`} />)}</span>;
}

export default function AccountPage({ onNavigate, onSignedOut }: AccountPageProps) {
  const [userEmail, setUserEmail] = useState('');
  const [profile, setProfile] = useState({ name: 'Customer', phone: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewProducts, setReviewProducts] = useState<Record<string, ReviewProduct>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAccount = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        if (active) {
          setError('Please sign in to view your account.');
          setLoading(false);
        }
        return;
      }

      const metadata = userData.user.user_metadata as { full_name?: string; phone?: string };
      const [ordersResult, reviewsResult] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('product_reviews').select('*').order('created_at', { ascending: false }),
      ]);

      if (!active) return;
      if (ordersResult.error || reviewsResult.error) {
        setError('Some account information could not be loaded. Please refresh and try again.');
      }
      setUserEmail(userData.user.email || '');
      setProfile({ name: metadata.full_name || userData.user.email?.split('@')[0] || 'Customer', phone: metadata.phone || '' });
      setOrders((ordersResult.data || []) as Order[]);
      const loadedReviews = (reviewsResult.data || []) as ProductReview[];
      setReviews(loadedReviews);

      if (loadedReviews.length > 0) {
        const productIds = [...new Set(loadedReviews.map((review) => review.product_id))];
        const { data: productData } = await supabase.from('products').select('id, name, image_url').in('id', productIds);
        if (active && productData) {
          setReviewProducts(Object.fromEntries((productData as ReviewProduct[]).map((product) => [product.id, product])));
        }
      }
      setLoading(false);
    };

    void loadAccount();
    return () => { active = false; };
  }, []);

  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total || 0), 0), [orders]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignedOut();
  };

  return (
    <div className="min-h-screen pt-20 bg-grid bg-grid-fade animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2"><UserRound className="w-5 h-5 text-[var(--accent-cyan)]" /><span className="text-sm font-mono text-[var(--accent-cyan)] uppercase tracking-wider">Customer account</span></div>
            <h1 className="text-4xl font-bold tracking-tight">Your <span className="gradient-text-cyan">Profile</span></h1>
            <p className="text-[var(--text-secondary)] mt-2">Manage your orders, account details, and product feedback.</p>
          </div>
          <button type="button" onClick={handleSignOut} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-light)] text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--accent-red)]/50 hover:text-[var(--accent-red)] transition-colors"><LogOut className="w-4 h-4" />Sign out</button>
        </div>

        {error && <div className="mb-6 rounded-xl border border-[var(--accent-red)]/40 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <div className="w-16 h-16 rounded-2xl gradient-cyan flex items-center justify-center text-2xl font-bold text-black mb-5">{profile.name.charAt(0).toUpperCase()}</div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-3"><Mail className="w-4 h-4 text-[var(--accent-cyan)]" />{userEmail}</div>
              {profile.phone && <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-2"><Phone className="w-4 h-4 text-[var(--accent-green)]" />{profile.phone}</div>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4"><Package className="w-5 h-5 text-[var(--accent-cyan)] mb-3" /><div className="text-2xl font-bold">{orders.length}</div><div className="text-xs text-[var(--text-muted)] mt-1">Orders</div></div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4"><Star className="w-5 h-5 text-[var(--accent-amber)] mb-3" /><div className="text-2xl font-bold">{reviews.length}</div><div className="text-xs text-[var(--text-muted)] mt-1">Reviews</div></div>
            </div>
          </aside>

          <main className="space-y-8">
            <section>
              <div className="flex items-end justify-between gap-4 mb-4"><div><p className="text-sm font-mono uppercase tracking-wider text-[var(--accent-cyan)]">Purchase history</p><h2 className="text-2xl font-bold mt-1">Your Orders</h2></div><div className="text-sm text-[var(--text-secondary)]">Total: <span className="font-semibold text-[var(--text-primary)]">{formatPrice(totalSpent)}</span></div></div>
              {loading ? <div className="h-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shimmer" /> : orders.length === 0 ? <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center"><Receipt className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" /><p className="font-medium">No orders yet</p><p className="text-sm text-[var(--text-muted)] mt-1">Your completed purchases will appear here.</p><button type="button" onClick={() => onNavigate('catalog')} className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-cyan text-black text-sm font-semibold">Browse catalog<ChevronRight className="w-4 h-4" /></button></div> : <div className="space-y-3">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">Order #{order.id.slice(0, 8).toUpperCase()}</p><p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-1"><CalendarDays className="w-3.5 h-3.5" />{new Date(order.created_at).toLocaleDateString()}</p></div><div className="text-right"><p className="text-lg font-bold gradient-text-cyan">{formatPrice(Number(order.total))}</p><span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs capitalize border border-[var(--accent-amber)]/30 text-[var(--accent-amber)] bg-[var(--accent-amber)]/10">{order.status}</span></div></div><div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2">{order.items.map((item) => <span key={`${order.id}-${item.product_id}`} className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)]">{item.name} × {item.quantity}</span>)}</div></article>)}</div>}
            </section>

            <section>
              <div className="mb-4"><p className="text-sm font-mono uppercase tracking-wider text-[var(--accent-amber)]">Your feedback</p><h2 className="text-2xl font-bold mt-1">Review History</h2></div>
              {loading ? <div className="h-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shimmer" /> : reviews.length === 0 ? <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center text-sm text-[var(--text-muted)]">You have not posted any reviews yet.</div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{reviews.map((review) => { const reviewedProduct = reviewProducts[review.product_id]; return <article key={review.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex gap-4">{reviewedProduct && <img src={reviewedProduct.image_url} alt={reviewedProduct.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}<div className="min-w-0"><p className="font-semibold truncate">{reviewedProduct?.name || 'Product review'}</p><div className="flex items-center gap-2 mt-2"><ReviewStars rating={review.rating} /><span className="text-xs text-[var(--text-muted)]">{new Date(review.created_at).toLocaleDateString()}</span></div><p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-3">{review.review_text}</p></div></article>; })}</div>}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
