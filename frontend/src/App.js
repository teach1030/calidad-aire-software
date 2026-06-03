import './App.css';
import { MainView } from './views/MainView.js';
import { CalculatorView } from './views/CalculatorView.js';
import { MapView } from './views/MapView.js';
import { UsView } from './views/UsView.js';
import { Login } from './components/Login.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className='min-h-screen bg-[#050c09] text-gray-100'>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/us" element={<UsView />} />

          {/* Rutas Protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainView />
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          } />
          <Route path="/calculator" element={
            <ProtectedRoute>
              <CalculatorView />
            </ProtectedRoute>
          } />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
