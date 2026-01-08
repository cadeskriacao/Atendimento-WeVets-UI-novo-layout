import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart, AlertCircle, FileText, Calendar, Play, CheckCircle, X } from 'lucide-react';
import { CartItem } from '../types';
import { Button } from './ui';

interface CartSidebarProps {
    items: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onAction: (action: 'schedule' | 'quote' | 'finalize' | 'cancel' | 'startAttendance') => void;
    isAttendanceMode?: boolean;
    isScheduled?: boolean;
    isInProgress?: boolean;
    canFinalize?: boolean;
    className?: string; // Allow overrides
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ items, onUpdateQuantity, onRemove, onAction, isAttendanceMode = false, isScheduled = false, isInProgress = false, canFinalize = false, className = '' }) => {
    const totalCopay = items.reduce((sum, item) => sum + (item.copay * item.quantity), 0);
    const totalAnticipation = items.reduce((sum, item) => sum + ((item.anticipationFee || 0) * item.quantity), 0);
    const totalLimitFee = items.reduce((sum, item) => sum + ((item.limitFee || 0) * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const grandTotal = totalCopay + totalAnticipation + totalLimitFee;
    const hasPendingFees = totalAnticipation > 0 || totalLimitFee > 0;

    if (items.length === 0 && isAttendanceMode && !isInProgress) {
        return (
            <div className={className}>
                <div className="flex items-center gap-2 mb-3 px-1">
                    <h3 className="font-bold text-gray-900 text-lg">Orçamento</h3>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center h-64 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart size={32} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">O carrinho está vazio</p>
                    <p className="text-xs text-slate-400 mt-2 max-w-[180px]">Adicione serviços da lista ao lado para começar o faturamento</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white flex flex-col h-full rounded-2xl border border-gray-200 overflow-hidden ${className}`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0 z-10 w-full">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">Checkout</h3>
                    {items.length > 0 && <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>}
                </div>
                <button className="text-primary-600 text-xs hover:underline font-medium">Infos. importantes</button>
            </div>

            <div className="p-4 flex-grow overflow-y-auto custom-scrollbar">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                        <ShoppingCart size={48} className="mb-3 opacity-20" />
                        <p className="font-medium text-lg">Carrinho Vazio</p>
                        <p className="text-sm">Adicione serviços ao lado</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="bg-gray-100 rounded p-3 border border-gray-100">
                                <div className="flex items-start gap-3 mb-2">

                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 mb-0.5">{item.code}</div>
                                        <div className="font-medium text-gray-800 text-sm leading-tight mb-2">{item.name}</div>

                                        {/* Exibir antecipação no item se houver */}
                                        {item.anticipationFee && item.anticipationFee > 0 && (
                                            <div className="text-xs text-gray-500 mb-1 flex justify-between">
                                                <span>Antecipação:</span>
                                                <span>R$ {(item.anticipationFee * item.quantity).toFixed(2).replace('.', ',')}</span>
                                            </div>
                                        )}
                                        {/* Exibir compra de limite no item se houver */}
                                        {item.limitFee && item.limitFee > 0 && (
                                            <div className="text-xs text-gray-500 mb-1 flex justify-between">
                                                <span>Compra de limite:</span>
                                                <span>R$ {(item.limitFee * item.quantity).toFixed(2).replace('.', ',')}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center border border-primary-200 rounded bg-white">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="p-1 text-primary-600 hover:bg-primary-50"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-xs font-medium w-6 text-center">{item.quantity.toString().padStart(2, '0')}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="p-1 text-primary-600 hover:bg-primary-50"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button onClick={() => onRemove(item.id)} className="text-primary-400 hover:text-red-500 p-1 border border-primary-200 rounded bg-white">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="text-left text-xs text-gray-500">
                                    Coparticipação: R$ {(item.copay * item.quantity).toFixed(2).replace('.', ',')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                {hasPendingFees && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-start gap-2 text-orange-500">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 fill-orange-100" />
                            <p className="text-xs font-bold leading-tight">
                                Aviso: existem pendências financeiras nestes serviços
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {totalAnticipation > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 font-medium">Antecipação</span>
                                <span className="text-[10px] font-bold text-red-500 border border-red-200 bg-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    Pendências
                                </span>
                            </div>
                            <span className="font-medium text-gray-800">R$ {totalAnticipation.toFixed(2).replace('.', ',')}</span>
                        </div>
                    )}

                    {totalLimitFee > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 font-medium">Compra de limite</span>
                                <span className="text-[10px] font-bold text-red-500 border border-red-200 bg-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    Pendências
                                </span>
                            </div>
                            <span className="font-medium text-gray-800">R$ {totalLimitFee.toFixed(2).replace('.', ',')}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 font-medium">Coparticipação</span>
                        <span className="font-medium text-gray-800">R$ {totalCopay.toFixed(2).replace('.', ',')}</span>
                    </div>

                    <div className="flex justify-between items-end pt-2 mt-2">
                        <span className="text-gray-800 font-bold text-lg">Total</span>
                        <span className="text-gray-900 font-bold text-xl">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                {isAttendanceMode ? (
                    <div className="grid grid-cols-1 gap-3 mt-6">
                        {!isInProgress ? (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="orange"
                                        onClick={() => onAction('quote')}
                                        disabled={items.length === 0}
                                        className="w-full text-sm py-2.5 font-bold"
                                        leftIcon={<FileText size={18} />}
                                    >
                                        Orçamento
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => onAction('schedule')}
                                        disabled={items.length === 0}
                                        className="w-full text-sm py-2.5 border-primary-200 text-primary-700 hover:bg-primary-50 font-bold"
                                        leftIcon={<Calendar size={18} />}
                                    >
                                        Agendar
                                    </Button>
                                </div>
                                <Button
                                    onClick={() => onAction('startAttendance')}
                                    disabled={items.length === 0}
                                    className="w-full text-base py-3 shadow-lg shadow-primary-500/10 font-bold"
                                    leftIcon={<Play size={20} className="fill-current" />}
                                >
                                    Iniciar Atendimento
                                </Button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => onAction('finalize')}
                                    disabled={!canFinalize || items.length === 0}
                                    className="col-span-1 disabled:opacity-50 font-bold shadow-md"
                                    leftIcon={<CheckCircle size={18} />}
                                >
                                    Finalizar
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => onAction('cancel')}
                                    className="col-span-1 text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium border border-gray-200"
                                    leftIcon={<X size={18} />}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Button
                            onClick={() => onAction('schedule')}
                            disabled={items.length === 0}
                            className="col-span-1 disabled:opacity-50"
                            leftIcon={<Calendar size={18} />}
                        >
                            Agendar
                        </Button>
                        <Button
                            variant="orange"
                            onClick={() => onAction('quote')}
                            className="col-span-1"
                            leftIcon={<FileText size={18} />}
                        >
                            Orçamento
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
