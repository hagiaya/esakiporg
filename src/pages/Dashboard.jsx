import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  GitBranch, 
  Printer,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

function Dashboard({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Dashboard | ${user?.name || 'e-SETDA'}`;
  }, [user]);

  const isAdmin = user?.role === 'ADMIN';

  const adminStats = [
    { label: 'Review Perencanaan', value: '128', icon: <ClipboardCheck className="text-secondary" />, trend: 'Dokumen Terverifikasi' },
    { label: 'Pohon Kinerja', value: '42', icon: <GitBranch className="text-success" />, trend: 'OPD Provinsi' },
    { label: 'Pusat Laporan', value: '12', icon: <Printer className="text-warning" />, trend: 'Menunggu Review' },
    { label: 'Panel Admin', value: '5', icon: <ShieldCheck className="text-error" />, trend: 'Revisi Diperlukan' },
  ];

  const opdStats = [
    { label: 'Data Perencanaan', value: 'Selesai', icon: <ClipboardCheck className="text-secondary" />, trend: 'Visi, Sasaran, PK' },
    { label: 'Pohon Kinerja', value: '18/20', icon: <GitBranch className="text-success" />, trend: 'Indikator Sukses' },
    { label: 'Pusat Laporan', value: '75%', icon: <Printer className="text-warning" />, trend: 'Triwulan I Selesai' },
    { label: 'Pencapaian', value: 'B+', icon: <TrendingUp className="text-success" />, trend: 'Meningkat' },
  ];

  const stats = isAdmin ? adminStats : opdStats;

  const adminActivities = [
    { title: 'Dinas Kesehatan mengunggah Perjanjian Kinerja', time: '10 menit yang lalu', status: 'success' },
    { title: 'BKD menyerahkan laporan Triwulan I', time: '1 jam yang lalu', status: 'pending' },
    { title: 'Inspektorat: Revisi Sasaran Renstra diperlukan', time: '3 jam yang lalu', status: 'error' },
    { title: 'Dinas Pendidikan: Pohon Kinerja diperbarui', time: 'Kemarin', status: 'success' },
  ];

  const opdActivities = [
    { title: 'Anda mengunggah Sasaran Renstra 2026', time: '2 jam yang lalu', status: 'success' },
    { title: 'Sekretaris Daerah meninjau Perjanjian Kinerja', time: '4 jam yang lalu', status: 'pending' },
    { title: 'Laporan Triwulan I berhasil disimpan', time: 'Kemarin', status: 'success' },
    { title: 'Lengkapi data Indikator Utama (IKU)', time: '2 hari yang lalu', status: 'error' },
  ];

  const recentActivities = isAdmin ? adminActivities : opdActivities;

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="welcome-banner glass"
      >
        <div className="banner-content">
          <span className="banner-badge">Pemberitahuan</span>
          <h1>Selamat Datang Kembali, {user?.name}!</h1>
          <p>
            {isAdmin 
              ? 'Terdapat 12 dokumen perencanaan yang memerlukan tinjauan hari ini.' 
              : 'Pastikan data perencanaan dan laporan triwulan Anda telah diperbarui sesuai jadwal.'}
          </p>
          <div className="flex gap-md" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-primary banner-btn" onClick={() => navigate(isAdmin ? '/admin' : '/laporan')}>
              {isAdmin ? 'Mulai Review Perencanaan' : 'Update Laporan'} <ArrowUpRight size={18} />
            </button>
            <button 
              className="btn btn-secondary banner-btn-secondary" 
              onClick={() => navigate('/konsultasi')}
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Konsultasi Online SAKIP <MessageSquare size={18} />
            </button>
          </div>
        </div>
        <div className="banner-icon">
          <ShieldCheck size={120} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card card"
          >
            <div className="stat-card-header">
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <span className="stat-trend">{stat.trend}</span>
            </div>
            <div className="stat-card-body">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-layout">
        {/* Main Section */}
        <div className="main-section">
          <section className="dashboard-section card">
            <div className="section-header">
              <h3>{isAdmin ? 'Monitoring Progress Seluruh OPD' : 'Grafik Pencapaian Instansi'}</h3>
              <button className="btn-text">Selengkapnya <ArrowUpRight size={16} /></button>
            </div>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[75, 45, 90, 60, 30].map((h, i) => (
                  <div key={i} className="bar-wrapper">
                    <div className="bar" style={{ height: `${h}%` }}>
                      <span className="bar-tooltip">{h}%</span>
                    </div>
                    <span className="bar-label">{isAdmin ? `Opd-${i+1}` : `Bulan-${i+1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Section */}
        <div className="side-section">
          <section className="dashboard-section card">
            <div className="section-header">
              <h3>Aktivitas Terbaru</h3>
            </div>
            <div className="activity-list">
              {recentActivities.map((act, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-status ${act.status}`}></div>
                  <div className="activity-info">
                    <p className="activity-title">{act.title}</p>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Banner Styles */
        .welcome-banner {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          padding: 3rem;
          border-radius: var(--radius-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        .welcome-banner h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 1rem 0;
          letter-spacing: -0.025em;
        }

        .welcome-banner p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 500px;
        }

        .banner-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .banner-icon {
          opacity: 0.1;
          transform: rotate(-15deg);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        .stat-trend {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--secondary);
          background: #dcfce7;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .stat-card-body {
          display: flex;
          flex-direction: column;
        }

        /* Dashboard Layout */
        .dashboard-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h3 {
          font-weight: 700;
          color: var(--primary);
        }

        .btn-text {
          color: var(--secondary);
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Chart Placeholder */
        .chart-placeholder {
          height: 250px;
          display: flex;
          align-items: flex-end;
          padding-top: 2rem;
        }

        .chart-bars {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          align-items: flex-end;
          gap: 1rem;
        }

        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .bar {
          width: 100%;
          max-width: 40px;
          background: linear-gradient(to top, var(--secondary), var(--secondary-light));
          border-radius: 6px 6px 0 0;
          position: relative;
          transition: height 1s ease-out;
        }

        .bar:hover {
          filter: brightness(1.1);
        }

        .bar-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          font-size: 0.65rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .bar:hover .bar-tooltip { opacity: 1; }

        .bar-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .activity-status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .activity-status.success { background: var(--success); box-shadow: 0 0 0 4px #dcfce7; }
        .activity-status.pending { background: var(--warning); box-shadow: 0 0 0 4px #fef9c3; }
        .activity-status.error { background: var(--error); box-shadow: 0 0 0 4px #fee2e2; }

        .activity-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-main);
          line-height: 1.4;
        }

        .activity-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}} />
    </div>
  );
}

export default Dashboard;
