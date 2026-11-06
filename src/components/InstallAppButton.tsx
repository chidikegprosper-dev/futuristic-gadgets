import { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface InstallAppButtonProps {
  className?: string;
  compact?: boolean;
  label?: string;
}

export default function InstallAppButton({ className = '', compact = false, label = 'Install App' }: InstallAppButtonProps) {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (isInstalled) return null;

  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleClick = () => {
    if (canInstall) {
      void promptInstall();
    } else {
      setShowHelp(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 rounded-lg gradient-cyan text-black font-semibold text-sm shadow-lg shadow-[var(--accent-cyan)]/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all ${compact ? 'px-3 py-2' : 'px-4 py-2.5'} ${className}`}
      >
        <Download className="w-4 h-4" />
        {label}
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-6 shadow-2xl animate-scale-in">
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-xl gradient-cyan flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-lg font-bold">Install Protech Digital</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              {isIOS
                ? 'Tap the Share button at the bottom of Safari, then choose "Add to Home Screen".'
                : 'Open your browser menu and choose "Install app" or "Add to Home screen". The store will open like a normal app.'}
            </p>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-3 rounded-xl border border-[var(--border-light)] text-sm font-medium hover:border-[var(--accent-cyan)]/50 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
