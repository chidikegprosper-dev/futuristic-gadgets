import { ShieldCheck, MessageCircle, Mail, LayoutDashboard } from 'lucide-react';
import InstallAppButton from '@/components/InstallAppButton';

interface FooterProps {
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

export default function Footer({ onNavigate, isAdmin }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold">
                Protech<span className="gradient-text-cyan"> Digital</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Your trusted partner in digital innovation and cyber security. Cutting-edge gadgets backed by enterprise-grade protection.
            </p>
            <InstallAppButton className="mt-4" compact />
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <ul className="space-y-2">
              {['Catalog', 'Wearables', 'Drones', 'Audio'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate(link === 'Catalog' ? 'catalog' : 'catalog')}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('about')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  About Us
                </button>
              </li>
              <li><span className="text-sm text-[var(--text-muted)]">Careers</span></li>
              <li><span className="text-sm text-[var(--text-muted)]">Press</span></li>
              <li><span className="text-sm text-[var(--text-muted)]">Sustainability</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Get In Touch</h4>
            <ul className="space-y-3">
              {isAdmin && (
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--accent-cyan)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </button>
              </li>
              )}
              <li>
                <a
                  href="https://wa.me/2348037049003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  +234 803 704 9003
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2349162550073"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-green)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  +234 916 255 0073
                </a>
              </li>
              <li>
                <a
                  href="mailto:chidikegprosper@gmail.com"
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  chidikegprosper@gmail.com
                </a>
              </li>
              <li><span className="text-sm text-[var(--text-muted)]">Help Center</span></li>
              <li><span className="text-sm text-[var(--text-muted)]">Shipping & Returns</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 Protech Digital. All rights reserved.
            </p>
            <p className="text-xs text-[var(--text-muted)]/70">
              Designed and owned by the Founder and CEO: Chidike Prosper Aaron Golden
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
