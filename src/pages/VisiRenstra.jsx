import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Info, Edit3, CheckCircle, AlertCircle, MessageSquare, Database, RefreshCw } from 'lucide-react';

function VisiRenstra({ user }) {
  const isAdmin = user?.role === 'ADMIN';
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    document.title = `${isAdmin ? 'Review' : 'Input'} Visi Renstra | ${user?.name || 'e-SETDA'}`;
  }, [user, isAdmin]);

  const [perangkatDaerah, setPerangkatDaerah] = useState(isAdmin ? 'SEKRETARIAT DAERAH PROVINSI GORONTALO' : user?.name);
  const [visi, setVisi] = useState('Terwujudnya Gorontalo yang Maju, Mandiri dan Sejahtera Melalui Penataan Birokrasi yang Akuntabel.');
  const [penjabaran, setPenjabaran] = useState('Meningkatkan kualitas pelayanan publik melalui digitalisasi proses bisnis...');
  const [reviewNote, setReviewNote] = useState('');

  const fetchOpenData = async () => {
    setIsFetching(true);
    // Simulating API fetch
    setTimeout(() => {
      setVisi('Terwujudnya Masyarakat Gorontalo yang Maju, Mandiri, dan Berkelanjutan melalui Penguatan Kinerja Birokrasi.');
      setPenjabaran('1. Meningkatkan kualitas SDM Aparatur\n2. Digitalisasi Pelayanan Publik\n3. Penguatan Akuntabilitas Kinerja Instansi Pemerintah');
      setIsFetching(false);
    }, 1500);
  };

  const handleSave = () => {
    alert('Data berhasil disimpan.');
  };

  const handleVerify = (status) => {
    alert(`Status dokumen: ${status}. Catatan: ${reviewNote || 'Tidak ada'}`);
  };

  return (
    <div className="visi-page">
      <div className="page-header-simple glass">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>{isAdmin ? 'Review Perencanaan' : 'Data Perencanaan'}</span> / <span>Visi Renstra</span>
        </div>
        <div className="period-badge">Tahun Periode : Renstra 2022-2027</div>
      </div>

      <div className="content-grid-complex">
        <div className="main-form card">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Edit3 size={18} />
              <h3>{isAdmin ? 'Review' : 'Pengisian'} Visi Rencana Strategis</h3>
            </div>
            {!isAdmin && (
              <button 
                className={`btn ${isFetching ? 'btn-disabled' : 'btn-secondary'} flex items-center gap-sm`}
                onClick={fetchOpenData}
                disabled={isFetching}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              >
                <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
                {isFetching ? 'Sinkronisasi...' : 'Sinkronkan Open Data'}
              </button>
            )}
          </div>

          <div className="info-alert" style={{ marginBottom: '1.5rem', background: '#ecfdf5', padding: '1rem', borderRadius: '8px', border: '1px solid #10b981', color: '#065f46', fontSize: '0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Database size={16} />
            <span>Data Visi dan Penjabaran dapat disinkronkan langsung dari <strong>Portal Open Data SAKIP</strong>.</span>
          </div>
          <div className="form-group">
            <label>Perangkat Daerah</label>
            <select 
              disabled={!isAdmin}
              value={perangkatDaerah} 
              onChange={(e) => setPerangkatDaerah(e.target.value)}
              className="input-select"
              style={{ opacity: !isAdmin ? 0.7 : 1 }}
            >
              <option>SEKRETARIAT DAERAH PROVINSI GORONTALO</option>
              <option>DINAS PENDIDIKAN, KEBUDAYAAN, PEMUDA DAN OLAHRAGA</option>
              <option>DINAS KESEHATAN</option>
              <option>INSPEKTORAT PROVINSI</option>
            </select>
          </div>

          <div className="vision-sections">
            <div className="input-group-vertical">
              <label><Edit3 size={14} /> Visi</label>
              <textarea 
                readOnly={isAdmin}
                rows={4} 
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                placeholder="Masukkan pernyataan visi..."
              />
            </div>

            <div className="input-group-vertical">
              <label><Info size={14} /> Penjabaran Visi</label>
              <textarea 
                readOnly={isAdmin}
                rows={4} 
                value={penjabaran}
                onChange={(e) => setPenjabaran(e.target.value)}
                placeholder="Masukkan rincian penjabaran..."
              />
            </div>
          </div>

          {!isAdmin && (
            <div className="form-footer">
              <button className="btn btn-primary btn-save" onClick={handleSave}>
                <Save size={18} /> Simpan Data
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="review-side-panel card">
            <div className="side-panel-header">
              <MessageSquare size={18} />
              <h4>Panel Verifikasi Admin</h4>
            </div>
            
            <div className="review-control">
              <label>Catatan Review / Perbaikan</label>
              <textarea 
                placeholder="Berikan masukan atau alasan revisi di sini..." 
                rows={5}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>

            <div className="review-actions">
              <button className="btn btn-success flex-1" onClick={() => handleVerify('VERIFIED')}>
                <CheckCircle size={16} /> Verifikasi
              </button>
              <button className="btn btn-error flex-1" onClick={() => handleVerify('REVISION')}>
                <AlertCircle size={16} /> Mark Revisi
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .visi-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .content-grid-complex { display: grid; grid-template-columns: ${isAdmin ? '1fr 350px' : '1fr'}; gap: 1.5rem; }
        
        .page-header-simple {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: var(--radius-md);
          background: white;
          border: 1px solid #e2e8f0;
        }

        .breadcrumb { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        .period-badge { background: #f1f5f9; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }

        .section-title { display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.5rem; }
        .section-title h3 { font-size: 1.1rem; color: var(--primary); font-weight: 700; }

        .input-select { width: 100%; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; }

        .vision-sections { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-group-vertical { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group-vertical label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }
        .input-group-vertical textarea { padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #e2e8f0; line-height: 1.5; resize: none; background: ${isAdmin ? '#f8fafc' : 'white'}; }

        .review-side-panel { display: flex; flex-direction: column; gap: 1.5rem; border-top: 4px solid var(--secondary); }
        .side-panel-header { display: flex; align-items: center; gap: 0.75rem; color: var(--secondary); font-weight: 700; }
        .review-control label { display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; }
        .review-control textarea { width: 100%; padding: 1rem; border-radius: var(--radius-md); border: 1px solid #e2e8f0; font-size: 0.85rem; }
        .review-actions { display: flex; gap: 0.75rem; }

        .btn-success { background: var(--success); color: white; }
        .btn-error { background: var(--error); color: white; }
        .flex-1 { flex: 1; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .gap-sm { gap: 0.5rem; }
        .btn-secondary { background: #f8fafc; color: var(--primary); border: 1px solid #e2e8f0; }
        .btn-secondary:hover { background: #f1f5f9; }
        .btn-disabled { opacity: 0.5; cursor: not-allowed; }

        .form-footer { margin-top: 2rem; display: flex; justify-content: flex-end; }
      `}} />
    </div>
  );
}

export default VisiRenstra;
