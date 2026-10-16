CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  amount INT UNSIGNED NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO products (slug, name, available, amount, price) VALUES
  ('product-1', 'product 1', TRUE, 12, 199.99),
  ('product-2', 'product 2', TRUE, 3, 49.50),
  ('product-3', 'product 3', FALSE, 0, 120.00),
  ('product-4', 'product 4', TRUE, 25, 9.99),
  ('product-5', 'product 5', FALSE, 0, 350.00),
  ('product-6', 'product 6', TRUE, 1, 75.00);
