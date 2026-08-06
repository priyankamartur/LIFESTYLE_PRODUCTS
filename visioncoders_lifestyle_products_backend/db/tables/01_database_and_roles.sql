-- Step 1: Database Initialization and Roles Table
-- This script creates the main database `lifestyle_products` using utf8mb4 encoding for full unicode/emoji support.
-- It also defines the independent lookup table `roles` corresponding to Role.java and ERole.java.

CREATE DATABASE IF NOT EXISTS lifestyle_products
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lifestyle_products;

-- Create Roles Lookup Table
-- 3NF Conforming: Static, unique lookup values mapping to JPA ERole enum.
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT,
    name ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL UNIQUE,
    CONSTRAINT pk_roles PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
