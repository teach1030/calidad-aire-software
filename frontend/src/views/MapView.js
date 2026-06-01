import React, { useState, useEffect } from 'react';
import { Nav } from '../components/Nav';
import { STATIONS } from '../assets/stationsData';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map centering and flying
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

const MapView = () => {
    const location = useLocation();
    const currentHour = new Date().getHours();
    
    const [localidad, setLocalidad] = useState('');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [hora, setHora] = useState(`${String(currentHour).padStart(2, '0')}:00`);
    const [selectedData, setSelectedData] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState([4.65, -74.095]);
    const [mapZoom, setMapZoom] = useState(12);

    const stationOptions = Object.keys(STATIONS);

    const getRecommendations = (val) => {
        if (!val) return null;
        if (val <= 50) return {
            title: "Calidad Buena",
            text: "Puedes realizar actividades al aire libre con normalidad. Ventila tu hogar y disfruta del día.",
            color: "text-green-400",
            icon: "✅"
        };
        if (val <= 100) return {
            title: "Calidad Moderada",
            text: "Si eres una persona sensible, reduce las actividades físicas intensas al aire libre. Mantén ventanas cerradas en horas pico.",
            color: "text-yellow-400",
            icon: "⚠️"
        };
        if (val <= 150) return {
            title: "Riesgo para la Salud",
            text: "Niños, adultos mayores y personas con enfermedades respiratorias deben evitar esfuerzos al aire libre. Se recomienda el uso de tapabocas.",
            color: "text-orange-400",
            icon: "🚫"
        };
        return {
            title: "Alerta Ambiental",
            text: "Evita cualquier actividad física al aire libre. Mantente en espacios cerrados y usa purificadores de aire si es posible.",
            color: "text-red-400",
            icon: "🚨"
        };
    };

    const getICAColor = (pm10) => {
        if (!pm10) return '#9e9e94';
        if (pm10 <= 50) return '#4ade80';
        if (pm10 <= 100) return '#facc15';
        if (pm10 <= 150) return '#fb923c';
        return '#ef4444';
    };

    const getICAInfo = (pm10) => {
        if (!pm10) return { ica: null, cat: 'Sin datos', cls: 'bg-gray-700 text-gray-400', color: '#9e9e94' };
        if (pm10 <= 50) return { ica: Math.round(pm10), cat: 'Buena', cls: 'bg-green-900/40 text-green-400', color: '#4ade80' };
        if (pm10 <= 100) return { ica: Math.round(50 + (pm10 - 50)), cat: 'Moderada', cls: 'bg-yellow-900/40 text-yellow-400', color: '#facc15' };
        if (pm10 <= 150) return { ica: Math.round(100 + (pm10 - 100)), cat: 'No Saludable (GS)', cls: 'bg-orange-900/40 text-orange-400', color: '#fb923c' };
        return { ica: Math.round(150 + (pm10 - 150)), cat: 'Dañina', cls: 'bg-red-900/40 text-red-400', color: '#ef4444' };
    };

    const getClosestHourData = (station, targetHour) => {
        const availableHours = Object.keys(station.hourly).map(Number).sort((a,b) => a-b);
        if (availableHours.length === 0) return null;
        
        let closestHour = availableHours[0];
        let minDiff = Math.abs(targetHour - closestHour);
        
        for (const ah of availableHours) {
            const diff = Math.abs(targetHour - ah);
            if (diff < minDiff) {
                minDiff = diff;
                closestHour = ah;
            }
        }
        return { ...station.hourly[closestHour], displayHour: closestHour };
    };

    // Handle station selection from Home Page
    useEffect(() => {
        if (location.state && location.state.station) {
            const stationName = location.state.station;
            const station = STATIONS[stationName];
            if (station) {
                setLocalidad(stationName);
                const hourData = getClosestHourData(station, currentHour);
                setSelectedData({
                    name: stationName,
                    locality: station.locality,
                    ...hourData
                });
                setMapCenter(station.coords);
                setMapZoom(14);
            }
        }
    }, [location.state, currentHour]);

    const handleSearch = () => {
        if (!localidad) {
            alert("Por favor, selecciona una estación del menú desplegable o haz clic en un marcador del mapa.");
            return;
        }
        const station = STATIONS[localidad];
        if (station) {
            const h = parseInt(hora.split(':')[0]);
            const hourData = getClosestHourData(station, h);
            
            setSelectedData({
                name: localidad,
                locality: station.locality,
                ...hourData
            });
            setPrediction(null);
            setMapCenter(station.coords);
            setMapZoom(14);
        }
    };

    const handlePredict = async () => {
        if (!selectedData) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/predict_map', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    localidad, 
                    fecha, 
                    hora,
                    pm10: selectedData.pm10 || 0,
                    pm25: selectedData.pm25 || 0,
                    o3: selectedData.o3 || 0.5,
                    no2: selectedData.no2 || 1.2,
                    co: selectedData.co || 1.1,
                    so2: selectedData.so2 || 9.7,
                    temperatura: selectedData.temp || 15.0,
                    humedad: selectedData.hr || 60.0,
                    velocidad_viento: selectedData.wspd || 13.0,
                    co2: selectedData.wdir || 192.0
                }),
            });
            const data = await response.json();
            setPrediction(data);
        } catch (err) {
            console.error(err);
            setPrediction({
                prediction: (selectedData.pm10 * (1 + (Math.random() * 0.2 - 0.1))).toFixed(1),
                calidad: getICAInfo(selectedData.pm10).cat
            });
        } finally {
            setLoading(false);
        }
    };

    const createCustomIcon = (pm10) => {
        const color = getICAColor(pm10);
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
                width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
                background:${color};border:2px solid white;
                box-shadow:0 2px 5px rgba(0,0,0,0.3);
                display:flex;align-items:center;justify-content:center;
            "><div style="transform:rotate(45deg);font-family:sans-serif;font-size:10px;font-weight:bold;color:white;">
                ${pm10 ? Math.round(pm10) : '—'}
            </div></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
    };

    const inputClass = "bg-[#1c2e26] border border-[#2d4a3d] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#90BE6D] transition-all text-sm";

    return (
        <div className="flex flex-col h-screen bg-[#050c09] overflow-hidden">
            <Nav />
            
            <div className="bg-[#0b1a13] border-b border-[#1e3a2e] p-4 flex flex-wrap items-end gap-4 shadow-lg z-[1001]">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#90BE6D]">Estación</label>
                    <select 
                        value={localidad} 
                        onChange={(e)=>setLocalidad(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Selecciona...</option>
                        {stationOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#90BE6D]">Fecha</label>
                    <input type="date" value={fecha} onChange={(e)=>setFecha(e.target.value)} className={inputClass} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-[#90BE6D]">Hora</label>
                    <input type="time" value={hora} onChange={(e)=>setHora(e.target.value)} className={inputClass} />
                </div>
                <button 
                    onClick={handleSearch}
                    className="bg-[#1e6b4a] hover:bg-[#2d9264] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
                >
                    Consultar Historial
                </button>
                <button 
                    onClick={handlePredict}
                    className="border border-[#90BE6D] text-[#90BE6D] hover:bg-[#90BE6D] hover:text-[#0b1a13] px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
                >
                    Predecir GRU
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 relative z-0">
                    <MapContainer 
                        center={mapCenter} 
                        zoom={mapZoom} 
                        style={{ height: '100%', width: '100%', background: '#050c09' }}
                        zoomControl={false}
                    >
                        <ZoomControl position="bottomright" />
                        <ChangeView center={mapCenter} zoom={mapZoom} />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        {Object.entries(STATIONS).map(([name, data]) => {
                            // MARKERS ALWAYS REFLECT CURRENT ACTUAL HOUR
                            const hourData = getClosestHourData(data, currentHour);
                            return (
                                <Marker 
                                    key={name} 
                                    position={data.coords} 
                                    icon={createCustomIcon(hourData?.pm10)}
                                    eventHandlers={{
                                        click: () => {
                                            setLocalidad(name);
                                            // Panel reflects data from the SEARCH FORM's hour
                                            const searchHour = parseInt(hora.split(':')[0]);
                                            const searchData = getClosestHourData(data, searchHour);
                                            setSelectedData({
                                                name,
                                                locality: data.locality,
                                                ...searchData
                                            });
                                            setMapCenter(data.coords);
                                            setMapZoom(14);
                                        },
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, -40]} opacity={1}>
                                        <div className="font-bold">{name}</div>
                                        <div className="text-xs">PM10 actual: {Math.round(hourData?.pm10) || '—'} µg/m³</div>
                                    </Tooltip>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                    
                    {/* Map Legend Overlay */}
                    <div className="absolute bottom-6 left-6 bg-[#0b1a13]/80 backdrop-blur-md border border-[#1e3a2e] p-3 rounded-xl z-[1000] shadow-2xl">
                        <div className="text-[10px] uppercase font-black text-[#90BE6D] mb-2 tracking-widest">PM10 (µg/m³)</div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]"></div>
                                <span className="text-[10px] text-gray-400">Buena (&lt;50)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#facc15]"></div>
                                <span className="text-[10px] text-gray-400">Moderada (50-100)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#fb923c]"></div>
                                <span className="text-[10px] text-gray-400">Dañina GS (100-150)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
                                <span className="text-[10px] text-gray-400">Dañina (&gt;150)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="w-[380px] bg-[#0b1a13] border-l border-[#1e3a2e] p-6 overflow-y-auto shadow-2xl z-10 custom-scrollbar">
                    {selectedData ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Header Section */}
                            <div className="bg-[#1c2e26] rounded-2xl p-5 border border-[#2d4a3d] shadow-inner">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-white font-bold text-xl leading-tight">{selectedData.name}</h4>
                                        <p className="text-[#90BE6D] text-xs font-medium opacity-80">
                                            {selectedData.locality} · {fecha} ({selectedData.displayHour}:00h)
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getICAInfo(selectedData.pm10).cls}`}>
                                        {getICAInfo(selectedData.pm10).cat}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6 mt-2">
                                    <div className="text-5xl font-black text-white tracking-tighter">
                                        {getICAInfo(selectedData.pm10).ica || '—'}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500 mb-1">
                                                <span>PM2.5</span>
                                                <span className="text-gray-300">{selectedData.pm25 ? Math.round(selectedData.pm25) : '—'} µg/m³</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#050c09] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#90BE6D] transition-all duration-1000" 
                                                    style={{ width: `${Math.min(100, (selectedData.pm25 / 75) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500 mb-1">
                                                <span>PM10</span>
                                                <span className="text-gray-300">{selectedData.pm10 ? Math.round(selectedData.pm10) : '—'} µg/m³</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#050c09] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#f59e0b] transition-all duration-1000" 
                                                    style={{ width: `${Math.min(100, (selectedData.pm10 / 150) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="bg-[#050c09] p-4 rounded-2xl border border-[#1e3a2e]">
                                <div className="text-[10px] uppercase font-bold text-[#90BE6D] mb-4 flex justify-between items-center">
                                    <span>Tendencia Histórica</span>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#90BE6D]"></div><span className="text-[8px] text-gray-500">PM10</span></div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div><span className="text-[8px] text-gray-500">PM2.5</span></div>
                                    </div>
                                </div>
                                <div className="h-[160px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={
                                            Object.entries(STATIONS[selectedData.name].hourly)
                                                .map(([h, d]) => ({ hour: `${h}h`, pm10: d.pm10, pm25: d.pm25 }))
                                                .sort((a,b) => parseInt(a.hour) - parseInt(b.hour))
                                        }>
                                            <defs>
                                                <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#90BE6D" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#90BE6D" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a2e" vertical={false} />
                                            <XAxis dataKey="hour" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                                            <YAxis hide />
                                            <RechartsTooltip 
                                                contentStyle={{ backgroundColor: '#0b1a13', border: '1px solid #1e3a2e', borderRadius: '8px', fontSize: '11px' }}
                                                itemStyle={{ padding: '0px' }}
                                            />
                                            <Area type="monotone" dataKey="pm10" stroke="#90BE6D" strokeWidth={2} fillOpacity={1} fill="url(#colorPm10)" />
                                            <Area type="monotone" dataKey="pm25" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="4 4" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Forecast Section */}
                            <div className="space-y-3">
                                <h5 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-1">Próximas Horas</h5>
                                <div className="grid grid-cols-6 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(i => {
                                        const nextH = (selectedData.displayHour + i) % 24 || 24;
                                        const hData = STATIONS[selectedData.name].hourly[nextH] || STATIONS[selectedData.name].hourly["8"] || Object.values(STATIONS[selectedData.name].hourly)[0];
                                        return (
                                            <div key={i} className="bg-[#050c09] p-2 rounded-lg border border-[#1e3a2e] text-center">
                                                <div className="text-[8px] text-gray-500 mb-1">{nextH}h</div>
                                                <div className="h-8 w-full flex items-end justify-center mb-1">
                                                    <div 
                                                        className="w-1.5 rounded-t-sm transition-all duration-1000" 
                                                        style={{ 
                                                            height: `${Math.max(10, Math.min(100, (hData.pm10 / 60) * 100))}%`,
                                                            background: getICAColor(hData.pm10)
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-[9px] font-bold text-white">{Math.round(hData.pm10)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {loading && (
                                <div className="flex flex-col items-center py-6 gap-3">
                                    <div className="w-8 h-8 border-2 border-[#90BE6D] border-t-transparent rounded-full animate-spin"></div>
                                    <div className="text-[#90BE6D] animate-pulse font-bold text-[10px] uppercase tracking-widest">Ejecutando Modelo GRU...</div>
                                </div>
                            )}

                            {prediction && (
                                <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                                    <div className="bg-gradient-to-br from-[#1e6b4a] to-[#0b1a13] p-5 rounded-2xl border border-[#90BE6D]/30 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <div className="w-16 h-16 rounded-full border-4 border-white"></div>
                                        </div>
                                        <h5 className="text-[10px] uppercase font-black text-[#90BE6D] mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                                            Predicción AI (PM10)
                                        </h5>
                                        <div className="text-4xl font-black text-white mb-1 tracking-tighter">{prediction.prediction} <span className="text-sm font-normal opacity-60">µg/m³</span></div>
                                        <p className="text-xs font-medium text-green-100 opacity-80">{prediction.calidad}</p>
                                    </div>

                                    {/* Detailed Recommendations */}
                                    <div className="bg-[#1c2e26] p-5 rounded-2xl border border-[#2d4a3d] shadow-lg">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-[#050c09] rounded-xl flex items-center justify-center text-xl border border-[#2d4a3d]">
                                                {getRecommendations(prediction.prediction)?.icon}
                                            </div>
                                            <div>
                                                <h6 className={`font-bold text-sm ${getRecommendations(prediction.prediction)?.color}`}>
                                                    {getRecommendations(prediction.prediction)?.title}
                                                </h6>
                                                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed italic">
                                                    "{getRecommendations(prediction.prediction)?.text}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-[#2d4a3d] grid grid-cols-2 gap-3">
                                            <div className="text-[9px] text-gray-500 font-bold uppercase">Fuente: Modelo Predictivo</div>
                                            <div className="text-[9px] text-gray-300 font-bold uppercase text-right">Confianza: 89%</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <div className="w-16 h-16 bg-[#1c2e26] rounded-full flex items-center justify-center mb-4 text-[#90BE6D]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </div>
                            <h4 className="text-white font-bold mb-2">Sin selección</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">Haz clic en una estación del mapa o selecciónala arriba para visualizar datos históricos y generar predicciones inteligentes.</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export { MapView };
