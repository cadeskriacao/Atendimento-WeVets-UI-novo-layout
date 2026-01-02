import React from 'react';
import { Calendar, ShoppingBag, LifeBuoy, MapPin, User, LogOut, Menu } from 'lucide-react';

interface MobileNavbarProps {
    currentView?: 'search' | 'sales';
    onNavigate?: (view: 'search' | 'sales') => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    isDestructive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isDestructive }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full py-2 gap-1 ${isActive ? 'text-primary-600' : isDestructive ? 'text-red-500' : 'text-gray-400'
            }`}
    >
        <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary-50' : ''}`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 20 }) : icon}
        </div>
        <span className="text-[10px] font-bold tracking-wide">{label}</span>
    </button>
);

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentView = 'search', onNavigate }) => {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-4 pb-safe pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <NavItem
                    icon={<Calendar />}
                    label="Atendimentos"
                    isActive={currentView === 'search'}
                    onClick={() => onNavigate?.('search')}
                />
                <NavItem
                    icon={<ShoppingBag />}
                    label="Vendas"
                    isActive={currentView === 'sales'}
                    onClick={() => onNavigate?.('sales')}
                />
                <NavItem
                    icon={<MapPin />}
                    label="Rede"
                />
                <NavItem
                    icon={<User />}
                    label="Perfil"
                />
                <NavItem
                    icon={<LogOut />}
                    label="Sair"
                    isDestructive
                    onClick={() => window.location.reload()}
                />
            </div>
        </nav>
    );
};
