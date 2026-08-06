-- Step 11: Banners Table
-- This script creates the `banners` table mapping to Banner.java.
-- It is used for displaying promotional items on the homepage catalog.

USE lifestyle_products;

CREATE TABLE IF NOT EXISTS banners (
    id BIGINT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_banners PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
