/*
# Restrict product review table permissions

1. Scope
- Modify only the existing `product_reviews` table.
- Preserve all reviews and all existing row-level security policies.

2. Security Changes
- Remove any inherited table-level permissions from the `anon` role.
- Restore only SELECT for `anon`, allowing public storefront visitors to read ratings and comments.
- Restore SELECT, INSERT, UPDATE, and DELETE for `authenticated`, allowing signed-in customers to use the owner-scoped review policies.

3. Important Notes
- No rows, columns, or relationships are deleted.
- Row Level Security remains enabled and continues to enforce review ownership for writes.
*/

REVOKE ALL ON product_reviews FROM anon;
REVOKE ALL ON product_reviews FROM authenticated;

GRANT SELECT ON product_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_reviews TO authenticated;
