import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Currency = 'USD' | 'NGN';

export const USD_TO_NGN = 1515;

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  convert: (usdPrice: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = 'protech-currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'NGN' ? 'NGN' : 'USD';
    } catch {
      return 'USD';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // ignore
    }
  }, [currency]);

  const setCurrency = (c: Currency) => setCurrencyState(c);
  const toggleCurrency = () => setCurrencyState((prev) => (prev === 'USD' ? 'NGN' : 'USD'));
  const convert = (usdPrice: number) => Math.round(usdPrice * USD_TO_NGN);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
