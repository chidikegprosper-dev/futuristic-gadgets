import { useState, useEffect, useCallback, useRef } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { syncCart, initKnownVisitor, trackProductView, type VisitorInfo } from '@/lib/visitorTracking';
import type { Product, ProductReviewSummary } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import VisitorSignInModal from '@/components/VisitorSignInModal';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import CategoriesPage from '@/pages/CategoriesPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AccountPage from '@/pages/AccountPage';
import { useIsAdmin } from '@/hooks/useIsAdmin';

function AppContent() {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviewSummaries, setReviewSummaries] = useState<Record<string, ProductReviewSummary>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSignIn, setShowSignIn] = useState(() => {
    try {
      return localStorage.getItem('protech-admin-auth') !== 'true';
    } catch {
      return true;
    }
  });
  const [visitorChecked, setVisitorChecked] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const { setIsOpen, items, subtotal } = useCart();
  const trackingInit = useRef(false);
  const { isAdmin, ready: adminReady } = useIsAdmin();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error('Failed to load products:', error);
    } else if (data) {
      setProducts(data as Product[]);
    }

    const { data: reviewData, error: reviewError } = await supabase
      .from('product_reviews')
      .select('product_id, rating');

    if (reviewError) {
      console.error('Failed to load review summaries:', reviewError);
    } else if (reviewData) {
      const summaries: Record<string, ProductReviewSummary> = {};
      for (const review of reviewData as Array<{ product_id: string; rating: number }>) {
        const current = summaries[review.product_id] || { averageRating: 0, reviewCount: 0 };
        const totalRating = current.averageRating * current.reviewCount + review.rating;
        current.reviewCount += 1;
        current.averageRating = totalRating / current.reviewCount;
        summaries[review.product_id] = current;
      }
      setReviewSummaries(summaries);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (!adminReady) return;
    const onAdminPath = window.location.pathname === '/admin';
    if (!isAdmin) {
      setPage((current) => (current === 'admin' ? 'home' : current));
      if (onAdminPath) window.history.replaceState(null, '', '/');
      return;
    }
    if (onAdminPath) setPage('admin');
  }, [adminReady, isAdmin]);

  useEffect(() => {
    if (trackingInit.current) return;
    trackingInit.current = true;
    setVisitorChecked(false);
  }, []);

  useEffect(() => {
    if (page === 'admin' || !visitorChecked) return;
    void syncCart(items, subtotal, page);
  }, [page, visitorChecked, items, subtotal]);

  const navigate = (newPage: string) => {
    const path = newPage === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== path) window.history.replaceState(null, '', path);
    setPage(newPage);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    void trackProductView(product.id, product.name);
  };

  const handleSignInComplete = async (info: VisitorInfo, returning: boolean) => {
    await initKnownVisitor('home');
    setShowSignIn(false);
    setVisitorChecked(true);
    setWelcomeMessage(`${returning ? 'Welcome back' : 'Welcome'}, ${info.name}!`);
    window.setTimeout(() => setWelcomeMessage(null), 4000);
  };

  const showBottomNav = page !== 'admin' && page !== 'checkout';

  const handleCheckout = () => { setIsOpen(false); navigate('checkout'); };
  const handleBack = () => navigate('catalog');
  const handleReviewSummaryChange = (productId: string, summary: ProductReviewSummary) => {
    setReviewSummaries((current) => ({ ...current, [productId]: summary }));
  };
  const handleSignedOut = () => {
    setShowSignIn(true);
    setVisitorChecked(false);
    navigate('home');
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] ${showBottomNav ? 'pb-safe-nav' : ''}`}>
      {page !== 'admin' && <Header onNavigate={navigate} currentPage={page} isAdmin={isAdmin} />}
      <main>
        {page === 'home' && <HomePage products={products} reviewSummaries={reviewSummaries} loading={loading} onNavigate={navigate} onProductClick={handleProductClick} />}
        {page === 'catalog' && <CatalogPage products={products} reviewSummaries={reviewSummaries} loading={loading} onProductClick={handleProductClick} />}
        {page === 'categories' && <CategoriesPage products={products} reviewSummaries={reviewSummaries} loading={loading} onProductClick={handleProductClick} onNavigate={navigate} />}
        {page === 'product' && selectedProduct && <ProductDetailPage product={selectedProduct} reviewSummary={reviewSummaries[selectedProduct.id]} onReviewSummaryChange={handleReviewSummaryChange} onBack={handleBack} onNavigate={navigate} />}
        {page === 'checkout' && <CheckoutPage onBack={handleBack} onNavigate={navigate} />}
        {page === 'about' && <AboutPage onNavigate={navigate} />}
        {page === 'contact' && <ContactPage onNavigate={navigate} />}
        {page === 'account' && <AccountPage onNavigate={navigate} onSignedOut={handleSignedOut} />}
        {page === 'admin' && isAdmin && <AdminDashboard onNavigate={navigate} />}
      </main>
      {page !== 'checkout' && page !== 'admin' && <Footer onNavigate={navigate} isAdmin={isAdmin} />}
      <CartDrawer onCheckout={handleCheckout} />
      {showBottomNav && <BottomNav currentPage={page} onNavigate={navigate} />}
      {welcomeMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl glass-strong border border-[var(--accent-green)]/40 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
            <span className="text-sm font-medium text-[var(--accent-green)]">{welcomeMessage}</span>
          </div>
        </div>
      )}
      {showSignIn && <VisitorSignInModal onSignedIn={handleSignInComplete} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
