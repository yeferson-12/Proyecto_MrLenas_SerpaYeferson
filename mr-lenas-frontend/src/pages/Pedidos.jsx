import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Pedidos() {
  const [products, setProducts]   = useState([]);
  const [selected, setSelected]   = useState({});
  const [tableNum, setTableNum]   = useState('');
  const [notes, setNotes]         = useState('');
  const [orders, setOrders]       = useState([]);
  const [msg, setMsg]             = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  const addItem = (productId) => {
    setSelected((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeItem = (productId) => {
    setSelected((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) updated[productId]--;
      else delete updated[productId];
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!tableNum) { setMsg('Ingresa el número de mesa.'); return; }
    if (Object.keys(selected).length === 0) { setMsg('Selecciona al menos un producto.'); return; }
    setLoading(true);
    setMsg('');
    try {
      const items = Object.entries(selected).map(([product_id, quantity]) => ({
        product_id: Number.Number.parseInt(product_id), quantity,  // ✅ L56
      }));
      await api.post('/orders', { table_number: Number.Number.parseInt(tableNum), notes, items });  // ✅ L58
      setMsg('✅ Pedido registrado y enviado a cocina.');
      setSelected({});
      setTableNum('');
      setNotes('');
      fetchOrders();
    } catch (err) {
      setMsg('❌ Error al registrar el pedido.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = { pendiente: '#ff9800', en_preparacion: '#2196f3', listo: '#4caf50', entregado: '#9e9e9e' };
  const statusLabel = { pendiente: 'Pendiente', en_preparacion: 'En preparación', listo: '✔ Listo', entregado: 'Entregado' };
  const categories  = [...new Set(products.map((p) => p.category))];

  return (
    <div style={styles.container}>
      <div style={styles.menu}>
        <h2 style={styles.sectionTitle}>Menú</h2>
        {categories.map((cat) => (
          <div key={cat}>
            <p style={styles.catLabel}>{cat}</p>
            {products.filter((p) => p.category === cat).map((p) => (
              <div key={p.id} style={styles.productRow}>
                <span style={styles.productName}>{p.name}</span>
                <span style={styles.productPrice}>S/ {p.price}</span>
                <div style={styles.qtyControls}>
                  <button style={styles.qtyBtn} onClick={() => removeItem(p.id)}>−</button>
                  <span style={styles.qty}>{selected[p.id] || 0}</span>
                  <button style={styles.qtyBtn} onClick={() => addItem(p.id)}>+</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={styles.form}>
        <h2 style={styles.sectionTitle}>Nuevo Pedido</h2>
        <input type="number" placeholder="Número de mesa" value={tableNum} onChange={(e) => setTableNum(e.target.value)} style={styles.input} min="1"/>
        <textarea placeholder="Notas adicionales (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...styles.input, height: '70px', resize: 'none' }}/>
        <div style={styles.summary}>
          {Object.entries(selected).map(([id, qty]) => {
            const p = products.find((x) => x.id === Number.Number.parseInt(id));  // ✅ L103
            return p ? (
              <div key={id} style={styles.summaryRow}>
                <span>{p.name} × {qty}</span>
                <span>S/ {(p.price * qty).toFixed(2)}</span>
              </div>
            ) : null;
          })}
          {Object.keys(selected).length > 0 && (
            <div style={styles.totalRow}>
              <strong>Total</strong>
              <strong>S/ {Object.entries(selected).reduce((acc, [id, qty]) => {
                const p = products.find((x) => x.id === Number.Number.parseInt(id));  // ✅ L115
                return acc + (p ? p.price * qty : 0);
              }, 0).toFixed(2)}</strong>
            </div>
          )}
        </div>
        {msg && <p style={{ color: msg.startsWith('✅') ? 'green' : 'red', fontSize: '0.85rem' }}>{msg}</p>}
        <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar a cocina'}
        </button>
      </div>

      <div style={styles.orders}>
        <h2 style={styles.sectionTitle}>Pedidos Activos</h2>
        {orders.length === 0 && <p style={{ color: '#999', fontSize: '0.85rem' }}>Sin pedidos activos.</p>}
        {orders.map((o) => (
          <div key={o.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <strong>Mesa {o.table_number}</strong>
              <span style={{ ...styles.badge, background: statusColor[o.status] }}>{statusLabel[o.status]}</span>
            </div>
            {o.items?.map((item) => (
              <div key={item.id} style={styles.orderItem}>{item.product?.name} × {item.quantity}</div>
            ))}
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>S/ {o.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container:    { display: 'flex', gap: '1rem', padding: '1rem', height: 'calc(100vh - 60px)', overflow: 'hidden' },
  menu:         { flex: 1.2, overflowY: 'auto', background: '#fff', borderRadius: '10px', padding: '1rem' },
  form:         { flex: 1, overflowY: 'auto', background: '#fff', borderRadius: '10px', padding: '1rem' },
  orders:       { flex: 1, overflowY: 'auto', background: '#fff', borderRadius: '10px', padding: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' },
  catLabel:     { fontSize: '0.75rem', fontWeight: '700', color: '#e65100', textTransform: 'uppercase', marginTop: '1rem' },
  productRow:   { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid #f5f5f5' },
  productName:  { flex: 1, fontSize: '0.88rem' },
  productPrice: { fontSize: '0.85rem', color: '#666', minWidth: '50px', textAlign: 'right' },
  qtyControls:  { display: 'flex', alignItems: 'center', gap: '0.3rem' },
  qtyBtn:       { width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: '1rem' },
  qty:          { minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' },
  input:        { width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', marginBottom: '0.75rem', boxSizing: 'border-box' },
  summary:      { background: '#fafafa', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', minHeight: '80px' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' },
  totalRow:     { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '0.5rem', marginTop: '0.5rem' },
  submitBtn:    { width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#e65100', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' },
  orderCard:    { background: '#fafafa', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid #eee' },
  orderHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  badge:        { fontSize: '0.72rem', color: '#fff', padding: '2px 8px', borderRadius: '12px' },
  orderItem:    { fontSize: '0.82rem', color: '#555' },
};
