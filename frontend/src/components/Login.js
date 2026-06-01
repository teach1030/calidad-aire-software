import React from 'react';
import { Nav } from './Nav';

const Login = () => {
    return (
        <div className="min-h-screen bg-[#050c09] text-gray-100 flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-[#0b1a13] rounded-3xl border border-[#1e3a2e] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#90BE6D] to-transparent opacity-50"></div>
                    
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#1c2e26] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#2d4a3d] rotate-3 shadow-lg">
                            <span className="text-3xl font-black text-[#90BE6D]">A</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
                        <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder al panel de control de calidad del aire.</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase font-black text-[#90BE6D] tracking-[0.2em] mb-2 ml-1">Usuario / Email</label>
                            <input 
                                type="text" 
                                placeholder="ejemplo@airebogota.co"
                                className="w-full bg-[#1c2e26] border border-[#2d4a3d] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#90BE6D] transition-all shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-black text-[#90BE6D] tracking-[0.2em] mb-2 ml-1">Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-[#1c2e26] border border-[#2d4a3d] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#90BE6D] transition-all shadow-inner"
                            />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs py-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded bg-[#1c2e26] border-[#2d4a3d] text-[#90BE6D] focus:ring-offset-[#0b1a13]" />
                                <span className="text-gray-400 group-hover:text-gray-200 transition-colors">Recordarme</span>
                            </label>
                            <a href="#" className="text-[#90BE6D] font-bold hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button 
                            type="button"
                            className="w-full bg-[#1e6b4a] hover:bg-[#2d9264] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] mt-4"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="mt-10 text-center text-xs text-gray-500 font-medium">
                        ¿No tienes una cuenta? <a href="#" className="text-[#90BE6D] font-bold hover:underline">Regístrate gratis</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Login };
