-- Guest checkout: orders placed without an account have no user_id.
-- Customer details are already stored on the order (customer_name/email/phone, shipping_address).
--
-- Must be run by the table owner (doadmin); app_reader/app_writer cannot ALTER.
-- Idempotent: safe to run more than once (a no-op if the column is already nullable).

ALTER TABLE public.orders
    ALTER COLUMN user_id DROP NOT NULL;
