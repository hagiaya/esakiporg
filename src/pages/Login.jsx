import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck } from 'lucide-react';

import { USERS } from '../constants/opdData';

function Login({ onLogin }) {
  useEffect(() => {
    document.title = "Login | e-SETDA Provinsi Gorontalo";
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin({ name: user.name, role: user.role, code: user.code });
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-overlay"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="login-card glass"
      >
        <div className="login-header">
          <img src="/logo.svg" alt="Logo Gorontalo" className="login-logo" />
          <h1>e-SETDA</h1>
          <p>Provinsi Gorontalo</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Masuk Sistem <ShieldCheck size={18} />
          </button>
        </form>

        <div className="login-footer">
          &copy; 2026 Biro Organisasi Provinsi Gorontalo
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .login-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/login-bg.png');
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .login-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(15, 23, 42, 0.3));
        }

        .login-card {
          width: 420px;
          padding: 3rem;
          border-radius: var(--radius-xl);
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .login-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          margin-top: 1rem;
          letter-spacing: -0.025em;
        }

        .login-header p {
          color: var(--text-muted);
          font-weight: 500;
        }

        .login-logo {
          height: 110px;
          width: 110px;
          margin: 0 auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 16px rgba(109, 40, 217, 0.5));
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          padding: 6px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .input-group input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          transition: var(--transition-base);
        }

        .input-group input:focus {
          outline: none;
          border-color: var(--secondary);
          background: white;
          box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.1);
        }

        .login-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .login-footer {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 1rem;
        }
      `}} />
    </div>
  );
}

export default Login;
