import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  CheckCircle,
  Database,
  RefreshCw 
} from 'lucide-react';
import { fetchRenstraByOPD } from '../services/sakipService';

const TAHUN_RENSTRA = [2022, 2023, 2024, 2025, 2026, 2027];

const defaultSasaran = () => ({
  id: Date.now(),
  tujuan: '',
  sasaran: '',
  indikatorList: [
    {
      id: Date.now() + 1,
      indikator: '',
      satuan: '',
      kondisiAwal: '',
      target: { 2022: '', 2023: '', 2024: '', 2025: '', 2026: '', 2027: '' },
      kondisiAkhir: '',
      program: '',
    }
  ],
  activeYears: [2025, 2026, 2027],
  expanded: true,
});

const STORAGE_KEY = 'renstra_sasaran_data';

function SasaranRenstra({ user }) {
  const isAdmin = user?.role === 'ADMIN';
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    document.title = `Sasaran Renstra | ${user?.name || 'e-SETDA'}`;
  }, [user]);

  const [perangkatDaerah, setPerangkatDaerah] = useState(user?.name || 'SEKRETARIAT DAERAH PROVINSI GORONTALO');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved'

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [
      {
        id: 1,
        tujuan: 'Terwujudnya Tata Kelola Pemerintahan yang Efektif dan Efisien',
        sasaran: 'Meningkatnya Pelaksanaan Reformasi Birokrasi',
        indikatorList: [
          {
            id: 101,
            indikator: 'Nilai SAKIP Perangkat Daerah',
            satuan: 'Nilai',
            kondisiAwal: '70',
            target: { 2022: '71', 2023: '72', 2024: '74', 2025: '76', 2026: '78', 2027: '80' },
            kondisiAkhir: '80',
            program: 'Program Penunjang Urusan Pemerintahan Daerah Provinsi',
          }
        ],
        activeYears: [2022, 2023, 2024, 2025, 2026, 2027],
        expanded: true,
      }
    ];
  };

  const [sasaranList, setSasaranList] = useState(loadData);

  const fetchOpenData = async () => {
    setIsFetching(true);
    try {
      const apiData = await fetchRenstraByOPD(user?.code);
      if (apiData) {
        setSasaranList(apiData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        alert('Data untuk OPD ini belum tersedia di portal SAKIP.');
      }
    } catch (err) {
      alert('Gagal mengambil data dari portal SAKIP.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sasaranList));
    localStorage.setItem('renstra_meta', JSON.stringify({ 
      perangkatDaerah, 
      updatedAt: new Date().toISOString() 
    }));
    setTimeout(() => setSaveStatus('saved'), 600);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // ─── Sasaran CRUD ─────────────────────────────────
  const addSasaran = () => setSasaranList(prev => [...prev, defaultSasaran()]);
  const removeSasaran = (id) => setSasaranList(prev => prev.filter(s => s.id !== id));
  const toggleExpand = (id) => setSasaranList(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));

  const updateSasaran = (id, field, value) =>
    setSasaranList(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const toggleYear = (id, year) =>
    setSasaranList(prev => prev.map(s => {
      if (s.id !== id) return s;
      const years = s.activeYears.includes(year)
        ? s.activeYears.filter(y => y !== year)
        : [...s.activeYears, year];
      return { ...s, activeYears: years };
    }));

  // ─── Indikator CRUD ───────────────────────────────
  const addIndikator = (sasaranId) =>
    setSasaranList(prev => prev.map(s => {
      if (s.id !== sasaranId) return s;
      return {
        ...s,
        indikatorList: [...s.indikatorList, {
          id: Date.now(),
          indikator: '',
          satuan: '',
          kondisiAwal: '',
          target: { 2022: '', 2023: '', 2024: '', 2025: '', 2026: '', 2027: '' },
          kondisiAkhir: '',
          program: '',
        }]
      };
    }));

  const removeIndikator = (sasaranId, indId) =>
    setSasaranList(prev => prev.map(s => {
      if (s.id !== sasaranId) return s;
      return { ...s, indikatorList: s.indikatorList.filter(i => i.id !== indId) };
    }));

  const updateIndikator = (sasaranId, indId, field, value) =>
    setSasaranList(prev => prev.map(s => {
      if (s.id !== sasaranId) return s;
      return {
        ...s,
        indikatorList: s.indikatorList.map(i =>
          i.id !== indId ? i : { ...i, [field]: value }
        )
      };
    }));

  const updateTarget = (sasaranId, indId, year, value) =>
    setSasaranList(prev => prev.map(s => {
      if (s.id !== sasaranId) return s;
      return {
        ...s,
        indikatorList: s.indikatorList.map(i =>
          i.id !== indId ? i : { ...i, target: { ...i.target, [year]: value } }
        )
      };
    }));

  return (
    <div className="sr-page">
      {/* ─── Header ─── */}
      <div className="sr-top-bar glass">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>Data Perencanaan</span> / <span className="active-crumb">Sasaran Renstra</span>
        </div>
        <div className="period-badge">Renstra 2022–2027</div>
      </div>

      {/* ─── OPD Selector ─── */}
      <div className="card opd-card">
        <div className="flex-header-row" style={{ marginBottom: 0 }}>
          <div className="field-group" style={{ flex: 1 }}>
            <label className="field-label">Nama Perangkat Daerah</label>
            <select
              value={perangkatDaerah}
              onChange={(e) => setPerangkatDaerah(e.target.value)}
              disabled={!isAdmin && !!user?.name}
              className="sr-select"
              style={{ maxWidth: 'none' }}
            >
              <option>SEKRETARIAT DAERAH PROVINSI GORONTALO</option>
              <option>DINAS PENDIDIKAN, KEBUDAYAAN, PEMUDA DAN OLAHRAGA</option>
              <option>DINAS KESEHATAN</option>
              <option>DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</option>
              <option>INSPEKTORAT PROVINSI</option>
            </select>
          </div>
          <button 
            className={`btn ${isFetching ? 'btn-disabled' : 'btn-secondary'} flex items-center gap-sm`} 
            onClick={fetchOpenData}
            disabled={isFetching}
            style={{ marginTop: '1.4rem', marginLeft: '1rem' }}
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} /> 
            {isFetching ? 'Sinkronisasi...' : 'Sinkronkan Open Data'}
          </button>
        </div>
      </div>

      {/* ─── Info Banner ─── */}
      <div className="info-banner" style={{ background: '#ecfdf5', borderColor: '#10b981', color: '#065f46' }}>
        <Database size={16} />
        <span>Data di bawah ini dapat disinkronkan langsung dari <strong>Portal SAKIP Provinsi Gorontalo (laporan-skpd/renstra)</strong>. Klik tombol "Sinkronkan" untuk mengambil data terbaru sesuai OPD Anda.</span>
      </div>

      {/* ─── Sasaran Cards ─── */}
      <AnimatePresence>
        {sasaranList.map((s, sIdx) => (
          <motion.div
            key={s.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="sasaran-card card"
          >
            {/* Card Header */}
            <div className="sasaran-card-header">
              <div className="sasaran-numbering">
                <span className="sn-badge">{sIdx + 1}</span>
                <span className="sn-label">Tujuan & Sasaran</span>
              </div>
              <div className="sasaran-card-actions">
                <button className="btn-icon btn-expand" onClick={() => toggleExpand(s.id)}>
                  {s.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <button className="btn-icon btn-danger" onClick={() => removeSasaran(s.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {s.expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  {/* Tujuan & Sasaran Inputs */}
                  <div className="two-col-grid">
                    <div className="field-group">
                      <label className="field-label">
                        <Target size={13} /> Tujuan Strategis
                      </label>
                      <textarea
                        className="sr-textarea"
                        rows={3}
                        value={s.tujuan}
                        onChange={(e) => updateSasaran(s.id, 'tujuan', e.target.value)}
                        placeholder="Contoh: Terwujudnya Tata Kelola Pemerintahan yang Efektif..."
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">
                        <Target size={13} /> Sasaran Strategis
                      </label>
                      <textarea
                        className="sr-textarea"
                        rows={3}
                        value={s.sasaran}
                        onChange={(e) => updateSasaran(s.id, 'sasaran', e.target.value)}
                        placeholder="Contoh: Meningkatnya Pelaksanaan Reformasi Birokrasi..."
                      />
                    </div>
                  </div>

                  {/* Tahun Aktif */}
                  <div className="field-group mt-1">
                    <label className="field-label">Tahun Aktif</label>
                    <div className="year-pills">
                      {TAHUN_RENSTRA.map(yr => (
                        <button
                          key={yr}
                          onClick={() => toggleYear(s.id, yr)}
                          className={`year-pill ${s.activeYears.includes(yr) ? 'active' : ''}`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="section-sep">
                    <span>Indikator Kinerja Utama (IKU)</span>
                  </div>

                  {/* Indikator Table */}
                  <div className="ind-table-wrap">
                    <table className="ind-table">
                      <thead>
                        <tr>
                          <th style={{ width: 40 }}>#</th>
                          <th style={{ minWidth: 200 }}>Indikator Kinerja</th>
                          <th style={{ width: 90 }}>Satuan</th>
                          <th style={{ width: 90 }}>Kondisi Awal (2021)</th>
                          {TAHUN_RENSTRA.map(yr => (
                            <th key={yr} style={{ width: 80 }}>{yr}</th>
                          ))}
                          <th style={{ width: 90 }}>Kondisi Akhir (2027)</th>
                          <th style={{ minWidth: 180 }}>Program</th>
                          <th style={{ width: 50 }}>Hapus</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {s.indikatorList.map((ind, iIdx) => (
                            <motion.tr
                              key={ind.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <td className="center-cell text-muted">{iIdx + 1}</td>
                              <td>
                                <textarea
                                  className="cell-input cell-textarea"
                                  rows={2}
                                  value={ind.indikator}
                                  onChange={(e) => updateIndikator(s.id, ind.id, 'indikator', e.target.value)}
                                  placeholder="Indikator..."
                                />
                              </td>
                              <td>
                                <input
                                  className="cell-input"
                                  value={ind.satuan}
                                  onChange={(e) => updateIndikator(s.id, ind.id, 'satuan', e.target.value)}
                                  placeholder="Poin / %"
                                />
                              </td>
                              <td>
                                <input
                                  className="cell-input center-cell"
                                  value={ind.kondisiAwal}
                                  onChange={(e) => updateIndikator(s.id, ind.id, 'kondisiAwal', e.target.value)}
                                  placeholder="0"
                                />
                              </td>
                              {TAHUN_RENSTRA.map(yr => (
                                <td key={yr}>
                                  <input
                                    className={`cell-input center-cell ${s.activeYears.includes(yr) ? 'target-active' : 'target-inactive'}`}
                                    value={ind.target[yr]}
                                    onChange={(e) => updateTarget(s.id, ind.id, yr, e.target.value)}
                                    placeholder="-"
                                    disabled={!s.activeYears.includes(yr)}
                                  />
                                </td>
                              ))}
                              <td>
                                <input
                                  className="cell-input center-cell"
                                  value={ind.kondisiAkhir}
                                  onChange={(e) => updateIndikator(s.id, ind.id, 'kondisiAkhir', e.target.value)}
                                  placeholder="0"
                                />
                              </td>
                              <td>
                                <textarea
                                  className="cell-input cell-textarea"
                                  rows={2}
                                  value={ind.program}
                                  onChange={(e) => updateIndikator(s.id, ind.id, 'program', e.target.value)}
                                  placeholder="Nama Program..."
                                />
                              </td>
                              <td className="center-cell">
                                <button
                                  className="btn-icon btn-danger sm"
                                  onClick={() => removeIndikator(s.id, ind.id)}
                                  disabled={s.indikatorList.length === 1}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  <button className="btn-add-row" onClick={() => addIndikator(s.id)}>
                    <Plus size={14} /> Tambah Indikator
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ─── Footer Actions ─── */}
      <div className="sr-footer">
        <button className="btn btn-outline-secondary" onClick={addSasaran}>
          <Plus size={18} /> Tambah Tujuan / Sasaran
        </button>
        <button className={`btn btn-primary btn-save ${saveStatus ? 'saving' : ''}`} onClick={handleSave}>
          {saveStatus === 'saving' ? (
            <span className="saving-dots">Menyimpan...</span>
          ) : saveStatus === 'saved' ? (
            <><CheckCircle size={18} /> Tersimpan!</>
          ) : (
            <><Save size={18} /> Simpan Semua Data</>
          )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sr-page { display: flex; flex-direction: column; gap: 1.25rem; }

        .sr-top-bar {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: var(--radius-md);
          background: white;
          border: 1px solid #e2e8f0;
        }
        .breadcrumb { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        .active-crumb { color: var(--primary); font-weight: 700; }
        .period-badge { background: #ede9fe; color: #5b21b6; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.73rem; font-weight: 800; letter-spacing: 0.02em; }

        .opd-card { padding: 1.25rem 1.5rem; }
        .sr-select { width: 100%; max-width: 500px; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; font-size: 0.875rem; }

        .info-banner {
          display: flex; align-items: flex-start; gap: 0.75rem;
          background: #f0f9ff; border: 1px solid #bae6fd; border-radius: var(--radius-md);
          padding: 0.875rem 1.25rem; font-size: 0.8rem; color: #0369a1; font-weight: 500;
        }
        .info-banner svg { flex-shrink: 0; margin-top: 1px; }

        .sasaran-card { padding: 1.5rem; border-top: 3px solid var(--primary); }

        .sasaran-card-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.25rem;
        }
        .sasaran-numbering { display: flex; align-items: center; gap: 0.75rem; }
        .sn-badge {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--primary); color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 800;
        }
        .sn-label { font-weight: 700; font-size: 0.95rem; color: var(--primary); }

        .sasaran-card-actions { display: flex; gap: 0.5rem; }
        .btn-icon {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; cursor: pointer;
        }
        .btn-expand { background: #f1f5f9; color: #475569; }
        .btn-expand:hover { background: #e2e8f0; }
        .btn-danger { background: #fee2e2; color: #ef4444; }
        .btn-danger:hover { background: #fecaca; }
        .btn-danger:disabled { opacity: 0.3; cursor: not-allowed; }
        .btn-icon.sm { width: 28px; height: 28px; }

        .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

        .field-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .field-label {
          font-size: 0.78rem; font-weight: 700; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.03em;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .sr-textarea {
          padding: 0.875rem; border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0; background: #f8fafc;
          font-size: 0.875rem; line-height: 1.6; resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sr-textarea:focus { outline: none; border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }

        .mt-1 { margin-top: 0.75rem; }

        .year-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .year-pill {
          padding: 0.35rem 0.9rem; border-radius: 20px;
          border: 2px solid #e2e8f0; font-size: 0.78rem; font-weight: 700;
          color: var(--text-muted); transition: all 0.2s; cursor: pointer;
          background: white;
        }
        .year-pill.active {
          background: var(--primary); border-color: var(--primary);
          color: white;
        }
        .year-pill:hover { border-color: var(--primary); color: var(--primary); }
        .year-pill.active:hover { opacity: 0.85; color: white; }

        .section-sep {
          display: flex; align-items: center; gap: 1rem;
          margin: 1.5rem 0 1rem;
        }
        .section-sep::before, .section-sep::after {
          content: ''; flex: 1; height: 1px; background: #e2e8f0;
        }
        .section-sep span {
          font-size: 0.73rem; font-weight: 800; color: #7c3aed;
          text-transform: uppercase; letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .ind-table-wrap { overflow-x: auto; border-radius: var(--radius-md); border: 1px solid #e2e8f0; }
        .ind-table { width: 100%; border-collapse: collapse; background: white; font-size: 0.8rem; }
        .ind-table th {
          background: #7c3aed; color: white;
          padding: 0.75rem 0.875rem;
          text-align: center; font-size: 0.7rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.02em;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .ind-table td {
          padding: 0.625rem 0.75rem;
          border: 1px solid #eef2f6; vertical-align: top;
        }
        .center-cell { text-align: center; vertical-align: middle !important; }
        .text-muted { color: var(--text-muted); font-weight: 600; }

        .cell-input {
          width: 100%; padding: 0.5rem 0.625rem;
          border: 1px solid #e2e8f0; border-radius: 6px;
          background: #f8fafc; font-size: 0.78rem; font-weight: 500;
          transition: border-color 0.2s;
        }
        .cell-input:focus { outline: none; border-color: #8b5cf6; background: white; }
        .cell-textarea { resize: vertical; min-height: 52px; }
        .target-active { background: #f5f3ff; border-color: #c4b5fd; }
        .target-inactive { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

        .btn-add-row {
          margin-top: 0.875rem;
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; border-radius: 6px;
          background: #ede9fe; color: #7c3aed;
          font-size: 0.78rem; font-weight: 700;
          transition: background 0.2s; cursor: pointer;
        }
        .btn-add-row:hover { background: #ddd6fe; }

        .sr-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem;
          background: white; border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          position: sticky; bottom: 1rem;
          box-shadow: 0 -2px 20px rgba(0,0,0,0.08);
        }

        .btn-outline-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.25rem; border-radius: var(--radius-md);
          border: 2px solid #e2e8f0; background: white;
          color: var(--primary); font-weight: 700; font-size: 0.875rem;
          transition: all 0.2s; cursor: pointer;
        }
        .btn-outline-secondary:hover { border-color: var(--primary); background: #f5f3ff; }

        .btn-save { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 180px; justify-content: center; }
        .btn-save.saving { background: #8b5cf6; }
        .saving-dots::after { content: ''; animation: dots 1s infinite; }
        @keyframes dots { 0%,20%{content:'.'} 40%,60%{content:'..'} 80%,100%{content:'...'} }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .gap-sm { gap: 0.5rem; }
        .btn-secondary { background: #f8fafc; color: var(--primary); border: 1px solid #e2e8f0; }
        .btn-secondary:hover { background: #f1f5f9; }
        .btn-disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 900px) {
          .two-col-grid { grid-template-columns: 1fr; }
          .sr-footer { flex-direction: column; gap: 1rem; position: static; }
          .btn-outline-secondary, .btn-save { width: 100%; justify-content: center; }
        }
      `}} />
    </div>
  );
}

export default SasaranRenstra;
