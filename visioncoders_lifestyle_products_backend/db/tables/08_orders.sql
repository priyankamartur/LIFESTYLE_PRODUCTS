-- Step 8: Orders Table
-- This script creates the `orders` table mapping to Order.java.
-- It tracks order metadata, total amount, shipping addresses, and statuses.

USE lifestyle_products;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_date DATETIME(6) NOT NULL,
    status ENUM('CANCELLED', 'DELIVERED', 'PENDING', 'PROCESSING', 'SHIPPED') NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_orders_total CHECK (total_amount >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
