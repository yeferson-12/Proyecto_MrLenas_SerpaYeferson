import { useState } from 'react';
import Login from './pages/Login';
import Pedidos from './pages/Pedidos';
import Cocina from './pages/Cocina';
import Admin from './pages/Admin';
import Prediccion from './pages/Prediccion';

const NAV_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    background: #2c1a0e;
    font-family: 'DM Sans', sans-serif;
  }

  .mr-nav {
    display: flex;
    align-items: center;
    height: 62px;
    padding: 0 28px;
    background: linear-gradient(90deg, #1a0e06 0%, #2d1a0a 60%, #3a2010 100%);
    border-bottom: 2px solid #c8861a;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 24px rgba(0,0,0,0.5);
  }

  .mr-nav::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      92deg,
      transparent 0px,
      rgba(255,255,255,0.012) 1px,
      transparent 2px,
      transparent 18px
    );
    pointer-events: none;
  }

  .mr-brand {
    display: flex;
    flex-direction: column;
    margin-right: 28px;
    user-select: none;
  }
  .mr-brand-main {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 1.5rem;
    color: #f5deb3;
    letter-spacing: 0.04em;
    line-height: 1;
    text-shadow: 0 1px 8px rgba(0,0,0,0.4);
  }
  .mr-brand-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 0.72rem;
    color: #c8861a;
    letter-spacing: 0.12em;
    margin-top: 2px;
    text-transform: uppercase;
  }

  .mr-divider {
    width: 1px;
    height: 28px;
    background: linear-gradient(to bottom, transparent, #c8861a55, transparent);
    margin: 0 20px;
  }

  .mr-nav-links {
    display: flex;
    gap: 4px;
  }
  .mr-nav-btn {
    padding: 7px 18px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #b89060;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    transition: all 0.18s;
    position: relative;
  }
  .mr-nav-btn:hover {
    color: #f5deb3;
    background: rgba(200,134,26,0.1);
  }
  .mr-nav-btn.active {
    color: #f5deb3;
    background: rgba(200,134,26,0.18);
    border: 1px solid rgba(200,134,26,0.35);
  }
  .mr-nav-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 20%;
    width: 60%;
    height: 2px;
    background: #c8861a;
    border-radius: 99px;
  }

  .mr-user {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .mr-user-name {
    font-size: 0.82rem;
    color: #b89060;
  }
  .mr-user-name strong {
    color: #f5deb3;
    font-weight: 500;
  }
  .mr-user-role {
    display: inline-block;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c8861a;
    background: rgba(200,134,26,0.12);
    border: 1px solid rgba(200,134,26,0.3);
    padding: 2px 8px;
    border-radius: 99px;
    margin-left: 7px;
  }
  .mr-logout {
    padding: 6px 16px;
    border: 1px solid rgba(200,134,26,0.25);
    border-radius: 6px;
    background: transparent;
    color: #b89060;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
    transition: all 0.18s;
  }
  .mr-logout:hover {
    border-color: rgba(220,80,50,0.5);
    color: #e06040;
    background: rgba(220,80,50,0.08);
  }

  .mr-main {
    min-height: calc(100vh - 62px);
    background: #2c1a0e;
  }
`;

function injectNavStyles() {
  if (!document.getElementById('mr-nav-css')) {
    const s = document.createElement('style');
    s.id = 'mr-nav-css';
    s.textContent = NAV_CSS;
    document.head.appendChild(s);
  }
}

const NAV_ITEMS = [
  { id: 'pedidos',    label: 'Pedidos',    roles: ['admin', 'cajero'] },
  { id: 'cocina',     label: 'Cocina',     roles: ['admin', 'cocinero'] },
  { id: 'admin',      label: 'Admin',      roles: ['admin'] },
  { id: 'prediccion', label: 'Predicción', roles: ['admin'] },
];

export default function App() {
  injectNavStyles();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('user');
    const u = saved ? JSON.parse(saved) : null;
    if (u?.role === 'cocinero') return 'cocina';
    return 'pedidos';
  });

  const handleLogin  = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const visibleItems = NAV_ITEMS.filter(n => n.roles.includes(user.role));

  return (
    <div>
      <nav className="mr-nav">
        <div className="mr-brand">
          <img src="/logo.png" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain', marginRight: '8px' }} />
          <span className="mr-brand-main">Mr. Leñas</span>
        </div>

        <div className="mr-divider" />

        <div className="mr-nav-links">
          {visibleItems.map(n => (
            <button
              key={n.id}
              className={`mr-nav-btn${page === n.id ? ' active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="mr-user">
          <span className="mr-user-name">
            <strong>{user.name}</strong>
            <span className="mr-user-role">{user.role}</span>
          </span>
          <button className="mr-logout" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <main className="mr-main">
        {page === 'pedidos'    && <Pedidos />}
        {page === 'cocina'     && <Cocina />}
        {page === 'admin'      && <Admin />}
        {page === 'prediccion' && <Prediccion />}
      </main>
    </div>
  );
}