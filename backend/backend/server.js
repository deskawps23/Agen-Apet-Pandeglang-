require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// ==================== ROUTES ====================

// 1. Register Pelanggan
app.post('/api/register', (req, res) => {
  const { name, phone, address, kecamatan } = req.body;
  const query = `INSERT INTO customers (name, phone, address, kecamatan) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, phone, address, kecamatan], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Customer registered', id: result.insertId });
  });
});

// 2. Daftar Kecamatan
app.get('/api/kecamatan', (req, res) => {
  db.query('SELECT * FROM kecamatan ORDER BY name', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. Harga berdasarkan kecamatan
app.get('/api/harga/:kecamatanId', (req, res) => {
  const { kecamatanId } = req.params;
  db.query('SELECT harga_galon FROM kecamatan WHERE id = ?', [kecamatanId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ harga: results[0]?.harga_galon || 17000 });
  });
});

// 4. Buat Pesanan
app.post('/api/orders', (req, res) => {
  const { customerId, kecamatanId, jumlah_galon, total_harga, kurirId } = req.body;
  const query = `INSERT INTO orders (customer_id, kecamatan_id, jumlah_galon, total_harga, kurir_id, status) 
                 VALUES (?, ?, ?, ?, ?, 'pending')`;
  db.query(query, [customerId, kecamatanId, jumlah_galon, total_harga, kurirId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Order created', orderId: result.insertId });
  });
});

// 5. Daftar pesanan kurir (hari ini)
app.get('/api/kurir/:kurirId/orders', (req, res) => {
  const { kurirId } = req.params;
  const query = `SELECT o.*, c.name as customer_name, c.address, k.name as kecamatan_name 
                 FROM orders o
                 JOIN customers c ON o.customer_id = c.id
                 JOIN kecamatan k ON o.kecamatan_id = k.id
                 WHERE o.kurir_id = ? AND DATE(o.created_at) = CURDATE()
                 ORDER BY o.created_at ASC`;
  db.query(query, [kurirId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 6. Update status pesanan (kurir update)
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // 'delivered', 'failed'
  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});

// 7. Generate Payroll Kurir (bulanan)
app.get('/api/payroll/:kurirId/:month/:year', (req, res) => {
  const { kurirId, month, year } = req.params;
  const query = `
    SELECT 
      COUNT(*) as total_deliveries,
      SUM(jumlah_galon) as total_galon,
      SUM(CASE WHEN kecamatan_id IN (SELECT id FROM kecamatan WHERE is_far = 1) THEN jumlah_galon ELSE 0 END) as far_deliveries
    FROM orders
    WHERE kurir_id = ? AND status = 'delivered' 
      AND MONTH(created_at) = ? AND YEAR(created_at) = ?
  `;
  db.query(query, [kurirId, month, year], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const data = results[0];
    const gajiPokok = 2500000;
    const insentifGalon = data.total_galon * 500;
    const bonusJarak = data.far_deliveries * 200;
    const total = gajiPokok + insentifGalon + bonusJarak;
    
    res.json({
      kurir_id: kurirId,
      bulan: `${month}-${year}`,
      gaji_pokok: gajiPokok,
      insentif_galon: insentifGalon,
      bonus_jarak: bonusJarak,
      total_gaji: total
    });
  });
});

// 8. Login Admin
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'deska' && password === 'admin123') {
    res.json({ token: 'fake-jwt-token', role: 'admin' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
