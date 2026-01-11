-- ============================================
-- Income/Expense Tracker Database Schema
-- ============================================
-- Description: Simple database for tracking personal income and expenses
-- Tables: Users, Categories, Transactions
-- ============================================

-- Create database
DROP DATABASE IF EXISTS expense_tracker;
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- ============================================
-- Table: Users
-- Description: Stores user account information
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(50) NOT NULL UNIQUE,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: Categories
-- Description: Stores income and expense categories
-- ============================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_user_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_type ENUM('income', 'expense') NOT NULL,
    category_color VARCHAR(7) DEFAULT '#667eea',
    category_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_category_user_type (category_user_id, category_type),
    UNIQUE KEY unique_user_category (category_user_id, category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: Transactions
-- Description: Stores all income and expense transactions
-- ============================================
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_user_id INT NOT NULL,
    transaction_category_id INT NOT NULL,
    transaction_amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('income', 'expense') NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_description TEXT,
    transaction_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_transaction_user_date (transaction_user_id, transaction_date),
    INDEX idx_transaction_category (transaction_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample user
INSERT INTO users (user_username, user_email, user_password) VALUES 
('john_doe', 'john@example.com', '$2a$10$Vc8kmgeNrRlfuYTeBeayvuoGxbH3E2AhYI/trdblnxggX9TNybsoK');

-- Insert sample categories
INSERT INTO categories (category_user_id, category_name, category_type, category_color) VALUES
(1, 'Salary', 'income', '#10b981'),
(1, 'Freelance', 'income', '#3b82f6'),
(1, 'Groceries', 'expense', '#ef4444'),
(1, 'Transportation', 'expense', '#f59e0b'),
(1, 'Entertainment', 'expense', '#8b5cf6'),
(1, 'Utilities', 'expense', '#ec4899');

-- Insert sample transactions
INSERT INTO transactions (transaction_user_id, transaction_category_id, transaction_amount, transaction_type, transaction_date, transaction_description) VALUES
(1, 1, 3000.00, 'income', '2026-01-01', 'Monthly salary'),
(1, 2, 500.00, 'income', '2026-01-05', 'Website project'),
(1, 3, 150.50, 'expense', '2026-01-02', 'Weekly grocery shopping'),
(1, 4, 45.00, 'expense', '2026-01-03', 'Gas for car'),
(1, 5, 75.00, 'expense', '2026-01-03', 'Movie tickets'),
(1, 6, 120.00, 'expense', '2026-01-01', 'Electricity bill');

-- ============================================
-- Useful Queries
-- ============================================

-- Get total income for a user
-- SELECT SUM(transaction_amount) as total_income 
-- FROM transactions 
-- WHERE transaction_user_id = 1 AND transaction_type = 'income';

-- Get total expenses for a user
-- SELECT SUM(transaction_amount) as total_expenses 
-- FROM transactions 
-- WHERE transaction_user_id = 1 AND transaction_type = 'expense';

-- Get balance (income - expenses)
-- SELECT 
--     (SELECT COALESCE(SUM(transaction_amount), 0) FROM transactions WHERE transaction_user_id = 1 AND transaction_type = 'income') -
--     (SELECT COALESCE(SUM(transaction_amount), 0) FROM transactions WHERE transaction_user_id = 1 AND transaction_type = 'expense') 
-- AS balance;

-- Get transactions by category
-- SELECT c.category_name, t.transaction_amount, t.transaction_date, t.transaction_description
-- FROM transactions t
-- JOIN categories c ON t.transaction_category_id = c.category_id
-- WHERE t.transaction_user_id = 1
-- ORDER BY t.transaction_date DESC;

-- Get spending by category (for a specific month)
-- SELECT c.category_name, SUM(t.transaction_amount) as total
-- FROM transactions t
-- JOIN categories c ON t.transaction_category_id = c.category_id
-- WHERE t.transaction_user_id = 1 
--   AND t.transaction_type = 'expense'
--   AND YEAR(t.transaction_date) = 2026
--   AND MONTH(t.transaction_date) = 1
-- GROUP BY c.category_name
-- ORDER BY total DESC;
