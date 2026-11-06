/*
# Link orders to customer accounts

1. Modified Table
- `orders.user_id` (uuid, nullable for legacy records): signed-in account that placed the order.
- New orders receive the current authenticated account automatically through `auth.uid()`.
- Existing order rows are preserved unchanged and may remain unlinked.

2. Security Changes
- Remove anonymous access to order records.
- Allow authenticated customers to insert their own orders.
- Allow authenticated customers to read only orders linked to their own account.
- Keep the existing products, reviews, and visitor analytics access rules unchanged.

3. Important Notes
- No existing orders are deleted or rewritten.
- Checkout must be used by a signed-in customer for the new owner check to pass.
- The account owner is taken from the authenticated session, not from a browser-supplied customer ID.
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();

REVOKE ALL ON orders FROM anon;
REVOKE ALL ON orders FROM authenticated;
GRANT SELECT, INSERT ON orders TO authenticated;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
DROP POLICY IF EXISTS "public_read_orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;

CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
