import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Printer, Download, GitBranch, ArrowDown, Database, RefreshCw, AlertCircle, Target } from 'lucide-react';

function PohonKinerja({ user }) {
  useEffect(() => {
    document.title = `Pohon Kinerja | ${user?.name || 'e-SETDA'}`;
  }, [user]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [headerData, setHeaderData] = useState({
    visi: '—',
    misi: '—',
    rpjmn: '—',
    isu: '—',
    janji: '—',
    tujuanPemda: '—',
    sasaranPemda: '—',
    opdName: '—'
  });

  const [tracks, setTracks] = useState([]);

  const fetchOpenData = async () => {
    setIsFetching(true);
    
    // Simulasi Fetching berdasarkan user.code (Setiap OPD mendapatkan data yang berbeda)
    setTimeout(() => {
      let dataForUser = {
        headerData: {
          visi: 'Terwujudnya Gorontalo yang Maju, Mandiri, dan Berkelanjutan',
          misi: 'Meningkatkan Kualitas SDM dan Kesejahteraan Masyarakat',
          rpjmn: 'RPJMN 2024-2029: Transformasi Sosial & Ekonomi',
          isu: 'Kualitas Pelayanan Dasar & Aksesibilitas Pendidikan/Kesehatan',
          janji: 'Akses Kesehatan Gratis & Beasiswa Pendidikan Tinggi',
          tujuanPemda: 'Peningkatan Sumber Daya Manusia',
          sasaranPemda: 'Meningkatnya derajat kesehatan masyarakat dan penguatan sistem kesehatan',
          opdName: user?.name || 'Dinas Kesehatan'
        },
        tracks: [
          {
            id: 1,
            rt: [{ name: 'Meningkatkan derajat kesehatan masyarakat', target: '85.50%', budget: '—' }],
            rs: [{ name: 'Tercapaianya Masyarakat yang sehat sesuai siklus hidup, layanan kesehatan yang berkualitas, baik, adil dan terjangkau serta meningkatnya kuantitas, kualitas dan pemerataan sdm kesehatan', target: '90%', budget: '—' }],
            ro: [{ name: 'Meningkatnya kualitas kesehatan perorangan dan masyarakat', target: '100%', budget: '—' }],
            rk: [
              { 
                code: '1.02.02.1.01', 
                name: 'Penyediaan Fasilitas Pelayanan, Sarana, Prasarana dan Alat Kesehatan untuk UKP Rujukan, UKM dan UKM Rujukan Tingkat Daerah Provinsi',
                target: '1 Dokumen',
                budget: '45.200.000.000',
                subKegiatan: [
                  { code: '1.02.02.1.01.0004', name: 'Pengembangan Fasilitas Kesehatan Lainnya', target: '2 Unit', budget: '12.500.000.000' },
                  { code: '1.02.02.1.01.0008', name: 'Rehabilitasi dan Pemeliharaan Fasilitas Kesehatan Lainnya', target: '5 Gedung', budget: '8.400.000.000' },
                  { code: '1.02.02.1.01.0009', name: 'Rehabilitasi dan Pemeliharaan Rumah Sakit', target: '1 Paket', budget: '5.000.000.000' },
                  { code: '1.02.02.1.01.0010', name: 'Pengadaan Alat Kesehatan/Alat Penunjang Medik Fasilitas Layanan Kesehatan', target: '40 Set', budget: '9.300.000.000' },
                  { code: '1.02.02.1.01.0013', name: 'Pengadaan dan Pemeliharaan Alat Kalibrasi', target: '10 Alat', budget: '2.500.000.000' },
                  { code: '1.02.02.1.01.0016', name: 'Pengadaan Barang Penunjang Operasional Rumah Sakit', target: '1 Paket', budget: '3.200.000.000' },
                  { code: '1.02.02.1.01.0025', name: 'Distribusi Alat Kesehatan, Obat, Bahan Habis Pakai, Bahan Medis Habis Pakai, Vaksin, Makanan dan Minuman ke Fasilitas Kesehatan', target: '12 Lokasi', budget: '4.300.000.000' },
                  { code: '1.02.02.1.01.0026', name: 'Pengembangan Rumah Sakit', target: '1 Unit', budget: '0' },
                  { code: '1.02.02.1.01.0027', name: 'Pengadaan Obat, Bahan Habis Pakai, Vaksin, Makanan dan Minuman di Rumah Sakit', target: '1 Paket', budget: '0' }
                ]
              },
              { 
                code: '1.02.02.1.02', 
                name: 'Penyelenggaraan Akreditasi Fasilitas Pelayanan Kesehatan di Seluruh Wilayah Provinsi',
                target: '12 Puskesmas',
                budget: '15.700.000.000',
                subKegiatan: [
                  { code: '1.02.02.1.02.0001', name: 'Pendampingan Akreditasi Fasyankes', target: '12 Fasyankes', budget: '5.000.000.000' },
                  { code: '1.02.02.1.02.0005', name: 'Monitoring dan Evaluasi Pasca Akreditasi', target: '1 Laporan', budget: '2.500.000.000' }
                ]
              },
              { 
                code: '1.02.02.1.03', 
                name: 'Penerbitan Izin Rumah Sakit Kelas B dan Fasilitas Pelayanan Kesehatan Tingkat Provinsi',
                target: '5 Izin',
                budget: '8.200.000.000',
                subKegiatan: [
                  { code: '1.02.02.1.03.0002', name: 'Verifikasi Lapangan Izin Operasional', target: '5 Lokasi', budget: '1.200.000.000' }
                ]
              }
            ]
          }
        ]
      };

      // In real scenario, we would filter based on user.code
      // For this demo, we assume the user wants to see the Dinas Kesehatan structure from the image.

      setHeaderData(dataForUser.headerData);
      setTracks(dataForUser.tracks);
      setIsFetching(false);
    }, 1200);
  };

  useEffect(() => {
    fetchOpenData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = document.querySelector('.diagram-container');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#eff6ff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
      
      const width = imgProps.width * ratio;
      const height = imgProps.height * ratio;
      const x = (pdfWidth - width) / 2;
      const y = (pdfHeight - height) / 2;

      pdf.addImage(imgData, 'PNG', x, y, width, height);
      pdf.save(`Pohon-Kinerja-${user?.name || 'OPD'}.pdf`);
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Gagal mengunduh PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="pohon-page">
      <div className="page-header-simple glass no-print">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>Pohon Kinerja</span>
        </div>
        <div className="period-badge">Mode : Integrasi Hierarki SAKIP</div>
      </div>

      {/* Integration Control Section */}
      <div className="content-container card no-print">
        <div className="flex-header-row">
          <div className="section-title">
            <Database size={20} className="text-secondary" />
            <h3>Integrasi Data Hierarki SAKIP</h3>
          </div>
          <button 
            className={`btn ${isFetching ? 'btn-disabled' : 'btn-secondary'} flex items-center gap-sm`} 
            onClick={fetchOpenData}
            disabled={isFetching}
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} /> 
            {isFetching ? 'Memuat Hierarki...' : 'Sinkronkan Data'}
          </button>
        </div>

        <div className="info-alert mb-4">
          <AlertCircle size={18} />
          <p>Struktur di bawah ini disusun berdasarkan hierarki <strong>T-S-O-RT-RS-RO-RK-RSK</strong> sesuai standar penataan kinerja terbaru.</p>
        </div>

        <div className="header-info-grid">
          <div className="info-box">
            <label className="label-visi">Visi</label>
            <p>{headerData.visi}</p>
          </div>
          <div className="info-box">
            <label className="label-misi">Misi</label>
            <p>{headerData.misi}</p>
          </div>
          <div className="info-box">
            <label className="label-rpjmn">RPJMN / RPJMD</label>
            <p>{headerData.rpjmn}</p>
          </div>
          <div className="info-box">
            <label className="label-isu">Isu Strategis</label>
            <p>{headerData.isu}</p>
          </div>
          <div className="info-box">
            <label className="label-janji">Janji Politik</label>
            <p>{headerData.janji}</p>
          </div>
          <div className="info-box">
            <label className="label-t">T - Tujuan Pemda</label>
            <p>{headerData.tujuanPemda}</p>
          </div>
          <div className="info-box">
            <label className="label-s">S - Sasaran Pemda</label>
            <p>{headerData.sasaranPemda}</p>
          </div>
          <div className="info-box">
            <label className="label-o">O - Instansi / OPD</label>
            <p>{headerData.opdName}</p>
          </div>
        </div>

        <div className="form-footer mt-6">
          <div className="flex gap-md">
            <button className="btn btn-outline" onClick={handlePrint}>
              <Printer size={18} /> Cetak
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPDF} 
              disabled={isDownloading}
            >
              {isDownloading ? 'Menyiapkan PDF...' : <><Download size={18} /> Ekspor Dokumen</>}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Diagram Section */}
      <div className="visual-preview-section">
        <div className="preview-title no-print">
          <GitBranch size={18} /> Visualisasi Hierarki Kinerja (Auto-Generated)
        </div>

        <AnimatePresence mode="wait">
          {isFetching ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-overlay card"
            >
              <RefreshCw size={40} className="animate-spin text-secondary" />
              <p>Membangun Struktur Hierarki SAKIP...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="diagram"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="diagram-container card print-area"
            >
               {/* Strategic Canvas Header */}
               <div className="strategic-canvas-header">
                  <div className="canvas-row">
                    <div className="node-box node-visi"><span className="node-tag">VISI</span>{headerData.visi}</div>
                    <div className="node-box node-misi"><span className="node-tag">MISI</span>{headerData.misi}</div>
                  </div>
                  <div className="canvas-row mt-2">
                    <div className="node-box node-rpjmn"><span className="node-tag">RPJMN</span>{headerData.rpjmn}</div>
                    <div className="node-box node-isu"><span className="node-tag">ISU</span>{headerData.isu}</div>
                    <div className="node-box node-janji"><span className="node-tag">JANJI</span>{headerData.janji}</div>
                  </div>
               </div>

               <div className="arrow-down-main"><ArrowDown size={32} /></div>

               {/* Level 1 & 2 & 3 (Pemda & OPD) */}
               <div className="diagram-top-hierarchy">
                  <div className="node-group">
                    <div className="node-box node-t">
                      <span className="node-tag">T</span>
                      {headerData.tujuanPemda}
                    </div>
                    <div className="node-line"></div>
                    <div className="node-box node-s">
                      <span className="node-tag">S</span>
                      {headerData.sasaranPemda}
                    </div>
                    <div className="node-line"></div>
                    <div className="node-box node-o">
                      <span className="node-tag">O</span>
                      {headerData.opdName}
                    </div>
                  </div>
               </div>

               <div className="arrow-down-main"><ArrowDown size={32} /></div>

               {/* Tracks Section */}
               <div className="diagram-tracks-row">
                  {tracks.map(track => (
                    <div key={track.id} className="diagram-track-complex">
                       {/* Level 4: RT */}
                       <div className="box-group">
                         {track.rt.map((item, i) => (
                           <div key={i} className="node-box node-rt flex-col">
                             <div className="flex items-center gap-sm">
                               <span className="node-tag">RT</span>
                               <span>{item.name}</span>
                             </div>
                             <div className="node-meta">
                               <span className="meta-target">Target: {item.target}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="arrow"><ArrowDown size={14} /></div>
                       
                       {/* Level 5: RS */}
                       <div className="box-group">
                         {track.rs.map((item, i) => (
                           <div key={i} className="node-box node-rs flex-col">
                             <div className="flex items-center gap-sm">
                               <span className="node-tag">RS</span>
                               <span>{item.name}</span>
                             </div>
                             <div className="node-meta">
                               <span className="meta-target">Target: {item.target}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="arrow"><ArrowDown size={14} /></div>

                       {/* Level 6: RO */}
                       <div className="box-group">
                         {track.ro.map((item, i) => (
                           <div key={i} className="node-box node-ro flex-col">
                             <div className="flex items-center gap-sm">
                               <span className="node-tag">RO</span>
                               <span>{item.name}</span>
                             </div>
                             <div className="node-meta">
                               <span className="meta-target">Target: {item.target}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="arrow"><ArrowDown size={14} /></div>

                       {/* Level 7: RK */}
                       <div className="box-group horizontal-rk">
                         {track.rk.map((keg, i) => (
                           <div key={i} className="rk-container">
                             <div className="node-box node-rk flex-col">
                               <div className="flex items-center gap-sm">
                                 <span className="node-tag">RK</span>
                                 <div className="rk-content">
                                   <span className="rk-code">{keg.code}</span>
                                   <span className="rk-name">{keg.name}</span>
                                 </div>
                               </div>
                               <div className="node-meta space-between">
                                 <span className="meta-target">Target: {keg.target}</span>
                                 <span className="meta-budget">Pagu: Rp {keg.budget}</span>
                               </div>
                             </div>
                             
                             <div className="arrow"><ArrowDown size={14} /></div>

                             {/* Level 8: RSK */}
                             <div className="rsk-list">
                               {keg.subKegiatan.map((sub, j) => (
                                 <div key={j} className="node-box node-rsk flex-col">
                                   <div className="flex items-center gap-sm">
                                     <span className="node-tag">RSK</span>
                                     <div className="rk-content">
                                       <span className="rk-code">{sub.code}</span>
                                       <span className="rk-name">{sub.name}</span>
                                     </div>
                                   </div>
                                   <div className="node-meta space-between">
                                     <span className="meta-target">Target: {sub.target}</span>
                                     <span className="meta-budget">Pagu: Rp {sub.budget}</span>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pohon-page { display: flex; flex-direction: column; gap: 2rem; }
        
        .flex-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .header-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

        .info-box { background: #f8fafc; padding: 1rem; border-radius: 10px; border: 1px solid #e2e8f0; }
        .info-box label { display: block; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .info-box p { font-size: 0.85rem; font-weight: 700; color: #1e293b; line-height: 1.4; }

        .label-t { color: #0891b2; }
        .label-s { color: #059669; }
        .label-o { color: #d97706; }
        .label-visi { color: #4f46e5; }
        .label-misi { color: #7c3aed; }
        .label-rpjmn { color: #2563eb; }
        .label-isu { color: #db2777; }
        .label-janji { color: #ea580c; }

        .diagram-container {
           background: #f1f5f9;
           padding: 4rem 2rem;
           display: flex;
           flex-direction: column;
           align-items: center;
           min-height: 1200px;
           overflow-x: auto;
        }

        .strategic-canvas-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          max-width: 1000px;
          margin-bottom: 1rem;
        }

        .canvas-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          width: 100%;
        }

        .diagram-top-hierarchy {
          width: 100%;
          max-width: 800px;
          margin-bottom: 1rem;
        }

        .node-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .flex-col { display: flex; flex-direction: column; gap: 4px; }
        .space-between { justify-content: space-between; }
        
        .node-meta {
          display: flex;
          width: 100%;
          gap: 12px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(0,0,0,0.05);
          font-size: 0.7rem;
          font-weight: 700;
        }

        .meta-target {
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .meta-budget {
          color: #059669;
          background: #ecfdf5;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .node-line {
          width: 2px;
          height: 20px;
          background: #cbd5e1;
        }

        .node-box {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 200px;
          max-width: 600px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }

        .node-visi { background: #eef2ff; color: #312e81; border-color: #c7d2fe; flex: 1; }
        .node-visi .node-tag { background: #4f46e5; }
        
        .node-misi { background: #f5f3ff; color: #4c1d95; border-color: #ddd6fe; flex: 1; }
        .node-misi .node-tag { background: #7c3aed; }

        .node-rpjmn { background: #eff6ff; color: #1e3a8a; border-color: #dbeafe; font-size: 0.75rem; }
        .node-rpjmn .node-tag { background: #2563eb; }

        .node-isu { background: #fdf2f8; color: #831843; border-color: #fce7f3; font-size: 0.75rem; }
        .node-isu .node-tag { background: #db2777; }

        .node-janji { background: #fff7ed; color: #7c2d12; border-color: #ffedd5; font-size: 0.75rem; }
        .node-janji .node-tag { background: #ea580c; }

        .node-tag {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 900;
          color: white;
          min-width: 32px;
          text-align: center;
        }

        .node-t { background: #ecfeff; color: #083344; border-color: #a5f3fc; }
        .node-t .node-tag { background: #0891b2; }

        .node-s { background: #f0fdf4; color: #064e3b; border-color: #bbf7d0; }
        .node-s .node-tag { background: #059669; }

        .node-o { background: #fffbeb; color: #78350f; border-color: #fef3c7; }
        .node-o .node-tag { background: #d97706; }

        .node-rt { background: #f0fdfa; color: #134e4a; border-color: #ccfbf1; }
        .node-rt .node-tag { background: #0d9488; }

        .node-rs { background: #f0f9ff; color: #0c4a6e; border-color: #e0f2fe; }
        .node-rs .node-tag { background: #0284c7; }

        .node-ro { background: #fdf2f8; color: #831843; border-color: #fce7f3; }
        .node-ro .node-tag { background: #db2777; }

        .node-rk { background: #f8fafc; color: #1e293b; border-color: #e2e8f0; width: 100%; max-width: 100%; }
        .node-rk .node-tag { background: #475569; }

        .node-rsk { background: white; color: #475569; border-color: #f1f5f9; font-size: 0.8rem; margin-top: 8px; width: 95%; align-self: flex-end; }
        .node-rsk .node-tag { background: #ec4899; }

        .rk-content { display: flex; flex-direction: column; text-align: left; }
        .rk-code { font-size: 0.7rem; color: #64748b; font-family: monospace; font-weight: 700; }
        .rk-name { line-height: 1.4; }

        .rsk-list {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          width: 100%;
          border-left: 2px dashed #e2e8f0;
          margin-left: 1rem;
          padding-left: 1rem;
        }

        .diagram-track-complex {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .horizontal-rk {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          gap: 2rem;
          width: 100%;
          flex-wrap: nowrap;
          position: relative;
        }

        .horizontal-rk::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50px;
          right: 50px;
          height: 2px;
          background: #cbd5e1;
          z-index: 0;
        }

        .rk-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .rk-container::before {
          content: "";
          position: absolute;
          top: -1.5rem;
          left: 50%;
          width: 2px;
          height: 1.5rem;
          background: #cbd5e1;
        }

        .arrow-down-main { color: #cbd5e1; margin: 1rem 0; }
        .arrow { color: #cbd5e1; margin-bottom: 0.5rem; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media print {
          .no-print, .btn, .sidebar, .main-header, .breadcrumb, .period-badge, .form-footer { display: none !important; }
          .pohon-page { gap: 0 !important; }
          .diagram-container { 
             background: white !important; 
             padding: 0 !important;
             box-shadow: none !important;
          }
          @page { size: portrait; margin: 1cm; }
        }
      `}} />
    </div>
  );
}

export default PohonKinerja;
