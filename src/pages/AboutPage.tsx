import { ShieldCheck, Target, Rocket, Lock, Globe, Mail, MessageCircle } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen pt-20 animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-grid bg-grid-fade">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[var(--accent-cyan)]/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-light)] glass mb-6">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span className="text-sm text-[var(--text-secondary)]">Digital & Cyber Security Experts</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter">
            Securing Your <span className="gradient-text-cyan">Digital Future</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mt-6 leading-relaxed">
            Protech Digital was founded on a simple belief: cutting-edge technology and cyber security
            should go hand in hand. We curate, source, and deliver the most innovative gadgets on the
            planet — each one vetted for security and performance — to people who want to live ahead of
            the curve without compromising their digital safety.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Target, title: 'Curated Quality', desc: 'Every product is tested by our team before it reaches the catalog. No gimmicks — only real innovation.' },
            { icon: Rocket, title: 'Fast Delivery', desc: 'Global warehousing means most orders arrive within 48 hours, anywhere in the world.' },
            { icon: Lock, title: 'Real Warranty', desc: 'Two-year comprehensive coverage on every gadget, with dedicated technical support.' },
            { icon: Globe, title: 'Worldwide', desc: 'We ship to 80+ countries with localized fulfillment centers across three continents.' },
          ].map((value) => (
            <div
              key={value.title}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] card-hover"
            >
              <div className="w-12 h-12 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-[var(--accent-cyan)]" />
              </div>
              <h3 className="font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '120+', label: 'Products Curated' },
              { value: '80+', label: 'Countries Served' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold gradient-text-green font-mono">{stat.value}</div>
                <div className="text-sm text-[var(--text-muted)] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ready to explore the catalog?
        </h2>
        <p className="text-[var(--text-secondary)] mt-4">
          Discover gadgets that feel like they arrived from the next decade.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Products
          </button>
          <a
            href="mailto:chidikegprosper@gmail.com"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-light)] font-medium hover:border-[var(--accent-cyan)]/50 transition-all"
          >
            <Mail className="w-4 h-4" />
            Email Us
          </a>
          <a
            href="https://wa.me/2348037049003"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-light)] font-medium hover:border-[var(--accent-green)]/50 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp: +234 803 704 9003
          </a>
          <a
            href="https://wa.me/2349162550073"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-light)] font-medium hover:border-[var(--accent-green)]/50 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp: +234 916 255 0073
          </a>
        </div>
      </section>

      {/* Ownership attribution */}
      <section className="pb-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs text-[var(--text-muted)]/60">
          Designed and owned by the Founder and CEO: Chidike Prosper Aaron Golden
        </p>
      </section>
    </div>
  );
}
