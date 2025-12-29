import React from 'react';
import { ShoppingCart, ChevronUp } from 'lucide-react';
import { CartItem } from '../types';

interface MobileCartBarProps {
    items: CartItem[];
    onOpenCart: () => void;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({ items, onOpenCart }) => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    // Calculate total including extra fees for the preview
    const totalCost = items.reduce((sum, item) => {
        const copay = item.copay * item.quantity;
        const anticipation = (item.anticipationFee || 0) * item.quantity;
        const limit = (item.limitFee || 0) * item.quantity;
        return sum + copay + anticipation + limit;
    }, 0);

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex items-center justify-between z-40 lg:hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3">
                <div className="bg-primary-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md">
                    {totalItems}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Estimado</span>
                    <span className="font-bold text-primary-900 text-lg">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>

            <button
                onClick={onOpenCart}
                className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95"
            >
                <ShoppingCart size={18} />
                <span>Ver Carrinho</span>
                <ChevronUp size={16} />
            </button>
        </div>
    );
};
