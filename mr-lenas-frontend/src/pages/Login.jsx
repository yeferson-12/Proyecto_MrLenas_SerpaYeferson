import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a0e06;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* vetas de madera en el fondo */
  .login-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        108deg,
        transparent 0px,
        rgba(200,134,26,0.03) 1px,
        transparent 2px,
        transparent 60px
      ),
      repeating-linear-gradient(
        72deg,
        transparent 0px,
        rgba(255,255,255,0.015) 1px,
        transparent 2px,
        transparent 40px
      );
    pointer-events: none;
  }

  /* círculo decorativo */
  .login-bg::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,134,26,0.08) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 400px;
    margin: 24px;
    background: #1e1208;
    border: 1px solid rgba(200,134,26,0.2);
    border-radius: 20px;
    padding: 48px 40px 40px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.03),
      0 24px 80px rgba(0,0,0,0.6),
      0 0 40px rgba(200,134,26,0.05);
    animation: loginFadeUp 0.5s ease both;
  }

  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* línea dorada superior */
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #c8861a, transparent);
    border-radius: 99px;
  }

  .login-brand {
    text-align: center;
    margin-bottom: 36px;
  }

  .login-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 95px;
    height: 95px;
    background: rgba(200,134,26,0.12);
    border: 1px solid rgba(200,134,26,0.25);
    border-radius: 14px;
    font-size: 1.6rem;
    margin-bottom: 14px;
  }

  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #f5deb3;
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 0.78rem;
    color: #7a6040;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* separador ornamental */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }
  .login-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(200,134,26,0.15);
  }
  .login-divider-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #c8861a;
    opacity: 0.5;
  }

  .login-field {
    margin-bottom: 18px;
  }

  .login-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7a6040;
    margin-bottom: 8px;
  }

  .login-input {
    width: 100%;
    padding: 12px 16px;
    background: #150d05;
    border: 1px solid rgba(200,134,26,0.15);
    border-radius: 10px;
    color: #f5deb3;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-input::placeholder { color: #4a3820; }
  .login-input:focus {
    border-color: rgba(200,134,26,0.5);
    box-shadow: 0 0 0 3px rgba(200,134,26,0.08);
  }

  .login-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(220,60,40,0.08);
    border: 1px solid rgba(220,60,40,0.2);
    border-radius: 8px;
    color: #e06040;
    font-size: 0.82rem;
    margin-bottom: 18px;
  }

  .login-btn {
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 10px;
    background: #c8861a;
    color: #1a0e06;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 6px;
    position: relative;
    overflow: hidden;
  }
  .login-btn:hover:not(:disabled) {
    background: #e09820;
    box-shadow: 0 4px 20px rgba(200,134,26,0.3);
    transform: translateY(-1px);
  }
  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(26,14,6,0.3);
    border-top-color: #1a0e06;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .login-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 0.72rem;
    color: #4a3820;
    letter-spacing: 0.04em;
  }
`;

function injectLoginCSS() {
  if (!document.getElementById('login-css')) {
    const s = document.createElement('style');
    s.id = 'login-css';
    s.textContent = LOGIN_CSS;
    document.head.appendChild(s);
  }
}

export default function Login({ onLogin }) {
  injectLoginCSS();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">

        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">
  <img src="/logo.png" alt="Mr. Leñas" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
</div>
          <h1 className="login-title">Mr. Leñas</h1>
          <p className="login-subtitle">Sistema de Gestión</p>
        </div>

        {/* Separador */}
        <div className="login-divider">
          <div className="login-divider-line" />
          <div className="login-divider-dot" />
          <div className="login-divider-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Correo electrónico</label>{/* ✅ L294 */}
            <input
              id="login-email"
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@mrlenas.com"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Contraseña</label>{/* ✅ L306 */}
            <input
              id="login-password"
              className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="login-error">
              ⚠ {error}
            </div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading && <span className="login-spinner" />}
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-footer">Mr. Leñas © 2026 · Todos los derechos reservados</p>
      </div>
    </div>
  );
}

// ✅ L248 — PropTypes validation
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};