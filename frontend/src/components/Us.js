import React from 'react';

const Us = () => {
  const technologies = [
    { name: 'TensorFlow / Keras', type: 'IA (Modelo GRU)' },
    { name: 'FastAPI', type: 'Backend' },
    { name: 'React', type: 'Frontend' },
    { name: 'RMCAB / IBOCA', type: 'Fuente de Datos' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic">
          Sobre el <span className="text-[#90BE6D]">Proyecto</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
          Investigación aplicada al monitoreo y predicción de la calidad del aire en la capital colombiana.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#0b1a13] rounded-[32px] border border-[#1e3a2e] p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#90BE6D]/20 group-hover:bg-[#90BE6D] transition-all"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#90BE6D]/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="relative">
            <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[2rem] bg-[#1c2e26] border border-[#2d4a3d] flex items-center justify-center text-5xl shadow-inner">
              👨‍💻
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#90BE6D] rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-[#0b1a13]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-none">Juan Esteban Guerrero Vera</h2>
              <p className="text-[#90BE6D] font-bold text-sm uppercase tracking-[0.2em] mt-3">Desarrollador e Investigador Principal</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-xl">🎓</span>
                <p className="text-gray-300 font-medium text-lg">Ingeniería de Sistemas (7mo Semestre)</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-xl">🏛️</span>
                <p className="text-gray-400 font-semibold uppercase tracking-widest text-sm italic">Universidad Libre</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1e3a2e] grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              {technologies.map((tech) => (
                <div key={tech.name} className="p-3 rounded-2xl bg-[#050c09] border border-[#1e3a2e]">
                  <div className="text-[10px] font-black text-white truncate">{tech.name}</div>
                  <div className="text-[8px] font-bold text-gray-500 uppercase mt-1">{tech.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-[#1c2e26]/30 rounded-3xl border border-[#2d4a3d] p-8 text-center space-y-6">
        <h3 className="text-white font-bold text-xl">Propósito Técnico</h3>
        <p className="text-gray-400 leading-relaxed font-medium">
          Este sistema integra modelos de aprendizaje profundo <span className="text-white font-bold">(GRU)</span> con datos históricos 
          de la <span className="text-white font-bold">Red de Monitoreo de Calidad del Aire de Bogotá (RMCAB)</span> para proporcionar 
          estimaciones precisas de la concentración de material particulado. El objetivo es ofrecer una herramienta accesible 
          para la toma de decisiones informadas y la prevención de riesgos respiratorios en la población civil.
        </p>
      </div>

      {/* Footer Institution */}
      <div className="text-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sede Bogotá · 2026</p>
      </div>
    </div>
  );
};

export { Us };
