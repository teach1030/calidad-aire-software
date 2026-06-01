import React from 'react';

const AirQualityGauge = ({ total, calidad }) => {
    // Normalize value for rotation (assuming 0-300 range for the gauge visual)
    const normalizedVal = Math.min(Math.max(total || 0, 0), 300);
    const rotation = (normalizedVal / 300) * 180 - 90;

    const getICAColor = (val) => {
        if (!val) return '#9e9e94';
        if (val <= 50) return '#4ade80';
        if (val <= 100) return '#facc15';
        if (val <= 150) return '#fb923c';
        if (val <= 200) return '#ef4444';
        return '#a855f7';
    };

    const color = getICAColor(total);

    return (
        <div className="relative flex flex-col items-center justify-center w-full max-w-[280px] mx-auto">
            {/* The SVG Gauge */}
            <div className="relative w-full">
                <svg viewBox="0 0 100 52" className="w-full h-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    {/* Background Track */}
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#050c09"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                    
                    {/* Colored Progress Track with Glow */}
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 - (normalizedVal / 300) * 125.6}
                        className="transition-all duration-1000 ease-out opacity-90"
                    />

                    {/* Pivot point base circle */}
                    <circle cx="50" cy="50" r="6" fill="#1c2e26" stroke="#2d4a3d" strokeWidth="1" />

                    {/* Needle */}
                    <g 
                        style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px' }}
                        className="transition-transform duration-1000 ease-out"
                    >
                        <path d="M 48 50 L 50 10 L 52 50 Z" fill="white" className="drop-shadow-sm" />
                        <circle cx="50" cy="50" r="2.5" fill="#white" />
                    </g>
                </svg>
            </div>

            {/* Repositioned Display: Below the needle pivot to avoid overlap */}
            <div className="mt-2 text-center animate-in fade-in duration-1000 delay-300">
                <div className="text-5xl font-black text-white tracking-tighter leading-none mb-1">
                    {total ? Math.round(total) : '—'}
                </div>
                <div className={`text-[11px] font-black uppercase tracking-[0.25em] px-3 py-0.5 rounded-full inline-block border border-opacity-30`} 
                     style={{ color: color, borderColor: color, backgroundColor: `${color}10` }}>
                    {calidad || 'Sin datos'}
                </div>
            </div>

            {/* Sub-label */}
            <div className="mt-6 flex flex-col items-center gap-1.5 opacity-60">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center leading-tight">
                        Índice de Calidad <br/> del Aire Detectado
                    </span>
                </div>
            </div>
        </div>
    );
};

export { AirQualityGauge };
