import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, FileText, CheckCircle2, Clock, AlertCircle, X, Download, ExternalLink, Calendar, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Kelembagaan({ user }) {
  useEffect(() => {
    document.title = `${user?.role === 'ADMIN' ? 'Monitoring' : 'Struktur'} | e-SETDA`;
  }, [user]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOPD, setSelectedOPD] = useState(null);
  const [isAddingModal, setIsAddingModal] = useState(false);
  const [newOPD, setNewOPD] = useState({ name: '', code: '', head: '', address: '', employees: '' });

  const [allOPDs, setAllOPDs] = useState([
    { id: 1, name: 'Dinas Pendidikan, Kebudayaan, Pemuda dan Olahraga', code: 'DIKBUDPORA', status: 'Selesai', date: '2026-03-15', progress: 100, head: 'Dr. Wahyudin A. Katili, S.STP, ME', address: 'Jl. Ahmad Nadjamuddin No. 1, Kota Gorontalo', employees: 420 },
    { id: 2, name: 'Dinas Kesehatan', code: 'DINKES', status: 'Proses', date: '2026-04-01', progress: 65, head: 'Drs. Anang S. Otoluwa, MPPM', address: 'Jl. Prof. Dr. Aloei Saboe, Kota Gorontalo', employees: 350 },
    { id: 3, name: 'Badan Kepegawaian Daerah', code: 'BKD', status: 'Draft', date: '2026-04-05', progress: 20, head: 'Zukri Surotinojo, S.Kom, M.Si', address: 'Jl. Sapta Marga, Kota Gorontalo', employees: 120 },
    { id: 4, name: 'Inspektorat Provinsi', code: 'ITPROV', status: 'Revisi', date: '2026-03-20', progress: 45, head: 'Misranda Nalole, SE, M.Si', address: 'Jl. Jendral Sudirman No. 5, Kota Gorontalo', employees: 85 },
    { id: 5, name: 'Dinas Pekerjaan Umum dan Penataan Ruang', code: 'PUPR', status: 'Selesai', date: '2026-03-10', progress: 100, head: 'Ir. Aries Ardianto, MT', address: 'Jl. Panjaitan No. 10, Kota Gorontalo', employees: 210 },
  ]);

  const isAdmin = user?.role === 'ADMIN';

  const filteredData = allOPDs.filter(opd => {
    const matchesSearch = opd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         opd.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (isAdmin) return matchesSearch;
    return matchesSearch && opd.code === user.code;
  });

  const handleAddOPD = (e) => {
    e.preventDefault();
    const id = allOPDs.length + 1;
    const date = new Date().toISOString().split('T')[0];
    setAllOPDs([{ ...newOPD, id, status: 'Draft', date, progress: 0 }, ...allOPDs]);
    setIsAddingModal(false);
    setNewOPD({ name: '', code: '', head: '', address: '', employees: '' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai': return <span className="badge badge-success">Terverifikasi</span>;
      case 'Proses': return <span className="badge badge-warning">Peninjauan</span>;
      case 'Draft': return <span className="badge badge-error" style={{ background: '#f1f5f9', color: '#64748b' }}>Draft</span>;
      case 'Revisi': return <span className="badge badge-error">Perlu Revisi</span>;
      default: return null;
    }
  };

  return (
    <div className="kelembagaan-page">
      <div className="page-header-actions">
        <div>
          <h1 className="text-2xl font-bold">{isAdmin ? 'Monitoring Struktur Organisasi' : 'Profil Struktur Instansi'}</h1>
          <p className="text-muted">
            {isAdmin 
              ? 'Panel pemantauan susunan organisasi seluruh perangkat daerah.' 
              : 'Manajemen data struktur organisasi dan tata kerja instansi Anda.'}
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setIsAddingModal(true)}>
            <Plus size={18} /> Tambah Struktur
          </button>
        )}
      </div>

      <div className="filter-bar card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama OPD atau kode..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filters">
          <button className="btn-filter"><Filter size={16} /> Filter Status</button>
          <button className="btn-filter">Tahun 2026</button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="table-container card"
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Instansi / OPD</th>
              <th>Status Evaluasi</th>
              <th>Progress</th>
              <th>Tgl Update</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((opd) => (
              <tr key={opd.id} className="clickable-row" onClick={() => setSelectedOPD(opd)}>
                <td>
                  <div className="opd-info">
                    <span className="opd-name">{opd.name}</span>
                    <span className="opd-code">{opd.code}</span>
                  </div>
                </td>
                <td>{getStatusBadge(opd.status)}</td>
                <td>
                  <div className="progress-group">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${opd.progress}%`, background: opd.progress === 100 ? 'var(--secondary)' : 'var(--warning)' }}></div>
                    </div>
                    <span className="progress-text">{opd.progress}%</span>
                  </div>
                </td>
                <td><span className="text-sm font-medium">{opd.date}</span></td>
                <td>
                  <button className="btn-icon-more" onClick={(e) => { e.stopPropagation(); setSelectedOPD(opd); }}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOPD && (
          <div className="modal-overlay" onClick={() => setSelectedOPD(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-subtitle">{selectedOPD.code}</span>
                  <h2 className="modal-title">{selectedOPD.name}</h2>
                </div>
                <button className="btn-close" onClick={() => setSelectedOPD(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="info-grid">
                  <div className="info-item">
                    <Users size={18} className="info-icon" />
                    <div className="info-text">
                      <label>Kepala Instansi</label>
                      <p>{selectedOPD.head}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <MapPin size={18} className="info-icon" />
                    <div className="info-text">
                      <label>Alamat Kantor</label>
                      <p>{selectedOPD.address}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Calendar size={18} className="info-icon" />
                    <div className="info-text">
                      <label>Update Terakhir</label>
                      <p>{selectedOPD.date}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Users size={18} className="info-icon" />
                    <div className="info-text">
                      <label>Jumlah Pegawai</label>
                      <p>{selectedOPD.employees} Personil</p>
                    </div>
                  </div>
                </div>

                <div className="document-section">
                  <h4 className="section-label">Dokumen Validasi</h4>
                  <div className="document-list">
                    <div className="doc-item">
                      <FileText size={18} />
                      <div className="doc-info">
                        <span>SK SOTK_2026.pdf</span>
                        <small>1.2 MB • Terbit 10 Jan 2026</small>
                      </div>
                      <button className="btn-doc-action"><Download size={16} /></button>
                    </div>
                    <div className="doc-item">
                      <FileText size={18} />
                      <div className="doc-info">
                        <span>Laporan_Kelembagaan_T1.pdf</span>
                        <small>2.5 MB • Terbit 15 Mar 2026</small>
                      </div>
                      <button className="btn-doc-action"><Download size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setSelectedOPD(null)}>Tutup</button>
                <button className="btn btn-primary">
                  Sudah Sesuai <CheckCircle2 size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddingModal && (
          <div className="modal-overlay" onClick={() => setIsAddingModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-subtitle">Tambah Data Baru</span>
                  <h2 className="modal-title">Input Struktur Organisasi</h2>
                </div>
                <button className="btn-close" onClick={() => setIsAddingModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddOPD}>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group-modal full">
                      <label>Nama Lengkap Instansi / OPD</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Contoh: Dinas Kesehatan Provinsi..."
                        value={newOPD.name}
                        onChange={(e) => setNewOPD({ ...newOPD, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>Kode Singkatan</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="DINKES"
                        value={newOPD.code}
                        onChange={(e) => setNewOPD({ ...newOPD, code: e.target.value })}
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>Nama Kepala Instansi</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Gelar & Nama Lengkap..."
                        value={newOPD.head}
                        onChange={(e) => setNewOPD({ ...newOPD, head: e.target.value })}
                      />
                    </div>
                    <div className="form-group-modal full">
                      <label>Alamat Kantor</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Jl. Raya..."
                        value={newOPD.address}
                        onChange={(e) => setNewOPD({ ...newOPD, address: e.target.value })}
                      />
                    </div>
                    <div className="form-group-modal">
                      <label>Total Pegawai</label>
                      <input 
                        type="number" 
                        required 
                        placeholder="0"
                        value={newOPD.employees}
                        onChange={(e) => setNewOPD({ ...newOPD, employees: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setIsAddingModal(false)}>Batalkan</button>
                  <button type="submit" className="btn btn-primary">
                    Simpan Struktur <Save size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .kelembagaan-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .text-2xl { font-size: 1.5rem; font-weight: 700; color: var(--primary); }
        .text-muted { color: var(--text-muted); font-size: 0.875rem; }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          align-items: center;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 350px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.875rem;
        }

        .filters {
          display: flex;
          gap: 1rem;
        }

        .btn-filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .table-container {
          padding: 0;
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 1.25rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .data-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .opd-info {
          display: flex;
          flex-direction: column;
        }

        .opd-name {
          font-weight: 600;
          color: var(--primary);
          font-size: 0.875rem;
        }

        .opd-code {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .progress-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 150px;
        }

        .progress-bar-bg {
          height: 6px;
          flex: 1;
          background: #f1f5f9;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .btn-icon-more {
          padding: 0.5rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
        }

        .btn-icon-more:hover { background: #f1f5f9; }

        .clickable-row { cursor: pointer; transition: background 0.2s; }
        .clickable-row:hover { background: #f8fafc; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          width: 100%;
          max-width: 600px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          padding: 1.5rem 2rem;
          background: var(--primary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title { font-size: 1.25rem; font-weight: 700; margin-top: 0.25rem; }
        .modal-subtitle { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; opacity: 0.8; letter-spacing: 0.05em; }

        .btn-close {
          color: white;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .btn-close:hover { opacity: 1; }

        .modal-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .info-icon { color: var(--secondary); margin-top: 0.25rem; }
        .info-text label { display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; }
        .info-text p { font-size: 0.95rem; font-weight: 600; color: var(--primary); }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group-modal {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group-modal.full { grid-column: span 2; }
        .form-group-modal label { font-size: 0.85rem; font-weight: 700; color: var(--primary); }
        .form-group-modal input {
          padding: 0.875rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          background: #f8fafc;
          font-size: 0.9rem;
          transition: var(--transition-base);
        }

        .form-group-modal input:focus {
          outline: none;
          border-color: var(--secondary);
          background: white;
          box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.1);
        }

        .document-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .section-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }

        .document-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .doc-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
        }

        .doc-info { flex: 1; display: flex; flex-direction: column; }
        .doc-info span { font-size: 0.875rem; font-weight: 600; color: var(--primary); }
        .doc-info small { font-size: 0.75rem; color: var(--text-muted); }

        .btn-doc-action { color: var(--text-muted); }
        .btn-doc-action:hover { color: var(--secondary); }

        .modal-footer {
          padding: 1.5rem 2rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .data-table thead { display: none; }
          .data-table, .data-table tbody, .data-table tr, .data-table td { display: block; width: 100%; }
          .data-table tr { 
            padding: 1.5rem; 
            border-bottom: 8px solid #f8fafc;
            position: relative;
          }
          .data-table td { padding: 0.5rem 0; border: none; }
          .data-table td:last-child { 
            position: absolute; 
            top: 1rem; 
            right: 0.5rem; 
          }
          .progress-group { width: 100%; margin-top: 0.5rem; }
          .search-box { width: 100%; }
          .filter-bar { flex-direction: column; gap: 1rem; }
          .filters { width: 100%; }
          .btn-filter { flex: 1; justify-content: center; }
          .page-header-actions { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}

export default Kelembagaan;
