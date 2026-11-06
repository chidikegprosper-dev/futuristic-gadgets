-- Add visit_count and products_viewed columns to visitor_carts

ALTER TABLE visitor_carts ADD COLUMN IF NOT EXISTS visit_count integer NOT NULL DEFAULT 1;
ALTER TABLE visitor_carts ADD COLUMN IF NOT EXISTS products_viewed jsonb NOT NULL DEFAULT '[]'::jsonb;
