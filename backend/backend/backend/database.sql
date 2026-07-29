CREATE DATABASE IF NOT EXISTS apetone_db;
USE apetone_db;

-- Tabel Kecamatan (35 kecamatan Pandeglang)
CREATE TABLE kecamatan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  harga_galon INT DEFAULT 17000,
  is_far BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 35 kecamatan (contoh 5 dulu)
INSERT INTO kecamatan (name, harga_galon, is_far) VALUES
('Majasari', 17000, FALSE),
('Kadumerak', 17000, FALSE),
('Cigeulis', 17500, TRUE),
('Cimanggu', 18000, TRUE),
('Carita', 17500, TRUE);
-- Tambahkan 30 kecamatan lainnya...

-- Tabel Pelanggan
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  address TEXT,
  kecamatan_id INT,
  is_mbg BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kecamatan_id) REFERENCES kecamatan(id)
);

-- Tabel Kurir (10 orang)
CREATE TABLE kurir (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  kecamatan_handle TEXT, -- comma separated
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO kurir (name, phone, kecamatan_handle) VALUES
('Kurir 1', '081234567890', '1,2'),
('Kurir 2', '081234567891', '3,4,5');
-- Tambahkan 8 kurir lainnya

-- Tabel Pesanan
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  kecamatan_id INT NOT NULL,
  kurir_id INT,
  jumlah_galon INT NOT NULL,
  total_harga INT NOT NULL,
  status ENUM('pending', 'processing', 'delivered', 'failed') DEFAULT 'pending',
  payment_method ENUM('cod', 'transfer', 'ewallet') DEFAULT 'cod',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (kecamatan_id) REFERENCES kecamatan(id),
  FOREIGN KEY (kurir_id) REFERENCES kurir(id)
);

-- Tabel Payroll (auto generated)
CREATE TABLE payroll (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kurir_id INT NOT NULL,
  bulan VARCHAR(7) NOT NULL, -- format: 2026-07
  gaji_pokok INT DEFAULT 2500000,
  insentif_galon INT DEFAULT 0,
  bonus_jarak INT DEFAULT 0,
  total_gaji INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kurir_id) REFERENCES kurir(id)
);
