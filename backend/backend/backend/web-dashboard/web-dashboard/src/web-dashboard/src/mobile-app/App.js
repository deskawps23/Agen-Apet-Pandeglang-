import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.x:5000/api'; // Ganti dengan IP server Anda
const Stack = createNativeStackNavigator();

// ============ HALAMAN LOGIN ============
function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // customer / kurir

  const handleLogin = () => {
    if (phone.length < 10) {
      Alert.alert('Error', 'Masukkan nomor HP yang valid');
      return;
    }
    if (role === 'customer') {
      navigation.navigate('CustomerHome', { phone });
    } else {
      navigation.navigate('KurirHome', { phone });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚰 ApetOne</Text>
      <Text style={styles.subtitle}>Platform Air Galon Pandeglang</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Masukkan Nomor HP" 
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'customer' && styles.roleActive]} 
          onPress={() => setRole('customer')}
        >
          <Text style={styles.roleText}>👤 Pelanggan</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'kurir' && styles.roleActive]} 
          onPress={() => setRole('kurir')}
        >
          <Text style={styles.roleText}>🚚 Kurir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============ HALAMAN PELANGGAN ============
function CustomerHomeScreen({ route }) {
  const { phone } = route.params;
  const [kecamatan, setKecamatan] = useState([]);
  const [selectedKec, setSelectedKec] = useState(null);
  const [harga, setHarga] = useState(17000);
  const [jumlah, setJumlah] = useState('1');
  const [address, setAddress] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/kecamatan`).then(res => setKecamatan(res.data));
  }, []);

  const handleOrder = () => {
    Alert.alert('Sukses', `Pesanan ${jumlah} galon berhasil dibuat!\nTotal: Rp ${(harga * parseInt(jumlah)).toLocaleString()}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>🛒 Pemesanan Air Galon</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Kecamatan</Text>
        {kecamatan.map(k => (
          <TouchableOpacity 
            key={k.id} 
            style={[styles.kecBtn, selectedKec === k.id && styles.kecActive]}
            onPress={() => {
              setSelectedKec(k.id);
              setHarga(k.harga_galon);
            }}
          >
            <Text>{k.name} - Rp {k.harga_galon.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Alamat Lengkap</Text>
        <TextInput style={styles.input} placeholder="Jl. ..." value={address} onChangeText={setAddress} />
        
        <Text style={styles.label}>Jumlah Galon</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={jumlah} 
          onChangeText={setJumlah} 
        />
        
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>Total: Rp {(harga * parseInt(jumlah || '0')).toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
          <Text style={styles.orderText}>Pesan Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ============ HALAMAN KURIR ============
function KurirHomeScreen({ route }) {
  const { phone } = route.params;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders untuk kurir ini (hardcode kurirId=1 dulu)
    axios.get(`${API_URL}/kurir/1/orders`).then(res => setOrders(res.data));
  }, []);

  const updateStatus = (orderId, status) => {
    axios.put(`${API_URL}/orders/${orderId}/status`, { status })
      .then(() => {
        Alert.alert('Berhasil', `Pesanan ${status === 'delivered' ? 'selesai' : 'gagal'}`);
        // Refresh list
        axios.get(`${API_URL}/kurir/1/orders`).then(res => setOrders(res.data));
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>🚚 Daftar Pengiriman Hari Ini</Text>
      
      {orders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order #{order.id}</Text>
          <Text>👤 {order.customer_name}</Text>
          <Text>📍 {order.address}</Text>
          <Text>📦 {order.jumlah_galon} galon</Text>
          <Text>💰 Rp {order.total_harga.toLocaleString()}</Text>
          <Text>Status: {order.status.toUpperCase()}</Text>
          
          <View style={styles.btnGroup}>
            <TouchableOpacity 
              style={[styles.statusBtn, styles.deliveredBtn]} 
              onPress={() => updateStatus(order.id, 'delivered')}
            >
              <Text style={styles.btnText}>✅ Selesai</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statusBtn, styles.failedBtn]} 
              onPress={() => updateStatus(order.id, 'failed')}
            >
              <Text style={styles.btnText}>❌ Gagal</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#1a365d', textAlign: 'center', marginTop: 40 },
  subtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginVertical: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  roleBtn: { flex: 1, padding: 15, backgroundColor: '#e2e8f0', borderRadius: 10, marginHorizontal: 5, alignItems: 'center' },
  roleActive: { backgroundColor: '#2b6cb0' },
  roleText: { fontSize: 16, fontWeight: '600' },
  
  loginBtn: { backgroundColor: '#2b6cb0', padding: 18, borderRadius: 12, marginTop: 20 },
  loginText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#1a365d', marginVertical: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginVertical: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  kecBtn: { padding: 12, backgroundColor: '#f7fafc', borderRadius: 8, marginVertical: 4 },
  kecActive: { backgroundColor: '#bee3f8' },
  
  priceBox: { backgroundColor: '#ebf8ff', padding: 15, borderRadius: 10, marginVertical: 10 },
  priceText: { fontSize: 20, fontWeight: 'bold', color: '#2b6cb0', textAlign: 'center' },
  orderBtn: { backgroundColor: '#48bb78', padding: 16, borderRadius: 12, marginTop: 10 },
  orderText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  
  orderCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginVertical: 8 },
  orderTitle: { fontSize: 18, fontWeight: 'bold', color: '#2b6cb0' },
  btnGroup: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-around' },
  statusBtn: { padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  deliveredBtn: { backgroundColor: '#48bb78' },
  failedBtn: { backgroundColor: '#f56565' },
  btnText: { color: 'white', fontWeight: 'bold' }
});

// ============ NAVIGATION ============
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ title: 'Pelanggan' }} />
        <Stack.Screen name="KurirHome" component={KurirHomeScreen} options={{ title: 'Kurir' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
          }
