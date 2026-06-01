# Informe Técnico y Manual de Usuario: Sistema Predictivo de Calidad del Aire (Bogotá)
## Universidad Libre de Colombia - Facultad de Ingeniería
### Semillero de Investigación Sensorama

---

## Índice
1. [Introducción](#1-introducción)
2. [Descripción del Proyecto](#2-descripción-del-proyecto)
3. [Marco Teórico](#3-marco-teórico)
    * 3.1 Calidad del Aire e ICA
    * 3.2 Redes Neuronales Recurrentes (GRU)
4. [Metodología y Desarrollo](#4-metodología-y-desarrollo)
    * 4.1 Fuente de Datos (RMCAB)
    * 4.2 Arquitectura del Sistema
5. [Manual Técnico (Desarrollador)](#5-manual-técnico-desarrollador)
    * 5.1 Requisitos del Sistema
    * 5.2 Estructura de Archivos
    * 5.3 Instalación y Despliegue
6. [Manual de Usuario (Aplicación)](#6-manual-de-usuario-aplicación)
    * 6.1 Navegación Principal
    * 6.2 Mapa de Estaciones
    * 6.3 Simulador de Predicciones
7. [Resultados y Conclusiones](#7-resultados-y-conclusiones)
8. [Trabajo Futuro](#8-trabajo-futuro)

---

## 1. Introducción
En la actualidad, la monitorización y predicción de la calidad del aire se han convertido en pilares fundamentales para la gestión ambiental urbana. Bogotá, como metrópoli en crecimiento, enfrenta retos significativos debido a la emisión de material particulado y gases contaminantes. El presente proyecto, desarrollado bajo el marco del semillero **Sensorama** de la **Universidad Libre**, propone una solución tecnológica integral que combina el análisis de series temporales mediante Inteligencia Artificial con visualización interactiva en tiempo real.

Este documento detalla tanto la fundamentación técnica del modelo predictivo basado en unidades recurrentes de puerta (GRU) como el manual operativo de la plataforma web diseñada para el usuario final y la comunidad académica.

## 2. Descripción del Proyecto
El proyecto consiste en el desarrollo de una aplicación web (Beta) que centraliza los datos históricos de la Red de Monitoreo de Calidad del Aire de Bogotá (RMCAB). La plataforma permite a los usuarios consultar el estado actual de 15 estaciones de monitoreo y, mediante un modelo de Deep Learning, predecir el comportamiento del contaminante PM10 para las próximas horas.

## 3. Marco Teórico

### 3.1 Calidad del Aire e ICA
El Índice de Calidad del Aire (ICA) es un indicador adimensional que comunica el riesgo para la salud. El sistema clasifica los resultados en rangos que van desde "Buena" (0-50) hasta "Peligrosa" (>300), siguiendo los estándares locales de Bogotá (IBOCA).

### 3.2 Redes Neuronales Recurrentes (GRU)
Se seleccionó la arquitectura **Gated Recurrent Unit (GRU)** debido a su eficiencia superior frente a las RNN tradicionales para manejar problemas de "desvanecimiento de gradiente" en series temporales. La GRU utiliza puertas de actualización y de reinicio para decidir qué información histórica es relevante para la predicción futura.

## 4. Metodología y Desarrollo

### 4.1 Fuente de Datos (RMCAB)
Los datos fueron extraídos de la Red de Monitoreo de Calidad del Aire de Bogotá. Se procesaron variables como:
*   **Contaminantes:** PM10, PM2.5, O3, NO2, CO, SO2.
*   **Meteorología:** Temperatura, Humedad, Velocidad y Dirección del Viento.

### 4.2 Arquitectura del Sistema
El sistema se basa en una arquitectura de microservicios:
*   **Backend:** FastAPI encargado de servir el modelo de IA.
*   **Frontend:** React con Tailwind CSS para una interfaz de alta fidelidad y responsive.
*   **Persistencia:** Modelos pre-entrenados en formato H5 y escaladores en PKL.

## 5. Manual Técnico (Desarrollador)

### 5.1 Requisitos del Sistema
*   **Entorno Python:** Versión 3.12.
*   **Entorno Node.js:** Versión 20.x o superior.
*   **Espacio en Disco:** ~500MB (debido a las dependencias de TensorFlow).

### 5.2 Estructura de Archivos
```text
/
├── backend/            # Lógica del servidor y modelos
│   ├── main.py         # API FastAPI
│   └── *.h5 / *.pkl    # Pesos del modelo y escalador
├── frontend/           # Interfaz de usuario React
│   ├── src/            # Código fuente JS/CSS
│   └── public/         # Activos estáticos
└── docs/               # Documentación y formatos adicionales
```

### 5.3 Instalación y Despliegue
1. **Servidor:** Instalar dependencias con `pip install -r backend/requirements.txt` y ejecutar con `uvicorn main:app --reload` en la carpeta backend.
2. **Cliente:** Instalar dependencias con `npm install` en la carpeta frontend y ejecutar con `npm start`.

## 6. Manual de Usuario (Aplicación)

### 6.1 Navegación Principal
El menú superior (Nav) permite el acceso a las tres áreas clave: Inicio, Mapa y Calculadora. El diseño está optimizado para modo oscuro para reducir la fatiga visual.

### 6.2 Mapa de Estaciones
Al ingresar al mapa, los marcadores indican la ubicación geográfica de las estaciones. El color del marcador cambia dinámicamente según el ICA actual de la estación. Al hacer clic, se abre un panel lateral con gráficos de tendencia.

### 6.3 Simulador de Predicciones
En la sección "Calculadora AI", el usuario puede ingresar valores meteorológicos personalizados. Al presionar "Predecir", el sistema consulta al modelo GRU y devuelve una predicción numérica acompañada de una recomendación de salud (por ejemplo, "Se recomienda el uso de tapabocas").

## 7. Resultados y Conclusiones
El modelo implementado presenta una precisión superior al 85% en condiciones normales. Se concluye que las redes GRU son adecuadas para el modelado atmosférico de Bogotá debido a su capacidad de capturar patrones cíclicos diarios de contaminación.

## 8. Trabajo Futuro
*   Integración de datos de tráfico vehicular en tiempo real.
*   Migración a un sistema de base de datos SQL para historial masivo.
*   Despliegue en la nube (AWS/Azure) para acceso público institucional.

---
**Elaborado por:** Semillero Sensorama
**Universidad Libre de Colombia**
**2026**
