import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';

import Laporan from './pages/Laporan';
import VisiRenstra from './pages/VisiRenstra';
import SasaranRenstra from './pages/SasaranRenstra';
import LaporanDetail from './pages/LaporanDetail';
import PohonKinerja from './pages/PohonKinerja';
import Placeholder from './pages/Placeholder';
import Admin from './pages/Admin';
import PerjanjianKinerja from './pages/PerjanjianKinerja';


function App() {
  const [user, setUser] = useState(null);

  // Simple auth check simulation with role
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? <MainLayout user={user} onLogout={() => handleLogin(null)} /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="pohon-kinerja" element={<PohonKinerja user={user} />} />
          <Route path="perencanaan/visi" element={<VisiRenstra user={user} />} />
          <Route path="perencanaan/sasaran" element={<SasaranRenstra user={user} />} />
          <Route path="perencanaan/pk" element={<PerjanjianKinerja user={user} />} />

          <Route path="laporan" element={<Laporan user={user} />} />
          <Route path="laporan/renstra" element={<LaporanDetail user={user} />} />
          <Route path="laporan/iku" element={<LaporanDetail user={user} />} />
          <Route path="laporan/pk" element={<LaporanDetail user={user} />} />
          <Route 
            path="admin" 
            element={
              user?.role === 'ADMIN' 
                ? <Admin user={user} /> 
                : <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2 className="text-2xl font-bold text-error">Akses Ditolak</h2>
                    <p className="text-muted">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                    <button 
                      onClick={() => window.location.href='/'} 
                      className="btn btn-primary"
                      style={{ marginTop: '20px' }}
                    >
                      Kembali ke Dashboard
                    </button>
                  </div>
            } 
          />
          <Route path="settings" element={<Placeholder title="Pengaturan Sistem" user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
