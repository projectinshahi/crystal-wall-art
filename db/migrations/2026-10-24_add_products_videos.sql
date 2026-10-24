-- Product videos: an ordered list shown after the images in the product gallery,
-- e.g. [{"url": "https://res.cloudinary.com/.../video/upload/...", "public_id": "product_videos/abc"}].
-- The product gallery (product_images) is unchanged. Existing products get '[]' (no videos).
--
-- Must be run by the table owner (doadmin); app_reader/app_writer cannot ALTER.
-- Table-level grants already cover new columns, so no GRANT is needed.
-- Idempotent: safe to run more than once.

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS videos jsonb NOT NULL DEFAULT '[]'::jsonb;
