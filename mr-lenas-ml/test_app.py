import pytest
import json
from unittest.mock import patch, MagicMock
import pandas as pd
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Mock MySQL antes de importar app
with patch('pymysql.connect') as mock_conn:
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_conn.return_value.__enter__ = mock_conn
    mock_conn.return_value.cursor.return_value.__enter__ = lambda s: mock_cursor
    mock_conn.return_value.cursor.return_value.__exit__ = MagicMock()
    mock_conn.return_value.__exit__ = MagicMock()
    from app import app, modelos, df_historial

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# ── Test 1: Health check ──
def test_health(client):
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'ok'
    assert 'modelos' in data

# ── Test 2: Predicción con fecha válida ──
def test_prediccion_fecha_valida(client):
    response = client.get('/prediccion?fecha=2025-06-15')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'predicciones' in data
    assert 'fecha' in data
    assert data['fecha'] == '2025-06-15'

# ── Test 3: Predicción con fecha inválida ──
def test_prediccion_fecha_invalida(client):
    response = client.get('/prediccion?fecha=fecha-mala')
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

# ── Test 4: Predicción sin fecha usa hoy ──
def test_prediccion_sin_fecha(client):
    response = client.get('/prediccion')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'predicciones' in data

# ── Test 5: Historial devuelve lista ──
def test_historial(client):
    response = client.get('/historial')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

# ── Test 6: Historial filtrado por product_id ──
def test_historial_por_producto(client):
    response = client.get('/historial?product_id=1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

# ── Test 7: Modelos entrenados ──
def test_modelos_entrenados():
    assert len(modelos) > 0

# ── Test 8: Predicción es fin de semana ──
def test_prediccion_finde(client):
    response = client.get('/prediccion?fecha=2025-06-21')  # sábado
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['es_finde'] == True

# ── Test 9: Predicción día de semana ──
def test_prediccion_dia_semana(client):
    response = client.get('/prediccion?fecha=2025-06-16')  # lunes
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['es_finde'] == False

# ── Test 10: Predicciones ordenadas de mayor a menor ──
def test_predicciones_ordenadas(client):
    response = client.get('/prediccion?fecha=2025-06-15')
    data = json.loads(response.data)
    predicciones = [p['prediccion'] for p in data['predicciones']]
    assert predicciones == sorted(predicciones, reverse=True)