import React from 'react';
import { Smartphone, Plus } from 'lucide-react';

export default function Navbar({ onAddClick }) {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-8">
      <div className="max-w-7xl mx-auto apple-glass rounded-[2.5rem] px-10 py-5 flex justify-between items-center border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20">
            <Smartphone className="text-white" size={28} />
          </div>
          {/* UPDATED: Increased Font Size and Weight */}
          <span className="text-5xl font-black text-white tracking-tighter uppercase ">
            Storage<span className="text-blue-500">Vault</span>
          </span>
        </div>

        <button 
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
        >
          <Plus size={20} />
          <span className="hidden md:inline">Restock Mobile</span>
        </button>
      </div>
    </nav>
  );
}