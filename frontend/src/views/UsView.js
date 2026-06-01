import React from 'react';
import { Us } from './../components/Us';
import { Nav } from '../components/Nav';

const UsView = () => {
  return (
    <div className="min-h-screen bg-[#050c09] text-gray-100 font-sans selection:bg-[#90BE6D] selection:text-[#0b1a13]">
      <Nav />
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#1e6b4a]/10 to-transparent pointer-events-none -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#90BE6D]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4">
            <Us />
        </div>
      </div>
    </div>
  );
};

export { UsView };
