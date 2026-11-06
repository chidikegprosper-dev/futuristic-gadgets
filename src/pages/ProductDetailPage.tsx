import { ArrowLeft, Plus, Minus, Check, ShoppingCart, ChevronRight, MessageCircle, Truck, MapPin, ShieldCheck, Package, Star, Send, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product, ProductReview, ProductReviewSummary } from '@/types';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatOtherCurrency } from '@/lib/format';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductDetailPageProps {
  product: Product;
  reviewSummary?: ProductReviewSummary;
  onReviewSummaryChange?: (productId: string, summary: ProductReviewSummary) => void;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const WHATSAPP_NUMBER = '2348037049003';

function RatingStars({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`${size} ${index < Math.round(rating) ? 'fill-[var(--accent-amber)] text-[var(--accent-amber)]' : 'text-[var(--border-light)]'}`} />)}
    </span>
  );
}

export default function ProductDetailPage({ product, reviewSummary, onReviewSummaryChange, onBack, onNavigate }: ProductDetailPageProps) {
  const { addItem, setIsOpen } = useCart();
  const { currency } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    let active = true;
    setReviewsLoading(true);
    setReviewMessage('');
    supabase.from('product_reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (error) setReviewMessage('Reviews are temporarily unavailable.');
      else setReviews((data || []) as ProductReview[]);
      setReviewsLoading(false);
    });
    return () => { active = false; };
  }, [product.id]);

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : reviewSummary?.averageRating || 0;

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewMessage('');
    setReviewSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Please sign in before posting a review.');
      const metadata = userData.user.user_metadata as { full_name?: string };
      const { error } = await supabase.from('product_reviews').upsert({ product_id: product.id, user_id: userData.user.id, customer_name: metadata.full_name || userData.user.email?.split('@')[0] || 'Customer', rating: reviewRating, review_text: reviewText.trim() }, { onConflict: 'product_id,user_id' });
      if (error) throw error;
      const { data: refreshedReviews } = await supabase.from('product_reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false });
      const nextReviews = (refreshedReviews || []) as ProductReview[];
      setReviews(nextReviews);
      if (onReviewSummaryChange) {
        onReviewSummaryChange(product.id, {
          averageRating: nextReviews.length > 0 ? nextReviews.reduce((sum, review) => sum + review.rating, 0) / nextReviews.length : 0,
          reviewCount: nextReviews.length,
        });
      }
      setReviewText('');
      setReviewMessage('Your review has been posted.');
    } catch (error) {
      setReviewMessage(error instanceof Error ? error.message : 'Unable to post your review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setIsOpen(true);
    }, 800);
  };

  const handleOrderWhatsApp = () => {
    const message = `Hello Protech Digital, I want to order:\n\n*${product.name}*\nPrice: ${formatPrice(product.price, currency)} / ${formatOtherCurrency(product.price, currency)}\nQuantity: ${quantity}\nTotal: ${formatPrice(product.price * quantity, currency)}\n\nPlease confirm availability and delivery.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen pt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <button onClick={() => onNavigate('catalog')} className="hover:text-[var(--text-primary)] transition-colors">
            Catalog
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--text-secondary)]">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--text-primary)] truncate">{product.name}</span>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)] aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
              {product.in_stock && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/40 text-[var(--accent-green)] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
                  In Stock
                </div>
              )}
            </div>
            {/* Ambient glow */}
            <div className="absolute -inset-4 rounded-3xl bg-[var(--accent-cyan)]/5 blur-[60px] -z-10 pointer-events-none" />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--border-light)] text-[var(--text-secondary)]">
                {product.category}
              </span>
              {product.in_stock && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--accent-green)]/30 text-[var(--accent-green)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
                  In Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-lg text-[var(--text-secondary)] mt-2">{product.tagline}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold gradient-text-cyan">{formatPrice(product.price, currency)}</span>
              <span className="text-sm text-[var(--text-muted)]">{formatOtherCurrency(product.price, currency)}</span>
            </div>

            {/* Delivery badges */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5 text-sm text-[var(--accent-green)]">
                <Truck className="w-4 h-4" />
                <span>{currency === 'NGN' ? 'Delivery in 24hrs' : 'DHL Shipping Worldwide'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5 text-sm text-[var(--accent-cyan)]">
                <MapPin className="w-4 h-4" />
                <span>{currency === 'NGN' ? 'Pay on Delivery in PH, Lagos' : 'Shipped from Port Harcourt, Nigeria'}</span>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed mt-6">{product.description}</p>

            {/* Specs */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-3 px-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]"
                  >
                    <span className="text-sm text-[var(--text-muted)]">{key}</span>
                    <span className="text-sm font-medium font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--text-secondary)]">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg border border-[var(--border-light)] flex items-center justify-center hover:border-[var(--accent-cyan)]/50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-mono w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-lg border border-[var(--border-light)] flex items-center justify-center hover:border-[var(--accent-cyan)]/50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* WhatsApp Order button — primary */}
              <button
                onClick={handleOrderWhatsApp}
                disabled={!product.in_stock}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </button>

              {/* Secondary actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || added}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                    added
                      ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/40'
                      : 'border border-[var(--border-light)] hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--accent-cyan)]/10'
                  } disabled:opacity-50`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    addItem(product, quantity);
                    onNavigate('checkout');
                  }}
                  disabled={!product.in_stock}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            {/* Trust footer */}
            <div className="mt-6 pt-6 border-t border-[var(--border)] flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-cyan)]" />
                Quality guaranteed
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Package className="w-4 h-4 text-[var(--accent-cyan)]" />
                Genuine products only
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="border-t border-[var(--border)] pt-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2"><Star className="w-5 h-5 text-[var(--accent-amber)] fill-[var(--accent-amber)]" /><span className="text-sm font-mono text-[var(--accent-amber)] uppercase tracking-wider">Customer feedback</span></div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What buyers <span className="gradient-text-cyan">say</span></h2>
              <p className="text-[var(--text-secondary)] mt-2">Read real feedback before you place your order.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-4">
              <div className="text-3xl font-bold text-[var(--accent-amber)]">{reviews.length || reviewSummary?.reviewCount ? averageRating.toFixed(1) : '—'}</div>
              <div><RatingStars rating={averageRating || 0} /><div className="text-xs text-[var(--text-muted)] mt-1">{reviews.length || reviewSummary?.reviewCount || 0} review{(reviews.length || reviewSummary?.reviewCount || 0) === 1 ? '' : 's'}</div></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-8">
            <div className="space-y-3">
              {reviewsLoading ? <div className="h-28 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shimmer" /> : reviews.length === 0 ? <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center"><Star className="w-8 h-8 text-[var(--accent-amber)]/60 mx-auto mb-3" /><p className="font-medium">Be the first to review this product.</p><p className="text-sm text-[var(--text-muted)] mt-1">Your experience can help the next buyer.</p></div> : reviews.map((review) => <article key={review.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{review.customer_name}</p><p className="text-xs text-[var(--text-muted)] mt-1">{new Date(review.created_at).toLocaleDateString()}</p></div><RatingStars rating={review.rating} /></div><p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-4">{review.review_text}</p></article>)}
              {reviewMessage && !reviewSubmitting && <p className="text-sm text-[var(--accent-cyan)]">{reviewMessage}</p>}
            </div>

            <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-5 sm:p-6 h-fit">
              <h3 className="text-lg font-semibold">Share your experience</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">Your review will be shown to other shoppers.</p>
              <div className="mt-5"><span className="block text-sm text-[var(--text-secondary)] mb-2">Your rating</span><div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, index) => <button key={index} type="button" onClick={() => setReviewRating(index + 1)} aria-label={`Rate ${index + 1} stars`} className="p-1 hover:scale-110 transition-transform"><Star className={`w-7 h-7 ${index < reviewRating ? 'fill-[var(--accent-amber)] text-[var(--accent-amber)]' : 'text-[var(--border-light)]'}`} /></button>)}</div></div>
              <label className="block mt-5"><span className="block text-sm text-[var(--text-secondary)] mb-2">Your review</span><textarea required minLength={5} maxLength={1000} value={reviewText} onChange={(event) => setReviewText(event.target.value)} rows={5} placeholder="What did you think about this product?" className="w-full resize-none rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors" /></label>
              <button type="submit" disabled={reviewSubmitting} className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">{reviewSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}{reviewSubmitting ? 'Posting...' : 'Post Review'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
