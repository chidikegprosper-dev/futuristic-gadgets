import { ArrowRight, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import type { Product, ProductReviewSummary } from '@/types';
import ProductCard from '@/components/ProductCard';

interface CategoriesPageProps {
  products: Product[];
  reviewSummaries: Record<string, ProductReviewSummary>;
  loading: boolean;
  onProductClick: (product: Product) => void;
  onNavigate: (page: string) => void;
}

export default function CategoriesPage({ products, reviewSummaries, loading, onProductClick, onNavigate }: CategoriesPageProps) {
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-10 bg-grid bg-grid-fade animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Browse <span className="gradient-text-cyan">Categories</span></h1>
          <p className="text-[var(--text-secondary)] mt-2">{loading ? 'Loading...' : `${categories.length} categories, ${products.length} products`}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 space-y-4">
                <div className="h-12 w-12 rounded-xl shimmer" />
                <div className="h-5 w-2/3 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat);
              const count = catProducts.length;
              return (
                <section key={cat}>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{cat}</h2>
                      <p className="text-sm text-[var(--text-muted)] mt-0.5">{count} product{count === 1 ? '' : 's'}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('catalog')}
                      className="flex items-center gap-1 text-sm font-medium text-[var(--accent-cyan)] hover:gap-2 transition-all"
                    >
                      See All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {catProducts.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        reviewSummary={reviewSummaries[product.id]}
                        onClick={() => onProductClick(product)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="text-center py-10">
              <button
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity"
              >
                View Full Catalog
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
