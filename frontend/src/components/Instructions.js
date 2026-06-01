import React from "react";

const Instructions = () => {
    const steps = [
        { id: 1, text: "Ingresa los valores numéricos para cada parámetro contaminante (PM2.5, PM10, etc)." },
        { id: 2, text: "Asegúrate de incluir datos climáticos como Temperatura y Humedad para mayor precisión." },
        { id: 3, text: "Presiona el botón 'Calcular Calidad del Aire' para ejecutar el modelo GRU." },
        { id: 4, text: "Interpreta el medidor gráfico y lee las recomendaciones de salud personalizadas." }
    ];

    const colors = [
        { label: "Buena", range: "0 - 50", cls: "bg-green-500", text: "Sin riesgos" },
        { label: "Moderada", range: "51 - 100", cls: "bg-yellow-500", text: "Sensibilidad leve" },
        { label: "Dañina GS", range: "101 - 150", cls: "bg-orange-500", text: "Grupos sensibles" },
        { label: "Dañina", range: "151 - 200", cls: "bg-red-500", text: "Evite exteriores" },
        { label: "Muy Mala", range: "201+", cls: "bg-purple-600", text: "Alerta ambiental" }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-[#90BE6D] font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#90BE6D]"></span>
                    Guía de Uso
                </h3>
                <div className="space-y-4">
                    {steps.map((step) => (
                        <div key={step.id} className="flex gap-4 items-start group">
                            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#1c2e26] border border-[#2d4a3d] flex items-center justify-center text-[10px] font-bold text-[#90BE6D] group-hover:border-[#90BE6D] transition-colors">
                                {step.id}
                            </span>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium group-hover:text-gray-200 transition-colors">
                                {step.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-[#1e3a2e]">
                <h3 className="text-[#90BE6D] font-black text-xs uppercase tracking-[0.2em] mb-6">Escala ICA</h3>
                <div className="grid grid-cols-1 gap-2.5">
                    {colors.map((c) => (
                        <div key={c.label} className="flex items-center justify-between p-2.5 rounded-xl bg-[#050c09] border border-[#1e3a2e] hover:border-[#2d4a3d] transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${c.cls} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white uppercase">{c.label}</span>
                                    <span className="text-[9px] text-gray-500 font-bold tracking-wider">{c.text}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 bg-[#1c2e26] px-2 py-0.5 rounded-md border border-[#2d4a3d]">
                                {c.range}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-4 rounded-xl bg-[#1e6b4a]/10 border border-[#1e6b4a]/20">
                <p className="text-[11px] text-gray-500 leading-relaxed italic text-center">
                    "Los resultados son estimaciones generadas por una Red Neuronal Recurrente (GRU) entrenada con datos de la RMCAB."
                </p>
            </div>
        </div>
    );
};

export { Instructions };
