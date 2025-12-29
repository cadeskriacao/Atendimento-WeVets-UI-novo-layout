import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Home, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-primary border-b border-primary-800 sticky top-0 z-50 shadow-md">
      <div className="w-full px-4 lg:px-6 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-4">
            <img src="/wevets-logo-2.png" alt="WeVets Logo" className="h-10 w-auto brightness-0 invert cursor-pointer" onClick={onGoHome} />
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 group"
              >
                <Home size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold tracking-wide">Início</span>
              </button>
            )}
          </div>
        </div>

        <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-white text-lg tracking-wide">
          Atendimento WeVets
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-white/80 font-bold text-sm hover:text-white transition-colors">Ajuda</a>

          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-3 cursor-pointer p-1 rounded-full pr-4 transition-all ${isUserMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/20 shadow-inner">
                <User size={20} />
              </div>
              <span className="text-white font-bold text-sm tracking-wide">Dr. Veterinário</span>
              <ChevronDown size={16} className={`text-blue-200 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                <div className="p-4 border-b border-gray-50 flex items-center gap-3 bg-gray-100/50">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-black">
                    DV
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-900 uppercase">Dr. Veterinário</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Médico Veterinário</span>
                  </div>
                </div>

                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors group">
                    <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors">
                      <Settings size={16} />
                    </div>
                    Perfil da Conta
                  </button>
                </div>

                <div className="p-2 border-t border-gray-50">
                  <button
                    onClick={() => window.location.reload()} // Placeholder for Logout
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-status-error hover:bg-red-50 rounded-xl transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors text-status-error">
                      <LogOut size={16} />
                    </div>
                    Sair do Sistema
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

