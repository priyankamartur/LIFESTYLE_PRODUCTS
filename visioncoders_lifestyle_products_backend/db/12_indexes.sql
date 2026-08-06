-- Step 12: Indexes Configuration
-- This script configures indexes on the database to speed up common search, filtering, and joining operations.

USE lifestyle_products;

-- 1. Product Indexes (Corresponds to Product.java)
CREATE INDEX idx_product_name ON products (name);
CREATE INDEX idx_product_featured ON products (featured);

-- Additional Product optimizations:
-- Speed up category-based product listings with price filtering/sorting
CREATE INDEX idx_product_category_price ON products (category_id, price);

-- 2. Order Indexes (Corresponds to Order.java)
CREATE INDEX idx_order_date ON orders (order_date);
CREATE INDEX idx_order_status ON orders (status);

-- 3. Payment Indexes (Corresponds to Payment.java)
-- Note: UNIQUE constraint on transaction_id already creates an index automatically.
-- We can add a composite index on payment status and date for reporting dashboards
CREATE INDEX idx_payment_status_date ON payments (payment_status, payment_date);

-- 4. User details indexing
-- Speed up name searches in the Admin Panel
CREATE INDEX idx_user_names ON users (first_name, last_name);
