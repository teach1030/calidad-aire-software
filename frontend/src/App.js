import './App.css';
import { MainView } from './views/MainView.js';
import { CalculatorView } from './views/CalculatorView.js';
import { MapView } from './views/MapView.js';
import { UsView } from './views/UsView.js';
import { Login } from './components/Login.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='min-h-screen bg-[#050c09] text-gray-100'>
      <Router>
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/calculator" element={<CalculatorView />} />
          <Route path="/us" element={<UsView />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
