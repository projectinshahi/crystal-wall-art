-- Size-specific product images: one optional image per size, keyed by the size label
-- (a value from products.sizes), e.g. {"12x18": {"url": "...", "public_id": "..."}}.
-- The product gallery (product_images) is unchanged. Existing products get '{}' (no size images).
--
-- Must be run by the table owner (doadmin); app_reader/app_writer cannot ALTER.
-- Table-level grants already cover new columns, so no GRANT is needed.
-- Idempotent: safe to run more than once.

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS size_images jsonb NOT NULL DEFAULT '{}'::jsonb;
