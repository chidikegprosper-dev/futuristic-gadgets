/*
# Create product reviews and ratings

1. New Tables
- `product_reviews`: customer feedback attached to a product.
- `id` (uuid, primary key): unique review identifier.
- `product_id` (uuid, required): product being reviewed, linked to `products`.
- `user_id` (uuid, required): signed-in account that owns the review, linked to `auth.users`.
- `customer_name` (text, required): display name shown beside the review.
- `rating` (smallint, required): whole-number rating from 1 to 5.
- `review_text` (text, required): written customer feedback.
- `created_at` (timestamptz): time the review was submitted.
- `updated_at` (timestamptz): time the review was last changed.

2. Data Integrity
- Each signed-in customer can have one review per product.
- Ratings are restricted to the range 1 through 5.
- Product deletion cascades to its reviews so orphaned feedback cannot remain.
- Account deletion cascades to that customer's reviews.

3. Security
- Row Level Security is enabled on `product_reviews`.
- Anonymous and authenticated visitors may read reviews because ratings are public storefront content.
- Only authenticated users may insert, update, or delete their own reviews.
- Data API grants are limited to the verbs required by those policies.

4. Performance
- Add indexes for product lookups and newest-review ordering.
*/

CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL CHECK (char_length(trim(customer_name)) BETWEEN 1 AND 80),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text NOT NULL CHECK (char_length(trim(review_text)) BETWEEN 5 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON product_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON product_reviews TO authenticated;

DROP POLICY IF EXISTS "Public can read product reviews" ON product_reviews;
CREATE POLICY "Public can read product reviews"
ON product_reviews FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Users can create own product reviews" ON product_reviews;
CREATE POLICY "Users can create own product reviews"
ON product_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own product reviews" ON product_reviews;
CREATE POLICY "Users can update own product reviews"
ON product_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own product reviews" ON product_reviews;
CREATE POLICY "Users can delete own product reviews"
ON product_reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
