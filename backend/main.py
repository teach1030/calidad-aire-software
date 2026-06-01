from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import joblib
import os
from datetime import datetime

app = FastAPI(title="API de Calidad del Aire - Modelo GRU")

# Habilitar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas de los archivos
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "modelo_gru_sensorama.h5")
SCALER_PATH = os.path.join(BASE_DIR, "escalador_datos.pkl")

# Cargar modelo y scaler
model = None
scaler = None

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print("Modelo cargado exitosamente.")
    if os.path.exists(SCALER_PATH):
        scaler = joblib.load(SCALER_PATH)
        print("Scaler cargado exitosamente.")
except Exception as e:
    print(f"Error crítico al cargar recursos: {e}")

class PredictionInput(BaseModel):
    pm10: float
    pm25: float
    o3: float
    no2: float
    co: float
    so2: float
    temperatura: float
    humedad: float
    velocidad_viento: float
    co2: float

class MapPredictionInput(BaseModel):
    localidad: str
    fecha: str
    hora: str
    pm10: float
    pm25: float
    o3: float
    no2: float
    co: float
    so2: float
    temperatura: float
    humedad: float
    velocidad_viento: float
    co2: float

@app.post("/predict")
async def predict(data: PredictionInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Modelo o Scaler no disponibles.")
    
    try:
        # 1. Preparar los datos en el ORDEN CORRECTO del scaler (identificado por medias)
        # 0:CO, 1:WDIR, 2:NO2, 3:O3, 4:WSPD, 5:TEMP, 6:PM25, 7:PM10, 8:HUM, 9:SO2
        features = [
            data.co, 
            192.0, # Wind Direction (Media identificada en el scaler)
            data.no2, 
            data.o3, 
            data.velocidad_viento,
            data.temperatura,
            data.pm25,
            data.pm10,
            data.humedad,
            data.so2
        ]
        input_array = np.array([features])
        
        # 2. Escalar los datos
        scaled_data = scaler.transform(input_array)
        
        # 3. Reshape para el modelo GRU (batch, timesteps=24, features=10)
        model_input = np.repeat(scaled_data[:, np.newaxis, :], 24, axis=1)
        
        # 4. Predicción
        prediction = model.predict(model_input, verbose=0)
        raw_result = float(prediction[0][0])

        # 5. DES-NORMALIZACIÓN (Inverse Transform)
        # Aplicamos formula: (Z * std) + mean para el target (PM10)
        # Parametros extraidos del scaler: mean=26.2045, std=17.7865
        result = (raw_result * 17.7865) + 26.2045
        
        # 6. Clasificación (ICA simplificado)
        if result <= 50: calidad = "Buena"
        elif result <= 100: calidad = "Moderada"
        elif result <= 150: calidad = "Dañina a la salud para grupos sensibles"
        elif result <= 200: calidad = "Dañina a la salud"
        elif result <= 300: calidad = "Muy dañina a la salud"
        else: calidad = "Peligrosa"

        return {
            "prediction": round(result, 2),
            "calidad": calidad,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        }
    except Exception as e:
        print(f"Error en predicción: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_map")
async def predict_map(data: MapPredictionInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Modelo o Scaler no disponibles.")
    
    try:
        # Usar los datos enriquecidos enviados por el frontend (ya perfilados por estación y hora)
        # Orden: 0:CO, 1:WDIR, 2:NO2, 3:O3, 4:WSPD, 5:TEMP, 6:PM25, 7:PM10, 8:HUM, 9:SO2
        features = [
            data.co, 
            data.co2 if data.co2 > 100 else 192.38, # Usamos co2 mapping slot for Wind Direction if needed or just baseline
            data.no2, 
            data.o3, 
            data.velocidad_viento,
            data.temperatura,
            data.pm25,
            data.pm10,
            data.humedad,
            data.so2
        ]
        input_array = np.array([features])
        
        # 2. Escalar los datos
        scaled_data = scaler.transform(input_array)
        
        # 3. Reshape para el modelo GRU (batch, timesteps=24, features=10)
        model_input = np.repeat(scaled_data[:, np.newaxis, :], 24, axis=1)
        
        # 4. Predicción real
        prediction = model.predict(model_input, verbose=0)
        raw_result = float(prediction[0][0])

        # 5. DES-NORMALIZACIÓN (Inverse Transform para PM10)
        result = (raw_result * 17.7865) + 26.2045
        
        # 6. Clasificación ICA
        if result <= 50: calidad = "Buena"
        elif result <= 100: calidad = "Moderada"
        elif result <= 150: calidad = "Dañina a la salud para grupos sensibles"
        elif result <= 200: calidad = "Dañina a la salud"
        elif result <= 300: calidad = "Muy dañina a la salud"
        else: calidad = "Peligrosa"

        return {
            "prediction": round(result, 2),
            "calidad": calidad,
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        }
    except Exception as e:
        print(f"Error en predicción map: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
