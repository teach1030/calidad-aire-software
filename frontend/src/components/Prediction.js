import React from "react"
import { AirQualityGauge } from "./AirQualityGauge"

const Prediction = ({ total, calidad }) => {

    const getRecommendation = (val) => {
        if (!val) return {
            title: "Esperando cálculo",
            text: "Por favor, ingresa los parámetros ambientales y presiona el botón de calcular.",
            color: "text-gray-400",
            icon: "⏳"
        };
        if (val <= 50) return {
            title: "Calidad Buena",
            text: "Condiciones ideales para actividades al aire libre. Disfruta del aire puro.",
            color: "text-green-400",
            icon: "✅"
        };
        if (val <= 100) return {
            title: "Calidad Moderada",
            text: "La mayoría puede disfrutar de exteriores, pero personas con alta sensibilidad deben estar atentas.",
            color: "text-yellow-400",
            icon: "⚠️"
        };
        if (val <= 150) return {
            title: "Riesgo para la Salud",
            text: "Grupos sensibles (niños, ancianos) deben limitar el esfuerzo físico prolongado al aire libre.",
            color: "text-orange-400",
            icon: "🚫"
        };
        if (val <= 200) return {
            title: "Dañina a la Salud",
            text: "Se recomienda reducir actividades físicas intensas en exteriores para toda la población.",
            color: "text-red-400",
            icon: "🚨"
        };
        return {
            title: "Alerta Ambiental",
            text: "Evita cualquier actividad al aire libre. Mantente en espacios cerrados con filtración de aire.",
            color: "text-purple-400",
            icon: "💀"
        };
    };

    const rec = getRecommendation(total);

    return (
        <div className="bg-[#1c2e26] p-8 rounded-2xl border border-[#2d4a3d] shadow-2xl overflow-hidden relative group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#90BE6D]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#90BE6D]/10 transition-colors"></div>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Gauge Section */}
                <div className="flex-1 w-full max-w-[320px]">
                    <AirQualityGauge total={total} calidad={calidad} />
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#90BE6D] uppercase tracking-[0.2em]">Resultado del Modelo</span>
                        <h2 className="text-3xl font-black text-white tracking-tighter">Análisis Predictivo</h2>
                    </div>

                    <div className="bg-[#050c09] p-6 rounded-2xl border border-[#1e3a2e] relative">
                        <div className="flex items-start gap-4 text-left">
                            <div className="w-12 h-12 bg-[#1c2e26] rounded-xl flex items-center justify-center text-2xl border border-[#2d4a3d] shadow-lg">
                                {rec.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-lg leading-none ${rec.color}`}>{rec.title}</h4>
                                <p className="text-gray-400 text-sm mt-3 leading-relaxed font-medium italic">
                                    "{rec.text}"
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#0b1a13] border border-[#1e3a2e]">
                            <div className="text-[9px] uppercase font-bold text-gray-500 mb-1">Índice Detectado</div>
                            <div className="text-2xl font-black text-white">{total ? Math.round(total) : '—'}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#0b1a13] border border-[#1e3a2e]">
                            <div className="text-[9px] uppercase font-bold text-gray-500 mb-1">Confianza Model</div>
                            <div className="text-2xl font-black text-[#90BE6D]">89%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Prediction }
