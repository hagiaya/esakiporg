import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, Save, Send, AlertCircle, Eye, X, CheckCircle2 } from 'lucide-react';

function Monev({ user }) {
  useEffect(() => {
    document.title = `${user?.role === 'ADMIN' ? 'Monitoring Monev' : 'Isi Kuisioner'} | e-SETDA`;
  }, [user]);

  const isAdmin = user?.role === 'ADMIN';
  const [activeStep, setActiveStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOPDReview, setSelectedOPDReview] = useState(null);

  const mockMonitoringData = [
    { id: 1, name: 'Dinas Pendidikan, Kebudayaan, Pemuda dan Olahraga', code: 'DIKBUDPORA', completion: 100, status: 'Sudah Kirim', date: '2026-04-05' },
    { id: 2, name: 'Dinas Kesehatan', code: 'DINKES', completion: 75, status: 'Draft', date: '2026-04-06' },
    { id: 3, name: 'Badan Kepegawaian Daerah', code: 'BKD', completion: 20, status: 'Draft', date: '2026-04-07' },
    { id: 4, name: 'Inspektorat Provinsi', code: 'ITPROV', completion: 0, status: 'Belum Isi', date: '-' },
  ];
  
  const questions = [
    { id: 1, text: 'Apakah Struktur Organisasi dan Tata Kerja (SOTK) sudah sesuai dengan regulasi terbaru?', category: 'Kelembagaan' },
    { id: 2, text: 'Apakah jumlah personil pada masing-masing unit kerja sudah memenuhi standar minimal?', category: 'Sumber Daya' },
    { id: 3, text: 'Apakah uraian tugas (job description) setiap jabatan sudah terdokumentasi dengan baik?', category: 'Operasional' },
    { id: 4, text: 'Apakah koordinasi antar unit kerja berjalan sesuai dengan prosedur yang ditetapkan?', category: 'Koordinasi' },
  ];

  const handleAnswerChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const completionPercentage = Math.round((Object.keys(answers).length / questions.length) * 100);

  const handleSubmit = () => {
    if (completionPercentage < 100) {
      alert('Mohon lengkapi semua pertanyaan sebelum mengirim.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (isAdmin) {
    return (
      <div className="monev-page">
        <div className="page-header">
          <h1 className="text-2xl font-bold">Rekapitulasi Kuisioner Monev</h1>
          <p className="text-muted">Pantau hasil pengisian instrumen monitoring dan evaluasi dari seluruh OPD.</p>
        </div>

        <div className="admin-monitoring-grid card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Instansi / OPD</th>
                <th width="200">Progres Pengisian</th>
                <th>Status</th>
                <th>Terakhir Update</th>
                <th width="120">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockMonitoringData.map(opd => (
                <tr key={opd.id}>
                  <td>
                    <div className="opd-info">
                      <span className="opd-name">{opd.name}</span>
                      <small className="opd-code">{opd.code}</small>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${opd.completion}%` }}></div>
                      </div>
                      <span>{opd.completion}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${opd.status === 'Sudah Kirim' ? 'badge-success' : 'badge-warning'}`}>
                      {opd.status}
                    </span>
                  </td>
                  <td>{opd.date}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedOPDReview(opd)}>
                      <Eye size={16} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedOPDReview && (
          <div className="modal-overlay" onClick={() => setSelectedOPDReview(null)}>
            <div className="modal-content card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Review Hasil: {selectedOPDReview.code}</h3>
                <button onClick={() => setSelectedOPDReview(null)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <p>Menampilkan hasil jawaban detail untuk {selectedOPDReview.name}...</p>
                {/* Simulated Results */}
                <div className="review-list">
                  {questions.map(q => (
                    <div key={q.id} className="review-item">
                      <p className="review-q">{q.text}</p>
                      <div className="review-a">Jawaban: <span className="text-secondary font-bold">Ya</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setSelectedOPDReview(null)}>Tutup Review</button>
              </div>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          .admin-table { width: 100%; border-collapse: collapse; }
          .admin-table th { text-align: left; padding: 1.25rem 1rem; background: #f8fafc; border-bottom: 2px solid #f1f5f9; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
          .admin-table td { padding: 1.25rem 1rem; border-bottom: 1px solid #f8fafc; }
          .opd-info { display: flex; flex-direction: column; }
          .opd-name { font-weight: 700; color: var(--primary); font-size: 0.9rem; }
          .opd-code { color: var(--text-muted); font-size: 0.75rem; }
          .progress-cell { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; font-weight: 800; }
          .progress-bar-bg { flex: 1; height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
          .progress-bar-fill { height: 100%; background: var(--secondary); }
          .review-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
          .review-item { padding: 1rem; background: #f8fafc; border-radius: 8px; border-left: 4px solid var(--secondary); }
          .review-q { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
          .review-a { font-size: 0.8rem; color: var(--text-muted); }
        `}} />
      </div>
    );
  }

  return (
    <div className="monev-page">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Monev Kelembagaan</h1>
        <p className="text-muted">Instrumen Monitoring dan Evaluasi Penataan Kelembagaan Perangkat Daerah.</p>
      </div>

      <div className="monev-container">
        {/* Progress Sidebar */}
        <div className="monev-sidebar card">
          <h4 className="sidebar-title">Kategori Evaluasi</h4>
          <div className="steps-list">
            {['Informasi Umum', 'Analisis Jabatan', 'Evaluasi Kinerja', 'Rencana Penataan'].map((step, i) => (
              <div key={i} className={`step-item ${activeStep === i + 1 ? 'active' : ''}`} onClick={() => setActiveStep(i + 1)}>
                <div className="step-number">{i + 1}</div>
                <span className="step-label">{step}</span>
                {activeStep === i + 1 && <ChevronRight size={16} />}
              </div>
            ))}
          </div>
          <div className="monev-completion">
            <div className="completion-info">
              <span>Keseluruhan</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="completion-bar-bg">
              <div className="completion-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <motion.div 
          key={activeStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="monev-content card"
        >
          <div className="content-header">
            <h3>{['Informasi Umum', 'Analisis Jabatan', 'Evaluasi Kinerja', 'Rencana Penataan'][activeStep - 1]}</h3>
            <span className="info-badge"><AlertCircle size={14} /> Wajib Diisi</span>
          </div>

          <div className="questions-list">
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <div className="question-text">
                  <span className="q-category">{q.category}</span>
                  <p>{q.text}</p>
                </div>
                <div className="answer-options">
                  <label className={`answer-option ${answers[q.id] === 'yes' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      value="yes" 
                      checked={answers[q.id] === 'yes'}
                      onChange={() => handleAnswerChange(q.id, 'yes')}
                    />
                    <span className="radio-label">Ya</span>
                  </label>
                  <label className={`answer-option ${answers[q.id] === 'no' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      value="no" 
                      checked={answers[q.id] === 'no'}
                      onChange={() => handleAnswerChange(q.id, 'no')}
                    />
                    <span className="radio-label">Tidak</span>
                  </label>
                  <label className={`answer-option ${answers[q.id] === 'partial' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      value="partial" 
                      checked={answers[q.id] === 'partial'}
                      onChange={() => handleAnswerChange(q.id, 'partial')}
                    />
                    <span className="radio-label">Sebagian</span>
                  </label>
                </div>
                <div className="evidence-upload">
                  <button className="btn-upload">Unggah Bukti Pendukung (PDF)</button>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button className="btn btn-outline"><Save size={18} /> Simpan Draft</button>
            <button className="btn btn-primary" onClick={handleSubmit}><Send size={18} /> Kirim Jawaban</button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="success-toast"
          >
            <div className="toast-content">
              <CheckCircle2 size={24} className="text-success" />
              <div>
                <p className="toast-title">Jawaban Terkirim!</p>
                <p className="toast-desc">Data evaluasi Anda sedang dalam proses peninjauan oleh Admin.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .monev-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .monev-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: flex-start;
        }

        .sidebar-title {
          font-size: 0.875rem;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }

        .step-item:hover { background: #f8fafc; }

        .step-item.active {
          background: #f1f5f9;
          border-color: #e2e8f0;
          color: var(--secondary);
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--text-muted);
          color: white;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .active .step-number { background: var(--secondary); }

        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          flex: 1;
        }

        .monev-completion {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .completion-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }

        .completion-bar-bg {
          height: 8px;
          background: #f1f5f9;
          border-radius: 999px;
          overflow: hidden;
        }

        .completion-bar-fill {
          height: 100%;
          background: var(--secondary);
          border-radius: 999px;
        }

        .monev-content {
          padding: 2.5rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--error);
          background: #fee2e2;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .question-card {
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: var(--radius-lg);
          border: 1px solid #f1f5f9;
        }

        .q-category {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--secondary);
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          display: block;
        }

        .question-text p {
          font-weight: 600;
          color: var(--primary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .answer-options {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.25rem;
        }

        .answer-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-upload {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--secondary);
          background: white;
          border: 1px dashed var(--secondary);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
        }

        .form-actions {
          margin-top: 3rem;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 2rem;
          border-top: 1px solid #f1f5f9;
        }

        .answer-option.selected {
          color: var(--secondary);
          font-weight: 700;
        }

        .success-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .toast-content {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--success);
          display: flex;
          gap: 1rem;
          align-items: center;
          min-width: 350px;
        }

        .toast-title { font-weight: 700; color: var(--primary); font-size: 1rem; }
        .toast-desc { font-size: 0.875rem; color: var(--text-muted); }
      `}} />
    </div>
  );
}

export default Monev;
