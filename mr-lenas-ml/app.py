from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# ── Datos de entrenamiento simulados (historial de ventas Mr. Leñas) ──
def generar_historial():
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

df_historial = generar_historial()

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
    print("🍗 Mr. Leñas — Módulo ML corriendo en http://localhost:5000")
    app.run(host='0.0.0.0', debug=True, port=5000)