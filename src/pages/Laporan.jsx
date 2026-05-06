import { useEffect } from 'react';
import { FileText, Download, Eye, Calendar, Printer, Share2, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

function Laporan({ user }) {
  useEffect(() => {
    document.title = `Laporan | ${user?.name || 'e-SETDA'}`;
  }, [user]);

  const isAdmin = user?.role === 'ADMIN';

  const handleDownloadTree = (tree) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Laporan Pohon Kinerja", 20, 20);
    doc.setFontSize(12);
    doc.text(`Pengirim: ${tree.user}`, 20, 30);
    doc.text(`Tanggal Kirim: ${new Date(tree.sentAt).toLocaleString()}`, 20, 40);
    doc.text(`Sasaran Pemda: ${tree.headerData.sasaranPemda}`, 20, 50);
    doc.text(`Jumlah Jalur Strategi: ${tree.tracks.length}`, 20, 60);
    
    doc.text("Detail Kinerja:", 20, 80);
    tree.tracks.forEach((track, i) => {
      doc.text(`Jalur ${i+1}: ${track.ksf1[0]} -> ${track.sasaranOPD[0]}`, 30, 90 + (i * 10));
    });
    
    doc.save(`Laporan-Pohon-${tree.user}.pdf`);
  };

  const reports = [
    { title: 'Laporan Triwulan I - 2026', desc: 'Evaluasi Penataan Kelembagaan Januari-Maret', date: 'Maret 31, 2026', status: 'Final' },
    { title: 'Laporan Semester II - 2025', desc: 'Indikator Kelembagaan Tahunan', date: 'Desember 20, 2025', status: 'Arsip' },
    { title: 'Laporan Khusus SOTK Dinkes', desc: 'Penyesuaian Struktur Unit Pelaksana Teknis', date: 'November 15, 2025', status: 'Arsip' },
    { title: 'Laporan Triwulan IV - 2025', desc: 'Evaluasi Akhir Tahun Anggaran 2025', date: 'Desember 31, 2025', status: 'Final' },
  ];

  // Get sent performance trees from storage
  const sentTrees = JSON.parse(localStorage.getItem('sent_pohon_kinerja') || '[]');

  return (
    <div className="laporan-page">
      <div className="page-header">
        <h1 className="text-2xl font-bold">{isAdmin ? 'Pusat Kendali Laporan & Kinerja' : 'Laporan Triwulan'}</h1>
        <p className="text-muted">
          {isAdmin 
            ? 'Monitor, periksa, dan cetak seluruh laporan serta pohon kinerja dari Perangkat Daerah.' 
            : 'Arsip dan dokumentasi laporan penataan kelembagaan instansi Anda.'}
        </p>
      </div>

      {isAdmin && sentTrees.length > 0 && (
        <div className="sent-section">
          <div className="section-title-simple">
            <Share2 size={20} className="text-secondary" />
            <h3>Pohon Kinerja Masuk (Perlu Diperiksa)</h3>
          </div>
          <div className="report-grid">
            {sentTrees.map((tree, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="report-card card border-secondary-light"
              >
                <div className="report-header">
                  <div className="report-badge badge-warning">Menunggu Review</div>
                  <div className="report-icon-container bg-secondary-soft">
                    <GitBranch size={32} className="text-secondary" />
                  </div>
                </div>
                <div className="report-body">
                  <h3>Pohon Kinerja: {tree.user}</h3>
                  <p>Design bagan pohon kinerja periode Renstra 2025-2029.</p>
                  <div className="report-meta">
                    <Calendar size={14} /> <span>Dikirim: {new Date(tree.sentAt).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="report-footer">
                  <button className="btn-icon" title="Pratinjau"><Eye size={18} /></button>
                  <button className="btn-icon" title="Download PDF" onClick={() => handleDownloadTree(tree)}>
                    <Download size={18} />
                  </button>
                  <button className="btn-icon" title="Cetak"><Printer size={18} /></button>
                  <button className="btn btn-primary btn-sm">Periksa Laporan</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="section-title-simple mt-8">
        <FileText size={20} className="text-primary" />
        <h3>Arsip Dokumen Laporan</h3>
      </div>

      <div className="report-grid">
        {reports.map((report, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="report-card card"
          >
            <div className="report-header">
              <div className="report-badge">{report.status}</div>
              <div className="report-icon-container">
                <FileText size={32} />
              </div>
            </div>
            <div className="report-body">
              <h3>{report.title}</h3>
              <p>{report.desc}</p>
              <div className="report-meta">
                <Calendar size={14} /> <span>Dibuat: {report.date}</span>
              </div>
            </div>
            <div className="report-footer">
              <button className="btn-icon"><Eye size={18} /></button>
              <button className="btn-icon"><Download size={18} /></button>
              <button className="btn-icon"><Printer size={18} /></button>
              <button className="btn btn-outline btn-sm">Bagikan <Share2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .laporan-page {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .report-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border: 1px solid #e2e8f0;
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .report-card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: var(--secondary-light);
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .report-badge {
          background: #f1f5f9;
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .report-icon-container {
          background: rgba(22, 101, 52, 0.05);
          color: var(--secondary);
          padding: 1rem;
          border-radius: 12px;
        }

        .report-body h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .report-body p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .report-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .report-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .btn-icon {
          padding: 0.5rem;
          border-radius: 8px;
          color: var(--text-muted);
          background: #f8fafc;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          color: var(--secondary);
          background: #dcfce7;
        }

        .section-title-simple {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .section-title-simple h3 { font-size: 1.1rem; font-weight: 700; color: var(--primary); }
        .bg-secondary-soft { background: rgba(22, 101, 52, 0.08) !important; }
        .border-secondary-light { border-top: 4px solid var(--secondary) !important; }
        .mt-8 { margin-top: 2rem; }
        
        @media (max-width: 768px) {
          .report-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}

export default Laporan;
