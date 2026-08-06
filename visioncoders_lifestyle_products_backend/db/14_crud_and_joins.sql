-- Step 14: CRUD and JOIN Queries
-- This script contains standard CRUD templates for all tables and complex JOIN operations commonly used in an e-commerce catalog, cart, and checkout system.

USE lifestyle_products;

-- ==========================================
-- 1. CRUD QUERY EXAMPLES FOR ALL TABLES
-- ==========================================

-- ROLES:
-- Create
INSERT INTO roles (name) VALUES ('ROLE_MODERATOR');
-- Read
SELECT * FROM roles WHERE id = 1;
-- Update
UPDATE roles SET name = 'ROLE_ADMINISTRATOR' WHERE name = 'ROLE_ADMIN';
-- Delete
DELETE FROM roles WHERE name = 'ROLE_MODERATOR';

-- USERS:
-- Create
INSERT INTO users (username, email, password, first_name, last_name, phone_number, enabled, created_at, updated_at)
VALUES ('john_doe', 'john.doe@example.com', '$2a$10$B0t19aY.L0ZcK7V6H4pZNeD02tH56b3S16X7aK7v5uS2.X2g/2g2', 'John', 'Doe', '+15550200', 1, NOW(6), NOW(6));
-- Read
SELECT * FROM users WHERE username = 'john_doe';
-- Update
UPDATE users SET phone_number = '+15550299', updated_at = NOW(6) WHERE username = 'john_doe';
-- Delete
DELETE FROM users WHERE username = 'john_doe';

-- USER_ROLES:
-- Create
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);
-- Read
SELECT * FROM user_roles WHERE user_id = 2;
-- Delete (Revoke Role)
DELETE FROM user_roles WHERE user_id = 2 AND role_id = 2;

-- CATEGORIES:
-- Create
INSERT INTO categories (name, description, image_url, created_at, updated_at)
VALUES ('Electronics', 'Smart home devices, audio systems, and gadget accessories.', 'https://images.example.com/categories/electronics.jpg', NOW(6), NOW(6));
-- Read
SELECT * FROM categories WHERE name = 'Electronics';
-- Update
UPDATE categories SET description = 'Premium consumer smart devices.', updated_at = NOW(6) WHERE name = 'Electronics';
-- Delete
DELETE FROM categories WHERE name = 'Electronics';

-- PRODUCTS:
-- Create
INSERT INTO products (name, description, price, image_url, featured, category_id, created_at, updated_at)
VALUES ('Smart LED Desk Lamp', 'Adjustable temperature LED smart lamp.', 39.99, 'https://images.example.com/products/smart_lamp.jpg', 1, 4, NOW(6), NOW(6));
-- Read
SELECT * FROM products WHERE price < 100.00;
-- Update
UPDATE products SET price = 34.99, updated_at = NOW(6) WHERE name = 'Smart LED Desk Lamp';
-- Delete
DELETE FROM products WHERE name = 'Smart LED Desk Lamp';

-- CARTS:
-- Create
INSERT INTO carts (user_id, created_at, updated_at) VALUES (3, NOW(6), NOW(6));
-- Read
SELECT * FROM carts WHERE user_id = 3;
-- Delete
DELETE FROM carts WHERE user_id = 3;

-- CART_ITEMS:
-- Create
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (1, 3, 1, NOW(6), NOW(6));
-- Read
SELECT * FROM cart_items WHERE cart_id = 1;
-- Update
UPDATE cart_items SET quantity = 3, updated_at = NOW(6) WHERE cart_id = 1 AND product_id = 3;
-- Delete
DELETE FROM cart_items WHERE cart_id = 1 AND product_id = 3;

-- ORDERS:
-- Create
INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address, created_at, updated_at)
VALUES (2, NOW(6), 'PENDING', 89.99, '123 Main St, New York, NY 10001', NOW(6), NOW(6));
-- Read
SELECT * FROM orders WHERE user_id = 2 ORDER BY order_date DESC;
-- Update
UPDATE orders SET status = 'PROCESSING', updated_at = NOW(6) WHERE id = 3;
-- Delete (Strictly restricted in production, but defined for completeness)
DELETE FROM orders WHERE id = 3;

-- ORDER_ITEMS:
-- Create
INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (1, 1, 1, 89.99, NOW(6), NOW(6));
-- Read
SELECT * FROM order_items WHERE order_id = 1;
-- Update
UPDATE order_items SET quantity = 2, price = 85.00, updated_at = NOW(6) WHERE id = 1;
-- Delete
DELETE FROM order_items WHERE id = 1;

-- PAYMENTS:
-- Create
INSERT INTO payments (order_id, transaction_id, amount, payment_method, payment_status, payment_date, created_at, updated_at)
VALUES (2, 'TXN-NEW-99', 199.99, 'CREDIT_CARD', 'COMPLETED', NOW(6), NOW(6), NOW(6));
-- Read
SELECT * FROM payments WHERE transaction_id = 'TXN-NEW-99';
-- Update
UPDATE payments SET payment_status = 'FAILED', updated_at = NOW(6) WHERE transaction_id = 'TXN-NEW-99';
-- Delete
DELETE FROM payments WHERE transaction_id = 'TXN-NEW-99';

-- BANNERS:
-- Create
INSERT INTO banners (title, image_url, link_url, display_order, created_at, updated_at)
VALUES ('Winter Warmers Collection', 'https://images.example.com/banners/winter.jpg', '/catalog?category=apparel', 3, NOW(6), NOW(6));
-- Read
SELECT * FROM banners ORDER BY display_order ASC;
-- Update
UPDATE banners SET display_order = 1, updated_at = NOW(6) WHERE title = 'Winter Warmers Collection';
-- Delete
DELETE FROM banners WHERE title = 'Winter Warmers Collection';


-- ==========================================
-- 2. USEFUL JOIN QUERIES
-- ==========================================

-- Query A: Get all products with their category names
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.price,
    c.name AS category_name,
    p.featured
FROM products p
INNER JOIN categories c ON p.category_id = c.id
ORDER BY c.name, p.name;


-- Query B: Get a user's cart contents, detailing product names, prices, quantities, and item subtotals
SELECT 
    u.username,
    ci.cart_id,
    p.id AS product_id,
    p.name AS product_name,
    p.price AS unit_price,
    ci.quantity,
    (p.price * ci.quantity) AS item_subtotal
FROM users u
INNER JOIN carts c ON u.id = c.user_id
INNER JOIN cart_items ci ON c.id = ci.cart_id
INNER JOIN products p ON ci.product_id = p.id
WHERE u.username = 'alice_green';


-- Query C: Get a comprehensive view of all orders with customer details, order item details, and payment details
SELECT 
    o.id AS order_id,
    u.username,
    u.email,
    o.order_date,
    o.status AS order_status,
    p.name AS product_name,
    oi.quantity,
    oi.price AS price_at_checkout,
    (oi.quantity * oi.price) AS item_total,
    o.total_amount AS order_grand_total,
    pay.transaction_id,
    pay.payment_method,
    pay.payment_status,
    pay.payment_date
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
LEFT JOIN payments pay ON o.id = pay.order_id
ORDER BY o.order_date DESC, o.id, p.name;


-- Query D: Check active user list and their assigned security roles (resolving M:N junction table user_roles)
SELECT 
    u.id AS user_id,
    u.username,
    u.email,
    u.enabled,
    GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ', ') AS roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.username, u.email, u.enabled;
