import { MessageCircle, Mail, ShieldCheck, Clock, MapPin, ArrowRight, Truck } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <div className="min-h-screen pt-20 animate-fade-in">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-grid bg-grid-fade">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[var(--accent-green)]/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-light)] glass mb-6">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span className="text-sm text-[var(--text-secondary)]">We're here to help</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter">
            Get In <span className="gradient-text-green">Touch</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mt-6 leading-relaxed">
            Have questions about our products or cyber security services? Reach out to us directly —
            we typically respond within a few hours.
          </p>
        </div>
      </section>

      {/* WhatsApp + Contact cards */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main WhatsApp button */}
        <a
          href="https://wa.me/2348037049003?text=Hello%20Protech%20Digital%2C%20I%20have%20a%20question%20about%20your%20products"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 p-6 rounded-2xl overflow-hidden card-hover mb-6"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Chat with us on WhatsApp</h3>
            <p className="text-sm text-white/90 mt-1">Fastest way to reach us — we reply within minutes</p>
          </div>
          <div className="flex items-center gap-2 text-white font-semibold flex-shrink-0 group-hover:gap-3 transition-all">
            +234 803 704 9003
            <ArrowRight className="w-5 h-5" />
          </div>
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp 2 */}
          <a
            href="https://wa.me/2349162550073?text=Hello%20Protech%20Digital%2C%20I%20want%20to%20place%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden card-hover"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[var(--accent-green)]/10 blur-[60px] pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/40 flex items-center justify-center mb-5">
                <MessageCircle className="w-7 h-7 text-[var(--accent-green)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Line 2</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Reach our second WhatsApp line for orders, cyber security consultations, and partnerships.
              </p>
              <p className="text-2xl font-bold font-mono text-[var(--accent-green)]">+234 916 255 0073</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--accent-green)] group-hover:gap-3 transition-all">
                Open WhatsApp
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Email card */}
          <a
            href="mailto:chidikegprosper@gmail.com"
            className="group relative p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden card-hover"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[var(--accent-cyan)]/10 blur-[60px] pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 flex items-center justify-center mb-5">
                <Mail className="w-7 h-7 text-[var(--accent-cyan)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Send us an email for detailed inquiries, cyber security consultations, and partnership opportunities.
              </p>
              <p className="text-lg font-bold font-mono text-[var(--accent-cyan)] break-all">chidikegprosper@gmail.com</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[var(--accent-cyan)] group-hover:gap-3 transition-all">
                Send Email
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Physical address + Map */}
        <div className="mt-6 p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[var(--accent-cyan)]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Our Location</h3>
                  <p className="text-sm text-[var(--text-muted)]">Visit us in person</p>
                </div>
              </div>
              <p className="text-lg text-[var(--text-primary)] font-medium">Port Harcourt, Rivers State</p>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                We're based in Port Harcourt and deliver to customers in PH and Lagos. Orders placed before
                2pm arrive within 24 hours. Pay on delivery available within Port Harcourt.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--accent-green)]">
                <Truck className="w-4 h-4" />
                <span>Delivery in 24 hours across PH & Lagos</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-xl overflow-hidden border border-[var(--border)] h-full min-h-[220px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127675.73500000001!2d6.93!3d4.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cea39f754415%3A0xd5e69d6c4c5f3c9d!2sPort%20Harcourt%2C%20Rivers%20State!5e0!3m2!1sen!2sng!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '220px' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Protech Digital Location - Port Harcourt"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: 'Fast Response', desc: 'We reply within a few hours during business days.' },
            { icon: ShieldCheck, title: 'Expert Advice', desc: 'Our team includes certified cyber security professionals.' },
            { icon: Truck, title: 'Pay on Delivery', desc: 'Available within Port Harcourt. 24hr delivery to PH & Lagos.' },
          ].map((info) => (
            <div key={info.title} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-start gap-3">
              <info.icon className="w-5 h-5 text-[var(--accent-cyan)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">{info.title}</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1">{info.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden p-10 sm:p-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[var(--accent-green)]/10 blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to <span className="gradient-text-green">Get Started?</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4">
              Browse our catalog of futuristic gadgets or reach out for a cyber security consultation.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 transition-opacity"
              >
                Browse Products
              </button>
              <a
                href="https://wa.me/2348037049003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-light)] font-medium hover:border-[var(--accent-green)]/50 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                +234 803 704 9003
              </a>
              <a
                href="https://wa.me/2349162550073"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border-light)] font-medium hover:border-[var(--accent-green)]/50 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                +234 916 255 0073
              </a>
            </div>
          </div>
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
