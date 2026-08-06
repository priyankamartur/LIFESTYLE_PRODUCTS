-- Step 6: Carts Table
-- This script creates the `carts` table mapping to Cart.java.
-- It maintains a 1-to-1 relationship with the `users` table.

USE lifestyle_products;

CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_carts PRIMARY KEY (id),
    CONSTRAINT uq_carts_user UNIQUE (user_id),
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
