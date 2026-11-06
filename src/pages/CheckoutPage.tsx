import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Package, Truck, ShieldCheck, MessageCircle, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { useCurrency } from '@/context/CurrencyContext';
import { updateVisitorInfo } from '@/lib/visitorTracking';
import type { Order } from '@/types';

interface CheckoutPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const WHATSAPP_NUMBER = '2348037049003';

type PaymentMethod = 'whatsapp' | 'paystack' | 'flutterwave' | 'pod';

export default function CheckoutPage({ onBack, onNavigate }: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: 'Port Harcourt',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');
  const [status, setStatus] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const metadata = data.user.user_metadata as { full_name?: string; phone?: string };
      setFormData((current) => ({
        ...current,
        name: metadata.full_name || current.name,
        email: data.user.email || current.email,
        phone: metadata.phone || current.phone,
      }));
    });
  }, []);

  const freeDeliveryThresholdUSD = 100000 / 1515;
  const deliveryFeeUSD = subtotal >= freeDeliveryThresholdUSD ? 0 : 15;
  const total = subtotal + deliveryFeeUSD;

  const buildWhatsAppMessage = () => {
    const itemList = items.map((item) => `• ${item.product.name} x${item.quantity} — ${formatPrice(item.product.price * item.quantity, currency)}`).join('\n');
    const delivery = items.length > 0 ? `Delivery: ${deliveryFeeUSD === 0 ? 'Free' : formatPrice(deliveryFeeUSD, currency)}` : '';
    return `Hello Protech Digital, I want to place an order:\n\n${itemList}\n\nSubtotal: ${formatPrice(subtotal, currency)}\n${delivery}\nTotal: ${formatPrice(total, currency)}\n\nName: ${formData.name}\nPhone: ${formData.phone}\nDelivery Address: ${formData.address}, ${formData.city}\n\nPayment: ${paymentMethod === 'pod' ? 'Pay on Delivery' : paymentMethod === 'paystack' ? 'Paystack (card)' : paymentMethod === 'flutterwave' ? 'Flutterwave (card/transfer)' : 'WhatsApp confirmation'}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const fullAddress = `${formData.address}, ${formData.city}`;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: fullAddress,
        items: orderItems,
        total: total,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      setStatus('error');
      return;
    }

    await updateVisitorInfo(formData.name, formData.email, formData.phone || null, 'ordered');

    // If WhatsApp or Pay on Delivery, open WhatsApp with order details
    if (paymentMethod === 'whatsapp' || paymentMethod === 'pod') {
      const message = encodeURIComponent(buildWhatsAppMessage());
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
    }

    setOrderId(data.id);
    setStatus('success');
    clearCart();
  };

  // Success state
  if (status === 'success') {
    const usedWhatsApp = paymentMethod === 'whatsapp' || paymentMethod === 'pod';
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 animate-fade-in">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/40 flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <Check className="w-10 h-10 text-[var(--accent-green)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Order Received!</h1>
          <p className="text-[var(--text-secondary)] mt-3">
            {usedWhatsApp
              ? 'We\'ve opened WhatsApp with your order details. Send the message to confirm your order and we\'ll respond within minutes.'
              : 'Your order has been placed. Complete your payment using the link below.'}
          </p>
          <div className="mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Order ID</span>
              <span className="font-mono text-[var(--accent-cyan)]">{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-[var(--text-muted)]">Status</span>
              <span className="text-[var(--accent-green)] font-medium">Pending Confirmation</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-[var(--text-muted)]">Total</span>
              <span className="font-bold">{formatPrice(total, currency)}</span>
            </div>
          </div>
          {usedWhatsApp && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp Again
            </a>
          )}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> Delivery in 24hrs</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Quality guaranteed</span>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full border border-[var(--border-light)] flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-[var(--text-secondary)] mt-2">Add some products before checking out.</p>
          <button
            onClick={() => onNavigate('catalog')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Catalog
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
              <h2 className="text-lg font-semibold mb-4">Contact & Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                    placeholder="House number, street name, area"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">City</label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
                  >
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === 'whatsapp'
                      ? 'border-[var(--accent-green)]/50 bg-[var(--accent-green)]/5'
                      : 'border-[var(--border)] hover:border-[var(--border-light)]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Order on WhatsApp</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">Send your order details via WhatsApp. We confirm and arrange payment.</div>
                  </div>
                  {paymentMethod === 'whatsapp' && <Check className="w-5 h-5 text-[var(--accent-green)]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('pod')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === 'pod'
                      ? 'border-[var(--accent-green)]/50 bg-[var(--accent-green)]/5'
                      : 'border-[var(--border)] hover:border-[var(--border-light)]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/40 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-[var(--accent-green)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Pay on Delivery</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">Pay with cash or bank transfer when your order arrives. Available in Port Harcourt & Lagos.</div>
                  </div>
                  {paymentMethod === 'pod' && <Check className="w-5 h-5 text-[var(--accent-green)]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paystack')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === 'paystack'
                      ? 'border-[var(--accent-cyan)]/50 bg-[var(--accent-cyan)]/5'
                      : 'border-[var(--border)] hover:border-[var(--border-light)]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[var(--accent-cyan)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Pay with Card (Paystack)</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">Pay securely with your debit/credit card via Paystack.</div>
                  </div>
                  {paymentMethod === 'paystack' && <Check className="w-5 h-5 text-[var(--accent-cyan)]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('flutterwave')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === 'flutterwave'
                      ? 'border-[var(--accent-cyan)]/50 bg-[var(--accent-cyan)]/5'
                      : 'border-[var(--border)] hover:border-[var(--border-light)]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[var(--accent-cyan)]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Pay with Flutterwave</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">Card, bank transfer, or USSD via Flutterwave.</div>
                  </div>
                  {paymentMethod === 'flutterwave' && <Check className="w-5 h-5 text-[var(--accent-cyan)]" />}
                </button>
              </div>
            </div>

            {status === 'error' && (
              <div className="p-4 rounded-xl border border-[var(--accent-red)]/40 bg-[var(--accent-red)]/10 text-sm text-[var(--accent-red)]">
                Something went wrong placing your order. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              {status === 'submitting' ? (
                'Placing Order...'
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Place Order — {formatPrice(total, currency)}
                </>
              )}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--accent-cyan)] whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Delivery</span>
                  <span>{deliveryFeeUSD === 0 ? 'Free' : formatPrice(deliveryFeeUSD, currency)}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold gradient-text-cyan">{formatPrice(total, currency)}</span>
                </div>
              </div>

              {subtotal < freeDeliveryThresholdUSD && (
                <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
                  Add {formatPrice(Math.max(0, freeDeliveryThresholdUSD - subtotal), currency)} more for free delivery
                </p>
              )}

              {/* Delivery info */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Truck className="w-4 h-4 text-[var(--accent-green)]" />
                  <span>Delivery in 24 hours (PH & Lagos)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <MapPin className="w-4 h-4 text-[var(--accent-cyan)]" />
                  <span>Pay on delivery available in Port Harcourt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
