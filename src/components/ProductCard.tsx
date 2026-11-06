import { Check, Plus, Star, Truck } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import type { Product, ProductReviewSummary } from '@/types';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice, formatOtherCurrency } from '@/lib/format';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  reviewSummary?: ProductReviewSummary;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`w-3.5 h-3.5 ${index < Math.round(rating) ? 'fill-[var(--accent-amber)] text-[var(--accent-amber)]' : 'text-[var(--border-light)]'}`} />
      ))}
    </span>
  );
}

export default function ProductCard({ product, onClick, reviewSummary }: ProductCardProps) {
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [added, setAdded] = useState(false);

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div onClick={onClick} className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden cursor-pointer card-hover">
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-secondary)]">
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute top-3 left-3"><span className="px-2.5 py-1 rounded-full text-xs font-medium glass border border-white/10 text-[var(--text-secondary)] font-mono">{product.category}</span></div>
        {product.in_stock ? <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium glass border border-[var(--accent-green)]/30 text-[var(--accent-green)]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />In Stock</div> : <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium glass border border-[var(--accent-red)]/30 text-[var(--accent-red)]">Sold Out</div>}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-base truncate group-hover:text-[var(--accent-cyan)] transition-colors">{product.name}</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-1">{product.tagline}</p>
        <div className="flex items-center gap-2 mt-3 min-h-[18px]">
          {reviewSummary && reviewSummary.reviewCount > 0 ? <><RatingStars rating={reviewSummary.averageRating} /><span className="text-xs font-medium text-[var(--text-secondary)]">{reviewSummary.averageRating.toFixed(1)}</span><span className="text-xs text-[var(--text-muted)]">({reviewSummary.reviewCount})</span></> : <span className="text-xs text-[var(--text-muted)]">No reviews yet</span>}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold gradient-text-cyan">{formatPrice(product.price, currency)}</span>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{formatOtherCurrency(product.price, currency)}</div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-0.5"><Truck className="w-3 h-3 text-[var(--accent-green)]" /><span>{currency === 'NGN' ? '24hr delivery' : 'DHL worldwide'}</span></div>
          </div>
          <button onClick={handleAdd} disabled={!product.in_stock || added} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${added ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/40' : 'border border-[var(--border-light)] text-[var(--text-primary)] hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--accent-cyan)]/10'} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {added ? <><Check className="w-4 h-4" />Added</> : <><Plus className="w-4 h-4" />Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
