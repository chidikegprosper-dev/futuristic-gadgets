/*
# Create visitor_carts table for tracking website visitors

1. New Tables
- `visitor_carts`: tracks each visitor's session, cart contents, and contact info
  - id (uuid PK)
  - session_id (text, unique browser-generated identifier)
  - cart_items (jsonb, array of {product_id, name, price, quantity, image_url})
  - cart_total (numeric(10,2), current cart subtotal)
  - customer_name (text, filled at checkout)
  - customer_email (text, filled at checkout)
  - customer_phone (text, optional, filled if provided)
  - status (text: 'browsing', 'checkout', 'ordered')
  - last_page (text, last page the visitor was on)
  - created_at (timestamptz, first visit)
  - updated_at (timestamptz, last activity)

2. Security
- RLS enabled on visitor_carts.
- anon + authenticated can INSERT (new visitor sessions).
- anon + authenticated can UPDATE (sync cart contents and contact info).
- anon + authenticated can SELECT (admin dashboard reads this data).
- No DELETE from public roles (data preserved for analytics).
*/

CREATE TABLE IF NOT EXISTS visitor_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  cart_items jsonb NOT NULL DEFAULT '[]',
  cart_total numeric(10,2) NOT NULL DEFAULT 0,
  customer_name text,
  customer_email text,
  customer_phone text,
  status text NOT NULL DEFAULT 'browsing',
  last_page text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visitor_carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_visitor_carts" ON visitor_carts;
CREATE POLICY "public_insert_visitor_carts" ON visitor_carts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_visitor_carts" ON visitor_carts;
CREATE POLICY "public_update_visitor_carts" ON visitor_carts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_visitor_carts" ON visitor_carts;
CREATE POLICY "public_read_visitor_carts" ON visitor_carts FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_visitor_carts_session ON visitor_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_carts_status ON visitor_carts(status);
CREATE INDEX IF NOT EXISTS idx_visitor_carts_updated ON visitor_carts(updated_at DESC);
