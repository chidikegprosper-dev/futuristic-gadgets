import { useState, useEffect, useCallback } from 'react';
import { Users, ShoppingCart, Mail, Phone, Clock, ArrowLeft, RefreshCw, Package, Eye, TrendingUp, Search, X, Repeat, MousePointerClick, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
const ADMIN_PASSWORD = "Protech2026";
interface VisitorCart {
  id: string;
  session_id: string;
  cart_items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
  cart_total: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  last_page: string | null;
  visit_count: number;
  products_viewed: Array<{ product_id: string; name: string; viewed_at: string }>;
  created_at: string;
  updated_at: string;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [isAuthed, setIsAuthed] = useState(() => {
    try {
      return localStorage.getItem('protech-admin-auth') === 'true';
    } catch {
      return false;
    }
  });
const [passInput, setPassInput] = useState("");
  const [visitors, setVisitors] = useState<VisitorCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorCart | null>(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitor_carts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to load visitors:', error);
    } else if (data) {
      setVisitors(data as VisitorCart[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const filtered = visitors.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (v.customer_name?.toLowerCase().includes(q) ?? false) ||
        (v.customer_email?.toLowerCase().includes(q) ?? false) ||
        (v.customer_phone?.toLowerCase().includes(q) ?? false) ||
        v.session_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: visitors.length,
    browsing: visitors.filter((v) => v.status === 'browsing').length,
    checkout: visitors.filter((v) => v.status === 'checkout').length,
    ordered: visitors.filter((v) => v.status === 'ordered').length,
    withCarts: visitors.filter((v) => v.cart_items && v.cart_items.length > 0).length,
    withInfo: visitors.filter((v) => v.customer_name || v.customer_email).length,
    totalVisits: visitors.reduce((sum, v) => sum + (v.visit_count || 1), 0),
    returning: visitors.filter((v) => (v.visit_count || 1) > 1).length,
    totalViews: visitors.reduce((sum, v) => sum + (v.products_viewed?.length || 0), 0),
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  };

  const statusColors: Record<string, string> = {
    browsing: 'text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10',
    checkout: 'text-[var(--accent-amber)] border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/10',
    ordered: 'text-[var(--accent-green)] border-[var(--accent-green)]/30 bg-[var(--accent-green)]/10',
  };

  const buildWhatsAppLink = (visitor: VisitorCart) => {
    const name = visitor.customer_name || 'there';
    const phone = visitor.customer_phone?.replace(/[^0-9]/g, '') || '';
    if (!phone) return null;

    let message = `Hello ${name}! This is Protech Digital. `;
    if (visitor.cart_items && visitor.cart_items.length > 0) {
      const itemList = visitor.cart_items.map((i) => `${i.name} (Qty: ${i.quantity})`).join(', ');
      message += `We noticed you have ${visitor.cart_items.length} item${visitor.cart_items.length > 1 ? 's' : ''} in your cart: ${itemList}. `;
      message += `Total: ${formatPrice(visitor.cart_total)}. `;
      message += `Is there anything we can help you with to complete your order?`;
    } else if (visitor.products_viewed && visitor.products_viewed.length > 0) {
      const lastViewed = visitor.products_viewed[visitor.products_viewed.length - 1];
      message += `We noticed you were checking out the ${lastViewed.name}. Would you like more information or help placing an order?`;
    } else {
      message += `Thank you for visiting our store. Is there anything we can help you with?`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const buildEmailLink = (visitor: VisitorCart) => {
    const email = visitor.customer_email;
    if (!email) return null;
    const name = visitor.customer_name || 'there';

    let subject = 'Protech Digital — Following up on your visit';
    let body = `Hello ${name},\n\nThank you for visiting Protech Digital!`;

    if (visitor.cart_items && visitor.cart_items.length > 0) {
      const itemList = visitor.cart_items.map((i) => `  - ${i.name} (Qty: ${i.quantity}) — ${formatPrice(i.price * i.quantity)}`).join('\n');
      subject = 'Protech Digital — Your cart is waiting!';
      body += `\n\nWe noticed you have the following items in your cart:\n\n${itemList}\n\nCart Total: ${formatPrice(visitor.cart_total)}\n\nIs there anything we can help you with to complete your order? We're here to answer any questions you may have.`;
    } else if (visitor.products_viewed && visitor.products_viewed.length > 0) {
      const lastViewed = visitor.products_viewed[visitor.products_viewed.length - 1];
      subject = `Protech Digital — Interested in the ${lastViewed.name}?`;
      body += `\n\nWe noticed you were checking out the ${lastViewed.name}. Would you like more information about this product, or help placing an order? Our team is ready to assist you.`;
    } else {
      body += `\n\nIs there anything we can help you with? Whether you're looking for cutting-edge gadgets or cyber security solutions, our team is here to help.\n\nBest regards,\nThe Protech Digital Team`;
    }

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  if (!isAuthed) {
    return (
      <div style={{display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', background:'#111'}}>
        <div style={{background:'white', padding:'30px', borderRadius:'16px', width:'90%', maxWidth:'340px'}}>
          <h2 style={{fontWeight:'bold', fontSize:'22px', marginBottom:'10px'}}>Admin Login</h2>
          <input type="password" placeholder="Password" value={passInput} onChange={(e)=>setPassInput(e.target.value)} style={{width:'100%', padding:'12px', border:'1px solid #ccc', borderRadius:'8px', marginBottom:'12px'}} />
          <button onClick={()=>{ if(passInput === ADMIN_PASSWORD){ localStorage.setItem('protech-admin-auth', 'true'); setIsAuthed(true); } else { alert('Wrong password!'); } }} style={{width:'100%', background:'black', color:'white', padding:'12px', borderRadius:'8px', fontWeight:'bold'}}>Unlock</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-5 h-5 text-[var(--accent-cyan)]" />
              <span className="text-sm font-mono text-[var(--accent-cyan)] uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-display">
              Visitor <span className="gradient-text-cyan">Analytics</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchVisitors}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-light)] text-sm font-medium hover:border-[var(--accent-cyan)]/50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-light)] text-sm font-medium hover:border-[var(--accent-cyan)]/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {[
            { label: 'Total Visitors', value: stats.total, icon: Users, color: 'cyan' },
            { label: 'Total Visits', value: stats.totalVisits, icon: Repeat, color: 'green' },
            { label: 'Returning', value: stats.returning, icon: TrendingUp, color: 'green' },
            { label: 'Browsing', value: stats.browsing, icon: Eye, color: 'cyan' },
            { label: 'At Checkout', value: stats.checkout, icon: ShoppingCart, color: 'amber' },
            { label: 'Ordered', value: stats.ordered, icon: Package, color: 'green' },
            { label: 'Products Viewed', value: stats.totalViews, icon: MousePointerClick, color: 'cyan' },
            { label: 'With Carts', value: stats.withCarts, icon: ShoppingCart, color: 'cyan' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]"
            >
              <stat.icon className={`w-5 h-5 text-[var(--accent-${stat.color})] mb-2`} />
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {['all', 'browsing', 'checkout', 'ordered'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  statusFilter === s
                    ? 'gradient-cyan text-black'
                    : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-cyan)]/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Visitors table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[var(--text-secondary)]">No visitors found.</p>
            <p className="text-sm text-[var(--text-muted)] mt-2">Visitor data will appear here as people browse your site.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((visitor) => (
              <div
                key={visitor.id}
                onClick={() => setSelectedVisitor(visitor)}
                className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent-cyan)]/40 cursor-pointer transition-all"
              >
                {/* Avatar / status */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full border border-[var(--border-light)] bg-[var(--bg-elevated)] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {visitor.customer_name || 'Anonymous Visitor'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[visitor.status] || statusColors.browsing}`}>
                      {visitor.status}
                    </span>
                    {(visitor.visit_count || 1) > 1 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                        <Repeat className="w-3 h-3" />
                        {visitor.visit_count} visits
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[var(--text-muted)]">
                    {visitor.customer_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {visitor.customer_email}
                      </span>
                    )}
                    {visitor.customer_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {visitor.customer_phone}
                      </span>
                    )}
                    {!visitor.customer_email && !visitor.customer_phone && (
                      <span className="font-mono">{visitor.session_id.slice(0, 20)}...</span>
                    )}
                  </div>
                </div>

                {/* Cart + views info */}
                <div className="hidden sm:flex flex-col items-end gap-1">
                  {visitor.cart_items && visitor.cart_items.length > 0 ? (
                    <>
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <ShoppingCart className="w-4 h-4 text-[var(--accent-cyan)]" />
                        {visitor.cart_items.reduce((sum, i) => sum + i.quantity, 0)} items
                      </span>
                      <span className="text-sm font-bold gradient-text-cyan">{formatPrice(visitor.cart_total)}</span>
                    </>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Empty cart</span>
                  )}
                  {visitor.products_viewed && visitor.products_viewed.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <MousePointerClick className="w-3 h-3" />
                      {visitor.products_viewed.length} views
                    </span>
                  )}
                </div>

                {/* Quick contact buttons */}
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                  {visitor.customer_phone && (
                    <a
                      href={buildWhatsAppLink(visitor) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/10 text-[var(--accent-green)] hover:bg-[var(--accent-green)]/20 transition-all"
                      title={`WhatsApp ${visitor.customer_name || visitor.customer_phone}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  {visitor.customer_email && (
                    <a
                      href={buildEmailLink(visitor) || '#'}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/20 transition-all"
                      title={`Email ${visitor.customer_email}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Last active */}
                <div className="hidden md:flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                    <Clock className="w-3 h-3" />
                    {formatTime(visitor.updated_at)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{visitor.last_page}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedVisitor && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedVisitor(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold">Visitor Details</h2>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Contact visitor actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedVisitor.customer_phone && (
                  <a
                    href={buildWhatsAppLink(selectedVisitor) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-green text-black font-semibold hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message on WhatsApp
                  </a>
                )}
                {selectedVisitor.customer_email && (
                  <a
                    href={buildEmailLink(selectedVisitor) || '#'}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                    Send Email
                  </a>
                )}
                {!selectedVisitor.customer_phone && !selectedVisitor.customer_email && (
                  <div className="flex-1 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-center text-sm text-[var(--text-muted)]">
                    No contact info available — this visitor hasn't signed in yet
                  </div>
                )}
              </div>
              {/* Contact info */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Name</div>
                    <div className="text-sm font-medium">{selectedVisitor.customer_name || 'Not provided'}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Email</div>
                    <div className="text-sm font-medium">{selectedVisitor.customer_email || 'Not provided'}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Phone</div>
                    <div className="text-sm font-medium">{selectedVisitor.customer_phone || 'Not provided'}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Status</div>
                    <div className="text-sm font-medium capitalize">{selectedVisitor.status}</div>
                  </div>
                </div>
              </div>

              {/* Visit stats */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Visit Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Visit Count</div>
                    <div className="text-sm font-medium">
                      <span className="text-2xl font-bold gradient-text-green font-mono">{selectedVisitor.visit_count || 1}</span>
                      <span className="text-[var(--text-muted)] ml-1">time{(selectedVisitor.visit_count || 1) > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Products Viewed</div>
                    <div className="text-sm font-medium">
                      <span className="text-2xl font-bold gradient-text-cyan font-mono">{selectedVisitor.products_viewed?.length || 0}</span>
                      <span className="text-[var(--text-muted)] ml-1">product{(selectedVisitor.products_viewed?.length || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session info */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Session Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Session ID</div>
                    <div className="text-xs font-mono text-[var(--accent-cyan)] break-all">{selectedVisitor.session_id}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Last Page</div>
                    <div className="text-sm font-medium capitalize">{selectedVisitor.last_page || 'Unknown'}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">First Visit</div>
                    <div className="text-sm font-medium">{new Date(selectedVisitor.created_at).toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-1">Last Active</div>
                    <div className="text-sm font-medium">{new Date(selectedVisitor.updated_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Products viewed */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Products Viewed ({selectedVisitor.products_viewed?.length || 0})
                </h3>
                {selectedVisitor.products_viewed && selectedVisitor.products_viewed.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...selectedVisitor.products_viewed].reverse().map((view, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                        <MousePointerClick className="w-4 h-4 text-[var(--accent-cyan)] flex-shrink-0" />
                        <span className="text-sm font-medium flex-1 truncate">{view.name}</span>
                        <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                          {formatTime(view.viewed_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-center">
                    <Eye className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-1" />
                    <p className="text-sm text-[var(--text-muted)]">No products viewed yet</p>
                  </div>
                )}
              </div>

              {/* Cart contents */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  Cart Contents ({selectedVisitor.cart_items?.length || 0} items)
                </h3>
                {selectedVisitor.cart_items && selectedVisitor.cart_items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedVisitor.cart_items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{item.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">
                            Qty: {item.quantity} x {formatPrice(item.price)}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-[var(--accent-cyan)]">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/5">
                      <span className="text-sm font-medium">Cart Total</span>
                      <span className="text-xl font-bold gradient-text-cyan">{formatPrice(selectedVisitor.cart_total)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-center">
                    <ShoppingCart className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--text-muted)]">Cart is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
