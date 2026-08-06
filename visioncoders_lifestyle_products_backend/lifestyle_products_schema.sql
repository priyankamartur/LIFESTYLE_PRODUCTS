-- =========================================================================
-- COMPLETE ENTERPRISE MYSQL SETUP SCRIPT FOR LIFESTYLE PRODUCTS E-COMMERCE
-- Includes: Database, Tables, Constraints, Indexes, Sample Data, Views, Stored Procedures, and Triggers
-- Compatible with Java Spring Boot 3.3 / Hibernate 6 DDL Validation
-- =========================================================================

-- -----------------------------------------------------
-- DATABASE CREATION
-- -----------------------------------------------------
DROP DATABASE IF EXISTS lifestyle_products;
CREATE DATABASE IF NOT EXISTS lifestyle_products
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lifestyle_products;

-- -----------------------------------------------------
-- TABLE CREATION (IN STRICT DEPENDENCY ORDER)
-- -----------------------------------------------------

-- 1. Roles Lookup Table (Enum compatible with Hibernate 6)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT,
    name ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL UNIQUE,
    CONSTRAINT pk_roles PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(120) NOT NULL, -- BCrypt Hash
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_email CHECK (email LIKE '%_@__%.__%')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Roles Join Table (ManyToMany)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Categories Table
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

-- 5. Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    category_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_products_price CHECK (price >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Carts Table
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_carts PRIMARY KEY (id),
    CONSTRAINT uq_carts_user UNIQUE (user_id),
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_cart_items PRIMARY KEY (id),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Orders Table
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

-- 9. Order Items Table (Captures Checkout Price)
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- 3NF price preservation at checkout
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_order_items PRIMARY KEY (id),
    CONSTRAINT uq_order_product UNIQUE (order_id, product_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_items_price CHECK (price >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('COMPLETED', 'FAILED', 'PENDING') NOT NULL,
    payment_date DATETIME(6) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    CONSTRAINT pk_payments PRIMARY KEY (id),
    CONSTRAINT uq_payments_order UNIQUE (order_id),
    CONSTRAINT uq_payments_txn UNIQUE (transaction_id),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    CONSTRAINT chk_payments_amount CHECK (amount >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Banners Table
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


-- -----------------------------------------------------
-- PERFORMANCE OPTIMIZING INDEXES
-- -----------------------------------------------------
CREATE INDEX idx_product_name ON products (name);
CREATE INDEX idx_product_featured ON products (featured);
CREATE INDEX idx_product_category_price ON products (category_id, price);
CREATE INDEX idx_order_date ON orders (order_date);
CREATE INDEX idx_order_status ON orders (status);
CREATE INDEX idx_payment_status_date ON payments (payment_status, payment_date);
CREATE INDEX idx_user_names ON users (first_name, last_name);


-- -----------------------------------------------------
-- REALISTIC SAMPLE DATA SEEDING
-- -----------------------------------------------------

-- Seed Roles
INSERT INTO roles (name) VALUES 
('ROLE_USER'),
('ROLE_ADMIN');

-- Seed Users (BCrypt Hash of 'password123')
INSERT INTO users (username, email, password, first_name, last_name, phone_number, enabled, created_at, updated_at) VALUES
('admin', 'admin@lifestyle.com', '$2a$10$B0t19aY.L0ZcK7V6H4pZNeD02tH56b3S16X7aK7v5uS2.X2g/2g2', 'System', 'Administrator', '+15550100', 1, NOW(6), NOW(6)),
('alice_green', 'alice.green@example.com', '$2a$10$B0t19aY.L0ZcK7V6H4pZNeD02tH56b3S16X7aK7v5uS2.X2g/2g2', 'Alice', 'Green', '+15550101', 1, NOW(6), NOW(6)),
('bob_smith', 'bob.smith@example.com', '$2a$10$B0t19aY.L0ZcK7V6H4pZNeD02tH56b3S16X7aK7v5uS2.X2g/2g2', 'Bob', 'Smith', '+15550102', 1, NOW(6), NOW(6)),
('charlie_brown', 'charlie.brown@example.com', '$2a$10$B0t19aY.L0ZcK7V6H4pZNeD02tH56b3S16X7aK7v5uS2.X2g/2g2', 'Charlie', 'Brown', '+15550103', 0, NOW(6), NOW(6));

-- Seed User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2),
(2, 1),
(3, 1),
(4, 1);

-- Seed Categories
INSERT INTO categories (name, description, image_url, created_at, updated_at) VALUES
('Apparel', 'Premium shirts, jackets, and everyday wear.', 'https://images.example.com/categories/apparel.jpg', NOW(6), NOW(6)),
('Footwear', 'Ergonomic and stylish running shoes, boots, and sneakers.', 'https://images.example.com/categories/footwear.jpg', NOW(6), NOW(6)),
('Accessories', 'Leather bags, high-grade watches, and sunglasses.', 'https://images.example.com/categories/accessories.jpg', NOW(6), NOW(6)),
('Home Decor', 'Minimalist lamps, rugs, and dynamic wall art.', 'https://images.example.com/categories/homedecor.jpg', NOW(6), NOW(6));

-- Seed Products
INSERT INTO products (name, description, price, image_url, featured, category_id, created_at, updated_at) VALUES
('Classic Denim Jacket', 'Heavyweight cotton denim jacket with standard fit.', 89.99, 'https://images.example.com/products/denim_jacket.jpg', 1, 1, NOW(6), NOW(6)),
('Organic Cotton T-Shirt', 'Ultra-soft organic cotton crew neck tee.', 24.99, 'https://images.example.com/products/organic_tee.jpg', 0, 1, NOW(6), NOW(6)),
('Aero Running Shoes', 'Lightweight mesh running shoes with responsive cushioning.', 120.00, 'https://images.example.com/products/running_shoes.jpg', 1, 2, NOW(6), NOW(6)),
('Casual Leather Sneakers', 'Handcrafted full-grain leather sneakers in white.', 145.00, 'https://images.example.com/products/leather_sneakers.jpg', 0, 2, NOW(6), NOW(6)),
('Minimalist Leather Wallet', 'Sleek bifold wallet made from vegetable-tanned leather.', 45.00, 'https://images.example.com/products/wallet.jpg', 1, 3, NOW(6), NOW(6)),
('Chronograph Sport Watch', 'Water-resistant chronograph watch with silicone strap.', 199.99, 'https://images.example.com/products/watch.jpg', 0, 3, NOW(6), NOW(6)),
('Ceramic Desk Lamp', 'Matte finished ceramic base lamp with linen shade.', 59.99, 'https://images.example.com/products/lamp.jpg', 0, 4, NOW(6), NOW(6)),
('Geometric Wool Rug', 'Hand-woven geometric patterned wool rug (5x7 ft).', 249.99, 'https://images.example.com/products/rug.jpg', 1, 4, NOW(6), NOW(6));

-- Seed Carts
INSERT INTO carts (user_id, created_at, updated_at) VALUES
(2, NOW(6), NOW(6)),
(3, NOW(6), NOW(6));

-- Seed Cart Items
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES
(1, 2, 2, NOW(6), NOW(6)),
(1, 5, 1, NOW(6), NOW(6)),
(2, 1, 1, NOW(6), NOW(6));

-- Seed Orders
INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address, created_at, updated_at) VALUES
(2, DATE_SUB(NOW(), INTERVAL 5 DAY), 'DELIVERED', 134.98, '123 Main St, New York, NY 10001', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, DATE_SUB(NOW(), INTERVAL 2 DAY), 'PROCESSING', 199.99, '456 Elm St, San Francisco, CA 94101', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, NOW(), 'PENDING', 24.99, '123 Main St, New York, NY 10001', NOW(), NOW());

-- Seed Order Items
INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES
(1, 2, 2, 22.49, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 1, 1, 89.99, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 6, 1, 199.99, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 2, 1, 24.99, NOW(), NOW());

-- Seed Payments
INSERT INTO payments (order_id, transaction_id, amount, payment_method, payment_status, payment_date, created_at, updated_at) VALUES
(1, 'TXN-9823120-NY', 134.98, 'CREDIT_CARD', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 'TXN-4190821-SF', 199.99, 'PAYPAL', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Seed Banners
INSERT INTO banners (title, image_url, link_url, display_order, created_at, updated_at) VALUES
('Summer Apparel Collection - Up to 40% Off', 'https://images.example.com/banners/summer_sale.jpg', '/catalog?category=apparel', 1, NOW(6), NOW(6)),
('Step Up Your Game with Aero Footwear', 'https://images.example.com/banners/footwear_banner.jpg', '/catalog?category=footwear', 2, NOW(6), NOW(6));


-- -----------------------------------------------------
-- ANALYTICAL VIEWS
-- -----------------------------------------------------
CREATE OR REPLACE VIEW view_sales_summary AS
SELECT 
    DATE(o.order_date) AS sales_date,
    COUNT(DISTINCT o.id) AS total_orders,
    COALESCE(SUM(CASE WHEN p.payment_status = 'COMPLETED' THEN o.total_amount ELSE 0.00 END), 0.00) AS total_revenue,
    COUNT(CASE WHEN p.payment_status = 'COMPLETED' THEN 1 END) AS successful_transactions,
    COUNT(CASE WHEN p.payment_status = 'FAILED' THEN 1 END) AS failed_transactions,
    AVG(o.total_amount) AS average_order_value
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
GROUP BY DATE(o.order_date);

CREATE OR REPLACE VIEW view_product_popularity AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    c.name AS category_name,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.quantity * oi.price), 0.00) AS gross_sales_amount
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN categories c ON p.category_id = c.id
GROUP BY p.id, p.name, c.name
ORDER BY units_sold DESC;


-- -----------------------------------------------------
-- TRANSACTIONAL STORED PROCEDURES & TRIGGERS
-- -----------------------------------------------------

DELIMITER //

-- Transactional Cart Checkout
CREATE PROCEDURE sp_checkout_cart(
    IN p_user_id BIGINT,
    IN p_shipping_address VARCHAR(500),
    OUT p_order_id BIGINT
)
BEGIN
    DECLARE v_cart_id BIGINT;
    DECLARE v_total_amount DECIMAL(10, 2) DEFAULT 0.00;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT id INTO v_cart_id FROM carts WHERE user_id = p_user_id;
    
    IF v_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart not found for user';
    END IF;

    SELECT SUM(p.price * ci.quantity) INTO v_total_amount
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    IF v_total_amount IS NULL OR v_total_amount = 0.00 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty. Checkout aborted';
    END IF;

    INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address, created_at, updated_at)
    VALUES (p_user_id, NOW(6), 'PENDING', v_total_amount, p_shipping_address, NOW(6), NOW(6));
    
    SET p_order_id = LAST_INSERT_ID();

    INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at)
    SELECT p_order_id, ci.product_id, ci.quantity, p.price, NOW(6), NOW(6)
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    DELETE FROM cart_items WHERE cart_id = v_cart_id;

    COMMIT;
END //

-- Monthly Performance Report
CREATE PROCEDURE sp_monthly_revenue_report()
BEGIN
    SELECT 
        YEAR(o.order_date) AS sales_year,
        MONTHNAME(o.order_date) AS sales_month,
        COUNT(DISTINCT o.id) AS total_orders,
        SUM(o.total_amount) AS total_gross_sales,
        SUM(CASE WHEN pay.payment_status = 'COMPLETED' THEN o.total_amount ELSE 0.00 END) AS total_net_revenue
    FROM orders o
    LEFT JOIN payments pay ON o.id = pay.order_id
    WHERE YEAR(o.order_date) = YEAR(CURDATE())
    GROUP BY YEAR(o.order_date), MONTH(o.order_date), MONTHNAME(o.order_date)
    ORDER BY MONTH(o.order_date);
END //

-- Triggers for Automatic Status Updates upon successful payment
CREATE TRIGGER trg_after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'COMPLETED' THEN
        UPDATE orders 
        SET status = 'PROCESSING', updated_at = NOW(6)
        WHERE id = NEW.order_id;
    END IF;
END //

CREATE TRIGGER trg_after_payment_update
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'COMPLETED' AND OLD.payment_status != 'COMPLETED' THEN
        UPDATE orders 
        SET status = 'PROCESSING', updated_at = NOW(6)
        WHERE id = NEW.order_id;
    END IF;
END //

DELIMITER ;
