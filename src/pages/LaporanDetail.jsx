import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Printer, FileDown, Table, Eye, Search, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { fetchRenstraByOPD } from '../services/sakipService';

const STORAGE_KEY = 'renstra_sasaran_data';
const PK_STORAGE_KEY = 'pk_data';
const TAHUN_RENSTRA = [2022, 2023, 2024, 2025, 2026, 2027];

const DUMMY_DATA = [
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
      },
    ],
    activeYears: [2022, 2023, 2024, 2025, 2026, 2027],
  }
];

function LaporanDetail({ user }) {
  const location = useLocation();
  const [reportTitle, setReportTitle] = useState('Laporan Rencana Strategis');
  const [isPreview, setIsPreview] = useState(false);
  const [reportType, setReportType] = useState('renstra'); // 'renstra' | 'pk'
  const [reportData, setReportData] = useState([]);
  const [pkData, setPkData] = useState([]);
  const [meta, setMeta] = useState({ perangkatDaerah: '', updatedAt: '' });
  const [pkMeta, setPkMeta] = useState({ perangkatDaerah: '', tahun: '2026', pejabat: '', nip: '', updatedAt: '' });
  const [dataSource, setDataSource] = useState('—');
  const [isFetching, setIsFetching] = useState(false);

  const fetchOpenData = async () => {
    setIsFetching(true);
    try {
      const apiData = await fetchRenstraByOPD(user?.code);
      if (apiData) {
        setReportData(apiData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        const newMeta = { perangkatDaerah: user?.name, updatedAt: new Date().toISOString() };
        setMeta(newMeta);
        localStorage.setItem('renstra_meta', JSON.stringify(newMeta));
        setDataSource('Tersinkron');
      } else {
        alert('Data untuk OPD ini belum tersedia di portal SAKIP.');
      }
    } catch (err) {
      alert('Gagal mengambil data dari portal SAKIP.');
    } finally {
      setIsFetching(false);
    }
  };

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const metaStored = localStorage.getItem('renstra_meta');
      setReportData(stored ? JSON.parse(stored) : DUMMY_DATA);
      setDataSource(stored ? 'Tersimpan' : 'Contoh');
      if (metaStored) setMeta(JSON.parse(metaStored));
    } catch (_) { setReportData(DUMMY_DATA); setDataSource('Contoh'); }

    try {
      const pkStored = localStorage.getItem(PK_STORAGE_KEY);
      const pkMetaStored = localStorage.getItem('pk_meta');
      if (pkStored) setPkData(JSON.parse(pkStored));
      if (pkMetaStored) setPkMeta(JSON.parse(pkMetaStored));
    } catch (_) {}
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('renstra')) { setReportTitle('Rencana Strategis (Renstra)'); setReportType('renstra'); }
    else if (path.includes('iku')) { setReportTitle('Indikator Kinerja Utama (IKU)'); setReportType('renstra'); }
    else if (path.includes('pk')) { setReportTitle('Perjanjian Kinerja (PK)'); setReportType('pk'); }
    document.title = `Laporan | e-SETDA Provinsi Gorontalo`;
    loadData();
  }, [location, user]);

  const handlePrint = () => window.print();

  // ─── PK Report Table ───────────────────────────────
  const renderPKTable = () => {
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const opdName = pkMeta.perangkatDaerah || meta.perangkatDaerah || user?.name || 'SEKRETARIAT DAERAH PROVINSI GORONTALO';
    const tahun = pkMeta.tahun || '2026';
    const pejabat = pkMeta.pejabat || '...............................................';
    const nip = pkMeta.nip || '...............................................';

    const rows = [];
    let no = 0;
    pkData.forEach(s => {
      no++;
      s.indikatorList.forEach((ind, iIdx) => {
        rows.push({ no, sasaran: s.sasaran, isFirst: iIdx === 0, rowspan: s.indikatorList.length, ...ind });
      });
    });

    const totalAnggaran = pkData.reduce((acc, s) =>
      acc + s.indikatorList.reduce((a, i) => a + (parseInt(i.anggaran?.replace(/\./g, '') || '0')), 0), 0
    );

    return (
      <div className="printable-report">
        <div className="kop-surat">
          <img src="/logo.svg" alt="Logo Provinsi Gorontalo" className="kop-logo" onError={e => { e.target.style.display='none'; }} />
          <div className="kop-text">
            <p className="kop-prov">PEMERINTAH PROVINSI GORONTALO</p>
            <p className="kop-opd">{opdName}</p>
            <p className="kop-alamat">Jln. Sapta Marga No. 5 Kota Gorontalo, Telp (0435) 821102</p>
          </div>
          <div className="kop-right-space" />
        </div>
        <div className="kop-line-double" />

        <div className="doc-title">
          <h2>PERJANJIAN KINERJA</h2>
          <p>{opdName}</p>
          <p>TAHUN ANGGARAN {tahun}</p>
        </div>

        {/* Pihak - Pihak */}
        <div className="pk-pihak-wrap">
          <div className="pk-pihak-row"><span>Yang Membuat Perjanjian</span><span>:</span><span>{pejabat}</span></div>
          <div className="pk-pihak-row"><span>NIP</span><span>:</span><span>{nip}</span></div>
          <div className="pk-pihak-row"><span>Jabatan</span><span>:</span><span>Kepala {opdName.split(' ').slice(0,2).join(' ')}</span></div>
          <div className="pk-pihak-row"><span>Perangkat Daerah</span><span>:</span><span>{opdName}</span></div>
        </div>

        <p style={{ fontSize: '0.8rem', margin: '1rem 0', fontWeight: 600 }}>berjanji akan mewujudkan target kinerja yang seharusnya sesuai lampiran perjanjian ini, dalam rangka mencapai target kinerja jangka menengah seperti yang telah ditetapkan dalam dokumen perencanaan.</p>

        <table className="renstra-table">
          <colgroup>
            <col className="col-no" />
            <col className="col-sasaran" />
            <col className="col-iku" />
            <col className="col-satuan-pk" />
            <col className="col-target-pk" />
            <col className="col-program-pk" />
            <col className="col-kegiatan" />
            <col className="col-anggaran" />
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>Sasaran Strategis</th>
              <th>Indikator Kinerja</th>
              <th>Satuan</th>
              <th>Target</th>
              <th>Program</th>
              <th>Kegiatan / Sub-Kegiatan</th>
              <th>Anggaran (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign:'center', padding:'2rem', color:'#94a3b8' }}>Belum ada data PK. Silakan isi data di menu Perjanjian Kinerja.</td></tr>
            ) : null}
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className={row.isFirst && rIdx > 0 ? 'row-separator' : ''}>
                {row.isFirst && (
                  <>
                    <td rowSpan={row.rowspan} className="center-cell fw-bold">{row.no}</td>
                    <td rowSpan={row.rowspan} className="cell-tujuan">{row.sasaran || '—'}</td>
                  </>
                )}
                <td>{row.indikator || '—'}</td>
                <td className="center-cell">{row.satuan || '—'}</td>
                <td className="center-cell fw-bold" style={{ color: '#92400e' }}>{row.target || '—'}</td>
                <td className="cell-program">{row.program || '—'}</td>
                <td className="cell-program">{row.kegiatan || '—'}</td>
                <td className="center-cell">{row.anggaran ? `Rp ${row.anggaran}` : '—'}</td>
              </tr>
            ))}
            {rows.length > 0 && (
              <tr style={{ fontWeight: 800, background: '#f8fafc' }}>
                <td colSpan={7} style={{ textAlign: 'right', paddingRight: '1rem', fontSize: '0.75rem' }}>TOTAL ANGGARAN</td>
                <td className="center-cell" style={{ color: '#166534' }}>Rp {totalAnggaran.toLocaleString('id-ID')}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="report-signature" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
          <div style={{ textAlign: 'center', width: '280px' }}>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Atasan Langsung,</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Gubernur Gorontalo</p>
            <div style={{ height: '80px' }} />
            <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>( ..................................... )</p>
          </div>
          <div style={{ textAlign: 'center', width: '280px' }}>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Gorontalo, {today}</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Yang Membuat Perjanjian,</p>
            <div style={{ height: '80px' }} />
            <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>( {pejabat} )</p>
            <p style={{ fontSize: '0.75rem' }}>NIP. {nip}</p>
          </div>
        </div>
      </div>
    );
  };

  // Build flat rows for table (one row per indikator)
  const buildRows = () => {
    const rows = [];
    let noSasaran = 0;
    reportData.forEach((s) => {
      noSasaran++;
      s.indikatorList.forEach((ind, iIdx) => {
        rows.push({
          noSasaran,
          tujuan: s.tujuan,
          sasaran: s.sasaran,
          isFirstIndikator: iIdx === 0,
          indikatorRowspan: s.indikatorList.length,
          indikator: ind.indikator,
          satuan: ind.satuan,
          kondisiAwal: ind.kondisiAwal,
          target: ind.target,
          kondisiAkhir: ind.kondisiAkhir,
          program: ind.program,
          activeYears: s.activeYears || TAHUN_RENSTRA,
        });
      });
    });
    return rows;
  };

  const renderTable = () => {
    const rows = buildRows();
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const opdName = meta.perangkatDaerah || user?.name || 'SEKRETARIAT DAERAH PROVINSI GORONTALO';

    return (
      <div className="printable-report">
        {/* ─── Kop Surat ─── */}
        <div className="kop-surat">
          <img src="/logo.svg" alt="Logo Provinsi Gorontalo" className="kop-logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="kop-text">
            <p className="kop-prov">PEMERINTAH PROVINSI GORONTALO</p>
            <p className="kop-opd">{opdName}</p>
            <p className="kop-alamat">Jln. Sapta Marga No. 5 Kota Gorontalo, Telp (0435) 821102</p>
          </div>
          <div className="kop-right-space" />
        </div>

        <div className="kop-line-double" />

        {/* ─── Judul ─── */}
        <div className="doc-title">
          <h2>RENCANA STRATEGIS</h2>
          <p>{opdName}</p>
          <p>TAHUN 2022 – 2027</p>
        </div>

        {/* ─── Tabel Renstra ─── */}
        <table className="renstra-table">
          <colgroup>
            <col className="col-no" />
            <col className="col-tujuan" />
            <col className="col-sasaran" />
            <col className="col-iku" />
            <col className="col-satuan" />
            <col className="col-awal" />
            {TAHUN_RENSTRA.map(yr => <col key={yr} className="col-target" />)}
            <col className="col-akhir" />
            <col className="col-program" />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2}>No</th>
              <th rowSpan={2}>Tujuan</th>
              <th rowSpan={2}>Sasaran Strategis</th>
              <th rowSpan={2}>Indikator Kinerja (IKU)</th>
              <th rowSpan={2}>Satuan</th>
              <th rowSpan={2}>Kondisi Awal<br />(2021)</th>
              <th colSpan={6} style={{ textAlign: 'center' }}>Target</th>
              <th rowSpan={2}>Kondisi Akhir<br />(2027)</th>
              <th rowSpan={2}>Program</th>
            </tr>
            <tr>
              {TAHUN_RENSTRA.map(yr => (
                <th key={yr}>{yr}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Belum ada data. Silakan isi data di menu Sasaran Renstra.
                </td>
              </tr>
            ) : null}
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className={row.isFirstIndikator && rIdx > 0 ? 'row-separator' : ''}>
                {row.isFirstIndikator && (
                  <>
                    <td rowSpan={row.indikatorRowspan} className="center-cell fw-bold">{row.noSasaran}</td>
                    <td rowSpan={row.indikatorRowspan} className="cell-tujuan">{row.tujuan || '—'}</td>
                    <td rowSpan={row.indikatorRowspan} className="cell-sasaran">{row.sasaran || '—'}</td>
                  </>
                )}
                <td className="cell-indikator">{row.indikator || '—'}</td>
                <td className="center-cell">{row.satuan || '—'}</td>
                <td className="center-cell">{row.kondisiAwal || '—'}</td>
                {TAHUN_RENSTRA.map(yr => (
                  <td key={yr} className={`center-cell ${row.activeYears && !row.activeYears.includes(yr) ? 'cell-inactive' : ''}`}>
                    {(!row.activeYears || row.activeYears.includes(yr)) ? (row.target[yr] || '—') : 'N/A'}
                  </td>
                ))}
                <td className="center-cell fw-bold">{row.kondisiAkhir || '—'}</td>
                <td className="cell-program">{row.program || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ─── TTD ─── */}
        <div className="signature-block">
          <div className="sig-left">
            <p>Ditetapkan di : Gorontalo</p>
            <p>Pada Tanggal : {today}</p>
          </div>
          <div className="sig-right">
            <p>Kepala {opdName.split(' ')[0] === 'SEKRETARIAT' ? 'Sekretariat Daerah' : opdName.substring(0, 30)}</p>
            <div className="sig-space" />
            <p className="sig-name">( ................................................ )</p>
            <p className="sig-nip">NIP. ..........................................</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ld-page">
      {/* ─── Breadcrumb Bar ─── */}
      <div className="ld-top-bar glass no-print">
        <div className="breadcrumb">
          <span>Halaman Utama</span> / <span>Laporan</span> / <span className="active-crumb">{reportTitle}</span>
        </div>
        <div className="period-badge">Renstra 2022–2027</div>
      </div>

      {/* ─── Card ─── */}
      <div className="ld-card card">
        {/* Header Section */}
        <div className="ld-header no-print">
          <div className="header-left">
            <FileText size={22} className="header-icon" />
            <div>
              <h3 className="header-title">Laporan {reportTitle}</h3>
              <p className="header-sub">
                {meta.perangkatDaerah || user?.name || 'Sekretariat Daerah Provinsi Gorontalo'}
                {meta.updatedAt && (
                  <span className="data-badge">
                    <CheckCircle size={11} />
                    Data {dataSource} · {new Date(meta.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                )}
                {!meta.updatedAt && (
                  <span className="data-badge demo">Data: {dataSource}</span>
                )}
              </p>
            </div>
          </div>

          <div className="header-actions">
            {reportType === 'renstra' && (
              <button 
                className={`btn ${isFetching ? 'btn-disabled' : 'btn-outline-secondary'} flex items-center gap-xs`} 
                onClick={fetchOpenData}
                disabled={isFetching}
                style={{ height: '36px', padding: '0 1rem', fontSize: '0.75rem' }}
              >
                <Database size={14} className={isFetching ? 'animate-spin' : ''} />
                {isFetching ? 'Sinkronisasi...' : 'Sinkronkan Open Data'}
              </button>
            )}
            <button className="btn-reload" onClick={loadData} title="Muat ulang data">
              <RefreshCw size={15} />
            </button>
            <div className="export-btns">
              <button className="btn-exp preview" onClick={() => setIsPreview(true)}>
                <Eye size={15} /> PRATINJAU
              </button>
              <button className="btn-exp print" onClick={handlePrint}>
                <Printer size={15} /> PRINT
              </button>
              <button className="btn-exp pdf" onClick={handlePrint}>
                <FileDown size={15} /> PDF
              </button>
              <button className="btn-exp excel">
                <Table size={15} /> EXCEL
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="ld-content">
          {reportType === 'renstra' ? renderTable() : renderPKTable()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ld-page { display: flex; flex-direction: column; gap: 1.25rem; }
        .ld-top-bar { padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-md); background: white; border: 1px solid #e2e8f0; }
        .breadcrumb { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        .active-crumb { color: var(--primary); font-weight: 700; }
        .period-badge { background: #ede9fe; color: #5b21b6; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.73rem; font-weight: 800; letter-spacing: 0.02em; }

        .ld-card { padding: 0; overflow: hidden; border: none; box-shadow: var(--shadow-lg); }
        .ld-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; background: white; }
        .header-left { display: flex; align-items: center; gap: 1rem; }
        .header-icon { color: var(--primary); }
        .header-title { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0; }
        .header-sub { font-size: 0.8rem; color: var(--text-muted); margin: 0; display: flex; align-items: center; gap: 0.75rem; }
        .data-badge { display: inline-flex; align-items: center; gap: 0.3rem; background: #f0fdf4; color: #166534; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.65rem; font-weight: 700; border: 1px solid #dcfce7; }
        .data-badge.demo { background: #fff7ed; color: #9a3412; border-color: #ffedd5; }

        .header-actions { display: flex; align-items: center; gap: 0.75rem; }
        .btn-reload { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; background: white; }
        .btn-reload:hover { background: #f8fafc; border-color: #cbd5e1; color: var(--primary); }
        .export-btns { display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 10px; gap: 0.25rem; }
        .btn-exp { border: none; padding: 0.5rem 0.8rem; border-radius: 7px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; transition: all 0.2s; color: #475569; background: transparent; }
        .btn-exp:hover { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); color: var(--primary); }
        .btn-exp.print { color: #0891b2; }
        .btn-exp.pdf { color: #e11d48; }
        .btn-exp.excel { color: #16a34a; }

        .ld-content { padding: 2rem; background: #f8fafc; overflow-x: auto; }

        /* ─── Report Styles ─── */
        .printable-report { background: white; width: 1060px; margin: 0 auto; padding: 2rem; box-shadow: 0 0 40px rgba(0,0,0,0.05); min-height: 1000px; color: #000; font-family: 'Inter', sans-serif; }
        .kop-surat { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem; }
        .kop-logo { width: 75px; height: auto; }
        .kop-text { flex: 1; text-align: center; }
        .kop-prov { font-size: 1.1rem; font-weight: 800; margin: 0; letter-spacing: 0.05em; }
        .kop-opd { font-size: 1.25rem; font-weight: 900; margin: 0; color: #000; }
        .kop-alamat { font-size: 0.7rem; margin: 0.2rem 0 0; color: #334155; }
        .kop-right-space { width: 75px; }
        .kop-line-double { height: 4px; border-top: 3px solid #000; border-bottom: 1px solid #000; margin-bottom: 1.5rem; }

        .doc-title { text-align: center; margin-bottom: 2rem; }
        .doc-title h2 { font-size: 1.2rem; font-weight: 900; margin: 0; text-decoration: underline; }
        .doc-title p { font-size: 1rem; font-weight: 800; margin: 0.2rem 0 0; }

        .renstra-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; border: 2px solid #000; table-layout: fixed; }
        .renstra-table th, .renstra-table td { 
          border: 1px solid #000; 
          padding: 0.4rem; 
          font-size: 0.68rem; 
          line-height: 1.25; 
          overflow-wrap: break-word;
        }
        .renstra-table th { background: #f1f5f9; font-weight: 800; text-align: center; text-transform: uppercase; }
        .center-cell { text-align: center; vertical-align: middle; }
        .fw-bold { font-weight: 800; }
        .cell-tujuan { font-weight: 700; background: #fafafa; }
        .cell-sasaran { font-weight: 600; }
        .cell-indikator { font-style: italic; }
        .cell-program { color: #1e40af; font-weight: 700; font-size: 0.62rem; }
        .cell-inactive { background: #f8fafc; color: #94a3b8; }
        .row-separator { border-top: 2px solid #000; }

        .col-no { width: 25px; }
        .col-tujuan { width: 125px; }
        .col-sasaran { width: 125px; }
        .col-iku { width: 180px; }
        .col-satuan { width: 45px; }
        .col-awal, .col-akhir { width: 45px; }
        .col-target { width: 40px; }
        .col-program { width: 160px; }

        .signature-block { display: flex; justify-content: space-between; margin-top: 3rem; page-break-inside: avoid; }
        .sig-left p { font-size: 0.8rem; margin: 0.2rem 0; font-weight: 600; }
        .sig-right { text-align: center; width: 300px; }
        .sig-right p { font-size: 0.85rem; margin: 0.2rem 0; font-weight: 700; }
        .sig-space { height: 80px; }
        .sig-name { font-weight: 800; }
        .sig-nip { font-size: 0.75rem; }

        .pk-pihak-wrap { margin-bottom: 1.5rem; }
        .pk-pihak-row { display: grid; grid-template-columns: 180px 20px 1fr; font-size: 0.85rem; margin-bottom: 0.3rem; font-weight: 600; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .gap-xs { gap: 0.25rem; }
        .btn-outline-secondary { background: white; color: #475569; border: 1px solid #e2e8f0; }
        .btn-outline-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
        .btn-disabled { opacity: 0.5; cursor: not-allowed; }

        @media print {
          .no-print, .sidebar, .main-header, .ld-top-bar, .ld-header { display: none !important; }
          .content-area { padding: 0 !important; background: white !important; }
          .ld-card { box-shadow: none; border: none; border-radius: 0; }
          .ld-content { padding: 0; background: white; }
          .printable-report { box-shadow: none; padding: 0; margin: 0; width: 100%; }
          @page { size: landscape; margin: 1cm; }
        }
      `}} />
    </div>
  );
}

export default LaporanDetail;
