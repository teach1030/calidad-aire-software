import React, { useState } from 'react';
import { Nav } from './Nav';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        const payload = isRegistering 
            ? { email, password, display_name: displayName }
            : { email, password };

        try {
            const response = await fetch(`https://calidad-aire-software.onrender.com${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Algo salió mal');
            }

            if (isRegistering) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                setIsRegistering(false);
            } else {
                // Guardar token y redirigir
                localStorage.setItem('token', data.idToken);
                localStorage.setItem('userEmail', data.email);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError('Por favor ingresa tu email primero.');
            return;
        }
        try {
            const response = await fetch('https://calidad-aire-software.onrender.com/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Se ha generado un link de recuperación: ' + data.link);
            } else {
                setError(data.detail);
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div className="min-h-screen bg-[#050c09] text-gray-100 flex flex-col">
            <Nav />
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-[#0b1a13] rounded-3xl border border-[#1e3a2e] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#90BE6D] to-transparent opacity-50"></div>
                    
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#1c2e26] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#2d4a3d] rotate-3 shadow-lg">
                            <span className="text-3xl font-black text-[#90BE6D]">{isRegistering ? 'R' : 'A'}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isRegistering ? 'Crea tu cuenta' : 'Bienvenido'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isRegistering ? 'Únete para monitorear el aire en tu zona.' : 'Ingresa tus credenciales para acceder.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500 text-red-200 text-xs p-3 rounded-xl mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {isRegistering && (
                            <div>
                                <label className="block text-[10px] uppercase font-black text-[#90BE6D] tracking-[0.2em] mb-2 ml-1">Nombre</label>
                                <input 
                                    type="text" 
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Tu Nombre"
                                    className="w-full bg-[#1c2e26] border border-[#2d4a3d] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#90BE6D] transition-all"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-[10px] uppercase font-black text-[#90BE6D] tracking-[0.2em] mb-2 ml-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@airebogota.co"
                                className="w-full bg-[#1c2e26] border border-[#2d4a3d] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#90BE6D] transition-all shadow-inner"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase font-black text-[#90BE6D] tracking-[0.2em] mb-2 ml-1">Contraseña</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#1c2e26] border border-[#2d4a3d] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#90BE6D] transition-all shadow-inner"
                                required
                            />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs py-2">
                            {!isRegistering && (
                                <button 
                                    type="button" 
                                    onClick={handleResetPassword}
                                    className="text-[#90BE6D] font-bold hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1e6b4a] hover:bg-[#2d9264] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-xs text-gray-500 font-medium">
                        {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes una cuenta?'} 
                        <button 
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="ml-1 text-[#90BE6D] font-bold hover:underline"
                        >
                            {isRegistering ? 'Inicia sesión' : 'Regístrate gratis'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Login };
