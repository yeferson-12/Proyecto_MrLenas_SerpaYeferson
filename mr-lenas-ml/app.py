from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
import pymysql
import os

app = Flask(__name__)
CORS(app)

# ── Conexión a MySQL ──
def get_connection():
    return pymysql.connect(
        host=os.environ.get('DB_HOST', 'db'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD', 'root'),
        database=os.environ.get('DB_NAME', 'mr_lenas'),
        cursorclass=pymysql.cursors.DictCursor
    )

# ── Leer historial real desde MySQL ──
def cargar_historial():
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT
                    o.created_at AS fecha,
                    oi.product_id,
                    p.name AS product_name,
                    SUM(oi.quantity) AS cantidad
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                JOIN products p ON oi.product_id = p.id
                GROUP BY DATE(o.created_at), oi.product_id, p.name
                ORDER BY fecha ASC
            """)
            rows = cursor.fetchall()
        conn.close()

        if not rows:
            print("⚠️ Sin datos en MySQL, usando historial simulado")
            return generar_historial_simulado()

        df = pd.DataFrame(rows)
        df['fecha'] = pd.to_datetime(df['fecha'])
        df['dia_semana'] = df['fecha'].dt.weekday
        df['dia_mes'] = df['fecha'].dt.day
        df['mes'] = df['fecha'].dt.month
        df['es_finde'] = (df['dia_semana'] >= 4).astype(int)
        df['fecha'] = df['fecha'].dt.strftime('%Y-%m-%d')
        print(f"✅ Historial cargado desde MySQL: {len(df)} registros")
        return df

    except Exception as e:
        print(f"⚠️ Error conectando a MySQL: {e} — usando historial simulado")
        return generar_historial_simulado()

# ── Fallback: datos simulados si MySQL no tiene historial ──
def generar_historial_simulado():
    from datetime import timedelta
    np.random.seed(42)
    productos = {
        1: 'Pollo a la brasa (entero)',
        2: 'Pollo a la brasa (1/2)',
        3: 'Pollo a la brasa (1/4)',
        4: 'Parrilla mixta',
        5: 'Anticuchos',
        6: 'Papas fritas',
        7: 'Ensalada fresca',
        8: 'Inca Kola 500ml',
        9: 'Agua mineral',
        10: 'Chicha morada 1L',
    }
    registros = []
    fecha_inicio = datetime(2025, 1, 1)
    for dia in range(180):
        fecha = fecha_inicio + timedelta(days=dia)
        es_finde = fecha.weekday() >= 4
        for pid, nombre in productos.items():
            base = np.random.randint(8, 25)
            if es_finde:
                base = int(base * 1.6)
            base += int(dia * 0.05)
            cantidad = max(1, base + np.random.randint(-3, 4))
            registros.append({
                'fecha': fecha.strftime('%Y-%m-%d'),
                'dia_semana': fecha.weekday(),
                'dia_mes': fecha.day,
                'mes': fecha.month,
                'es_finde': int(es_finde),
                'product_id': pid,
                'product_name': nombre,
                'cantidad': cantidad,
            })
    return pd.DataFrame(registros)

df_historial = cargar_historial()

# ── Modelo de predicción por producto ──
modelos = {}

def entrenar_modelos():
    for pid in df_historial['product_id'].unique():
        df_prod = df_historial[df_historial['product_id'] == pid].copy()
        X = df_prod[['dia_semana', 'dia_mes', 'mes', 'es_finde']]
        y = df_prod['cantidad']
        modelo = LinearRegression()
        modelo.fit(X, y)
        modelos[pid] = modelo

entrenar_modelos()

# ── Endpoints ──

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'modelos': len(modelos)})

@app.route('/prediccion', methods=['GET'])
def prediccion():
    fecha_str = request.args.get('fecha', datetime.today().strftime('%Y-%m-%d'))
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
    except:
        return jsonify({'error': 'Formato de fecha inválido. Usa YYYY-MM-DD'}), 400

    es_finde = int(fecha.weekday() >= 4)
    features = pd.DataFrame([{
        'dia_semana': fecha.weekday(),
        'dia_mes':    fecha.day,
        'mes':        fecha.month,
        'es_finde':   es_finde,
    }])

    resultados = []
    nombres = df_historial[['product_id', 'product_name']].drop_duplicates()

    for pid, modelo in modelos.items():
        pred = max(1, int(round(float(modelo.predict(features)[0]))))
        nombre = nombres[nombres['product_id'] == pid]['product_name'].values[0]
        resultados.append({
            'product_id':   int(pid),
            'product_name': str(nombre),
            'fecha':        fecha_str,
            'prediccion':   int(pred),
            'es_finde':     bool(es_finde),
        })

    resultados.sort(key=lambda x: x['prediccion'], reverse=True)
    return jsonify({
        'fecha':        fecha_str,
        'dia':          ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'][fecha.weekday()],
        'es_finde':     bool(es_finde),
        'predicciones': resultados,
    })

@app.route('/historial', methods=['GET'])
def historial():
    pid = request.args.get('product_id', type=int)
    if pid:
        df = df_historial[df_historial['product_id'] == pid]
    else:
        df = df_historial
    return jsonify(df.tail(30).to_dict(orient='records'))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🍗 Mr. Leñas — Módulo ML corriendo en http://localhost:{port}")
    app.run(host='0.0.0.0', debug=False, port=port)