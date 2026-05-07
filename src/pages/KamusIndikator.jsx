import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Search, 
  Plus, 
  FileText, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  Calculator, 
  Database, 
  Clock,
  Info,
  CheckCircle2
} from 'lucide-react';

const DUMMY_KAMUS = [
  {
    id: 1,
    opd: 'DINAS KESEHATAN',
    indikator: 'Persentase tahapan SPM Provinsi terpenuhi sesuai standar',
    definisi: 'Ukuran keberhasilan pemenuhan 12 standar pelayanan minimal kesehatan di tingkat provinsi sesuai dengan regulasi yang berlaku.',
    rumus: '(Jumlah SPM terpenuhi / Total 12 SPM) x 100%',
    sumberData: 'Laporan Bidang Yankes',
    frekuensi: 'Triwulanan',
    tipe: 'IKU',
    level: 'OPD'
  },
  {
    id: 2,
    opd: 'DINAS KESEHATAN',
    indikator: 'Angka Kematian Bayi (AKB) per 1.000 KH',
    definisi: 'Jumlah kematian bayi (0-11 bulan) per 1.000 kelahiran hidup pada tahun tertentu.',
    rumus: '(Jumlah kematian bayi / Jumlah kelahiran hidup) x 1.000',
    sumberData: 'Profil Kesehatan / Bidang Kesmas',
    frekuensi: 'Tahunan',
    tipe: 'IKU',
    level: 'OPD'
  },
  {
    id: 3,
    opd: 'BIRO ORGANISASI',
    indikator: 'Nilai SAKIP Pemerintah Provinsi',
    definisi: 'Hasil evaluasi akuntabilitas kinerja instansi pemerintah oleh Kemenpan-RB.',
    rumus: 'Hasil Penilaian Kemenpan-RB',
    sumberData: 'LHE Kemenpan-RB',
    frekuensi: 'Tahunan',
    tipe: 'IKU',
    level: 'PEMPROV'
  }
];

function KamusIndikator({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpd, setSelectedOpd] = useState('Semua OPD');
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = DUMMY_KAMUS.filter(item => {
    const matchSearch = item.indikator.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.opd.toLowerCase().includes(searchTerm.toLowerCase());
    const matchOpd = selectedOpd === 'Semua OPD' || item.opd === selectedOpd;
    return matchSearch && matchOpd;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="kamus-page">
      {/* Top Header */}
      <div className="kamus-header glass">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>Referensi</span> / <span className="active-crumb">Kamus Indikator</span>
        </div>
        <div className="header-main">
          <div className="title-section">
            <Book className="header-icon" />
            <div>
              <h1>Kamus Indikator</h1>
              <p>Standardisasi definisi dan cara penghitungan indikator kinerja.</p>
            </div>
          </div>
          <button className="btn btn-primary">
            <Plus size={18} /> Tambah Indikator
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-bar card">
        <div className="search-group">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama indikator atau OPD..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="select-group">
          <Filter size={18} className="filter-icon" />
          <select value={selectedOpd} onChange={(e) => setSelectedOpd(e.target.value)}>
            <option>Semua OPD</option>
            <option>DINAS KESEHATAN</option>
            <option>BIRO ORGANISASI</option>
            <option>DINAS PENDIDIKAN</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-row">
        <div className="stat-card glass">
          <div className="stat-icon blue"><CheckCircle2 /></div>
          <div className="stat-info">
            <span className="stat-value">{filteredData.length}</span>
            <span className="stat-label">Total Indikator</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon purple"><Calculator /></div>
          <div className="stat-info">
            <span className="stat-value">100%</span>
            <span className="stat-label">Memiliki Rumus</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon orange"><Database /></div>
          <div className="stat-info">
            <span className="stat-value">42</span>
            <span className="stat-label">Sumber Data Terdata</span>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="kamus-list">
        {filteredData.length === 0 ? (
          <div className="empty-state card">
            <Search size={48} />
            <p>Tidak ditemukan indikator yang sesuai dengan kriteria.</p>
          </div>
        ) : (
          filteredData.map(item => (
            <div key={item.id} className={`kamus-item card ${expandedId === item.id ? 'expanded' : ''}`}>
              <div className="item-header" onClick={() => toggleExpand(item.id)}>
                <div className="item-main-info">
                  <span className={`type-badge ${item.tipe.toLowerCase()}`}>{item.tipe}</span>
                  <div className="name-box">
                    <h3>{item.indikator}</h3>
                    <span className="opd-name">{item.opd}</span>
                  </div>
                </div>
                <div className="item-meta">
                  <div className="meta-pill">
                    <Clock size={12} /> {item.frekuensi}
                  </div>
                  <button className="expand-btn">
                    {expandedId === item.id ? <ChevronDown /> : <ChevronRight />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="item-detail"
                  >
                    <div className="detail-grid">
                      <div className="detail-section">
                        <label><Info size={14} /> Definisi Operasional</label>
                        <p>{item.definisi}</p>
                      </div>
                      <div className="detail-section">
                        <label><Calculator size={14} /> Rumus Penghitungan</label>
                        <div className="formula-box">
                          <code>{item.rumus}</code>
                        </div>
                      </div>
                      <div className="detail-row">
                        <div className="detail-sub">
                          <label><Database size={14} /> Sumber Data</label>
                          <p>{item.sumberData}</p>
                        </div>
                        <div className="detail-sub">
                          <label><FileText size={14} /> Level Indikator</label>
                          <p>{item.level}</p>
                        </div>
                      </div>
                    </div>
                    <div className="item-footer">
                      <button className="btn btn-sm btn-outline">Edit Detail</button>
                      <button className="btn btn-sm btn-outline">Lihat Evidence</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .kamus-page { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .kamus-header { padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid #e2e8f0; }
        .header-main { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
        .title-section { display: flex; align-items: center; gap: 1rem; }
        .header-icon { width: 42px; height: 42px; color: var(--primary); background: #f5f3ff; padding: 0.75rem; border-radius: 12px; }
        .header-main h1 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin: 0; }
        .header-main p { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

        .filter-bar { padding: 1rem; display: flex; gap: 1rem; }
        .search-group { flex: 1; position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 1rem; color: #94a3b8; }
        .search-group input { width: 100%; padding: 0.75rem 1rem 0.75rem 3rem; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 0.9rem; }
        
        .select-group { width: 260px; position: relative; display: flex; align-items: center; }
        .filter-icon { position: absolute; left: 1rem; color: #94a3b8; z-index: 1; }
        .select-group select { width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; font-size: 0.85rem; appearance: none; }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .stat-card { padding: 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: var(--radius-md); border: 1px solid #e2e8f0; }
        .stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
        .stat-icon.blue { background: #3b82f6; }
        .stat-icon.purple { background: #8b5cf6; }
        .stat-icon.orange { background: #f59e0b; }
        .stat-value { display: block; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        .kamus-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .kamus-item { padding: 0; overflow: hidden; border: 1px solid #e2e8f0; transition: all 0.2s; }
        .kamus-item:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08); }
        .kamus-item.expanded { border-color: var(--primary); }

        .item-header { padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .item-main-info { display: flex; align-items: center; gap: 1.25rem; }
        .type-badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
        .type-badge.iku { background: #dcfce7; color: #166534; }
        .name-box h3 { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0 0 0.25rem 0; }
        .opd-name { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        .item-meta { display: flex; align-items: center; gap: 1rem; }
        .meta-pill { display: flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.6rem; background: #f1f5f9; border-radius: 20px; font-size: 0.7rem; font-weight: 600; color: #64748b; }
        .expand-btn { border: none; background: transparent; color: #94a3b8; }

        .item-detail { padding: 0 1.25rem 1.25rem 1.25rem; border-top: 1px dashed #e2e8f0; padding-top: 1.25rem; }
        .detail-grid { display: flex; flex-direction: column; gap: 1.25rem; }
        .detail-section label, .detail-sub label { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
        .detail-section p, .detail-sub p { font-size: 0.9rem; color: #334155; line-height: 1.5; margin: 0; }
        
        .formula-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 8px; font-family: monospace; color: #0f172a; font-size: 0.95rem; }
        
        .detail-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .item-footer { margin-top: 1.5rem; display: flex; gap: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
        .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.75rem; }
        .btn-outline { border: 1px solid #e2e8f0; background: white; color: #64748b; }
        .btn-outline:hover { border-color: var(--primary); color: var(--primary); }

        .empty-state { padding: 4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #94a3b8; }
      `}} />
    </div>
  );
}

export default KamusIndikator;
