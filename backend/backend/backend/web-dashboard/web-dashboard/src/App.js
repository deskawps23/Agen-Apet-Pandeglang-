import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [orders, setOrders] = useState([]);
  const [kurirs, setKurirs] = useState([]);
  const [selectedKurir, setSelectedKurir] = useState('');
  const [payrollData, setPayrollData] = useState(null);

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Fetch Kurirs
  useEffect(() => {
    axios.get(`${API_URL}/kurir`).then(res => setKurirs(res.data));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { username, password });
      if (res.data.token) {
        setIsLoggedIn(true);
        alert('Login berhasil! Selamat datang Deska 👋');
      }
    } catch (error) {
      alert('Login gagal!');
    }
  };

  const handlePayroll = async (kurirId) => {
    const month = '07';
    const year = '2026';
    const res = await axios.get(`${API_URL}/payroll/${kurirId}/${month}/${year}`);
    setPayrollData(res.data);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h1>🔐 Admin ApetOne</h1>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <small>Username: deska | Password: admin123</small>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🏢 ApetOne - Dashboard Admin</h1>
        <p>Owner: Agus Suryana | Admin: Deska Wiata Praja S</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>📦 Total Pesanan Hari Ini</h3>
          <p className="stat-number">156</p>
        </div>
        <div className="stat-card">
          <h3>🚚 Kurir Aktif</h3>
          <p className="stat-number">10/10</p>
        </div>
        <div className="stat-card">
          <h3>💰 Omzet Hari Ini</h3>
          <p className="stat-number">Rp 2.652.000</p>
        </div>
        <div className="stat-card">
          <h3>🏷️ Kecamatan</h3>
          <p className="stat-number">35</p>
        </div>
      </div>

      <div className="payroll-section">
        <h2>💳 Generate Payroll Kurir</h2>
        <select onChange={(e) => handlePayroll(e.target.value)} value={selectedKurir}>
          <option value="">Pilih Kurir</option>
          {kurirs.map(k => (
            <option key={k.id} value={k.id}>{k.name}</option>
          ))}
        </select>

        {payrollData && (
          <div className="payroll-result">
            <h3>Slip Gaji {payrollData.bulan}</h3>
            <p>Gaji Pokok: Rp {payrollData.gaji_pokok.toLocaleString()}</p>
            <p>Insentif Galon: Rp {payrollData.insentif_galon.toLocaleString()}</p>
            <p>Bonus Jarak: Rp {payrollData.bonus_jarak.toLocaleString()}</p>
            <h2>Total: Rp {payrollData.total_gaji.toLocaleString()}</h2>
            <button onClick={() => alert('Slip gaji di-export ke PDF')}>📄 Export PDF</button>
          </div>
        )}
      </div>

      <div className="order-list">
        <h2>📋 Pesanan Terbaru</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pelanggan</th>
              <th>Kecamatan</th>
              <th>Jumlah</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Budi</td><td>Majasari</td><td>2</td><td>Rp 34.000</td><td>Delivered ✅</td></tr>
            <tr><td>2</td><td>Dapur MBG</td><td>Cigeulis</td><td>50</td><td>Rp 875.000</td><td>Processing ⏳</td></tr>
            <tr><td>3</td><td>Ani</td><td>Carita</td><td>3</td><td>Rp 52.500</td><td>Pending 🕐</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
