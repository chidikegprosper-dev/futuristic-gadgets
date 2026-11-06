import { useMemo, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { CATEGORY_OPTIONS, filterProducts, PRICE_RANGE_OPTIONS, SORT_OPTIONS, type ProductCategory, type PriceRange, type CatalogSort } from '@/lib/productFilters';
import { ArrowRight, Cpu, Rocket, ShieldCheck, Sparkles, MessageCircle, Zap, Smartphone, Laptop, Tablet, Watch, Car, Headphones, Gamepad2, Home, Plane, Monitor, ChevronRight, Truck, MapPin, Package, Search, X } from 'lucide-react';
import type { Product, ProductReviewSummary } from '@/types';
import ProductCard from '@/components/ProductCard';
import InstallAppButton from '@/components/InstallAppButton';

interface HomePageProps {
  products: Product[];
  reviewSummaries: Record<string, ProductReviewSummary>;
  loading: boolean;
  onNavigate: (page: string) => void;
  onProductClick: (product: Product) => void;
}

const CATEGORY_ICONS: Record<string, typeof Cpu> = {
  Wearables: Watch,
  Audio: Headphones,
  'Mobile & Desk': Smartphone,
  'Gaming & VR': Gamepad2,
  'Smart Home': Home,
  'Viral Futuristic': Sparkles,
};

const HERO_CATEGORIES = [
  { name: 'Wearables', icon: Watch, desc: 'Smart rings, watches, glasses & more' },
  { name: 'Smart Home', icon: Home, desc: 'Cameras, vacuums, locks & lights' },
  { name: 'Gaming & VR', icon: Gamepad2, desc: 'VR headsets, drones, controllers' },
];

export default function HomePage({ products, reviewSummaries, loading, onNavigate, onProductClick }: HomePageProps) {
  const { currency } = useCurrency();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<CatalogSort>('featured');
  const [category, setCategory] = useState<ProductCategory>('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const filteredResults = useMemo(() => filterProducts(products, { search, sort, category, priceRange, currency }), [products, search, sort, category, priceRange, currency]);
  const hasActiveFilters = Boolean(search.trim()) || sort !== 'featured' || category !== 'All' || priceRange !== 'all';

  const clearFilters = () => {
    setSearch('');
    setSort('featured');
    setCategory('All');
    setPriceRange('all');
  };

  const categories = [...new Set(products.map((p) => p.category))].sort();

  const getCategoryProducts = (cat: string) =>
    products.filter((p) => p.category === cat).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid bg-grid-fade">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-cyan)]/12 blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-blue)]/12 blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-magenta)]/5 blur-[160px] pointer-events-none" />

        {/* Orbiting rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[var(--accent-cyan)]/5 animate-orbit pointer-events-none hidden lg:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[var(--accent-green)]/5 animate-orbit pointer-events-none hidden lg:block" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-light)] glass mb-8 animate-slide-up scanline">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
            <span className="text-sm text-[var(--text-secondary)] font-mono tracking-wider">
              SHIPPED WORLDWIDE FROM NIGERIA
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] animate-slide-up" style={{ animationDelay: '0.1s' }}>
            PROTECH DIGITAL
            <br />
            <span className="gradient-text-cyan text-glow-cyan">Next-Gen Gadgets</span>
          </h1>
          <InstallAppButton label="Get the app" className="mt-6 mx-auto px-6 py-3.5" />

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Real smart gadgets shipped worldwide from Nigeria. DHL shipping for international orders,
            pay on delivery within Port Harcourt & Lagos.
          </p>

          {/* Homepage search and filters */}
          <div className="mt-8 max-w-5xl mx-auto text-left animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--accent-cyan)]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full pl-14 pr-14 py-5 sm:py-6 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--accent-cyan)]/35 text-base sm:text-lg text-[var(--text-primary)] shadow-[0_0_35px_rgba(0,240,255,0.12)] focus:outline-none focus:border-[var(--accent-cyan)] focus:shadow-[0_0_45px_rgba(0,240,255,0.22)] transition-all placeholder:text-[var(--text-muted)]"
                />
                {search && <button type="button" onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Clear product search"><X className="w-5 h-5" /></button>}
              </div>
              <select value={sort} onChange={(event) => setSort(event.target.value as CatalogSort)} aria-label="Sort products" className="lg:w-60 px-4 py-4 sm:py-5 rounded-2xl bg-[var(--bg-card)]/95 border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/60 cursor-pointer">
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value} className="bg-[var(--bg-card)]">Sort by: {option.label}</option>)}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
              {CATEGORY_OPTIONS.map((option) => <button key={option} type="button" onClick={() => setCategory(option)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === option ? 'gradient-cyan text-black' : 'border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)]/50 hover:text-[var(--text-primary)]'}`}>{option}</button>)}
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value as PriceRange)} aria-label="Filter by price range" className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-card)]/95 border border-[var(--border-light)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/60 cursor-pointer">
                {PRICE_RANGE_OPTIONS.map((option) => <option key={option.value} value={option.value} className="bg-[var(--bg-card)]">Price: {option.label}</option>)}
              </select>
              <button type="button" onClick={clearFilters} className="px-4 py-3 rounded-xl border border-[var(--accent-red)]/40 text-sm font-medium text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 transition-colors">Clear filters</button>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)]/95 p-4 sm:p-6 text-left shadow-2xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="text-sm text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">{filteredResults.length}</span> product{filteredResults.length === 1 ? '' : 's'} found</p>
                  <button type="button" onClick={() => onNavigate('catalog')} className="text-sm font-medium text-[var(--accent-cyan)] hover:text-[var(--text-primary)] transition-colors">View full catalog</button>
                </div>
                {filteredResults.length === 0 ? <p className="py-8 text-center text-sm text-[var(--text-muted)]">No products match these filters. Try clearing one to see more products.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{filteredResults.map((product) => <ProductCard key={product.id} product={product} reviewSummary={reviewSummaries[product.id]} onClick={() => onProductClick(product)} />)}</div>}
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => onNavigate('catalog')}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity neon-border"
            >
              Shop Latest Gadgets
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/2348037049003?text=Hello%20Protech%20Digital%2C%20I%20want%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--accent-green)]/50 font-medium hover:bg-[var(--accent-green)]/10 transition-all"
            >
              <MessageCircle className="w-5 h-5 text-[var(--accent-green)]" />
              Order on WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Truck className="w-4 h-4 text-[var(--accent-green)]" />
              <span>DHL Shipping Worldwide</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Package className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>Pay on Delivery in PH</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <MapPin className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>Port Harcourt, Nigeria</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '50K+', label: 'Customers' },
              { value: '30+', label: 'Products' },
              { value: '4.9★', label: 'Avg Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center relative">
                <div className="text-3xl sm:text-4xl font-bold gradient-text-green font-mono">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Main Categories */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERO_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onNavigate('catalog')}
                className="group relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden card-hover text-left"
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[var(--accent-cyan)]/8 blur-[60px] pointer-events-none group-hover:bg-[var(--accent-cyan)]/15 transition-colors" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-light)] flex items-center justify-center mb-5 transition-all group-hover:border-[var(--accent-cyan)]/40 group-hover:bg-[var(--accent-cyan)]/5">
                    <cat.icon className="w-7 h-7 text-[var(--accent-cyan)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">{cat.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{cat.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--accent-cyan)] group-hover:gap-2 transition-all">
                    Browse {cat.name}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tech marquee */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden py-4">
        <div className="flex items-center gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap" style={{ animation: 'scroll 30s linear infinite' }}>
          {['DHL SHIPPING', 'PAY ON DELIVERY', 'WORLDWIDE FROM NIGERIA', 'GENUINE PRODUCTS', 'PORT HARCOURT', '4.9 STAR RATED', 'WHATSAPP ORDERS', 'SMART GADGETS'].map((word, i) => (
            <span key={i} className="flex items-center gap-12 text-sm font-mono text-[var(--text-muted)] uppercase tracking-widest">
              {word}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)]/40" />
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* Features bar */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)] bg-grid-fine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: 'Genuine Products', desc: 'Every product is carefully sourced and quality-checked before shipping.', color: 'cyan' },
              { icon: Rocket, title: 'DHL Worldwide', desc: 'Fast DHL shipping internationally. 24-hour delivery within Port Harcourt & Lagos.', color: 'green' },
              { icon: ShieldCheck, title: 'Pay on Delivery', desc: 'Pay with cash or transfer on delivery within Port Harcourt. Secure card payments via Paystack.', color: 'cyan' },
            ].map((feat) => (
              <div key={feat.title} className="flex items-start gap-4 group">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] flex items-center justify-center transition-all group-hover:border-[var(--accent-${feat.color})]/40`}>
                  <feat.icon className={`w-6 h-6 text-[var(--accent-${feat.color})]`} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feat.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[var(--accent-cyan)]" />
              <span className="text-sm font-mono text-[var(--accent-cyan)] uppercase tracking-wider">Top Picks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">
              Featured <span className="gradient-text-cyan">Gadgets</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">Hand-picked products our customers love.</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--accent-cyan)] hover:gap-2 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                <div className="aspect-square shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-2/3 rounded shimmer" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                  <div className="h-8 w-full rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                reviewSummary={reviewSummaries[product.id]}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category showcase */}
      {!loading && categories.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-green)]" />
              <span className="text-sm font-mono text-[var(--accent-green)] uppercase tracking-wider">Browse by Category</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display">
              Shop by <span className="gradient-text-green">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Cpu;
              const count = products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => onNavigate('catalog')}
                  className="group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] card-hover neon-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-light)] flex items-center justify-center transition-all group-hover:border-[var(--accent-cyan)]/40 group-hover:bg-[var(--accent-cyan)]/5">
                    <Icon className="w-6 h-6 text-[var(--accent-cyan)]" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold group-hover:text-[var(--accent-cyan)] transition-colors">{cat}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{count} item{count > 1 ? 's' : ''}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Category spotlights — alternating product rows */}
      {!loading && ['Wearables', 'Audio', 'Mobile & Desk', 'Gaming & VR'].map((cat) => {
        const catProducts = getCategoryProducts(cat);
        if (catProducts.length === 0) return null;
        const Icon = CATEGORY_ICONS[cat] || Cpu;
        return (
          <section key={cat} className="py-14 border-t border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--accent-cyan)]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{cat}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{products.filter((p) => p.category === cat).length} products</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="flex items-center gap-1 text-sm font-medium text-[var(--accent-cyan)] hover:gap-2 transition-all"
                >
                  See All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {catProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => onProductClick(product)}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden p-10 sm:p-16 text-center bg-grid-fine">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[var(--accent-cyan)]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[var(--accent-magenta)]/8 blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display">
              Ready to <span className="gradient-text-green">Order?</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
              Chat with us on WhatsApp to place your order. DHL shipping worldwide, pay on delivery in Port Harcourt.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-green text-black font-semibold hover:opacity-90 transition-opacity neon-border"
              >
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://wa.me/2348037049003?text=Hello%20Protech%20Digital%2C%20I%20want%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--accent-green)]/50 font-medium hover:bg-[var(--accent-green)]/10 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-[var(--accent-green)]" />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ownership attribution */}
      <section className="pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs text-[var(--text-muted)]/60 font-mono">
          Designed and owned by the Founder and CEO: Chidike Prosper Aaron Golden
        </p>
      </section>
    </div>
  );
}
