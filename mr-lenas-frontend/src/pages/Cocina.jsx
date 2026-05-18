import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUS_NEXT  = { en_preparacion: 'listo', listo: 'entregado' };
const STATUS_LABEL = { pendiente: 'Pendiente', en_preparacion: 'En preparación', listo: 'Listo', entregado: 'Entregado' };

const STATUS_CONFIG = {
  pendiente:      { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)',  icon: '⏳' },
  en_preparacion: { color: '#3b82f6', glow: 'rgba(59,130,246,0.25)',  icon: '🔥' },
  listo:          { color: '#22c55e', glow: 'rgba(34,197,94,0.25)',   icon: '✓'  },
  entregado:      { color: '#6b7280', glow: 'rgba(107,114,128,0.25)', icon: '✓✓' },
};

const BTN_CONFIG = {
  listo:     { bg: '#22c55e', hover: '#16a34a', label: 'Marcar como "Listo"' },
  entregado: { bg: '#c8861a', hover: '#e09820', label: 'Marcar como "Entregado"' },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ck-root {
    min-height: 100vh;
    background: #120a02;
    font-family: 'DM Sans', sans-serif;
    color: #f5deb3;
    padding: 28px 32px 48px;
    position: relative;
    overflow-x: hidden;
  }

  /* Textura de fondo */
  .ck-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      repeating-linear-gradient(108deg, transparent 0px, rgba(200,134,26,0.025) 1px, transparent 2px, transparent 60px),
      repeating-linear-gradient(72deg,  transparent 0px, rgba(255,255,255,0.01)  1px, transparent 2px, transparent 40px);
    pointer-events: none;
    z-index: 0;
  }

  .ck-content { position: relative; z-index: 1; }

  /* ── HEADER ── */
  .ck-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(200,134,26,0.15);
  }

  .ck-header-left { display: flex; align-items: center; gap: 14px; flex: 1; }

  .ck-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: #f5deb3;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  .ck-flame { font-size: 1.4rem; }

  .ck-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(200,134,26,0.15);
    border: 1px solid rgba(200,134,26,0.3);
    color: #c8861a;
    border-radius: 99px;
    padding: 4px 14px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .ck-count-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #c8861a;
    animation: pulse 1.4s ease infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  .ck-refresh {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    background: transparent;
    border: 1px solid rgba(200,134,26,0.25);
    border-radius: 10px;
    color: #7a6040;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ck-refresh:hover {
    border-color: rgba(200,134,26,0.5);
    color: #c8861a;
    background: rgba(200,134,26,0.06);
  }

  .ck-refresh-icon {
    font-size: 1rem;
    display: inline-block;
    transition: transform 0.4s;
  }

  .ck-refresh:hover .ck-refresh-icon { transform: rotate(180deg); }

  /* ── GRID ── */
  .ck-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  /* ── EMPTY STATE ── */
  .ck-empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 14px;
    color: #4a3820;
    text-align: center;
  }

  .ck-empty-icon {
    font-size: 3rem;
    opacity: 0.4;
  }

  .ck-empty-text {
    font-size: 0.9rem;
    letter-spacing: 0.04em;
  }

  /* ── CARD ── */
  .ck-card {
    background: #1a0f04;
    border-radius: 16px;
    border: 1px solid rgba(200,134,26,0.12);
    padding: 0;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: cardIn 0.35s ease both;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .ck-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Barra de color superior */
  .ck-card-bar {
    height: 3px;
    width: 100%;
  }

  .ck-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 14px; }

  /* Cabecera de la card */
  .ck-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .ck-mesa-label {
    font-size: 0.58rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a4030;
    margin-bottom: 2px;
  }

  .ck-mesa-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #f5deb3;
    line-height: 1;
  }

  .ck-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    border: 1px solid;
    margin-top: 2px;
  }

  .ck-badge-icon { font-size: 0.7rem; }

  /* Separador */
  .ck-sep {
    height: 1px;
    background: rgba(200,134,26,0.08);
  }

  /* Items */
  .ck-items { display: flex; flex-direction: column; gap: 6px; }

  .ck-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 8px;
    background: rgba(255,255,255,0.02);
    font-size: 0.87rem;
    color: #c8a87a;
  }

  .ck-item-qty {
    font-weight: 700;
    color: #c8861a;
    font-size: 0.8rem;
    min-width: 26px;
    text-align: center;
    background: rgba(200,134,26,0.1);
    border-radius: 6px;
    padding: 1px 6px;
  }

  .ck-item-name { flex: 1; }

  /* Notas */
  .ck-notes {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 9px 12px;
    background: rgba(245,158,11,0.05);
    border: 1px solid rgba(245,158,11,0.12);
    border-radius: 8px;
    font-size: 0.78rem;
    color: #8a7050;
    line-height: 1.4;
  }

  .ck-notes-icon { font-size: 0.8rem; flex-shrink: 0; margin-top: 1px; }

  /* Tiempo */
  .ck-time {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    color: #4a3820;
    letter-spacing: 0.04em;
  }

  .ck-time::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #c8861a;
    opacity: 0.4;
  }

  /* Footer acción */
  .ck-card-footer { padding: 0 20px 20px; }

  .ck-action-btn {
    width: 100%;
    padding: 11px;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .ck-action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    filter: brightness(1.1);
  }

  .ck-action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ck-btn-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 7px;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

function injectCSS() {
  if (!document.getElementById('ck-css')) {
    const s = document.createElement('style');
    s.id = 'ck-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}

export default function Cocina() {
  injectCSS();

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  const updateStatus = async (orderId, newStatus) => {
    setLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } finally {
      setLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'entregado');

  return (
    <div className="ck-root">
      <div className="ck-content">

        {/* Header */}
        <div className="ck-header">
          <div className="ck-header-left">
            <span className="ck-flame">🔥</span>
            <h2 className="ck-title">Panel de Cocina</h2>
            {activeOrders.length > 0 && (
              <span className="ck-count">
                {/* ✅ L400: span separado del texto con espacio explícito */}
                <span className="ck-count-dot" />{' '}
                {activeOrders.length}{' '}activo{activeOrders.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button className="ck-refresh" onClick={fetchOrders}>
            <span className="ck-refresh-icon">↻</span>
            Actualizar
          </button>
        </div>

        {/* Grid de pedidos */}
        <div className="ck-grid">
          {activeOrders.length === 0 && (
            <div className="ck-empty">
              <span className="ck-empty-icon">🍽️</span>
              <p className="ck-empty-text">No hay pedidos activos en este momento</p>
            </div>
          )}

          {activeOrders.map((order, i) => {
            const cfg     = STATUS_CONFIG[order.status] || STATUS_CONFIG.pendiente;
            const nextKey = STATUS_NEXT[order.status];
            const btnCfg  = nextKey ? BTN_CONFIG[nextKey] : null;

            return (
              <div
                key={order.id}
                className="ck-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Barra de color */}
                <div
                  className="ck-card-bar"
                  style={{ background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)` }}
                />

                <div className="ck-card-body">
                  {/* Cabecera */}
                  <div className="ck-card-header">
                    <div>
                      <div className="ck-mesa-label">Mesa</div>
                      <div className="ck-mesa-num">{order.table_number}</div>
                    </div>
                    <span
                      className="ck-badge"
                      style={{
                        color: cfg.color,
                        borderColor: cfg.glow,
                        background: cfg.glow,
                      }}
                    >
                      <span className="ck-badge-icon">{cfg.icon}</span>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className="ck-sep" />

                  {/* Items */}
                  <ul className="ck-items" style={{ listStyle: 'none', padding: 0 }}>
                    {order.items?.map((item) => (
                      <li key={item.id} className="ck-item">
                        <span className="ck-item-qty">{item.quantity}×</span>
                        <span className="ck-item-name">{item.product?.name}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Notas */}
                  {order.notes && (
                    <div className="ck-notes">
                      <span className="ck-notes-icon">📝</span>
                      {order.notes}
                    </div>
                  )}

                  {/* Tiempo */}
                  <div className="ck-time">
                    {new Date(order.created_at).toLocaleTimeString('es-PE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {/* Botón de acción */}
                {btnCfg && (
                  <div className="ck-card-footer">
                    <button
                      className="ck-action-btn"
                      style={{ background: btnCfg.bg }}
                      onClick={() => updateStatus(order.id, nextKey)}
                      disabled={loading[order.id]}
                    >
                      {loading[order.id] && <span className="ck-btn-spinner" />}
                      {loading[order.id] ? 'Actualizando...' : btnCfg.label}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}