-- Price variants per Size + Thickness + Mounting Method.
-- mounting_method holds one value from products.mounting_methods (e.g. 'Studs').
-- NULL means the variant applies to every mounting method: all existing variants stay NULL,
-- so existing products keep exactly their current Size + Thickness prices (no data is changed).
--
-- Must be run by the table owner (doadmin); app_reader/app_writer cannot ALTER.
-- Table-level grants already cover new columns, so no GRANT is needed.
-- Idempotent: safe to run more than once.

ALTER TABLE public.product_variants
    ADD COLUMN IF NOT EXISTS mounting_method text NULL;
