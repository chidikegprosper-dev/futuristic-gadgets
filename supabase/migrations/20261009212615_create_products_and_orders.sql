/*
# Create products and orders tables for futuristic gadgets store

1. New Tables
- `products`: catalog of futuristic gadgets for sale
  - id (uuid PK)
  - name (text)
  - tagline (text, short marketing line)
  - description (text, full description)
  - price (numeric(10,2))
  - category (text: e.g. "Wearables", "Drones", "Audio", "Displays", "Smart Home")
  - image_url (text, product photo URL)
  - specs (jsonb, key-value technical specifications)
  - featured (boolean, shown on landing page)
  - in_stock (boolean)
  - created_at (timestamptz)
- `orders`: customer purchase records
  - id (uuid PK)
  - customer_name (text)
  - customer_email (text)
  - shipping_address (text)
  - items (jsonb, array of {product_id, name, price, quantity})
  - total (numeric(10,2))
  - status (text, default 'pending')
  - created_at (timestamptz)

2. Security
- RLS enabled on both tables.
- products: public read (anon + authenticated), no public writes.
- orders: public insert (customers place orders without accounts), public read, no public update/delete.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  specs jsonb NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  shipping_address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
