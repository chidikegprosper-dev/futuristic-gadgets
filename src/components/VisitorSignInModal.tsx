import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { registerVisitor, type VisitorInfo } from '@/lib/visitorTracking';
import { supabase } from '@/lib/supabase';

interface VisitorSignInModalProps {
  onSignedIn: (info: VisitorInfo, returning: boolean) => void;
}

type Mode = 'signin' | 'register';

export default function VisitorSignInModal({ onSignedIn }: VisitorSignInModalProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: { full_name: formData.name.trim(), phone: formData.phone.trim() },
          },
        });

        if (signUpError) throw signUpError;
        if (!data.user) throw new Error('We could not create your account. Please try again.');

        const info: VisitorInfo = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        };
        await registerVisitor(info);
        onSignedIn(info, false);
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('We could not sign you in. Please try again.');

      const metadata = data.user.user_metadata as { full_name?: string; phone?: string };
      const info: VisitorInfo = {
        name: metadata.full_name || data.user.email?.split('@')[0] || 'Customer',
        email: data.user.email || formData.email.trim(),
        phone: metadata.phone || '',
      };
      await registerVisitor(info);
      onSignedIn(info, true);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : '';
      setError(message.includes('Invalid login credentials') ? 'Email or password is incorrect.' : message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div className="relative w-full max-w-md rounded-3xl border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden animate-scale-in shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[var(--accent-cyan)]/10 blur-[90px] pointer-events-none" />
        <div className="relative p-7 sm:p-9">
          <div className="text-center mb-7">
            <img src="/images/IMG-20261012-WA3332.jpg" alt="Protech Digital" className="w-56 h-auto mx-auto mb-5 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)]" />
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--accent-cyan)] mb-3">Secure access required</p>
            <h2 className="text-2xl font-bold tracking-tight font-display">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
              {mode === 'signin' ? 'Sign in to continue to Protech Digital.' : 'Create a free account to browse and shop our gadget collection.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <label className="block">
                  <span className="block text-sm text-[var(--text-muted)] mb-1.5">Full name</span>
                  <span className="relative block">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input required value={formData.name} onChange={(event) => updateField('name', event.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors" placeholder="Your full name" />
                  </span>
                </label>
                <label className="block">
                  <span className="block text-sm text-[var(--text-muted)] mb-1.5">Phone number <span className="text-[var(--text-muted)]/70">(optional)</span></span>
                  <span className="relative block">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input type="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors" placeholder="+234 800 000 0000" />
                  </span>
                </label>
              </>
            )}

            <label className="block">
              <span className="block text-sm text-[var(--text-muted)] mb-1.5">Email address</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input type="email" required value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors" placeholder="you@example.com" />
              </span>
            </label>

            <label className="block">
              <span className="block text-sm text-[var(--text-muted)] mb-1.5">Password</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input type={showPassword ? 'text' : 'password'} required minLength={6} value={formData.password} onChange={(event) => updateField('password', event.target.value)} className="w-full pl-11 pr-11 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent-cyan)]/60 transition-colors" placeholder="At least 6 characters" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </span>
            </label>

            {error && <p className="text-sm text-[var(--accent-red)] text-center">{error}</p>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-cyan text-black font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In Securely' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <button type="button" onClick={() => { setMode((current) => current === 'signin' ? 'register' : 'signin'); setError(''); }} className="w-full mt-5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors">
            {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
