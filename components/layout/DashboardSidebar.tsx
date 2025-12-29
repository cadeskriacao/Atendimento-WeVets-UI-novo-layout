import React from 'react';
import { Calendar, ShoppingBag, LifeBuoy, MapPin, User, LogOut } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    isActive?: boolean;
    isDestructive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick, isActive, isDestructive }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group ${isDestructive
            ? 'text-status-error hover:bg-red-50 hover:text-red-700'
            : isActive
                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100/50'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
    >
        <span className={`transition-colors ${isDestructive ? 'text-status-error' : isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            {icon}
        </span>
        {label}
    </button>
);

interface DashboardSidebarProps {
    currentView?: 'search' | 'sales';
    onNavigate?: (view: 'search' | 'sales') => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentView = 'search', onNavigate }) => {
    return (
        <aside className="w-64 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-4 space-y-1">
                <SidebarItem
                    icon={<Calendar size={20} />}
                    label="Atendimentos"
                    isActive={currentView === 'search'}
                    onClick={() => onNavigate?.('search')}
                />
                <SidebarItem
                    icon={<ShoppingBag size={20} />}
                    label="Vendas"
                    isActive={currentView === 'sales'}
                    onClick={() => onNavigate?.('sales')}
                />
                <SidebarItem icon={<LifeBuoy size={20} />} label="Suporte WeVets" />
                <SidebarItem icon={<MapPin size={20} />} label="Rede Credenciada" />
                <SidebarItem icon={<User size={20} />} label="Meus Dados" />
            </div>

            <div className="mt-auto p-4 border-t border-gray-100">
                <SidebarItem icon={<LogOut size={20} />} label="Sair" isDestructive onClick={() => window.location.reload()} />
            </div>
        </aside>
    );
};
