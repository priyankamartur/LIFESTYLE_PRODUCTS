-- Step 12: Wishlist Table
-- This script creates the `wishlist` table mapping to Wishlist.java.
-- It links users to their wishlisted products and enforces a unique constraint on (user_id, product_id).

USE lifestyle_products;

CREATE TABLE IF NOT EXISTS wishlist (
    wishlist_id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_wishlist PRIMARY KEY (wishlist_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uq_wishlist_user_product UNIQUE (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
