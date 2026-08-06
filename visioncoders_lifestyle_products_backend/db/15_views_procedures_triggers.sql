-- Step 15: Views, Stored Procedures, and Triggers
-- This script contains analytical views, transactional stored procedures, and automated database triggers to streamline e-commerce operations.

USE lifestyle_products;

-- ==========================================
-- 1. ANALYTICAL VIEWS
-- ==========================================

-- View A: Sales Dashboard Summary
-- Consolidates paid orders, total sales, and average basket sizes.
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


-- View B: Product Performance Rankings
-- Displays popularity of products based on items sold.
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


-- ==========================================
-- 2. STORED PROCEDURES
-- ==========================================

DELIMITER //

-- Procedure A: Transactional Checkout
-- Converts a user's cart into a firm Order, copies items, clears the cart, and returns the new order ID.
CREATE PROCEDURE sp_checkout_cart(
    IN p_user_id BIGINT,
    IN p_shipping_address VARCHAR(500),
    OUT p_order_id BIGINT
)
BEGIN
    DECLARE v_cart_id BIGINT;
    DECLARE v_total_amount DECIMAL(10, 2) DEFAULT 0.00;
    
    -- Start Transaction boundary
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Get user's cart
    SELECT id INTO v_cart_id FROM carts WHERE user_id = p_user_id;
    
    IF v_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart not found for the given user';
    END IF;

    -- 2. Verify cart is not empty and compute total amount
    SELECT SUM(p.price * ci.quantity) INTO v_total_amount
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    IF v_total_amount IS NULL OR v_total_amount = 0.00 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty. Checkout aborted';
    END IF;

    -- 3. Create Order
    INSERT INTO orders (user_id, order_date, status, total_amount, shipping_address, created_at, updated_at)
    VALUES (p_user_id, NOW(6), 'PENDING', v_total_amount, p_shipping_address, NOW(6), NOW(6));
    
    SET p_order_id = LAST_INSERT_ID();

    -- 4. Copy Cart Items to Order Items (capturing current product price)
    INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at)
    SELECT p_order_id, ci.product_id, ci.quantity, p.price, NOW(6), NOW(6)
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = v_cart_id;

    -- 5. Empty the user's cart
    DELETE FROM cart_items WHERE cart_id = v_cart_id;

    COMMIT;
END //


-- Procedure B: Monthly Revenue Report
-- Aggregates monthly revenue metrics for the current calendar year.
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

DELIMITER ;


-- ==========================================
-- 3. AUTOMATED DATABASE TRIGGERS
-- ==========================================

DELIMITER //

-- Trigger A: Update Order Status on Payment Success (After Payment Insert)
-- If a payment record is inserted as COMPLETED, advance the order's status to PROCESSING.
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


-- Trigger B: Update Order Status on Payment Success (After Payment Update)
-- If an existing payment status transitions to COMPLETED, update the order status.
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
