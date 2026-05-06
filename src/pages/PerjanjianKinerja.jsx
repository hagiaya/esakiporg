import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Plus, Trash2, Info, ChevronDown, ChevronUp,
  CheckCircle, FileSignature, DollarSign
} from 'lucide-react';

const PK_STORAGE_KEY = 'pk_data';

const formatRupiah = (val) => {
  const num = val.replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const defaultIndikator = () => ({
  id: Date.now() + Math.random(),
  indikator: '',
  satuan: '',
  target: '',
  program: '',
  kegiatan: '',
  anggaran: '',
});

const defaultSasaran = () => ({
  id: Date.now(),
  sasaran: '',
  indikatorList: [defaultIndikator()],
  expanded: true,
});

const DUMMY_PK = [
  {
    id: 1,
    sasaran: 'Meningkatnya Kualitas Tata Kelola Pemerintahan',
    indikatorList: [
      {
        id: 101,
        indikator: 'Nilai SAKIP Perangkat Daerah',
        satuan: 'Nilai',
        target: 'BB (76)',
        program: 'Program Penunjang Urusan Pemerintahan Daerah Provinsi',
        kegiatan: 'Perencanaan, Penganggaran, dan Evaluasi Kinerja Perangkat Daerah',
        anggaran: '850.000.000',
      },
      {
        id: 102,
        indikator: 'Indeks Kepuasan Masyarakat (IKM)',
        satuan: 'Poin',
        target: '85',
        program: 'Program Pemerintahan dan Kesejahteraan Rakyat',
        kegiatan: 'Peningkatan Pelayanan Publik',
        anggaran: '540.000.000',
      },
    ],
    expanded: true,
  },
  {
    id: 2,
    sasaran: 'Terwujudnya Kebijakan Kesejahteraan Rakyat',
    indikatorList: [
      {
        id: 201,
        indikator: 'Persentase Rekomendasi Kebijakan yang Diterapkan',
        satuan: '%',
        target: '80',
        program: 'Program Koordinasi Kerukunan Masyarakat',
        kegiatan: 'Fasilitasi dan Koordinasi Kebijakan Kesejahteraan Rakyat',
        anggaran: '320.000.000',
      },
    ],
    expanded: false,
  },
];

function PerjanjianKinerja({ user }) {
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    document.title = `Perjanjian Kinerja | ${user?.name || 'e-SETDA'}`;
  }, [user]);

  const [tahun, setTahun] = useState('2026');
  const [perangkatDaerah, setPerangkatDaerah] = useState(user?.name || 'SEKRETARIAT DAERAH PROVINSI GORONTALO');
  const [pejabat, setPejabat] = useState('');
  const [nip, setNip] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(PK_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DUMMY_PK;
  };

  const [sasaranList, setSasaranList] = useState(loadData);

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem(PK_STORAGE_KEY, JSON.stringify(sasaranList));
    localStorage.setItem('pk_meta', JSON.stringify({
      perangkatDaerah, tahun, pejabat, nip,
      updatedAt: new Date().toISOString()
    }));
    setTimeout(() => setSaveStatus('saved'), 600);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // ─── Sasaran CRUD ─────────────────────────────────
  const addSasaran = () => setSasaranList(prev => [...prev, defaultSasaran()]);
  const removeSasaran = (id) => setSasaranList(prev => prev.filter(s => s.id !== id));
  const toggleExpand = (id) => setSasaranList(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  const updateSasaran = (id, val) => setSasaranList(prev => prev.map(s => s.id === id ? { ...s, sasaran: val } : s));

  // ─── Indikator CRUD ───────────────────────────────
  const addIndikator = (sasId) =>
    setSasaranList(prev => prev.map(s => s.id !== sasId ? s : { ...s, indikatorList: [...s.indikatorList, defaultIndikator()] }));

  const removeIndikator = (sasId, indId) =>
    setSasaranList(prev => prev.map(s => s.id !== sasId ? s : { ...s, indikatorList: s.indikatorList.filter(i => i.id !== indId) }));

  const updateIndikator = (sasId, indId, field, value) =>
    setSasaranList(prev => prev.map(s => s.id !== sasId ? s : {
      ...s,
      indikatorList: s.indikatorList.map(i => i.id !== indId ? i : { ...i, [field]: value })
    }));

  const handleAnggaranChange = (sasId, indId, raw) => {
    const formatted = formatRupiah(raw);
    updateIndikator(sasId, indId, 'anggaran', formatted);
  };

  // ─── Hitung total anggaran ─────────────────────────
  const totalAnggaran = sasaranList.reduce((acc, s) =>
    acc + s.indikatorList.reduce((a, i) => a + (parseInt(i.anggaran?.replace(/\./g, '') || '0')), 0), 0
  );

  return (
    <div className="pk-page">
      {/* ─── Header Bar ─── */}
      <div className="pk-top-bar glass">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>Data Perencanaan</span> / <span className="active-crumb">Perjanjian Kinerja</span>
        </div>
        <div className="year-selector-wrap">
          <label>Tahun :</label>
          <select value={tahun} onChange={e => setTahun(e.target.value)} className="year-select-sm">
            {['2026', '2025', '2024', '2023'].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* ─── Info Banner ─── */}
      <div className="info-banner-pk">
        <Info size={15} />
        <span>Perjanjian Kinerja (PK) adalah dokumen pernyataan/kesepakatan kinerja antara pimpinan instansi dengan atasannya. Isi setiap sasaran, indikator, target, program, dan anggaran.</span>
      </div>

      {/* ─── Identity Card ─── */}
      <div className="card pk-identity-card">
        <div className="idc-header">
          <FileSignature size={18} className="idc-icon" />
          <h4>Identitas Perjanjian Kinerja</h4>
        </div>
        <div className="idc-grid">
          <div className="field-group">
            <label className="field-label">Perangkat Daerah</label>
            <select
              value={perangkatDaerah}
              onChange={e => setPerangkatDaerah(e.target.value)}
              disabled={!isAdmin && !!user?.name}
              className="idc-input"
            >
              <option>SEKRETARIAT DAERAH PROVINSI GORONTALO</option>
              <option>DINAS PENDIDIKAN, KEBUDAYAAN, PEMUDA DAN OLAHRAGA</option>
              <option>DINAS KESEHATAN</option>
              <option>DINAS PEKERJAAN UMUM DAN PENATAAN RUANG</option>
              <option>INSPEKTORAT PROVINSI</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Tahun Anggaran</label>
            <select value={tahun} onChange={e => setTahun(e.target.value)} className="idc-input">
              {['2026', '2025', '2024', '2023'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Nama Pejabat</label>
            <input
              className="idc-input"
              value={pejabat}
              onChange={e => setPejabat(e.target.value)}
              placeholder="Nama lengkap pejabat..."
            />
          </div>
          <div className="field-group">
            <label className="field-label">NIP</label>
            <input
              className="idc-input"
              value={nip}
              onChange={e => setNip(e.target.value)}
              placeholder="19XXXXXXXXXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* ─── Total Anggaran Summary ─── */}
      <div className="anggaran-summary">
        <DollarSign size={18} />
        <span>Total Nilai Anggaran PK Tahun {tahun} :</span>
        <strong>Rp {totalAnggaran.toLocaleString('id-ID')}</strong>
      </div>

      {/* ─── Sasaran List ─── */}
      <AnimatePresence>
        {sasaranList.map((s, sIdx) => (
          <motion.div
            key={s.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="pk-card card"
          >
            {/* Card Header */}
            <div className="pk-card-header">
              <div className="pk-numbering">
                <span className="pk-badge">{sIdx + 1}</span>
                <span className="pk-label">Sasaran Strategis</span>
              </div>
              <div className="pk-card-actions">
                <button className="btn-icon btn-expand" onClick={() => toggleExpand(s.id)}>
                  {s.expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </button>
                <button className="btn-icon btn-danger" onClick={() => removeSasaran(s.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Sasaran input */}
            <div className="field-group" style={{ marginBottom: s.expanded ? '1rem' : 0 }}>
              <label className="field-label">Sasaran Strategis</label>
              <textarea
                className="pk-textarea"
                rows={2}
                value={s.sasaran}
                onChange={e => updateSasaran(s.id, e.target.value)}
                placeholder="Contoh: Meningkatnya Kualitas Tata Kelola Pemerintahan..."
              />
            </div>

            <AnimatePresence>
              {s.expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  {/* Indikator Section Label */}
                  <div className="section-sep">
                    <span>Indikator Kinerja, Target & Program</span>
                  </div>

                  {/* Indikator Table */}
                  <div className="ind-table-wrap">
                    <table className="ind-table">
                      <thead>
                        <tr>
                          <th style={{ width: 38 }}>#</th>
                          <th style={{ minWidth: 180 }}>Indikator Kinerja</th>
                          <th style={{ width: 80 }}>Satuan</th>
                          <th style={{ width: 100 }}>Target</th>
                          <th style={{ minWidth: 200 }}>Program</th>
                          <th style={{ minWidth: 200 }}>Kegiatan/Sub-Kegiatan</th>
                          <th style={{ width: 140 }}>Anggaran (Rp)</th>
                          <th style={{ width: 46 }}>Hapus</th>
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
                                  onChange={e => updateIndikator(s.id, ind.id, 'indikator', e.target.value)}
                                  placeholder="Nama indikator..."
                                />
                              </td>
                              <td>
                                <input
                                  className="cell-input center-text"
                                  value={ind.satuan}
                                  onChange={e => updateIndikator(s.id, ind.id, 'satuan', e.target.value)}
                                  placeholder="%, Poin"
                                />
                              </td>
                              <td>
                                <input
                                  className="cell-input center-text target-cell"
                                  value={ind.target}
                                  onChange={e => updateIndikator(s.id, ind.id, 'target', e.target.value)}
                                  placeholder="Nilai..."
                                />
                              </td>
                              <td>
                                <textarea
                                  className="cell-input cell-textarea"
                                  rows={2}
                                  value={ind.program}
                                  onChange={e => updateIndikator(s.id, ind.id, 'program', e.target.value)}
                                  placeholder="Nama program..."
                                />
                              </td>
                              <td>
                                <textarea
                                  className="cell-input cell-textarea"
                                  rows={2}
                                  value={ind.kegiatan}
                                  onChange={e => updateIndikator(s.id, ind.id, 'kegiatan', e.target.value)}
                                  placeholder="Nama kegiatan..."
                                />
                              </td>
                              <td>
                                <div className="anggaran-input-wrap">
                                  <span className="rp-prefix">Rp</span>
                                  <input
                                    className="cell-input anggaran-input"
                                    value={ind.anggaran}
                                    onChange={e => handleAnggaranChange(s.id, ind.id, e.target.value)}
                                    placeholder="0"
                                  />
                                </div>
                              </td>
                              <td className="center-cell">
                                <button
                                  className="btn-icon btn-danger sm"
                                  onClick={() => removeIndikator(s.id, ind.id)}
                                  disabled={s.indikatorList.length === 1}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  <button className="btn-add-row" onClick={() => addIndikator(s.id)}>
                    <Plus size={13} /> Tambah Indikator
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ─── Footer ─── */}
      <div className="pk-footer">
        <button className="btn-outline-secondary" onClick={addSasaran}>
          <Plus size={17} /> Tambah Sasaran Strategis
        </button>
        <button className={`btn btn-primary btn-save ${saveStatus ? 'saving' : ''}`} onClick={handleSave}>
          {saveStatus === 'saving' ? (
            'Menyimpan...'
          ) : saveStatus === 'saved' ? (
            <><CheckCircle size={17} /> Tersimpan!</>
          ) : (
            <><Save size={17} /> Simpan Semua Data</>
          )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pk-page { display: flex; flex-direction: column; gap: 1.25rem; }

        .pk-top-bar {
          padding: 0.875rem 1.5rem; display: flex; justify-content: space-between; align-items: center;
          background: white; border-radius: var(--radius-md); border: 1px solid #e2e8f0;
        }
        .breadcrumb { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        .active-crumb { color: var(--primary); font-weight: 700; }
        .year-selector-wrap { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
        .year-select-sm { padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 700; font-size: 0.8rem; }

        .info-banner-pk {
          display: flex; align-items: flex-start; gap: 0.625rem;
          background: #fff7ed; border: 1px solid #fed7aa;
          border-radius: var(--radius-md); padding: 0.75rem 1.25rem;
          font-size: 0.78rem; color: #9a3412; font-weight: 500; line-height: 1.5;
        }
        .info-banner-pk svg { flex-shrink: 0; margin-top: 1px; }

        .pk-identity-card { padding: 1.5rem; }
        .idc-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-weight: 700; color: var(--primary); font-size: 0.95rem; }
        .idc-icon { color: var(--secondary); }
        .idc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .idc-input { width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid #e2e8f0; background: #f8fafc; font-size: 0.875rem; font-weight: 600; }
        .idc-input:focus { outline: none; border-color: var(--secondary); }

        .anggaran-summary {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.875rem 1.5rem; border-radius: var(--radius-md);
          background: linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%);
          color: white; font-size: 0.875rem; font-weight: 600;
        }
        .anggaran-summary strong { margin-left: auto; font-size: 1.05rem; font-weight: 800; color: #6ee7b7; }

        .pk-card { padding: 1.5rem; border-top: 3px solid #f59e0b; }
        .pk-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .pk-numbering { display: flex; align-items: center; gap: 0.75rem; }
        .pk-badge {
          width: 30px; height: 30px; border-radius: 50%;
          background: #f59e0b; color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 800;
        }
        .pk-label { font-weight: 700; font-size: 0.9rem; color: #92400e; }
        .pk-card-actions { display: flex; gap: 0.5rem; }

        .btn-icon { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; }
        .btn-expand { background: #f1f5f9; color: #475569; }
        .btn-expand:hover { background: #e2e8f0; }
        .btn-danger { background: #fee2e2; color: #ef4444; }
        .btn-danger:hover { background: #fecaca; }
        .btn-danger:disabled { opacity: 0.3; cursor: not-allowed; }
        .btn-icon.sm { width: 27px; height: 27px; }

        .pk-textarea {
          width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0; background: #fafafa;
          font-size: 0.875rem; line-height: 1.55; resize: vertical;
        }
        .pk-textarea:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }

        .section-sep { display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0 1rem; }
        .section-sep::before, .section-sep::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
        .section-sep span { font-size: 0.7rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }

        .ind-table-wrap { overflow-x: auto; border-radius: var(--radius-md); border: 1px solid #e2e8f0; }
        .ind-table { width: 100%; border-collapse: collapse; background: white; font-size: 0.78rem; }
        .ind-table th {
          background: #1e293b; color: white;
          padding: 0.65rem 0.75rem; text-align: center;
          font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.02em; white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ind-table td { padding: 0.5rem 0.625rem; border: 1px solid #eef2f6; vertical-align: top; }
        .center-cell { text-align: center; vertical-align: middle !important; }
        .center-text { text-align: center; }
        .text-muted { color: var(--text-muted); font-weight: 600; }

        .cell-input {
          width: 100%; padding: 0.45rem 0.625rem;
          border: 1px solid #e2e8f0; border-radius: 5px;
          background: #f8fafc; font-size: 0.76rem; font-weight: 500;
        }
        .cell-input:focus { outline: none; border-color: #f59e0b; background: white; }
        .cell-textarea { resize: vertical; min-height: 48px; }
        .target-cell { background: #fffbeb !important; border-color: #fde68a !important; font-weight: 700; color: #92400e; }

        .anggaran-input-wrap { display: flex; align-items: center; gap: 0; }
        .rp-prefix {
          padding: 0.45rem 0.5rem; background: #f1f5f9;
          border: 1px solid #e2e8f0; border-right: none;
          border-radius: 5px 0 0 5px; font-size: 0.7rem; font-weight: 700; color: #64748b;
          white-space: nowrap;
        }
        .anggaran-input { border-radius: 0 5px 5px 0 !important; text-align: right; }

        .btn-add-row {
          margin-top: 0.75rem;
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.45rem 0.9rem; border-radius: 6px;
          background: #fef3c7; color: #b45309;
          font-size: 0.75rem; font-weight: 700;
          transition: background 0.2s; cursor: pointer;
        }
        .btn-add-row:hover { background: #fde68a; }

        .field-group { display: flex; flex-direction: column; gap: 0.45rem; }
        .field-label { font-size: 0.73rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.03em; }

        .pk-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem; background: white;
          border-radius: var(--radius-md); border: 1px solid #e2e8f0;
          position: sticky; bottom: 1rem;
          box-shadow: 0 -2px 20px rgba(0,0,0,0.07);
        }
        .btn-outline-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.7rem 1.25rem; border-radius: var(--radius-md);
          border: 2px solid #e2e8f0; background: white;
          color: var(--primary); font-weight: 700; font-size: 0.875rem;
          transition: all 0.2s; cursor: pointer;
        }
        .btn-outline-secondary:hover { border-color: #f59e0b; background: #fffbeb; }
        .btn-save { display: inline-flex; align-items: center; gap: 0.5rem; min-width: 180px; justify-content: center; }

        @media (max-width: 900px) {
          .idc-grid { grid-template-columns: 1fr 1fr; }
          .pk-footer { flex-direction: column; gap: 1rem; position: static; }
          .btn-outline-secondary, .btn-save { width: 100%; justify-content: center; }
        }
        @media (max-width: 600px) {
          .idc-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}

export default PerjanjianKinerja;
