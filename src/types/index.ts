export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  specs: Record<string, string>;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}
