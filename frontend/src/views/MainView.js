import React from 'react';
import { Nav } from '../components/Nav';
import { Link, useNavigate } from 'react-router-dom';
import { STATIONS } from '../assets/stationsData';

const MainView = () => {
    const navigate = useNavigate();
    const currentHour = new Date().getHours();

    const getICAInfo = (pm10) => {
        if (!pm10) return { cat: 'Sin datos', cls: 'bg-gray-700 text-gray-400', color: '#9e9e94' };
        if (pm10 <= 50) return { cat: 'Buena', cls: 'bg-green-900/40 text-green-400', color: '#4ade80' };
        if (pm10 <= 100) return { cat: 'Moderada', cls: 'bg-yellow-900/40 text-yellow-400', color: '#facc15' };
        if (pm10 <= 150) return { cat: 'Dañina (GS)', cls: 'bg-orange-900/40 text-orange-400', color: '#fb923c' };
        return { cat: 'Dañina', cls: 'bg-red-900/40 text-red-400', color: '#ef4444' };
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
        return { ...station.hourly[closestHour], hour: closestHour };
    };

    return (
        <div className="min-h-screen bg-[#050c09] text-gray-100 selection:bg-[#90BE6D] selection:text-[#0b1a13]">
            <Nav />
            
            <main className="relative pt-20 pb-20 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#1e6b4a]/10 to-transparent pointer-events-none -z-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#90BE6D]/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 -left-24 w-80 h-80 bg-[#1e6b4a]/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c2e26] border border-[#2d4a3d] text-[#90BE6D] text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#90BE6D] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#90BE6D]"></span>
                        </span>
                        Simulación de Monitoreo Basada en Historial
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        Respira el <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#90BE6D] via-white to-[#90BE6D] animate-gradient">Futuro de Bogotá</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                        Plataforma avanzada de predicción de la calidad del aire impulsada por Redes Neuronales GRU. Datos históricos de la RMCAB (IBOCA) para una ciudad más informada.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            to="/map" 
                            className="w-full sm:w-auto px-10 py-5 bg-[#1e6b4a] hover:bg-[#2d9264] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
                        >
                            Ver Mapa Interactivo
                        </Link>
                        <Link 
                            to="/calculator" 
                            className="w-full sm:w-auto px-10 py-5 border-2 border-[#1e3a2e] hover:border-[#90BE6D] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-[#90BE6D]/5 hover:-translate-y-1 active:translate-y-0"
                        >
                            Usar Calculadora AI
                        </Link>
                    </div>

                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-white mb-1">+85%</span>
                            <span className="text-[10px] uppercase font-bold text-[#90BE6D] tracking-widest">Precisión AI</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-white mb-1">15</span>
                            <span className="text-[10px] uppercase font-bold text-[#90BE6D] tracking-widest">Estaciones RMCAB</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-white mb-1">IBOCA</span>
                            <span className="text-[10px] uppercase font-bold text-[#90BE6D] tracking-widest">Fuente de Datos</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-black text-white mb-1">24H</span>
                            <span className="text-[10px] uppercase font-bold text-[#90BE6D] tracking-widest">Ventana Temporal</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Station Grid Section (New) */}
            <section className="py-24 bg-[#0b1a13] border-y border-[#1e3a2e] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex justify-between items-end mb-12">
                        <div className="text-left">
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Estado Actual de la Red</h2>
                            <p className="text-[#90BE6D] font-bold text-sm uppercase tracking-widest opacity-80 mt-2">Valores simulados para las {currentHour}:00h</p>
                        </div>
                        <Link to="/map" className="text-[#90BE6D] text-xs font-bold uppercase tracking-widest hover:underline mb-2">Ver todas en el mapa →</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {Object.entries(STATIONS).map(([name, data]) => {
                            const hourData = getClosestHourData(data, currentHour);
                            const ica = getICAInfo(hourData.pm10);
                            return (
                                <div 
                                    key={name}
                                    onClick={() => navigate('/map', { state: { station: name } })}
                                    className="group bg-[#050c09] p-5 rounded-2xl border border-[#1e3a2e] hover:border-[#90BE6D]/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-[#90BE6D]/5"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="max-w-[120px]">
                                            <h4 className="text-white font-bold text-[11px] uppercase leading-tight truncate group-hover:text-[#90BE6D] transition-colors">{name}</h4>
                                            <p className="text-gray-500 text-[9px] font-bold mt-1">{data.locality}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${ica.cls}`}>
                                            {ica.cat}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1 mt-4">
                                        <span className="text-2xl font-black text-white">{Math.round(hourData.pm10)}</span>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase">µg/m³ PM10</span>
                                    </div>
                                    <div className="h-1 w-full bg-[#1c2e26] rounded-full mt-3 overflow-hidden">
                                        <div 
                                            className="h-full transition-all duration-1000" 
                                            style={{ width: `${Math.min(100, (hourData.pm10 / 150) * 100)}%`, backgroundColor: ica.color }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Feature section */}
            <section className="bg-[#050c09] py-24">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#1c2e26] rounded-xl flex items-center justify-center mx-auto md:mx-0 text-[#90BE6D] shadow-lg border border-[#2d4a3d]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Algoritmos GRU</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Redes neuronales especializadas en secuencias temporales para predecir fluctuaciones en contaminantes gaseosos y particulados.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#1c2e26] rounded-xl flex items-center justify-center mx-auto md:mx-0 text-[#90BE6D] shadow-lg border border-[#2d4a3d]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Análisis RMCAB</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Integración con la Red de Monitoreo de Bogotá, proporcionando un panorama integral de la salud atmosférica distrital.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-[#1c2e26] rounded-xl flex items-center justify-center mx-auto md:mx-0 text-[#90BE6D] shadow-lg border border-[#2d4a3d]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Arquitectura Escalable</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Sistema diseñado para la ingesta masiva de datos y procesamiento asíncrono de modelos de Inteligencia Artificial.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export { MainView };
