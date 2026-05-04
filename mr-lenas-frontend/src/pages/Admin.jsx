import { useEffect, useState } from 'react';
import api from '../services/api';

const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .adm-root {
    padding: 24px;
    min-height: calc(100vh - 62px);
    background: #2c1a0e;
    font-family: 'DM Sans', sans-serif;
    color: #f5deb3;
  }

  /* Tabs */
  .adm-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(200,134,26,0.2);
    padding-bottom: 0;
  }
  .adm-tab {
    padding: 10px 24px;
    border: none;
    background: transparent;
    color: #b89060;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.18s;
    letter-spacing: 0.03em;
  }
  .adm-tab:hover { color: #f5deb3; }
  .adm-tab.active {
    color: #f5deb3;
    border-bottom-color: #c8861a;
  }

  /* Header de sección */
  .adm-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .adm-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    color: #f5deb3;
    font-weight: 600;
  }

  /* Botón primario */
  .adm-btn-primary {
    padding: 9px 20px;
    background: #c8861a;
    color: #1a0e06;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.03em;
  }
  .adm-btn-primary:hover { background: #e09820; }

  /* Botones de acción en tabla */
  .adm-btn-edit {
    padding: 5px 12px;
    background: rgba(200,134,26,0.15);
    color: #c8861a;
    border: 1px solid rgba(200,134,26,0.3);
    border-radius: 6px;
    font-size: 0.78rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    margin-right: 6px;
  }
  .adm-btn-edit:hover { background: rgba(200,134,26,0.3); }

  .adm-btn-delete {
    padding: 5px 12px;
    background: rgba(220,60,40,0.1);
    color: #e06040;
    border: 1px solid rgba(220,60,40,0.25);
    border-radius: 6px;
    font-size: 0.78rem;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .adm-btn-delete:hover { background: rgba(220,60,40,0.25); }

  /* Tabla */
  .adm-table-wrap {
    background: #1e1208;
    border-radius: 12px;
    border: 1px solid rgba(200,134,26,0.15);
    overflow: hidden;
  }
  .adm-table {
    width: 100%;
    border-collapse: collapse;
  }
  .adm-table th {
    padding: 13px 18px;
    text-align: left;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c8861a;
    background: rgba(200,134,26,0.08);
    border-bottom: 1px solid rgba(200,134,26,0.15);
  }
  .adm-table td {
    padding: 13px 18px;
    font-size: 0.85rem;
    color: #d4b896;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    vertical-align: middle;
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: rgba(200,134,26,0.04); }

  /* Badge activo/inactivo */
  .adm-badge-active {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 600;
    background: rgba(62,207,142,0.12);
    color: #3ecf8e;
    border: 1px solid rgba(62,207,142,0.25);
  }
  .adm-badge-inactive {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 600;
    background: rgba(150,120,90,0.12);
    color: #8a7060;
    border: 1px solid rgba(150,120,90,0.2);
  }

  /* Badge rol */
  .adm-badge-role {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: rgba(200,134,26,0.12);
    color: #c8861a;
    border: 1px solid rgba(200,134,26,0.25);
  }

  /* Modal overlay */
  .adm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,6,3,0.75);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .adm-modal {
    background: #1e1208;
    border: 1px solid rgba(200,134,26,0.25);
    border-radius: 14px;
    padding: 28px;
    width: 420px;
    max-width: 95vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }
  .adm-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    color: #f5deb3;
    margin-bottom: 20px;
  }

  /* Inputs del modal */
  .adm-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8a7060;
    margin-bottom: 6px;
    margin-top: 14px;
  }
  .adm-label:first-of-type { margin-top: 0; }
  .adm-input, .adm-select {
    width: 100%;
    padding: 10px 14px;
    background: #2c1a0e;
    border: 1px solid rgba(200,134,26,0.2);
    border-radius: 8px;
    color: #f5deb3;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border 0.18s;
  }
  .adm-input:focus, .adm-select:focus {
    border-color: rgba(200,134,26,0.55);
  }
  .adm-select option { background: #2c1a0e; }

  /* Checkbox personalizado */
  .adm-check-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
  }
  .adm-check-row input[type=checkbox] {
    width: 16px; height: 16px;
    accent-color: #c8861a;
    cursor: pointer;
  }
  .adm-check-row label {
    font-size: 0.85rem;
    color: #b89060;
    cursor: pointer;
  }

  /* Botones del modal */
  .adm-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 24px;
  }
  .adm-btn-cancel {
    padding: 9px 20px;
    background: transparent;
    color: #8a7060;
    border: 1px solid rgba(200,134,26,0.2);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.15s;
  }
  .adm-btn-cancel:hover { color: #f5deb3; border-color: rgba(200,134,26,0.4); }

  /* Feedback */
  .adm-msg {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .adm-msg.ok  { background: rgba(62,207,142,0.1); color: #3ecf8e; border: 1px solid rgba(62,207,142,0.2); }
  .adm-msg.err { background: rgba(220,60,40,0.1);  color: #e06040; border: 1px solid rgba(220,60,40,0.2); }

  /* Empty state */
  .adm-empty {
    text-align: center;
    padding: 48px;
    color: #6a5040;
    font-size: 0.88rem;
  }
`;

function injectAdminCSS() {
  if (!document.getElementById('adm-css')) {
    const s = document.createElement('style');
    s.id = 'adm-css';
    s.textContent = ADMIN_CSS;
    document.head.appendChild(s);
  }
}

/* ─── valores por defecto ─── */
const EMPTY_PRODUCT = { name: '', price: '', category: '', is_active: true, image_url: '' };
const EMPTY_USER    = { name: '', email: '', password: '', role: 'cajero' };
const CATEGORIES    = ['Pollos', 'Bebidas', 'Entradas', 'Postres', 'Ensaladas', 'Acompañamientos', 'Otros'];
const ROLES         = ['admin', 'cajero', 'cocinero'];

export default function Admin() {
  injectAdminCSS();

  const [tab, setTab] = useState('productos');

  /* productos */
  const [products, setProducts]   = useState([]);
  const [prodModal, setProdModal] = useState(false);
  const [editProd, setEditProd]   = useState(null);
  const [prodForm, setProdForm]   = useState(EMPTY_PRODUCT);
  const [prodMsg, setProdMsg]     = useState(null);
  const [prodLoading, setProdLoading] = useState(false);

  /* usuarios */
  const [users, setUsers]         = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [editUser, setEditUser]   = useState(null);
  const [userForm, setUserForm]   = useState(EMPTY_USER);
  const [userMsg, setUserMsg]     = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => { fetchProducts(); fetchUsers(); }, []);

  /* ── fetch ── */
  const fetchProducts = async () => {
    try { const r = await api.get('/products/all'); setProducts(r.data); } catch {}
  };
  const fetchUsers = async () => {
    try { const r = await api.get('/users'); setUsers(r.data); } catch {}
  };

  /* ── helpers mensaje ── */
  const flash = (setter, type, text) => {
    setter({ type, text });
    setTimeout(() => setter(null), 3000);
  };

  /* ════ PRODUCTOS ════ */
  const openNewProd = () => {
    setEditProd(null);
    setProdForm(EMPTY_PRODUCT);
    setProdModal(true);
  };
  const openEditProd = (p) => {
    setEditProd(p);
    setProdForm({ name: p.name, price: p.price, category: p.category, is_active: !!p.is_active, image_url: p.image_url || '' });
    setProdModal(true);
  };
  const closeProdModal = () => { setProdModal(false); setEditProd(null); };

  const saveProd = async () => {
    if (!prodForm.name || !prodForm.price || !prodForm.category) {
      flash(setProdMsg, 'err', 'Completa nombre, precio y categoría.');
      return;
    }
    setProdLoading(true);
    try {
      const payload = { ...prodForm, price: parseFloat(prodForm.price) };
      if (editProd) await api.put(`/products/${editProd.id}`, payload);
      else          await api.post('/products', payload);
      flash(setProdMsg, 'ok', editProd ? 'Producto actualizado.' : 'Producto creado.');
      closeProdModal();
      fetchProducts();
    } catch {
      flash(setProdMsg, 'err', 'Error al guardar el producto.');
    } finally {
      setProdLoading(false);
    }
  };

  const deleteProd = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      flash(setProdMsg, 'ok', 'Producto eliminado.');
      fetchProducts();
    } catch {
      flash(setProdMsg, 'err', 'Error al eliminar.');
    }
  };

  /* ════ USUARIOS ════ */
  const openNewUser = () => {
    setEditUser(null);
    setUserForm(EMPTY_USER);
    setUserModal(true);
  };
  const openEditUser = (u) => {
    setEditUser(u);
    setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
    setUserModal(true);
  };
  const closeUserModal = () => { setUserModal(false); setEditUser(null); };

  const saveUser = async () => {
    if (!userForm.name || !userForm.email || (!editUser && !userForm.password)) {
      flash(setUserMsg, 'err', 'Completa nombre, email y contraseña.');
      return;
    }
    setUserLoading(true);
    try {
      const payload = { ...userForm };
      if (editUser && !payload.password) delete payload.password;
      if (editUser) await api.put(`/users/${editUser.id}`, payload);
      else          await api.post('/users', payload);
      flash(setUserMsg, 'ok', editUser ? 'Usuario actualizado.' : 'Usuario creado.');
      closeUserModal();
      fetchUsers();
    } catch {
      flash(setUserMsg, 'err', 'Error al guardar el usuario.');
    } finally {
      setUserLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      flash(setUserMsg, 'ok', 'Usuario eliminado.');
      fetchUsers();
    } catch {
      flash(setUserMsg, 'err', 'Error al eliminar.');
    }
  };

  /* ══ render ══ */
  return (
    <div className="adm-root">

      {/* Tabs */}
      <div className="adm-tabs">
        <button className={`adm-tab${tab === 'productos' ? ' active' : ''}`} onClick={() => setTab('productos')}>
          Productos ({products.length})
        </button>
        <button className={`adm-tab${tab === 'usuarios' ? ' active' : ''}`} onClick={() => setTab('usuarios')}>
          Usuarios ({users.length})
        </button>
      </div>

      {/* ── PRODUCTOS ── */}
      {tab === 'productos' && (
        <>
          <div className="adm-section-header">
            <span className="adm-section-title">Gestión de Productos</span>
            <button className="adm-btn-primary" onClick={openNewProd}>+ Nuevo producto</button>
          </div>

          {prodMsg && <div className={`adm-msg ${prodMsg.type}`}>{prodMsg.text}</div>}

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={6} className="adm-empty">Sin productos registrados.</td></tr>
                )}
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: '#6a5040' }}>{p.id}</td>
                    <td style={{ fontWeight: 500, color: '#f5deb3' }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td style={{ color: '#c8861a', fontWeight: 600 }}>S/ {parseFloat(p.price).toFixed(2)}</td>
                    <td>
                      {p.is_active
                        ? <span className="adm-badge-active">Activo</span>
                        : <span className="adm-badge-inactive">Inactivo</span>
                      }
                    </td>
                    <td>
                      <button className="adm-btn-edit" onClick={() => openEditProd(p)}>Editar</button>
                      <button className="adm-btn-delete" onClick={() => deleteProd(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── USUARIOS ── */}
      {tab === 'usuarios' && (
        <>
          <div className="adm-section-header">
            <span className="adm-section-title">Gestión de Usuarios</span>
            <button className="adm-btn-primary" onClick={openNewUser}>+ Nuevo usuario</button>
          </div>

          {userMsg && <div className={`adm-msg ${userMsg.type}`}>{userMsg.text}</div>}

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={5} className="adm-empty">Sin usuarios registrados.</td></tr>
                )}
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ color: '#6a5040' }}>{u.id}</td>
                    <td style={{ fontWeight: 500, color: '#f5deb3' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="adm-badge-role">{u.role}</span></td>
                    <td>
                      <button className="adm-btn-edit" onClick={() => openEditUser(u)}>Editar</button>
                      <button className="adm-btn-delete" onClick={() => deleteUser(u.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ══ MODAL PRODUCTO ══ */}
      {prodModal && (
        <div className="adm-overlay" onClick={closeProdModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <p className="adm-modal-title">{editProd ? 'Editar producto' : 'Nuevo producto'}</p>

            <label className="adm-label">Nombre</label>
            <input className="adm-input" value={prodForm.name} onChange={e => setProdForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Pollo a la brasa (entero)" />

            <label className="adm-label">Precio (S/)</label>
            <input className="adm-input" type="number" min="0" step="0.10" value={prodForm.price} onChange={e => setProdForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />

            <label className="adm-label">Categoría</label>
            <select className="adm-select" value={prodForm.category} onChange={e => setProdForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Seleccionar...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="adm-label">URL de imagen (opcional)</label>
            <input className="adm-input" value={prodForm.image_url} onChange={e => setProdForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />

            <div className="adm-check-row">
              <input type="checkbox" id="is_active" checked={prodForm.is_active} onChange={e => setProdForm(f => ({ ...f, is_active: e.target.checked }))} />
              <label htmlFor="is_active">Producto activo</label>
            </div>

            <div className="adm-modal-footer">
              <button className="adm-btn-cancel" onClick={closeProdModal}>Cancelar</button>
              <button className="adm-btn-primary" onClick={saveProd} disabled={prodLoading}>
                {prodLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL USUARIO ══ */}
      {userModal && (
        <div className="adm-overlay" onClick={closeUserModal}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <p className="adm-modal-title">{editUser ? 'Editar usuario' : 'Nuevo usuario'}</p>

            <label className="adm-label">Nombre</label>
            <input className="adm-input" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre completo" />

            <label className="adm-label">Email</label>
            <input className="adm-input" type="email" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com" />

            <label className="adm-label">{editUser ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
            <input className="adm-input" type="password" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />

            <label className="adm-label">Rol</label>
            <select className="adm-select" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <div className="adm-modal-footer">
              <button className="adm-btn-cancel" onClick={closeUserModal}>Cancelar</button>
              <button className="adm-btn-primary" onClick={saveUser} disabled={userLoading}>
                {userLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}