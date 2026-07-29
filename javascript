// web-dashboard/src/App.js - FULL VERSION dengan styling inline
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [kurirs, setKurirs] = useState([]);
  const [selectedKurir, setSelectedKurir] = useState('');
  const [payrollData, setPayrollData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data dummy untuk tampilan
  const dummyOrders = [
    { id: 1, customer: 'Budi Santoso', kecamatan: 'Majasari', jumlah: 2, total: 34000, status: 'Delivered' },
    { id: 2, customer: 'Dapur MBG Cigeulis', kecamatan: 'Cigeulis', jumlah: 50, total: 875000, status: 'Processing' },
    { id: 3, customer: 'Ani Rahayu', kecamatan: 'Carita', jumlah: 3, total: 52500, status: 'Pending' },
    { id: 4, customer: 'Dapur MBG Cimanggu', kecamatan: 'Cimanggu', jumlah: 40, total: 720000, status: 'Delivered' },
    { id: 5, customer: 'Rudi Hermawan', kecamatan: 'Kadumerak', jumlah: 1, total: 17000, status: 'Delivered' },
  ];

  const dummyKurirs = [
    { id: 1, name: 'Kurir 1 - Ahmad' },
    { id: 2, name: 'Kurir 2 - Budi' },
    { id: 3, name: 'Kurir 3 - Caca' },
    { id: 4, name: 'Kurir 4 - Dedi' },
    { id: 5, name: 'Kurir 5 - Euis' },
    { id: 6, name: 'Kurir 6 - Fajar' },
    { id: 7, name: 'Kurir 7 - Gilang' },
    { id: 8, name: 'Kurir 8 - Hani' },
    { id: 9, name: 'Kurir 9 - Iwan' },
    { id: 10, name: 'Kurir 10 - Joko' },
  ];

  useEffect(() => {
    setOrders(dummyOrders);
    setKurirs(dummyKurirs);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'deska' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Login gagal! Username: deska | Password: admin123');
    }
  };

  const handlePayroll = (kurirId) => {
    const found = dummyKurirs.find(k => k.id === parseInt(kurirId));
    if (found) {
      setPayrollData({
        kurir_id: kurirId,
        nama: found.name,
        bulan: '07-2026',
        gaji_pokok: 2500000,
        insentif_galon: 1350000,
        bonus_jarak: 540000,
        total_gaji: 4390000
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={loginStyles.container}>
        <div style={loginStyles.card}>
          <div style={loginStyles.logo}>🚰</div>
          <h1 style={loginStyles.title}>Agen-Apet-Pandeglang</h1>
          <p style={loginStyles.subtitle}>Melayani supplier kebutuhan masyarakat dan dapur MBG sekabupaten Pandeglang</p>
          <hr style={loginStyles.divider} />
          <form onSubmit={handleLogin} style={loginStyles.form}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={loginStyles.input}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={loginStyles.input}
              required 
            />
            <button type="submit" style={loginStyles.button}>
              Login sebagai Admin
            </button>
          </form>
          <p style={loginStyles.hint}>Username: deska | Password: admin123</p>
          <p style={loginStyles.owner}>Owner: Agus Suryana | Admin: Deska Wiata Praja S</p>
        </div>
      </div>
    );
  }

  return (
    <div style={appStyles.container}>
      {/* HEADER */}
      <header style={appStyles.header}>
        <div style={appStyles.headerContent}>
          <div style={appStyles.logoArea}>
            <span style={appStyles.logoIcon}>🚰</span>
            <div>
              <h1 style={appStyles.headerTitle}>Agen-Apet-Pandeglang</h1>
              <p style={appStyles.headerSub}>Melayani supplier kebutuhan masyarakat dan dapur MBG sekabupaten Pandeglang</p>
            </div>
          </div>
          <div style={appStyles.headerRight}>
            <span style={appStyles.adminBadge}>👤 Admin: Deska</span>
            <button onClick={() => setIsLoggedIn(false)} style={appStyles.logoutBtn}>Logout</button>
          </div>
        </div>
      </header>

      {/* NAVIGASI TAB */}
      <div style={appStyles.tabNav}>
        <button 
          style={{...appStyles.tabBtn, ...(activeTab === 'dashboard' ? appStyles.tabActive : {})}}
          onClick={() => setActiveTab('dashboard')}
        >📊 Dashboard</button>
        <button 
          style={{...appStyles.tabBtn, ...(activeTab === 'payroll' ? appStyles.tabActive : {})}}
          onClick={() => setActiveTab('payroll')}
        >💰 Payroll</button>
        <button 
          style={{...appStyles.tabBtn, ...(activeTab === 'orders' ? appStyles.tabActive : {})}}
          onClick={() => setActiveTab('orders')}
        >📋 Pesanan</button>
      </div>

      {/* KONTEN */}
      <div style={appStyles.content}>
        {activeTab === 'dashboard' && (
          <div>
            {/* STATS */}
            <div style={appStyles.statsGrid}>
              <div style={appStyles.statCard}>
                <h3>📦 Total Pesanan</h3>
                <p style={appStyles.statNumber}>156</p>
                <small style={appStyles.statSub}>Hari ini</small>
              </div>
              <div style={appStyles.statCard}>
                <h3>🚚 Kurir Aktif</h3>
                <p style={appStyles.statNumber}>10/10</p>
                <small style={appStyles.statSub}>Semua aktif</small>
              </div>
              <div style={appStyles.statCard}>
                <h3>💰 Omzet</h3>
                <p style={appStyles.statNumber}>Rp 2.65 Jt</p>
                <small style={appStyles.statSub}>Hari ini</small>
              </div>
              <div style={appStyles.statCard}>
                <h3>🏷️ Kecamatan</h3>
                <p style={appStyles.statNumber}>35</p>
                <small style={appStyles.statSub}>Seluruh Pandeglang</small>
              </div>
            </div>

            {/* KURIR STATUS */}
            <div style={appStyles.card}>
              <h3 style={appStyles.cardTitle}>🚚 Status 10 Kurir Hari Ini</h3>
              <div style={appStyles.kurirGrid}>
                {dummyKurirs.map(k => (
                  <div key={k.id} style={appStyles.kurirItem}>
                    <span>{k.name}</span>
                    <span style={appStyles.kurirStatus}>✅ Online</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div>
            <div style={appStyles.card}>
              <h3 style={appStyles.cardTitle}>💰 Generate Payroll Kurir</h3>
              <p style={appStyles.cardSub}>Bulan: Juli 2026</p>
              <select 
                onChange={(e) => handlePayroll(e.target.value)} 
                value={selectedKurir}
                style={appStyles.select}
              >
                <option value="">Pilih Kurir</option>
                {kurirs.map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>

              {payrollData && (
                <div style={appStyles.payrollResult}>
                  <h4 style={appStyles.payrollTitle}>Slip Gaji {payrollData.nama}</h4>
                  <p style={appStyles.payrollPeriod}>Periode: {payrollData.bulan}</p>
                  <table style={appStyles.payrollTable}>
                    <tbody>
                      <tr><td>Gaji Pokok</td><td style={appStyles.payrollRight}>Rp {payrollData.gaji_pokok.toLocaleString()}</td></tr>
                      <tr><td>Insentif Galon</td><td style={appStyles.payrollRight}>Rp {payrollData.insentif_galon.toLocaleString()}</td></tr>
                      <tr><td>Bonus Jarak</td><td style={appStyles.payrollRight}>Rp {payrollData.bonus_jarak.toLocaleString()}</td></tr>
                      <tr style={appStyles.payrollTotal}><td><strong>TOTAL</strong></td><td style={appStyles.payrollRight}><strong>Rp {payrollData.total_gaji.toLocaleString()}</strong></td></tr>
                    </tbody>
                  </table>
                  <button style={appStyles.exportBtn}>📄 Export PDF</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div style={appStyles.card}>
            <h3 style={appStyles.cardTitle}>📋 Daftar Pesanan Terbaru</h3>
            <div style={appStyles.tableWrapper}>
              <table style={appStyles.table}>
                <thead>
                  <tr>
                    <th style={appStyles.th}>ID</th>
                    <th style={appStyles.th}>Pelanggan</th>
                    <th style={appStyles.th}>Kecamatan</th>
                    <th style={appStyles.th}>Jumlah</th>
                    <th style={appStyles.th}>Total</th>
                    <th style={appStyles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td style={appStyles.td}>#{o.id}</td>
                      <td style={appStyles.td}>{o.customer}</td>
                      <td style={appStyles.td}>{o.kecamatan}</td>
                      <td style={appStyles.td}>{o.jumlah} galon</td>
                      <td style={appStyles.td}>Rp {o.total.toLocaleString()}</td>
                      <td style={appStyles.td}>
                        <span style={{
                          ...appStyles.statusBadge,
                          ...(o.status === 'Delivered' ? appStyles.statusSuccess : 
                              o.status === 'Processing' ? appStyles.statusWarning : 
                              appStyles.statusPending)
                        }}>
                          {o.status === 'Delivered' ? '✅' : o.status === 'Processing' ? '⏳' : '🕐'} {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={appStyles.footer}>
        <p>© 2026 Agen-Apet-Pandeglang | Owner: Agus Suryana | Admin: Deska Wiata Praja S</p>
        <p style={appStyles.footerSub}>Melayani supplier kebutuhan masyarakat dan dapur MBG sekabupaten Pandeglang</p>
      </footer>
    </div>
  );
}

// ============ STYLES ============
const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  logo: { fontSize: '56px', marginBottom: '10px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#1a365d' },
  subtitle: { fontSize: '14px', color: '#718096', marginTop: '8px' },
  divider: { border: 'none', borderTop: '2px solid #e2e8f0', margin: '20px 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '16px' },
  button: { padding: '14px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  hint: { fontSize: '12px', color: '#a0aec0', marginTop: '12px' },
  owner: { fontSize: '12px', color: '#718096', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }
};

const appStyles = {
  container: { minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Segoe UI, sans-serif' },
  
  header: { background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)', color: 'white', padding: '16px 30px' },
  headerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoIcon: { fontSize: '36px' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold', margin: 0 },
  headerSub: { fontSize: '13px', opacity: 0.85, margin: '2px 0 0 0' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminBadge: { background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer' },
  
  tabNav: { background: 'white', borderBottom: '2px solid #e2e8f0', display: 'flex', gap: '4px', padding: '0 30px', maxWidth: '1200px', margin: '0 auto' },
  tabBtn: { padding: '14px 24px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: '#718096', fontSize: '14px', borderBottom: '3px solid transparent' },
  tabActive: { color: '#2b6cb0', borderBottomColor: '#2b6cb0' },
  
  content: { maxWidth: '1200px', margin: '0 auto', padding: '24px 30px' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  statNumber: { fontSize: '32px', fontWeight: 'bold', color: '#2b6cb0', margin: '8px 0 4px' },
  statSub: { color: '#a0aec0', fontSize: '12px' },
  
  card: { background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1a365d', marginTop: 0, marginBottom: '8px' },
  cardSub: { color: '#718096', fontSize: '14px', marginBottom: '16px' },
  
  kurirGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' },
  kurirItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f7fafc', borderRadius: '8px' },
  kurirStatus: { color: '#48bb78', fontWeight: '600' },
  
  select: { padding: '12px', borderRadius: '8px', border: '2px solid #e2e8f0', width: '100%', maxWidth: '300px', fontSize: '16px' },
  
  payrollResult: { marginTop: '20px', padding: '20px', background: '#f7fafc', borderRadius: '10px' },
  payrollTitle: { fontSize: '18px', margin: '0 0 4px 0' },
  payrollPeriod: { color: '#718096', fontSize: '14px', margin: '0 0 16px 0' },
  payrollTable: { width: '100%', maxWidth: '400px', borderCollapse: 'collapse' },
  payrollRight: { textAlign: 'right' },
  payrollTotal: { borderTop: '2px solid #2b6cb0', fontSize: '18px' },
  exportBtn: { marginTop: '16px', padding: '10px 24px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', background: '#f7fafc', fontWeight: '600', borderBottom: '2px solid #e2e8f0' },
  td: { padding: '12px 16px', borderBottom: '1px solid #e2e8f0' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusSuccess: { background: '#c6f6d5', color: '#22543d' },
  statusWarning: { background: '#fefcbf', color: '#744210' },
  statusPending: { background: '#e2e8f0', color: '#2d3748' },
  
  footer: { background: '#1a365d', color: 'white', padding: '20px 30px', textAlign: 'center', fontSize: '14px' },
  footerSub: { opacity: 0.7, fontSize: '12px', marginTop: '4px' }
};

export default App;
