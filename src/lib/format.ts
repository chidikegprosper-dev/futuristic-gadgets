import { useCurrency, type Currency } from '@/context/CurrencyContext';

export function formatPrice(usdPrice: number, currency?: Currency): string {
  const c: Currency = currency || 'USD';
  if (c === 'NGN') {
    const ngn = Math.round(usdPrice * 1515);
    return '₦' + new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(ngn);
  }
  return '$' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usdPrice);
}

export function formatPriceDetailed(usdPrice: number, currency?: Currency): string {
  const c: Currency = currency || 'USD';
  if (c === 'NGN') {
    const ngn = Math.round(usdPrice * 1515);
    return '₦' + new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(ngn);
  }
  return '$' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdPrice);
}

export function formatDualPrice(usdPrice: number, currency: Currency): string {
  if (currency === 'NGN') {
    const ngn = Math.round(usdPrice * 1515);
    return '₦' + new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(ngn);
  }
  return '$' + new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usdPrice);
}

export function formatOtherCurrency(usdPrice: number, currency: Currency): string {
  const other: Currency = currency === 'USD' ? 'NGN' : 'USD';
  return formatPrice(usdPrice, other);
}

export { useCurrency };
