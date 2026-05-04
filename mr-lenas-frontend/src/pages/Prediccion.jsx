import { useState } from 'react';
import axios from 'axios';

const ml = axios.create({ baseURL: 'http://127.0.0.1:5000' });

export default function Prediccion() {
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha, setFecha]       = useState(hoy);
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const predecir = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ml.get(`/prediccion?fecha=${fecha}`);
      setData(res.data);
    } catch {
      setError('No se pudo conectar con el módulo ML. Verifica que esté corriendo en puerto 5000.');
    } finally {
      setLoading(false);
    }
  };

  const maxPred = data ? Math.max(...data.predicciones.map(p => p.prediccion)) : 1;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Predicción de demanda</h2>
          <p style={s.subtitle}>Modelo de regresión lineal — scikit-learn</p>
        </div>
        <div style={s.controls}>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={s.dateInput}
          />
          <button style={s.btn} onClick={predecir} disabled={loading}>
            {loading ? 'Calculando...' : 'Predecir demanda'}
          </button>
        </div>
      </div>

      {error && <p style={s.error}>{error}</p>}

      {data && (
        <>
          {/* Resumen */}
          <div style={s.resumen}>
            <div style={s.resCard}>
              <span style={s.resLabel}>Fecha</span>
              <span style={s.resValue}>{data.fecha}</span>
            </div>
            <div style={s.resCard}>
              <span style={s.resLabel}>Día</span>
              <span style={s.resValue}>{data.dia}</span>
            </div>
            <div style={s.resCard}>
              <span style={s.resLabel}>Tipo de día</span>
              <span style={{ ...s.resValue, color: data.es_finde ? '#c8861a' : '#4caf50' }}>
                {data.es_finde ? 'Fin de semana' : 'Día de semana'}
              </span>
            </div>
            <div style={s.resCard}>
              <span style={s.resLabel}>Productos analizados</span>
              <span style={s.resValue}>{data.predicciones.length}</span>
            </div>
          </div>

          {/* Tabla de predicciones */}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Producto</th>
                  <th style={s.th}>Unidades previstas</th>
                  <th style={s.th}>Demanda relativa</th>
                </tr>
              </thead>
              <tbody>
                {data.predicciones.map((p, i) => (
                  <tr key={p.product_id} style={{ background: i % 2 === 0 ? 'rgba(200,134,26,0.03)' : 'transparent' }}>
                    <td style={s.td}>{p.product_name}</td>
                    <td style={{ ...s.td, fontWeight: '600', color: '#c8861a' }}>{p.prediccion} uds.</td>
                    <td style={s.td}>
                      <div style={s.barBg}>
                        <div style={{
                          ...s.barFill,
                          width: `${(p.prediccion / maxPred) * 100}%`,
                          background: p.prediccion === maxPred ? '#c8861a' : '#3d2a10',
                        }}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!data && !loading && (
        <div style={s.empty}>
          <p>Selecciona una fecha y haz clic en <strong>Predecir demanda</strong></p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#6a5040' }}>
            El modelo usa regresión lineal entrenado con 180 días de historial de ventas
          </p>
        </div>
      )}
    </div>
  );
}

const s = {
  container:  { padding: '1.5rem', minHeight: 'calc(100vh - 62px)', background: '#2c1a0e', color: '#f5deb3' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title:      { margin: 0, fontSize: '1.4rem', fontWeight: '600', color: '#f5deb3' },
  subtitle:   { margin: '4px 0 0', fontSize: '0.82rem', color: '#8a7060' },
  controls:   { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  dateInput:  { padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(200,134,26,0.3)', background: '#1e1208', color: '#f5deb3', fontSize: '0.9rem' },
  btn:        { padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', background: '#c8861a', color: '#1a0e06', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' },
  error:      { color: '#e06040', fontSize: '0.85rem', marginBottom: '1rem' },
  resumen:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  resCard:    { background: '#1e1208', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(200,134,26,0.15)', display: 'flex', flexDirection: 'column', gap: '4px' },
  resLabel:   { fontSize: '0.72rem', color: '#8a7060', textTransform: 'uppercase', letterSpacing: '0.08em' },
  resValue:   { fontSize: '1.1rem', fontWeight: '600', color: '#f5deb3' },
  tableWrap:  { background: '#1e1208', borderRadius: '12px', border: '1px solid rgba(200,134,26,0.15)', overflow: 'hidden' },
  table:      { width: '100%', borderCollapse: 'collapse' },
  th:         { padding: '12px 18px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8861a', background: 'rgba(200,134,26,0.08)', borderBottom: '1px solid rgba(200,134,26,0.15)' },
  td:         { padding: '12px 18px', fontSize: '0.88rem', color: '#d4b896', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  barBg:      { background: 'rgba(255,255,255,0.06)', borderRadius: '99px', height: '8px', width: '100%' },
  barFill:    { height: '8px', borderRadius: '99px', transition: 'width 0.3s' },
  empty:      { textAlign: 'center', padding: '4rem', color: '#8a7060' },
};