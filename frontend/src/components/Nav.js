import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Nav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = !!localStorage.getItem('token');
    
    const links = [
        { name: 'Inicio', path: '/' },
        { name: 'Mapa', path: '/map' },
        { name: 'Calculadora', path: '/calculator' },
        { name: 'Nosotros', path: '/us' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    return (
        <nav className="bg-[#0b1a13]/90 backdrop-blur-md border-b border-[#1e3a2e] sticky top-0 z-[2000]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#90BE6D] rounded-lg flex items-center justify-center">
                        <span className="text-[#0b1a13] font-bold">A</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Aire<span className="text-[#90BE6D]">Bogotá</span></span>
                </div>
                
                {/* Desktop Menu */}
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
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogout}
                            className="px-5 py-2 rounded-full border border-red-500 text-red-500 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link 
                            to="/login" 
                            className="px-5 py-2 rounded-full border border-[#90BE6D] text-[#90BE6D] text-sm font-semibold hover:bg-[#90BE6D] hover:text-[#0b1a13] transition-all"
                        >
                            Ingresar
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-[#90BE6D] p-2 focus:outline-none"
                    >
                        {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isOpen && (
                <div className="md:hidden bg-[#0b1a13] border-b border-[#1e3a2e] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col p-4 gap-4">
                        {links.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-base font-medium py-2 px-4 rounded-lg transition-all ${location.pathname === link.path ? 'bg-[#90BE6D]/10 text-[#90BE6D]' : 'text-gray-300 hover:bg-white/5'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-[#1e3a2e]">
                            {isAuthenticated ? (
                                <button 
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-red-500 font-semibold"
                                >
                                    Cerrar Sesión
                                </button>
                            ) : (
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-4 py-3 text-[#90BE6D] font-semibold"
                                >
                                    Ingresar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export { Nav };
