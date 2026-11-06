import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { CATEGORY_OPTIONS, filterProducts, PRICE_RANGE_OPTIONS, SORT_OPTIONS, type CatalogSort, type PriceRange, type ProductCategory } from '@/lib/productFilters';
import type { Product, ProductReviewSummary } from '@/types';
import ProductCard from '@/components/ProductCard';

interface CatalogPageProps {
  products: Product[];
  reviewSummaries: Record<string, ProductReviewSummary>;
  loading: boolean;
  onProductClick: (product: Product) => void;
}

export default function CatalogPage({ products, reviewSummaries, loading, onProductClick }: CatalogPageProps) {
  const { currency } = useCurrency();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory>('All');
  const [sort, setSort] = useState<CatalogSort>('featured');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');

  const filtered = useMemo(() => filterProducts(products, { search, category, sort, priceRange, currency }), [products, search, category, sort, priceRange, currency]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('featured');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen pt-20 bg-grid bg-grid-fade animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Product <span className="gradient-text-cyan">Catalog</span></h1>
          <p className="text-[var(--text-secondary)] mt-2">{loading ? 'Loading...' : `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent-cyan)]" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." aria-label="Search products" className="w-full pl-12 pr-12 py-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors" />
            {search && <button type="button" onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Clear search"><X className="w-4 h-4" /></button>}
          </div>
          <select value={sort} onChange={(event) => setSort(event.target.value as CatalogSort)} aria-label="Sort products" className="lg:w-64 px-4 py-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors cursor-pointer">
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value} className="bg-[var(--bg-card)]">Sort by: {option.label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORY_OPTIONS.map((option) => <button key={option} type="button" onClick={() => setCategory(option)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${category === option ? 'gradient-cyan text-black' : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)]/50 hover:text-[var(--text-primary)]'}`}>{option}</button>)}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-8">
          <select value={priceRange} onChange={(event) => setPriceRange(event.target.value as PriceRange)} aria-label="Filter by price range" className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors cursor-pointer">
            {PRICE_RANGE_OPTIONS.map((option) => <option key={option.value} value={option.value} className="bg-[var(--bg-card)]">Price: {option.label}</option>)}
          </select>
          <button type="button" onClick={clearFilters} className="px-5 py-3 rounded-xl border border-[var(--accent-red)]/40 text-sm font-medium text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors">Clear filters</button>
          <p className="text-sm text-[var(--text-secondary)] sm:ml-auto whitespace-nowrap"><span className="font-semibold text-[var(--text-primary)]">{loading ? '—' : filtered.length}</span> product{filtered.length === 1 ? '' : 's'} found</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"><div className="aspect-square shimmer" /><div className="p-4 space-y-3"><div className="h-4 w-2/3 rounded shimmer" /><div className="h-3 w-1/2 rounded shimmer" /><div className="h-8 w-full rounded shimmer" /></div></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><p className="text-xl text-[var(--text-secondary)]">No products found.</p><p className="text-sm text-[var(--text-muted)] mt-2">Try changing your search or filters.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => <ProductCard key={product.id} product={product} reviewSummary={reviewSummaries[product.id]} onClick={() => onProductClick(product)} />)}
          </div>
        )}
      </div>
    </div>
  );
}
