import React, { useState } from 'react';

const Calculator = ({ setTotal, setCalidad }) => {
    const [pm10, setPm10] = useState('');
    const [pm25, setPm25] = useState('');
    const [o3, setO3] = useState('');
    const [no2, setNo2] = useState('');
    const [co, setCo] = useState('');
    const [so2, setSo2] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [humedad, setHumedad] = useState('');
    const [velocidadViento, setVelocidadViento] = useState('');
    const [co2, setCo2] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pm10: parseFloat(pm10) || 0,
                    pm25: parseFloat(pm25) || 0,
                    o3: parseFloat(o3) || 0,
                    no2: parseFloat(no2) || 0,
                    co: parseFloat(co) || 0,
                    so2: parseFloat(so2) || 0,
                    temperatura: parseFloat(temperatura) || 0,
                    humedad: parseFloat(humedad) || 0,
                    velocidad_viento: parseFloat(velocidadViento) || 0,
                    co2: parseFloat(co2) || 0,
                    user_token: token
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Error en el servidor');
            }

            const data = await response.json();
            setTotal(data.prediction);
            setCalidad(data.calidad);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-[#1c2e26] border border-[#2d4a3d] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#1e6b4a] transition-all";
    const labelClass = "block text-xs font-semibold uppercase tracking-wider text-[#90BE6D] mb-1.5";

    return (
        <div className="bg-[#0b1a13] p-8 rounded-2xl border border-[#1e3a2e] shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#90BE6D] rounded-full inline-block"></span>
                Parámetros de Entrada
            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>PM10 (µg/m³)</label>
                    <input type="number" step="any" value={pm10} onChange={(e)=>setPm10(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>PM2.5 (µg/m³)</label>
                    <input type="number" step="any" value={pm25} onChange={(e)=>setPm25(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Ozono O3 (ppb)</label>
                    <input type="number" step="any" value={o3} onChange={(e)=>setO3(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Dióxido Nitrógeno NO2 (ppb)</label>
                    <input type="number" step="any" value={no2} onChange={(e)=>setNo2(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Monóxido Carbono CO (ppm)</label>
                    <input type="number" step="any" value={co} onChange={(e)=>setCo(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Dióxido Azufre SO2 (ppb)</label>
                    <input type="number" step="any" value={so2} onChange={(e)=>setSo2(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Temperatura (°C)</label>
                    <input type="number" step="any" value={temperatura} onChange={(e)=>setTemperatura(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Humedad (%)</label>
                    <input type="number" step="any" value={humedad} onChange={(e)=>setHumedad(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Velocidad Viento (m/s)</label>
                    <input type="number" step="any" value={velocidadViento} onChange={(e)=>setVelocidadViento(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Dióxido Carbono CO2 (ppm)</label>
                    <input type="number" step="any" value={co2} onChange={(e)=>setCo2(e.target.value)} placeholder="0.0" className={inputClass} required />
                </div>

                <div className="md:col-span-2 mt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg ${loading ? 'bg-gray-600' : 'bg-[#1e6b4a] hover:bg-[#2d9264] active:scale-[0.98]'}`}
                    >
                        {loading ? 'Procesando Predicción...' : 'Calcular Calidad del Aire'}
                    </button>
                    {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
                </div>
            </form>
        </div>
    );
};

export { Calculator };
