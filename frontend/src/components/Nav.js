import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
    const location = useLocation();
    
    const links = [
        { name: 'Inicio', path: '/' },
        { name: 'Mapa', path: '/map' },
        { name: 'Calculadora', path: '/calculator' },
        { name: 'Nosotros', path: '/us' }
    ];

    return (
        <nav className="bg-[#0b1a13]/80 backdrop-blur-md border-b border-[#1e3a2e] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#90BE6D] rounded-lg flex items-center justify-center">
                        <span className="text-[#0b1a13] font-bold">A</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Aire<span className="text-[#90BE6D]">Bogotá</span></span>
                </div>
                
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-[#90BE6D] ${location.pathname === link.path ? 'text-[#90BE6D]' : 'text-gray-300'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link 
                        to="/login" 
                        className="px-5 py-2 rounded-full border border-[#90BE6D] text-[#90BE6D] text-sm font-semibold hover:bg-[#90BE6D] hover:text-[#0b1a13] transition-all"
                    >
                        Ingresar
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export { Nav };
