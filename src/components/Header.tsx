import { ShoppingCart, Menu, X, LayoutDashboard, Sun, Moon, UserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isAdmin: boolean;
}

export default function Header({ onNavigate, currentPage, isAdmin }: HeaderProps) {
  const { totalItems, setIsOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Catalog', page: 'catalog' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
    { label: 'Account', page: 'account' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <img src="/images/IMG-20261012-WA3332.jpg" alt="Protech Digital" className="h-12 sm:h-14 w-auto rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-transform group-hover:scale-105" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  currentPage === item.page
                    ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border-light)] hover:border-[var(--accent-cyan)]/50 transition-all group"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[var(--accent-amber)] group-hover:text-[var(--accent-amber)] transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] transition-colors" />
              )}
            </button>

            {/* Currency switcher */}
            <div className="flex items-center rounded-lg border border-[var(--border-light)] overflow-hidden">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1.5 text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                $ USD
              </button>
              <div className="w-px h-4 bg-[var(--border-light)]" />
              <button
                onClick={() => setCurrency('NGN')}
                className={`px-2.5 py-1.5 text-xs font-bold transition-all ${
                  currency === 'NGN'
                    ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                ₦ NGN
              </button>
            </div>

            <button
              onClick={() => onNavigate('account')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-light)] hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--accent-cyan)]/5 transition-all group"
              title="Customer Account"
            >
              <UserRound className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
              <span className="hidden lg:inline text-sm font-medium">Account</span>
            </button>

            {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-light)] hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--accent-cyan)]/5 transition-all group"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
              <span className="hidden lg:inline text-sm font-medium">Admin</span>
            </button>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-light)] hover:border-[var(--accent-cyan)]/50 transition-all group"
            >
              <ShoppingCart className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full gradient-cyan text-black text-xs font-bold flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 animate-slide-up">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all text-left ${
                  currentPage === item.page
                    ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Currency + theme in mobile menu */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-muted)]">Currency:</span>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    currency === 'USD'
                      ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency('NGN')}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    currency === 'NGN'
                      ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  ₦ NGN
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded border border-[var(--border-light)]"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[var(--accent-amber)]" /> : <Moon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
            {isAdmin && (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 transition-all text-left"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
