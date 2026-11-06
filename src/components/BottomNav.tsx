import { Home, Search, LayoutGrid, ShoppingCart, UserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'catalog', label: 'Search', icon: Search },
  { key: 'categories', label: 'Categories', icon: LayoutGrid },
  { key: 'cart', label: 'Cart', icon: ShoppingCart, isCart: true },
  { key: 'account', label: 'Account', icon: UserRound },
];

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { totalItems, setIsOpen } = useCart();

  const handleClick = (item: typeof NAV_ITEMS[number]) => {
    if (item.isCart) {
      setIsOpen(true);
    } else {
      onNavigate(item.key);
    }
  };

  const isActive = (key: string) => {
    if (key === 'home') return currentPage === 'home';
    if (key === 'catalog') return currentPage === 'catalog' || currentPage === 'product';
    if (key === 'categories') return currentPage === 'categories';
    if (key === 'account') return currentPage === 'account';
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-strong border-t border-[var(--border)] safe-area-bottom">
      <div className="flex items-stretch justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.key);
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => handleClick(item)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 transition-colors"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
                />
                {item.isCart && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full gradient-cyan text-black text-[10px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors truncate ${active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-cyan" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
