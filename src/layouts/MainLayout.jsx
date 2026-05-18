import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  LogOut, 
  Bell, 
  User, 
  Menu,
  ChevronRight,
  ChevronDown,
  X,
  GitBranch,
  Printer,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MainLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { 
      name: isAdmin ? 'Review Perencanaan' : 'Data Perencanaan', 
      icon: <ClipboardCheck size={20} />, 
      path: '/perencanaan',
      submenus: [
        { name: 'Visi Renstra', path: '/perencanaan/visi' },
        { name: 'Sasaran Renstra', path: '/perencanaan/sasaran' },
        { name: 'Perjanjian Kinerja', path: '/perencanaan/pk' }
      ]
    },
    { name: 'Pohon Kinerja', icon: <GitBranch size={20} />, path: '/pohon-kinerja' },
    { name: 'Konsultasi Online', icon: <MessageSquare size={20} />, path: '/konsultasi' },
    { 
      name: 'Pusat Laporan', 
      icon: <Printer size={20} />, 
      path: '/laporan',
      submenus: [
        { name: 'Laporan Renstra', path: '/laporan/renstra' },
        { name: 'Indikator Utama (IKU)', path: '/laporan/iku' },
        { name: 'Perjanjian Kinerja', path: '/laporan/pk' }
      ]
    },
    ...(isAdmin ? [{ name: 'Panel Admin', icon: <ShieldCheck size={20} />, path: '/admin' }] : []),
    { name: 'Pengaturan', icon: <Menu size={20} />, path: '/settings' },
  ];

  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (name) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const renderNavItem = (item, isSubmenu = false) => {
    const hasSubmenus = item.submenus && item.submenus.length > 0;
    const isExpanded = expandedMenus[item.name];

    if (hasSubmenus) {
      return (
        <div key={item.name} className="nav-group">
          <div 
            className={`nav-item ${isExpanded ? 'expanded' : ''}`}
            onClick={() => toggleMenu(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            {(sidebarOpen || isMobile) && <span className="nav-label">{item.name}</span>}
            {(sidebarOpen || isMobile) && (
              isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
          </div>
          
          <AnimatePresence>
            {isExpanded && (sidebarOpen || isMobile) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="submenu-list"
              >
                {item.submenus.map(sub => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                  >
                    <span>{sub.name}</span>
                  </NavLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <NavLink 
        key={item.name} 
        to={item.path} 
        onClick={() => isMobile && setSidebarOpen(false)}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${isSubmenu ? 'submenu-link' : ''}`}
      >
        <span className="nav-icon">{item.icon}</span>
        {(sidebarOpen || isMobile) && <span className="nav-label">{item.name}</span>}
        {(sidebarOpen || isMobile) && !isSubmenu && <ChevronRight size={14} className="nav-arrow" />}
      </NavLink>
    );
  };

  return (
    <div className="layout-wrapper">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''} glass-dark`}>
        <div className="sidebar-header">
          <img src="/logo.svg" alt="Logo Provinsi Gorontalo" className="sidebar-logo" />
          {(sidebarOpen || isMobile) && (
            <div className="brand-text">
              <span className="brand-title">e-SETDA</span>
              <span className="brand-subtitle">Gorontalo Province</span>
            </div>
          )}
          {isMobile && sidebarOpen && (
            <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => renderNavItem(item))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            {(sidebarOpen || isMobile) && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="content-area">
        {/* Header */}
        <header className="main-header glass">
          <div className="header-left">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
              <Menu size={24} />
            </button>
            <h2 className="page-title">{user.name}</h2>
          </div>

          <div className="header-right">
            <button className="icon-badge-btn">
              <Bell size={20} />
              <span className="badge-count">3</span>
            </button>
            
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{isAdmin ? 'Administrator' : 'Petugas OPD'}</span>
              </div>
              <div className="user-avatar">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .layout-wrapper {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        /* Sidebar Styles */
        .sidebar {
          transition: width var(--transition-base);
          display: flex;
          flex-direction: column;
          color: white;
          z-index: 50;
        }

        .sidebar.open { width: 280px; }
        .sidebar.closed { width: 80px; }

        .sidebar-header {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-logo {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(109, 40, 217, 0.4));
          border-radius: 8px;
          background: rgba(255,255,255,0.08);
          padding: 3px;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 800;
          font-size: 1.25rem;
          line-height: 1;
        }

        .brand-subtitle {
          font-size: 0.65rem;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
          color: rgba(255, 255, 255, 0.7);
          transition: all var(--transition-fast);
          gap: 1rem;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: var(--secondary);
          color: white;
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.3);
        }

        .nav-item.expanded {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-icon { flex-shrink: 0; }
        .nav-label { flex: 1; font-weight: 500; }
        .nav-arrow { opacity: 0.5; }

        .nav-group {
          display: flex;
          flex-direction: column;
        }

        .submenu-list {
          padding-left: 3rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow: hidden;
          margin-top: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .submenu-item {
          padding: 0.65rem 1rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          border-left: 2px solid transparent;
        }

        .submenu-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.03);
        }

        .submenu-item.active {
          color: white;
          border-left: 2px solid var(--secondary-light);
          background: rgba(22, 101, 94, 0.1);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          color: #ef4444;
          font-weight: 600;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Content Area Styles */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: var(--background);
        }

        .main-header {
          height: 80px;
          background: white;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          z-index: 40;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .toggle-btn {
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: var(--radius-md);
        }

        .toggle-btn:hover { background: #f1f5f9; }

        .page-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .icon-badge-btn {
          position: relative;
          color: var(--text-muted);
          padding: 0.5rem;
        }

        .badge-count {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--error);
          color: white;
          font-size: 0.65rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border: 2px solid white;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--primary);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
          border: 1px solid #e2e8f0;
        }

        .page-content {
          flex: 1;
          padding: 2.5rem;
          overflow-y: auto;
        }

        /* Mobile Styles */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 100;
        }

        .sidebar.mobile {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 101;
          background: var(--primary);
          width: 280px;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .sidebar.mobile.open {
          transform: translateX(0);
        }

        .close-sidebar-btn {
          margin-left: auto;
          color: white;
          opacity: 0.7;
        }

        @media (max-width: 1024px) {
          .sidebar.closed { display: none; }
          .page-content { padding: 1.5rem; }
          .main-header { padding: 0 1.5rem; }
          .user-name, .user-role { display: none; }
          .page-title { font-size: 1rem; }
        }

        @media (max-width: 640px) {
          .main-header { height: 70px; }
          .page-title { display: none; }
          .header-right { gap: 1rem; }
        }
      `}} />
    </div>
  );
}

export default MainLayout;
