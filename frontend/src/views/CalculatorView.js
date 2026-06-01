import React, { useState } from "react";
import { Prediction } from './../components/Prediction';
import { Instructions } from './../components/Instructions';
import { Calculator } from "../components/Calculator";
import { Nav } from "../components/Nav";

const CalculatorView = () => {
    const [total, setTotal] = useState(null);
    const [calidad, setCalidad] = useState("");

    return (
        <div className="min-h-screen bg-[#050c09] text-gray-100 font-sans selection:bg-[#90BE6D] selection:text-[#0b1a13]">
            <Nav />
            
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24 relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e6b4a]/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#90BE6D]/5 blur-[120px] rounded-full pointer-events-none"></div>

                <header className="mb-16 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c2e26] border border-[#2d4a3d] text-[#90BE6D] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                        Herramienta de Diagnóstico AI
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
                        Simulador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#90BE6D] to-white">Calidad del Aire</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Ingresa parámetros específicos para obtener un análisis profundo generado por nuestra Red Neuronal GRU entrenada con series temporales de la ciudad.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    <div className="lg:col-span-8 space-y-8">
                        <Calculator setTotal={setTotal} setCalidad={setCalidad} />
                        
                        {total !== null && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <Prediction total={total} calidad={calidad} />
                            </div>
                        )}
                    </div>
                    
                    <div className="lg:col-span-4">
                        <aside className="sticky top-24 space-y-6">
                            <div className="bg-[#0b1a13] rounded-3xl border border-[#1e3a2e] p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#90BE6D]/20 group-hover:bg-[#90BE6D] transition-all"></div>
                                <Instructions />
                            </div>

                            <div className="bg-[#1c2e26]/30 rounded-2xl border border-[#2d4a3d] p-6">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Aviso Legal</h4>
                                <p className="text-[10px] text-gray-600 leading-relaxed font-medium">
                                    Esta herramienta es una simulación con fines educativos e investigativos. Los resultados deben ser contrastados con las fuentes oficiales de la Secretaría de Ambiente.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CalculatorView }
