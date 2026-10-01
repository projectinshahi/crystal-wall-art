-- Subcategories: a subcategory is a row in public.categories whose parent_id points to its main category.
-- Main categories keep parent_id = NULL, so every existing row stays a main category (no data is changed).
-- Products keep using products.category_id, which now points to a subcategory for new/edited products.
--
-- Must be run by the table owner (doadmin); app_reader/app_writer cannot ALTER.
-- Table-level grants already cover new columns, so no GRANT is needed.
-- Idempotent: safe to run more than once.

ALTER TABLE public.categories
    ADD COLUMN IF NOT EXISTS parent_id uuid NULL
        REFERENCES public.categories(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_categories_parent_id
    ON public.categories (parent_id);
