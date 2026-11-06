import type { Currency } from '@/context/CurrencyContext';
import { USD_TO_NGN } from '@/context/CurrencyContext';
import type { Product } from '@/types';

export type CatalogSort = 'featured' | 'price-low' | 'price-high' | 'name-az' | 'name-za';
export type ProductCategory = 'All' | 'Audio' | 'Wearables' | 'Power' | 'Gadgets';
export type PriceRange = 'all' | 'under-50' | '50-100' | '100-150' | 'over-150';

export interface ProductFilters {
  search: string;
  sort: CatalogSort;
  category: ProductCategory;
  priceRange: PriceRange;
  currency: Currency;
}

export const CATEGORY_OPTIONS: ProductCategory[] = ['All', 'Audio', 'Wearables', 'Power', 'Gadgets'];

export const PRICE_RANGE_OPTIONS: Array<{ value: PriceRange; label: string; shortLabel: string }> = [
  { value: 'all', label: 'All prices', shortLabel: 'All prices' },
  { value: 'under-50', label: 'Under ₦50,000 / Under $35', shortLabel: 'Under ₦50k / $35' },
  { value: '50-100', label: '₦50,000 - ₦100,000 / $35 - $65', shortLabel: '₦50k - ₦100k / $35 - $65' },
  { value: '100-150', label: '₦100,000 - ₦150,000 / $65 - $100', shortLabel: '₦100k - ₦150k / $65 - $100' },
  { value: 'over-150', label: 'Above ₦150,000 / Above $100', shortLabel: 'Above ₦150k / $100' },
];

export const SORT_OPTIONS: Array<{ value: CatalogSort; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-az', label: 'Name: A - Z' },
  { value: 'name-za', label: 'Name: Z - A' },
];

function productText(product: Product): string {
  return [product.name, product.tagline, product.description, product.category, ...Object.values(product.specs || {})].join(' ').toLowerCase();
}

function matchesCategory(product: Product, category: ProductCategory): boolean {
  if (category === 'All') return true;
  const text = productText(product);
  if (category === 'Audio') return /audio|earbud|headphone|speaker|sound/.test(text);
  if (category === 'Wearables') return /wearable|watch|ring|glass/.test(text);
  if (category === 'Power') return /power|charger|charging|usb|battery|powerbank/.test(text);
  return !matchesCategory(product, 'Audio') && !matchesCategory(product, 'Wearables') && !matchesCategory(product, 'Power');
}

function priceForCurrency(usdPrice: number, currency: Currency): number {
  return currency === 'NGN' ? usdPrice * USD_TO_NGN : usdPrice;
}

function matchesPriceRange(product: Product, priceRange: PriceRange, currency: Currency): boolean {
  const price = priceForCurrency(product.price, currency);
  const thresholds = currency === 'NGN' ? [50000, 100000, 150000] : [35, 65, 100];
  if (priceRange === 'under-50') return price < thresholds[0];
  if (priceRange === '50-100') return price >= thresholds[0] && price < thresholds[1];
  if (priceRange === '100-150') return price >= thresholds[1] && price <= thresholds[2];
  if (priceRange === 'over-150') return price > thresholds[2];
  return true;
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const query = filters.search.trim().toLowerCase();
  const result = products.filter((product) => {
    const matchesSearch = !query || productText(product).includes(query);
    return matchesSearch && matchesCategory(product, filters.category) && matchesPriceRange(product, filters.priceRange, filters.currency);
  });

  return result.sort((a, b) => {
    if (filters.sort === 'price-low') return a.price - b.price;
    if (filters.sort === 'price-high') return b.price - a.price;
    if (filters.sort === 'name-az') return a.name.localeCompare(b.name);
    if (filters.sort === 'name-za') return b.name.localeCompare(a.name);
    return Number(b.featured) - Number(a.featured);
  });
}
