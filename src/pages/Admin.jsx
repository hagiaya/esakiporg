import { useState, useEffect } from 'react';
import { 
  Building2, 
  ClipboardCheck, 
  GitBranch, 
  Target, 
  FileText, 
  Award,
  Search,
  ChevronRight,
  Eye,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Users,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Admin({ user }) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('daftar-opd');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('2026');
  const [selectedItem, setSelectedItem] = useState(null);

  // States specific to tabs
  const [selectedRenstraOpd, setSelectedRenstraOpd] = useState(null);

  // ─── Real data from localStorage ────────────────────
  const [renstraData, setRenstraData] = useState([]);
  const [renstraMeta, setRenstraMeta] = useState({});
  const [pkData, setPkData] = useState([]);
  const [pkMeta, setPkMeta] = useState({});
  const [pohonData, setPohonData] = useState([]);

  // Custom Toast State
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    document.title = `Data Master Admin | e-SETDA`;
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      const rs = localStorage.getItem('renstra_sasaran_data');
      const rm = localStorage.getItem('renstra_meta');
      if (rs) setRenstraData(JSON.parse(rs));
      if (rm) setRenstraMeta(JSON.parse(rm));
    } catch (_) {}
    try {
      const pk = localStorage.getItem('pk_data');
      const pm = localStorage.getItem('pk_meta');
      if (pk) setPkData(JSON.parse(pk));
      if (pm) setPkMeta(JSON.parse(pm));
    } catch (_) {}
    try {
      const ph = localStorage.getItem('sent_pohon_kinerja');
      if (ph) setPohonData(JSON.parse(ph));
    } catch (_) {}
  };

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const handleAction = (msg) => {
    showToast(`Aksi Sistem: ${msg} (Demo)`);
  };

  const handlePrint = () => {
    window.print();
  };


  // ─── Derived Stats ──────────────────────────────────
  const totalSasaranRenstra = renstraData.length;
  const totalIKU = renstraData.reduce((a, s) => a + (s.indikatorList?.length || 0), 0);
  const totalPKSasaran = pkData.length;
  const totalPKAnggaran = pkData.reduce((acc, s) =>
    acc + (s.indikatorList || []).reduce((a, i) => a + parseInt(i.anggaran?.replace(/\./g, '') || '0'), 0), 0
  );
  const hasRenstra = renstraData.length > 0;
  const hasPK = pkData.length > 0;
  const opdName = renstraMeta.perangkatDaerah || pkMeta.perangkatDaerah || user?.name || 'Perangkat Daerah';
  const opdShort = opdName.split(' ').slice(0, 2).join(' ');

  const opdList = [
    {
      id: 1,
      name: opdShort || 'Sekretariat Daerah',
      code: renstraMeta.perangkatDaerah ? 'INPUT-OPD' : 'SETDA',
      status: hasRenstra && hasPK ? 'Verifikasi Selesai' : hasRenstra || hasPK ? 'Dalam Review' : 'Draft',
      lead: pkMeta.pejabat || 'Drs. H. Darda Daraba, M.Si',
      data: {
        visi: renstraData[0]?.tujuan || 'Terwujudnya Gorontalo yang Maju, Mandiri dan Sejahtera Melalui Penataan Birokrasi yang Akuntabel.',
        sasaran: renstraData[0]?.sasaran || 'Meningkatkan Kualitas Penyelenggaraan Pemerintahan Daerah',
        ikuCount: totalIKU || 0,
        pkStatus: hasPK && pkMeta.pejabat ? 'Sudah TTD' : hasPK ? 'Belum TTD' : 'Belum Input',
      }
    },
    { id: 2, name: 'Dinas Kesehatan', code: 'DINKES', status: 'Dalam Review', lead: 'dr. Yana Yanti Suleman, SH',
      data: {
        visi: 'Meningkatkan pelayanan kesehatan masyarakat yang responsif dan inklusif di Provinsi Gorontalo.',
        sasaran: 'Menurunkan Prevalensi Penyakit Menular dan Angka Kematian Ibu',
        ikuCount: 12, pkStatus: 'Belum TTD'
      }
    },
    { id: 3, name: 'Dinas Pendidikan', code: 'DIKBUDPORA', status: 'Draft', lead: 'Dr. Wahyudin Katili, S.STP, ME',
      data: {
        visi: 'Terciptanya Generasi Unggul Berbudaya melalui Akses Pendidikan Merata dan Berkualitas.',
        sasaran: 'Meningkatkan Angka Partisipasi Sekolah dan Kualitas Pendidik',
        ikuCount: 18, pkStatus: 'Belum TTD'
      }
    },
    { id: 4, name: 'Inspektorat', code: 'INSPEKTORAT', status: 'Verifikasi Selesai', lead: 'Nirwan Utiarahman, SE, MM',
      data: {
        visi: 'Mewujudkan Pengawasan Internal Pemerintah Provinsi Gorontalo yang Berintegritas dan Efektif.',
        sasaran: 'Meningkatnya Akuntabilitas Tata Kelola Pemerintahan OPD',
        ikuCount: 8, pkStatus: 'Sudah TTD'
      }
    },
    { id: 5, name: 'Bappeda', code: 'BAPPEDA', status: 'Dalam Review', lead: 'Budiyanto Sidiki, S.Sos, M.Si',
      data: {
        visi: 'Pusat Perencanaan Pembangunan Berbasis Data Menuju Pembangunan yang Berkelanjutan.',
        sasaran: 'Meningkatnya Kualitas Dokumen Perencanaan Pembangunan Daerah',
        ikuCount: 10, pkStatus: 'Belum TTD'
      }
    },
  ];

  const adminMenu = [
    { id: 'daftar-opd', label: 'Daftar OPD', icon: <Building2 size={20} /> },
    { id: 'review-perencanaan', label: 'Review Perencanaan', icon: <ClipboardCheck size={20} /> },
    { id: 'pohon-kinerja', label: 'Pohon Kinerja', icon: <GitBranch size={20} /> },
    { id: 'iku', label: 'Monitoring IKU', icon: <Target size={20} /> },
    { id: 'renstra', label: 'Data Renstra', icon: <FileText size={20} /> },
    { id: 'pk', label: 'Perjanjian Kinerja (PK)', icon: <Award size={20} /> },
  ];

  const renderContent = () => {
    // If we have a selectedItem, show detail view (overriding the main list)
    if (selectedItem) {
      if (selectedItem.type === 'pohon') {
        const mockTracks = [
          {
            id: 1,
            ksf1: [`Pelayanan Terpadu ${selectedItem.name}`],
            sasaranOPD: [selectedItem.data.sasaran],
            ksf2: ['Peningkatan SDM', 'Sistem Digitalisasi'],
            program: ['Program Peningkatan Kapasitas'],
            kegiatan: ['Pengadaan Sistem Berbasis TIK']
          }
        ];
        
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="detail-view-container card p-0 overflow-hidden">
            <div className="view-header" style={{padding: '1.5rem 1.5rem 0 1.5rem', marginBottom: 0, borderBottom: 'none'}}>
              <button className="btn-back" onClick={() => setSelectedItem(null)}>
                <ChevronLeft size={16} /> Kembali ke Monitoring Pohon
              </button>
            </div>
            
            <div className="view-body" style={{padding: '1.5rem'}}>
              <div className="info-alert" style={{marginBottom: '1rem'}}>
                <Info size={18} />
                <p>Menjelajahi struktur hirarki kinerja dan cascading untuk {selectedItem.name}.</p>
              </div>

              <div className="diagram-container">
                 <div className="diagram-header-row">
                    <div className="side-boxes column">
                      <div className="box box-dashed box-blue">RPJMN Nasional 2024-2029</div>
                      <div className="box box-dashed box-cyan" style={{marginTop: '0.5rem'}}>Isu Strategis: Kualitas Pelayanan</div>
                    </div>
                    <div className="center-connector-group">
                       <div className="icon-main"><Building2 size={32} /></div>
                       <div className="box box-solid box-primary box-main">Meningkatnya Tata Kelola Pemerintahan yang Baik</div>
                    </div>
                    <div className="side-boxes column">
                      <div className="box box-dashed box-cyan">Visi Misi Kepala Daerah Gorontalo</div>
                    </div>
                 </div>

                 <div className="arrow-down-main"><CheckCircle2 size={32} /></div>

                 <div className="diagram-tracks-row">
                    {mockTracks.map(track => (
                      <div key={track.id} className="diagram-track">
                         {/* Level 1: KSF 1 */}
                         <div className="box-group">
                           {track.ksf1.map((item, i) => (
                             <div key={i} className="box box-dashed box-orange">
                               {item}
                               <div className="box-bottom-line" />
                             </div>
                           ))}
                         </div>
                         <div className="arrow" />
                         
                         {/* Level 2: Sasaran Strategis */}
                         <div className="box-group">
                           {track.sasaranOPD.map((item, i) => (
                             <div key={i} className="box box-solid box-white box-shadow">
                               <div className="box-icon"><Target size={16} /></div>
                               {item}
                             </div>
                           ))}
                         </div>
                         <div className="arrow" />

                         {/* Level 3: KSF 2 */}
                         <div className="box-group">
                           {track.ksf2.map((item, i) => (
                             <div key={i} className="box box-dashed box-pink">
                               {item}
                             </div>
                           ))}
                         </div>
                         <div className="arrow" />

                         {/* Level 4: Program */}
                         <div className="box-group">
                           {track.program.map((item, i) => (
                             <div key={i} className="box box-solid box-green">
                               {item}
                             </div>
                           ))}
                         </div>
                         <div className="arrow" />

                         {/* Level 5: Kegiatan */}
                         <div className="box-group">
                           {track.kegiatan.map((item, i) => (
                             <div key={i} className="box box-solid box-blue-dark">
                               {item}
                             </div>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="view-footer no-print" style={{padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0'}}>
              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} /> Cetak/Ekspor Dokumen Pohon Kinerja
              </button>
            </div>
          </motion.div>
        );
      }

      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="detail-view-container card">
          <div className="view-header">
            <button className="btn-back" onClick={() => setSelectedItem(null)}>
              <ChevronLeft size={16} /> Kembali
            </button>
            <h3>Detail Data: {selectedItem.name}</h3>
          </div>
          <div className="view-body">
            <div className="info-alert">
              <Info size={18} />
              <p>Menampilkan data lengkap untuk tahun anggaran {filterYear}. Seluruh data di bawah ini bersifat preview.</p>
            </div>
            
            <div className="detail-content-grid">
               <div className="data-box">
                  <span className="data-box-label">Kode Instansi</span>
                  <span className="data-box-value font-bold text-primary">{selectedItem.code}</span>
               </div>
               <div className="data-box">
                  <span className="data-box-label">Kepala PD</span>
                  <span className="data-box-value">{selectedItem.lead}</span>
               </div>
               <div className="data-box">
                  <span className="data-box-label">Status Verifikasi</span>
                  <span className="data-box-value text-success font-bold">{selectedItem.status}</span>
               </div>
            </div>
            
            <div className="data-box full-width mt-4">
              <span className="data-box-label">Visi Perangkat Daerah</span>
              <p className="data-box-text">{selectedItem.data.visi}</p>
            </div>
            <div className="data-box full-width mt-4">
              <span className="data-box-label">Sasaran Strategis</span>
              <p className="data-box-text">{selectedItem.data.sasaran}</p>
            </div>

            <div className="view-footer mt-4 no-print">
              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} /> Cetak Laporan
              </button>
              {selectedItem.actionContext === 'verify' && (
                <button className="btn btn-success ml-2" onClick={() => handleAction(`Verifikasi Selesai untuk ${selectedItem.code}`)}>
                  <CheckCircle2 size={16} /> Tandai Selesai Di-review
                </button>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    switch (activeMenu) {
      case 'daftar-opd':
        return (
          <div className="admin-table-view card">
            <div className="table-header">
              <h3>Database Perangkat Daerah</h3>
              <button className="btn btn-primary btn-sm" onClick={() => handleAction('Mengekspor Database OPD')}>
                <Download size={14} /> Export Data
              </button>
            </div>
            <table className="admin-custom-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Instansi</th>
                  <th>Kepala PD</th>
                  <th>Status SAKIP</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {opdList.map(opd => (
                  <tr key={opd.id}>
                    <td><span className="badge-code">{opd.code}</span></td>
                    <td className="font-bold">{opd.name}</td>
                    <td>{opd.lead}</td>
                    <td>
                      <span className={`status-pill ${opd.status === 'Verifikasi Selesai' ? 'success' : 'warning'}`}>
                        {opd.status}
                      </span>
                    </td>
                    <td><button className="btn-icon-shadow" onClick={() => setSelectedItem(opd)}><Eye size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'review-perencanaan':
        return (
          <div className="review-grid">
            {opdList.map(opd => (
              <div key={opd.id} className="review-card card">
                <div className="review-card-header">
                  <div className="opd-tag">{opd.code}</div>
                  <div className="status-indicator">
                    {opd.status === 'Verifikasi Selesai' ? <CheckCircle2 className="text-success" size={20} /> : <Clock className="text-warning" size={20} />}
                  </div>
                </div>
                <h4>{opd.name}</h4>
                <div className="review-items">
                  <div className={`review-item ${hasRenstra && opd.id === 1 ? 'done' : opd.id !== 1 ? 'done' : 'pending'}`} onClick={() => navigate('/perencanaan/visi')}>
                    <span>Visi Renstra</span>
                    {hasRenstra && opd.id === 1 ? <CheckCircle2 size={12} /> : opd.id !== 1 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  </div>
                  <div className={`review-item ${hasRenstra && opd.id === 1 ? 'done' : opd.id !== 1 && opd.id % 3 !== 0 ? 'done' : 'pending'}`} onClick={() => navigate('/perencanaan/sasaran')}>
                    <span>Sasaran Renstra ({opd.id === 1 ? totalSasaranRenstra : opd.data.ikuCount > 10 ? 3 : 2} Sasaran)</span>
                    {hasRenstra && opd.id === 1 ? <CheckCircle2 size={12} /> : opd.id !== 1 && opd.id % 3 !== 0 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  </div>
                  <div className={`review-item ${hasPK && opd.id === 1 ? 'done' : opd.id === 4 ? 'done' : 'pending'}`} onClick={() => navigate('/perencanaan/pk')}>
                    <span>Perjanjian Kinerja (PK)</span>
                    {hasPK && opd.id === 1 ? <CheckCircle2 size={12} /> : opd.id === 4 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  </div>
                </div>
                <button className="btn-full mt-4" onClick={() => setSelectedItem({ ...opd, actionContext: 'verify' })}>
                  Mulai Verifikasi <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        );

      case 'pohon-kinerja':
        return (
          <div className="pohon-monitoring card">
            <div className="table-header">
              <h3>Monitoring Struktur Pohon Kinerja</h3>
              <button className="btn btn-outline btn-sm" onClick={loadAllData}>
                ↻ Refresh Data
              </button>
            </div>
            <div className="pohon-stats">
              <div className="p-stat"><span>Pohon Terkirim</span> <strong>{pohonData.length} OPD</strong></div>
              <div className="p-stat"><span>Total Jalur Strategi</span> <strong>{pohonData.reduce((a, p) => a + (p.tracks?.length || 0), 0)} Track</strong></div>
              <div className="p-stat"><span>Status Renstra Input</span> <strong>{hasRenstra ? '✓ Ada Data' : '⚠ Kosong'}</strong></div>
            </div>
            <table className="admin-custom-table mt-4">
              <thead>
                <tr>
                  <th>Nama OPD / Pengirim</th>
                  <th>Sasaran Pemda</th>
                  <th>Jumlah Track</th>
                  <th>Waktu Kirim</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pohonData.length > 0 ? pohonData.map((pohon, idx) => (
                  <tr key={idx}>
                    <td className="font-bold">{pohon.user || 'OPD tidak diketahui'}</td>
                    <td>{pohon.headerData?.sasaranPemda || '—'}</td>
                    <td style={{ textAlign: 'center' }}><strong>{pohon.tracks?.length || 0}</strong></td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{pohon.sentAt ? new Date(pohon.sentAt).toLocaleString('id-ID') : '—'}</td>
                    <td>
                      <button className="btn-view-text" onClick={() => setSelectedItem({ ...opdList[0], name: pohon.user, type: 'pohon' })}>
                        Buka Pohon <GitBranch size={14} />
                      </button>
                    </td>
                  </tr>
                )) : opdList.map(opd => (
                  <tr key={opd.id}>
                    <td>{opd.name}</td>
                    <td style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>Belum mengirim pohon kinerja</td>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>—</td>
                    <td style={{ fontSize: '0.78rem', color: '#94a3b8' }}>—</td>
                    <td>
                      <button className="btn-view-text" onClick={() => setSelectedItem({ ...opd, type: 'pohon' })}>
                        Lihat Diagram <GitBranch size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'iku':
        return (
          <div className="iku-view card">
            <div className="section-title-alt">
              <div className="flex items-center gap-2">
                <Target size={24} className="text-secondary" />
                <h3>Data Indikator Kinerja Utama (IKU) — {totalIKU} Indikator</h3>
              </div>
              <button className="btn btn-secondary btn-sm no-print" onClick={handlePrint}>
                <Printer size={14} /> Cetak Layar
              </button>
            </div>

            {/* Real IKU from Renstra data */}
            {hasRenstra ? (
              <div className="iku-table-container">
                <div className="opd-iku-header" style={{ borderRadius: '8px 8px 0 0', marginTop: '1rem' }}>
                  <span>{renstraMeta.perangkatDaerah || opdName}</span>
                  <span className="real-data-badge">● Data Real</span>
                </div>
                <table className="iku-sub-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Sasaran Strategis</th>
                      <th>Indikator Kinerja</th>
                      <th>Satuan</th>
                      <th>Target {filterYear}</th>
                      <th>Kondisi Akhir</th>
                      <th>Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renstraData.map((s, si) =>
                      (s.indikatorList || []).map((ind, ii) => (
                        <tr key={`${si}-${ii}`}>
                          {ii === 0 && (
                            <td rowSpan={s.indikatorList.length} className="center-cell font-bold">{si + 1}</td>
                          )}
                          {ii === 0 && (
                            <td rowSpan={s.indikatorList.length} style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.sasaran || '—'}</td>
                          )}
                          <td>{ind.indikator || '—'}</td>
                          <td style={{ textAlign: 'center' }}>{ind.satuan || '—'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: '#059669' }}>{ind.target?.[filterYear] || '—'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{ind.kondisiAkhir || '—'}</td>
                          <td style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>{ind.program || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <Target size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ fontWeight: 600 }}>Belum ada data IKU.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Silakan isi data di menu <strong>Sasaran Renstra</strong> terlebih dahulu.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/perencanaan/sasaran')}>Isi Sasaran Renstra</button>
              </div>
            )}
          </div>
        );

      case 'renstra':
        return (
          <div className="renstra-view grid-2">
            <div className="renstra-sidebar card">
              <div className="flex justify-between items-center mb-4">
                <h3>Data Renstra Tersimpan</h3>
                <button className="btn-icon-xs refresh-btn" onClick={loadAllData} title="Muat ulang data">↻</button>
              </div>
              {hasRenstra ? (
                <div className="opd-search-list">
                  {renstraData.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className={`opd-list-item ${selectedRenstraOpd?.id === (s.id || idx) ? 'active' : ''}`}
                      onClick={() => setSelectedRenstraOpd({ ...s, id: s.id || idx })}
                    >
                      <span style={{ fontSize: '0.78rem' }}>Sasaran {idx + 1}: {(s.sasaran || 'Tanpa Judul').substring(0, 35)}{(s.sasaran?.length || 0) > 35 ? '...' : ''}</span>
                      <ChevronRight size={13} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                  <p>Belum ada data Renstra.</p>
                  <button className="btn btn-primary" style={{ marginTop: '1rem', fontSize: '0.75rem' }} onClick={() => navigate('/perencanaan/sasaran')}>Isi Data Sekarang</button>
                </div>
              )}
              {hasRenstra && (
                <div className="renstra-meta-box">
                  <span>OPD: <strong>{renstraMeta.perangkatDaerah || 'N/A'}</strong></span>
                  <span>Update: <strong>{renstraMeta.updatedAt ? new Date(renstraMeta.updatedAt).toLocaleDateString('id-ID') : '—'}</strong></span>
                </div>
              )}
            </div>
            <div className="renstra-main card">
              <div className="renstra-header">
                <h3>Detail Sasaran Renstra</h3>
                <span className="badge-year">Periode 2022-2027</span>
              </div>

              {!selectedRenstraOpd ? (
                <div className="renstra-content-placeholder">
                  <p className="placeholder-text text-muted text-center pt-8">
                    {hasRenstra ? 'Pilih sasaran dari daftar di sebelah kiri untuk melihat detail IKU dan target.' : 'Belum ada data Renstra tersimpan.'}
                  </p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="renstra-real-data mt-4">
                  <div className="mb-4">
                    <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">TUJUAN STRATEGIS</span>
                    <p className="text-lg font-bold text-primary">{selectedRenstraOpd.tujuan || '—'}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-xs text-muted font-bold uppercase tracking-wider block mb-1">SASARAN STRATEGIS</span>
                    <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedRenstraOpd.sasaran || '—'}</p>
                  </div>

                  {/* IKU Table */}
                  {(selectedRenstraOpd.indikatorList || []).length > 0 && (
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                      <table className="iku-sub-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Indikator Kinerja</th>
                            <th>Satuan</th>
                            <th>Kondisi Awal</th>
                            <th>Target 2026</th>
                            <th>Kondisi Akhir</th>
                            <th>Program</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedRenstraOpd.indikatorList || []).map((ind, i) => (
                            <tr key={i}>
                              <td style={{ textAlign: 'center', fontWeight: 700 }}>{i + 1}</td>
                              <td>{ind.indikator || '—'}</td>
                              <td style={{ textAlign: 'center' }}>{ind.satuan || '—'}</td>
                              <td style={{ textAlign: 'center' }}>{ind.kondisiAwal || '—'}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700, color: '#059669' }}>{ind.target?.[2026] || '—'}</td>
                              <td style={{ textAlign: 'center', fontWeight: 700 }}>{ind.kondisiAkhir || '—'}</td>
                              <td style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>{ind.program || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="renstra-action-strip mt-4 no-print">
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/perencanaan/sasaran')}>Edit Data</button>
                    <button className="btn btn-primary btn-sm" onClick={handlePrint}><Printer size={14} /> Cetak</button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'pk':
        return (
          <div className="pk-view card">
            <div className="table-header">
              <div className="header-text">
                <h3>Perjanjian Kinerja (PK) Tahun {pkMeta.tahun || filterYear}</h3>
                <p className="text-sm text-muted">Monitoring penandatanganan dan input target kinerja tahunan</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-outline btn-sm" onClick={loadAllData}>↻ Refresh</button>
                <button className="btn btn-primary btn-sm ml-2" onClick={() => navigate('/perencanaan/pk')}>Edit Data PK</button>
              </div>
            </div>

            {hasPK ? (
              <>
                {/* PK Meta Info */}
                <div className="pk-meta-strip">
                  <span>OPD: <strong>{pkMeta.perangkatDaerah || '—'}</strong></span>
                  <span>Pejabat: <strong>{pkMeta.pejabat || '—'}</strong></span>
                  <span>NIP: <strong>{pkMeta.nip || '—'}</strong></span>
                  <span>Update: <strong>{pkMeta.updatedAt ? new Date(pkMeta.updatedAt).toLocaleDateString('id-ID') : '—'}</strong></span>
                  <span className="pk-total-anggaran">Total Anggaran: <strong>Rp {totalPKAnggaran.toLocaleString('id-ID')}</strong></span>
                </div>

                {/* PK Real Table */}
                <div style={{ overflowX: 'auto', marginTop: '1.25rem' }}>
                  <table className="admin-custom-table">
                    <thead>
                      <tr>
                        <th style={{width:40}}>No</th>
                        <th>Sasaran Strategis</th>
                        <th>Indikator Kinerja</th>
                        <th style={{width:80}}>Satuan</th>
                        <th style={{width:90}}>Target</th>
                        <th>Program</th>
                        <th style={{width:140}}>Anggaran (Rp)</th>
                        <th style={{width:80}}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkData.map((s, si) =>
                        (s.indikatorList || []).map((ind, ii) => (
                          <tr key={`${si}-${ii}`}>
                            {ii === 0 && <td rowSpan={s.indikatorList.length} className="center-cell font-bold">{si + 1}</td>}
                            {ii === 0 && <td rowSpan={s.indikatorList.length} style={{ fontWeight: 600 }}>{s.sasaran || '—'}</td>}
                            <td>{ind.indikator || '—'}</td>
                            <td style={{ textAlign: 'center' }}>{ind.satuan || '—'}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#92400e' }}>{ind.target || '—'}</td>
                            <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{ind.program || '—'}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700 }}>{ind.anggaran ? `Rp ${ind.anggaran}` : '—'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`status-pill ${pkMeta.pejabat ? 'success' : 'warning'}`}>
                                {pkMeta.pejabat ? 'Sudah TTD' : 'Belum TTD'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <Award size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p style={{ fontWeight: 600 }}>Belum ada data Perjanjian Kinerja.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Silakan isi data di menu <strong>Perjanjian Kinerja</strong>.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/perencanaan/pk')}>Isi Data PK</button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-complex-page relative">
      
      {/* Toast Notification UI */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="toast-notification"
          >
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="admin-banner glass">
        <div className="banner-info">
          <h1>Panel Kontrol Eksekutif</h1>
          <p>Pemantauan Terpadu SAKIP Provinsi Gorontalo</p>
        </div>
        <div className="banner-stats">
          <div className="b-stat cursor-pointer" onClick={() => setActiveMenu('daftar-opd')}>
            <Users size={16} /> {opdList.length} OPD Terdaftar
          </div>
          <div className="b-stat cursor-pointer" onClick={() => { setActiveMenu('renstra'); setSelectedItem(null); }}>
            <FileText size={16} /> {totalSasaranRenstra} Sasaran Renstra
          </div>
          <div className="b-stat cursor-pointer" onClick={() => { setActiveMenu('iku'); setSelectedItem(null); }}>
            <Target size={16} /> {totalIKU} IKU Terdaftar
          </div>
          <div className="b-stat cursor-pointer" onClick={() => { setActiveMenu('pk'); setSelectedItem(null); }}>
            <Award size={16} /> {totalPKSasaran} Sasaran PK
          </div>
        </div>
      </div>

      <div className="admin-layout-grid">
        {/* Internal Navigation */}
        <aside className="admin-sub-nav card">
          {adminMenu.map(menu => (
            <button 
              key={menu.id}
              className={`sub-nav-item ${activeMenu === menu.id ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(menu.id);
                setSelectedItem(null);
                setSelectedRenstraOpd(null);
              }}
            >
              <span className="menu-icon">{menu.icon}</span>
              <span className="menu-label">{menu.label}</span>
              {activeMenu === menu.id && <motion.div layoutId="active-pill" className="active-pill" />}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-slate-100">
             <button className="sub-nav-item w-full text-error" onClick={() => handleAction('Membuka Window Log Error Sistem')}>
                <AlertCircle size={18} />
                <span>Log System</span>
             </button>
          </div>
        </aside>

        {/* Main Interface */}
        <main className="admin-main-interface">
          {/* Global Filter/Search for Admin */}
          <div className="admin-global-actions card mb-4">
            <div className="search-bar-alt">
              <Search size={18} />
              <input 
                type="text" 
                placeholder={`Cari data dalam panel ${activeMenu.replace('-', ' ')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <button className="btn-filter" onClick={() => handleAction('Menampilkan Modal Parameter Filter Lanjutan')}><Filter size={14} /> Filter Lanjutan</button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu + (selectedItem ? '-detail' : '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-complex-page { display: flex; flex-direction: column; gap: 1.5rem; animation: fadeIn 0.5s ease; position: relative; }
        .cursor-pointer { cursor: pointer; }
        .ml-2 { margin-left: 0.5rem; }
        .mt-auto { margin-top: auto; }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .pt-4 { padding-top: 1rem; }
        .pt-8 { padding-top: 2rem; }
        .pb-2 { padding-bottom: 0.5rem; }
        .p-4 { padding: 1rem; }
        .block { display: block; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-center { text-align: center; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .text-main { color: var(--text-main); }
        .text-primary { color: var(--primary); }
        .text-secondary { color: var(--secondary); }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .text-muted { color: var(--text-muted); }
        .text-error { color: var(--error); }
        .bg-slate-50 { background-color: #f8fafc; }
        .border-slate-200 { border-color: #e2e8f0; }
        .rounded-lg { border-radius: var(--radius-lg); }
        .relative { position: relative; }
        .border-t { border-top: 1px solid #f1f5f9; }
        
        /* Toast Notification */
        .toast-notification {
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
          z-index: 1000;
        }

        /* Banner & Layout */
        .admin-banner { background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 2rem 2.5rem; border-radius: var(--radius-xl); color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-lg); flex-wrap: wrap; gap: 1rem; }
        .banner-info h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.25rem; }
        .banner-info p { font-size: 0.85rem; opacity: 0.8; }
        .banner-stats { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .b-stat { display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.15); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.78rem; font-weight: 700; white-space: nowrap; transition: background 0.2s; }
        .b-stat:hover { background: rgba(255,255,255,0.25); }
        .admin-layout-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; }

        /* Section title with actions */
        .section-title-alt { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .section-title-alt h3 { font-size: 1.05rem; font-weight: 700; color: var(--primary); }
        .gap-2 { gap: 0.5rem; }

        /* Renstra & PK meta info strips */
        .renstra-meta-box { margin-top: 1rem; padding: 0.75rem 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 0.75rem; display: flex; flex-direction: column; gap: 0.3rem; color: #166534; }
        .renstra-meta-box strong { font-weight: 700; }
        .renstra-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .renstra-header h3 { font-size: 1rem; font-weight: 700; color: var(--primary); }
        .badge-year { background: #ede9fe; color: #5b21b6; padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; }
        .renstra-action-strip { display: flex; gap: 0.5rem; justify-content: flex-end; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; }

        .pk-meta-strip { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0.875rem 1rem; margin-top: 1rem; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; font-size: 0.75rem; color: #92400e; }
        .pk-meta-strip strong { font-weight: 700; }
        .pk-total-anggaran { margin-left: auto; font-weight: 700; color: #166534; }
        .pk-total-anggaran strong { font-size: 0.85rem; }

        /* Real data badge */
        .real-data-badge { background: #dcfce7; color: #166534; padding: 0.15rem 0.6rem; border-radius: 20px; font-size: 0.68rem; font-weight: 700; }

        /* Small utility buttons */
        .btn-icon-xs { width: 24px; height: 24px; border-radius: 5px; background: rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; transition: background 0.2s; cursor: pointer; }
        .btn-icon-xs:hover { background: rgba(255,255,255,0.35); }
        .refresh-btn { background: #f1f5f9; color: #475569; font-size: 1rem; font-weight: 700; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; }
        .refresh-btn:hover { background: #e2e8f0; transform: rotate(180deg); }

        /* Table center cell */
        .center-cell { text-align: center; vertical-align: middle !important; }
        .iku-table-container { margin-top: 0.5rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid #e2e8f0; }

        /* Detail View Styles */
        .detail-view-container { overflow: hidden; }
        .view-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
        .view-header h3 { font-size: 1.25rem; font-weight: 700; color: var(--primary); }
        .btn-back { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--text-muted); transition: color 0.2s; padding: 0.5rem; border-radius: var(--radius-md); }
        .btn-back:hover { color: var(--primary); background: #f8fafc; }
        
        .info-alert { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 8px; color: #166534; font-size: 0.85rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; font-weight: 500; }
        
        /* Box Layout Details */
        .detail-content-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .data-box { background: #f8fafc; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.5rem; }
        .data-box.full-width { width: 100%; }
        .data-box-label { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); }
        .data-box-value { font-size: 1.1rem; }
        .data-box-text { font-size: 1rem; line-height: 1.6; color: var(--primary); font-weight: 500; }

        /* Diagram Pohon Kinerja inside Admin */
        .diagram-container { background: #eff6ff; padding: 2rem; display: flex; flex-direction: column; align-items: center; border-radius: 12px; overflow-x: auto; min-height: 600px;}
        .diagram-header-row { display: flex; justify-content: space-between; width: 100%; max-width: 900px; align-items: center; margin-bottom: 1rem; }
        .center-connector-group { display: flex; flex-direction: column; align-items: center; flex: 1; }
        .side-boxes { display: flex; flex-direction: column; gap: 1rem; width: 220px; }
        .column { flex-direction: column; }
        .box-group { display: flex; flex-direction: row; justify-content: center; gap: 2rem; width: 100%; position: relative; padding: 1rem 0; }
        .box { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-align: center; min-height: 48px; display: flex; align-items: center; justify-content: center; line-height: 1.3; min-width: 150px; max-width: 250px; position: relative; z-index: 1;}
        .box-dashed { border: 2px dashed rgba(0,0,0,0.3); }
        .box-solid { border: 1px solid rgba(0,0,0,0.1); }
        .box-shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .box-icon { margin-right: 8px; flex-shrink: 0; }
        .box-blue { background: #bae6fd; color: #0369a1; }
        .box-cyan { background: #cffafe; color: #0e7490; }
        .box-primary { background: white; color: var(--primary); border: 2px solid var(--primary); }
        .box-main { font-size: 1rem; width: 280px; }
        .box-orange { background: #fed7aa; color: #9a3412; }
        .box-white { background: white; color: var(--primary); border: 1px solid #e2e8f0; }
        .box-pink { background: #fce7f3; color: #9d174d; }
        .box-green { background: #dcfce7; color: #166534; border-radius: 4px;}
        .box-blue-dark { background: #dbeafe; color: #1e40af; border-radius: 4px; }
        .diagram-tracks-row { display: flex; justify-content: center; gap: 2rem; width: 100%; flex-wrap: nowrap; background: rgba(255,255,255,0.7); padding: 2rem; border-radius: 20px; align-items: flex-start; }
        .diagram-track { display: flex; flex-direction: column; align-items: center; min-width: 220px; gap: 0; }
        .diagram-track .box-bottom-line { position: absolute; bottom: -1rem; left: 50%; transform: translateX(-50%); width: 2px; height: 1rem; background: #f97316; }
        .arrow { width: 2px; height: 1rem; background: #f97316; margin: 0; }
        .icon-main { color: var(--primary); margin-bottom: 0.5rem; }
        .arrow-down-main { color: #f97316; margin: 0.5rem 0; }

        /* General Admin Internal Actions */        .admin-global-actions { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.5rem; }
        .search-bar-alt { display: flex; align-items: center; gap: 0.75rem; flex: 1; color: var(--text-muted); }
        .search-bar-alt input { border: none; outline: none; font-size: 0.9rem; width: 100%; font-weight: 500; }
        .btn-filter { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--text-main); padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #e2e8f0; }
        .btn-filter:hover { background: #f8fafc; }

        /* Review Grid */
        .review-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
        .review-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border-top: 4px solid var(--secondary); }
        .review-card-header { display: flex; justify-content: space-between; }
        .opd-tag { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); background: #f8fafc; padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid #e2e8f0;}
        .review-card h4 { font-weight: 700; color: var(--primary); font-size: 0.95rem; }
        .review-items { display: flex; flex-direction: column; gap: 0.5rem; }
        .review-item { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: transform 0.1s, background 0.2s; border: 1px solid transparent; }
        .review-item:hover { border-color: #cbd5e1; }
        .review-item:active { transform: scale(0.98); }
        .review-item.done { background: #f0fdf4; color: #166534; }
        .review-item.pending { background: #fef2f2; color: #991b1b; }
        .btn-full { width: 100%; padding: 0.75rem; background: var(--primary); color: white; border-radius: var(--radius-md); font-weight: 600; display: flex; justify-content: center; align-items: center; gap: 0.5rem; transition: var(--transition-base); }
        .btn-full:hover { background: var(--primary-light); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
        .btn-icon-shadow { padding: 0.5rem; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); color: var(--text-muted); transition: all 0.2s; }
        .btn-icon-shadow:hover { color: var(--primary); background: #f8fafc; }
        .btn-view-text { display: flex; align-items: center; gap: 0.5rem; color: var(--secondary); font-weight: 700; font-size: 0.75rem; padding: 0.5rem; border-radius: 6px; }
        .btn-view-text:hover { background: #f0fdf4; }

        /* Styling the Subnav */
        .admin-sub-nav { padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; position: sticky; top: 1rem; min-height: fit-content; border: 1px solid #e2e8f0; }
        .sub-nav-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: var(--radius-md); color: var(--text-muted); font-weight: 600; transition: all 0.2s; position: relative; text-align: left; }
        .sub-nav-item.active { color: var(--secondary); background: #f0fdf4; }
        .sub-nav-item:hover:not(.active) { background: #f8fafc; color: var(--primary); }
        .active-pill { position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px; background: var(--secondary); border-radius: 0 4px 4px 0; }

        /* Tables */
        .admin-custom-table { width: 100%; border-collapse: collapse; }
        .admin-custom-table th { background: #f8fafc; padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; border-bottom: 1px solid #e2e8f0; }
        .admin-custom-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }
        .badge-code { background: #f1f5f9; padding: 0.25rem 0.6rem; border-radius: 4px; font-family: monospace; font-weight: 700; color: var(--primary); border: 1px solid #e2e8f0;}
        .status-pill { padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.7rem; font-weight: 700; }
        .status-pill.success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;}
        .status-pill.warning { background: #fef9c3; color: #a16207; border: 1px solid #fef08a;}

        /* IKU module */
        .iku-sub-table { width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-top: none; }
        .iku-sub-table td { padding: 1rem 0.75rem; font-size: 0.85rem; border-bottom: 1px solid #f1f5f9; }
        .iku-sub-table th { padding: 0.75rem; font-size: 0.75rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left; color: var(--text-muted); font-weight: 700;}
        .opd-iku-header { background: var(--primary); color: white; padding: 0.75rem 1rem; font-weight: 700; font-size: 0.9rem; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; }
        
        /* PK Module */
        .pk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .pk-mini-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02);}
        .pk-mini-card:hover { border-color: var(--secondary); box-shadow: var(--shadow-md); transform: translateY(-2px);}
        .pk-info { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; align-items: flex-start;}
        .pk-opd-name { font-size: 0.85rem; font-weight: 700; color: var(--primary); display: block; line-height: 1.2;}
        .pk-status { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 0.15rem 0.4rem; border-radius: 4px; }
        .pk-status.signed { color: #166534; background: #dcfce7; }
        .pk-status.unsigned { color: #991b1b; background: #fee2e2; }
        .btn-circle { width: 32px; height: 32px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s;flex-shrink:0;}
        .btn-circle:hover { color: var(--primary); border-color: var(--primary); background: white;}

        /* Renstra Grid Options */
        .grid-2 { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
        .opd-search-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .opd-list-item { padding: 0.8rem; border-radius: 6px; border: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; color: var(--text-muted);}
        .opd-list-item:hover { background: #f8fafc; color: var(--primary); }
        .opd-list-item.active { background: var(--secondary); color: white; border-color: var(--secondary); }

        .select-sm { padding: 0.4rem 1rem; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 0.8rem; font-weight: 600; outline: none; background: white;}

        /* CSS KHUSUS CETAK/PRINT */
        @media print {
          /* Sembunyikan elemen navigasi dan banner */
          .admin-sub-nav, .admin-banner, .admin-global-actions, .toast-notification, .no-print, .btn-back, .main-header, .sidebar {
            display: none !important;
          }
          
          /* Hilangkan latar belakang gelap dari wrapper/body */
          body, .content-area, .admin-complex-page {
            background: white !important;
          }

          /* Maksimalkan lebar tampilan */
          .admin-layout-grid {
            display: block !important;
          }

          /* Elemen Card tidak perlu shadow atau border melingkar saat di print */
          .card {
            box-shadow: none !important;
            border: none;
            padding: 0;
            margin: 0;
          }

          /* Ubah warna agar printer tidak boros tinta */
          .bg-slate-50 {
            background-color: transparent !important;
            border: 1px solid #ddd !important;
          }
        }
      `}} />
    </div>
  );
}

const Info = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const Edit3 = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

export default Admin;
