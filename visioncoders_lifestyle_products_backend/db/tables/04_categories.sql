-- Step 4: Categories Table
-- This script creates the `categories` table mapping to Category.java.
-- It acts as a lookup table for product classification.

USE lifestyle_products;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(255),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_categories PRIMARY KEY (id),
    CONSTRAINT uq_categories_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
