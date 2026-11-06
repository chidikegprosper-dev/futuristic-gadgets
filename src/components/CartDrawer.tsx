import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import { useCurrency } from '@/context/CurrencyContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { currency } = useCurrency();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md z-50 glass-strong border-l border-[var(--border)] transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--accent-cyan)]" />
            <h2 className="text-lg font-semibold">
              Cart {totalItems > 0 && <span className="text-[var(--text-muted)]">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 rounded-full border border-[var(--border-light)] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-secondary)] text-center">
              Your cart is empty. Start exploring our cutting-edge products.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-lg gradient-cyan text-black font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] animate-slide-in-right"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{item.product.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] truncate">{item.product.tagline}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md border border-[var(--border-light)] flex items-center justify-center hover:border-[var(--accent-cyan)]/50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-mono w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md border border-[var(--border-light)] flex items-center justify-center hover:border-[var(--accent-cyan)]/50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--accent-cyan)]">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Subtotal</span>
                <span className="text-xl font-bold gradient-text-cyan">{formatPrice(subtotal, currency)}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Shipping and taxes calculated at checkout.</p>
              <button
                onClick={onCheckout}
                className="w-full py-3 rounded-xl gradient-cyan text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
