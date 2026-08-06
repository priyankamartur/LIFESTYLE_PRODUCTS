-- Step 10: Payments Table
-- This script creates the `payments` table mapping to Payment.java.
-- It tracks transaction records, gateways, amounts, and statuses.

USE lifestyle_products;

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
