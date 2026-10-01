-- Adds the optional mobile/tablet hero image used by Admin → Content (hero sections).
-- Stores the same JSON-in-text shape as `contents.image`: {"url": "...", "public_id": "..."}.
-- Nullable: existing rows stay NULL and the storefront falls back to `image`.
--
-- Must be run by the table owner (doadmin); app_reader/app_writer cannot ALTER.
-- Table-level grants already cover new columns, so no GRANT is needed.
-- Idempotent: safe to run more than once.

ALTER TABLE public.contents
    ADD COLUMN IF NOT EXISTS mobile_image text;
