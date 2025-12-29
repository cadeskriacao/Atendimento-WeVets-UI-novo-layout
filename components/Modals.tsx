import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Cat, ShoppingCart, Trash2, Upload, Printer, Info, CheckCircle2, AlertTriangle, Check, ChevronDown, ChevronUp, FileText, MessageCircle } from 'lucide-react';
import { CartItem, ModalType, Pet, Service, Tutor } from '../types';
import { MOCK_BUDGET_ITEMS, MOCK_ATTENDANCE_HISTORY } from '../constants';
import { Button, Input, Select, Badge, Card } from './ui';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
    headerAction?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = "max-w-lg", headerAction }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200">
            <div id="printable-content" className={`bg-white rounded-lg shadow-2xl w-full ${maxWidth} overflow-hidden animate-in zoom-in-95 duration-200 relative`}>
                {title && (
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                        {headerAction && <div className="mr-8">{headerAction}</div>}
                    </div>
                )}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10">
                    <X size={20} />
                </button>
                <div className="p-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Dados Mockados dos serviços já contratados no início do atendimento
const MOCK_CONTRACTED_SERVICES = [
    { name: 'Consulta Clínica Geral', price: 150.00 },
    { name: 'Hemograma Completo', price: 70.00 },
    { name: 'Vacina Antirrábica', price: 90.00 }
];

export const ServiceDetailsModal: React.FC<{
    onClose: () => void;
    onAddService: () => void;
    onFinalize: () => void;
    cartItems: CartItem[];
}> = ({ onClose, onAddService, onFinalize, cartItems }) => {

    const contractedTotal = MOCK_CONTRACTED_SERVICES.reduce((acc, item) => acc + item.price, 0);
    const newServicesTotal = cartItems.reduce((acc, item) => acc + (item.copay * item.quantity), 0);
    const grandTotal = contractedTotal + newServicesTotal;

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalhes do atendimento" maxWidth="max-w-md">
            <div className="p-6 pt-2">
                <div className="mb-4">
                    <p className="font-bold text-gray-800 mb-1">Dia 14/01/2026 às 14:30</p>
                    <p className="text-sm text-gray-600">WeVets - Unidade Jardins (aqui)</p>
                    <p className="text-sm text-gray-600">Rua Augusta, 1234 - Jardins, São Paulo - SP</p>
                </div>

                <div className="w-full border border-primary-200 rounded-md p-3 mb-6">
                    <button className="w-full text-primary-600 text-sm font-medium hover:underline">
                        Ver anamnese
                    </button>
                </div>

                <div className="max-h-[40vh] overflow-y-auto pr-1">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Serviços já contratados</h4>
                    <div className="space-y-3 mb-6">
                        {MOCK_CONTRACTED_SERVICES.map((service, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">{service.name}</span>
                                <span className="font-medium text-gray-600">R$ {service.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="mb-6 animate-in slide-in-from-bottom duration-300">
                            <h4 className="font-bold text-primary-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                Serviços adicionados agora
                            </h4>
                            <div className="space-y-3 bg-primary-50 p-3 rounded-lg border border-primary-100">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-primary-900 font-medium">
                                            {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                                        </span>
                                        <span className="font-bold text-primary-700">R$ {(item.copay * item.quantity).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center mb-8">
                    <span className="font-bold text-gray-800">Total Geral</span>
                    <span className="font-bold text-gray-800 text-lg">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onAddService}
                        className="w-full bg-white border border-primary-300 text-primary-600 font-bold py-3 rounded-md hover:bg-primary-50 transition-colors"
                    >
                        Adicionar serviço
                    </button>
                    <button
                        onClick={onFinalize}
                        className="w-full bg-primary-600 text-white font-bold py-3 rounded-md hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        Finalizar atendimento
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-white border border-primary-300 text-primary-600 font-bold py-3 rounded-md hover:bg-primary-50 transition-colors"
                    >
                        Cancelar atendimento
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export const ConfirmBudgetModal: React.FC<{
    items: CartItem[];
    onClose: () => void;
    onConfirm: () => void;
    isAttendanceMode?: boolean;
}> = ({ items, onClose, onConfirm, isAttendanceMode = false }) => {
    const totalServices = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = items.reduce((acc, item) => acc + (item.copay * item.quantity) + ((item.anticipationFee || 0) * item.quantity) + ((item.limitFee || 0) * item.quantity), 0);

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isAttendanceMode ? "Orçamento para serviços extras" : "Confirmar orçamento"}
            maxWidth="max-w-xl"
            headerAction={
                <button
                    onClick={() => window.print()}
                    className="p-2 text-primary-600 border border-primary-200 rounded hover:bg-primary-50 transition-colors"
                    title="Imprimir / Salvar em PDF"
                >
                    <Printer size={18} />
                </button>
            }
        >
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-100/50">
                <p className="text-sm text-gray-600">Revise os detalhes e valores do orçamento antes de enviar ao tutor</p>
            </div>

            <div className="px-6 py-4 max-h-[40vh] overflow-y-auto">
                {items.map(item => (
                    <div key={item.id} className="mb-6 last:mb-0">
                        <p className="text-xs text-gray-500 mb-1">{item.code}</p>
                        <h4 className="font-bold text-gray-800 text-base mb-3">{item.name}</h4>
                        <div className="space-y-2 bg-gray-100 p-3 rounded-md border border-gray-100">
                            {item.anticipationFee ? (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Antecipação</span>
                                    <span className="font-medium text-gray-800">R$ {(item.anticipationFee * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </div>
                            ) : null}
                            {item.limitFee ? (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Compra de limite</span>
                                    <span className="font-medium text-gray-800">R$ {(item.limitFee * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </div>
                            ) : null}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Coparticipação</span>
                                <span className="font-medium text-gray-800">R$ {(item.copay * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-6 py-5 bg-gray-100 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4 font-bold text-gray-800 text-lg">
                    <span className="text-base font-normal text-gray-600">Total de serviços: {totalServices}</span>
                    <span>Total orçado: R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Observação: Os valores apresentados são estimativas. Valores finais podem variar de acordo com a execução dos serviços.
                </p>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white border border-primary-300 text-primary-600 font-bold py-3 rounded-md hover:bg-primary-50 transition-colors">
                        Voltar
                    </button>
                    {!isAttendanceMode && (
                        <button onClick={onConfirm} className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-md hover:bg-primary-700 transition-colors shadow-sm">
                            Confirmar e enviar
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export const FinalizeModal: React.FC<{
    items: CartItem[];
    onClose: () => void;
    isAttendanceMode?: boolean;
    isFeesPaid?: boolean;
    onCancelProcess?: () => void;
}> = ({ items, onClose, isAttendanceMode = false, isFeesPaid = false, onCancelProcess }) => {

    // Identificar itens com pendências
    const pendingItems = items.filter(item => (item.anticipationFee && item.anticipationFee > 0) || (item.limitFee && item.limitFee > 0));

    // Determinar se há bloqueio ativo (tem pendências e não foi pago)
    const hasPendingFees = pendingItems.length > 0 && !isFeesPaid;

    // Filtrar itens para exibição na lista principal: Se houver bloqueio, remove os itens pendentes da lista visual
    const displayItems = hasPendingFees ? items.filter(item => !pendingItems.includes(item)) : items;

    // Calcular totais baseados nos itens visíveis
    const cartTotal = displayItems.reduce((sum, item) => sum + (item.copay * item.quantity), 0);
    const contractedTotal = isAttendanceMode ? MOCK_CONTRACTED_SERVICES.reduce((acc, item) => acc + item.price, 0) : 0;
    const grandTotal = cartTotal + contractedTotal;

    const totalPending = pendingItems.reduce((acc, item) => {
        const anticipation = item.anticipationFee ? item.anticipationFee * item.quantity : 0;
        const limit = item.limitFee ? item.limitFee * item.quantity : 0;
        return acc + anticipation + limit;
    }, 0);

    return (
        <Modal isOpen={true} onClose={onClose} title="Finalizar atendimento">
            <div className="p-6 pt-2">
                <div className="text-gray-600 mb-6 text-sm">
                    <p className="mb-1"><strong className="text-gray-800">Dia 14/01/2026 às 14:30</strong></p>
                    <p className="mb-1">WeVets - Unidade Jardins (aqui)</p>
                    <p>Rua Augusta, 1234 - Jardins, São Paulo - SP</p>
                </div>

                {/* Warning Banner for Pending Fees */}
                {hasPendingFees && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-5 mb-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex gap-2 items-start mb-4">
                            <AlertTriangle className="text-primary-600 shrink-0 mt-0.5" size={20} />
                            <p className="text-primary-600 font-bold text-base leading-tight">
                                Atenção! Tutor precisa realizar esses pagamentos antes de finalizar o atendimento
                            </p>
                        </div>

                        <div className="space-y-4 mb-5">
                            {pendingItems.map(item => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <span className="font-bold text-gray-800 block mb-0.5">{item.name}</span>
                                        <span className="text-xs text-gray-600">
                                            {item.anticipationFee ? 'Antecipação da Carência:' : 'Compra de Limite:'}
                                        </span>
                                    </div>
                                    <span className="font-bold text-gray-800">
                                        R$ {((item.anticipationFee || 0) + (item.limitFee || 0)).toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-sm font-bold text-gray-900 border-t border-primary-200 pt-3 mb-4">
                            <span>Total</span>
                            <span className="text-lg">R$ {totalPending.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                )}

                <div className="border-t border-b border-gray-100 py-4 mb-6">
                    <div className="flex justify-between font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                        <span>Serviços contratados</span>
                        <span>Coparticipação</span>
                    </div>

                    <div className="space-y-4 text-sm text-gray-600 mb-4 max-h-[30vh] overflow-y-auto pr-2">
                        {isAttendanceMode && (
                            <>
                                {MOCK_CONTRACTED_SERVICES.map((service, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-gray-600">{service.name}</span>
                                        <span className="font-medium text-gray-600">R$ {service.price.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                            </>
                        )}

                        {displayItems.length > 0 && (
                            <div className={`${isAttendanceMode ? "mt-4" : ""}`}>
                                {displayItems.map(item => (
                                    <div key={item.id} className="flex justify-between">
                                        <span className={isAttendanceMode ? "text-gray-800 font-medium" : ""}>
                                            {item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                                        </span>
                                        <span className={`font-medium ${isAttendanceMode ? 'text-gray-800' : 'text-gray-800'}`}>
                                            R$ {(item.copay * item.quantity).toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-lg font-bold bg-gray-100 p-4 rounded-lg border border-gray-100">
                        <span className="text-gray-600">Total</span>
                        <span className="text-primary-600">R$ {grandTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="font-bold text-gray-800 mb-3 text-sm">Forma de pagamento recebida</p>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="payment" className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" disabled={hasPendingFees} />
                            <span className={`group-hover:text-primary-600 transition-colors ${hasPendingFees ? 'text-gray-300' : 'text-gray-700'}`}>PIX</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="payment" className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" disabled={hasPendingFees} />
                            <span className={`group-hover:text-primary-600 transition-colors ${hasPendingFees ? 'text-gray-300' : 'text-gray-700'}`}>Cartão de crédito/débito</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancelProcess ? onCancelProcess : onClose}
                        className="flex-1 bg-white border border-primary-300 text-primary-600 font-bold py-3 rounded-md hover:bg-primary-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onClose}
                        disabled={hasPendingFees}
                        className="flex-[2] bg-primary-600 text-white font-bold py-3 rounded-md hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Finalizar atendimento
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export const CancelAttendanceModal: React.FC<{
    onClose: () => void;
    onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [otherReasonText, setOtherReasonText] = useState<string>('');

    const reasons = [
        { id: 'absent', label: 'Tutor não compareceu / estava em casa' },
        { id: 'other', label: 'Outro motivo' }
    ];

    const isConfirmDisabled = !selectedReason || (selectedReason === 'other' && !otherReasonText.trim());

    return (
        <Modal isOpen={true} onClose={onClose} title="Cancelar atendimento" maxWidth="max-w-md">
            <div className="p-6 pt-2">
                <div className="mb-4">
                    <p className="font-bold text-gray-800 mb-1">Dia 14/01/2026 às 14:30</p>
                    <p className="text-sm text-gray-600">WeVets - Unidade Jardins (aqui)</p>
                    <p className="text-sm text-gray-600">Rua Augusta, 1234 - Jardins, São Paulo - SP</p>
                </div>

                <Button variant="outline" className="w-full mb-6 text-primary-600 border-primary-300">
                    Ver anamnese
                </Button>

                <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Informe o motivo</h4>
                    <div className="space-y-3">
                        {reasons.map(reason => (
                            <button
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id)}
                                className={`w-full p-3 rounded-md border flex items-center justify-center gap-2 font-medium transition-all
                                    ${selectedReason === reason.id
                                        ? 'bg-teal-700 text-white border-teal-700'
                                        : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'
                                    }
                                `}
                            >
                                {selectedReason === reason.id && <Check size={18} />}
                                {reason.label}
                            </button>
                        ))}
                    </div>

                    {selectedReason === 'other' && (
                        <textarea
                            className="w-full mt-3 border border-gray-300 rounded-md p-3 h-24 focus:ring-2 focus:ring-primary-500 outline-none text-sm animate-in fade-in slide-in-from-top-2 duration-200"
                            placeholder="Inclua uma breve descrição do motivo do não-comparecimento"
                            value={otherReasonText}
                            onChange={(e) => setOtherReasonText(e.target.value)}
                        />
                    )}
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={onConfirm}
                        disabled={isConfirmDisabled}
                        className="w-full"
                    >
                        Cancelar atendimento
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full border-primary-300 text-primary-600"
                    >
                        Voltar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const ScheduleModal: React.FC<{ onClose: () => void; onConfirm?: (data: { date: string; time: string; location: 'clinic' | 'home' }) => void }> = ({ onClose, onConfirm }) => {
    const [location, setLocation] = useState<'clinic' | 'home'>('clinic');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm({ date, time, location });
        } else {
            onClose();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Atendimento de serviço">
            <div className="p-6 pt-2">
                <div className="space-y-6 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Data"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            leftIcon={<CalendarIcon size={18} />}
                        />
                        <Input
                            label="Horário"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            leftIcon={<Clock size={18} />}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Local do atendimento</label>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => setLocation('clinic')}
                                className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${location === 'clinic' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${location === 'clinic' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                                    {location === 'clinic' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold text-sm ${location === 'clinic' ? 'text-primary-900' : 'text-gray-700'}`}>Cliente vai até a clínica</p>
                                    <p className="text-xs text-gray-500">O atendimento será realizado na unidade selecionada</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setLocation('home')}
                                className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${location === 'home' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${location === 'home' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                                    {location === 'home' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold text-sm ${location === 'home' ? 'text-primary-900' : 'text-gray-700'}`}>Médico Veterinário irá ao local</p>
                                    <p className="text-xs text-gray-500">Atendimento domiciliar no endereço do tutor</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 text-gray-500 hover:bg-gray-100"
                    >
                        Voltar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-[2] py-4 text-base shadow-lg shadow-primary-500/20"
                    >
                        Confirmar agendamento
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const BudgetDetailsModal: React.FC<{ onClose: () => void; onSchedule: () => void }> = ({ onClose, onSchedule }) => {
    const total = MOCK_BUDGET_ITEMS.reduce((sum, item) => sum + item.price, 0);

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalhes do orçamento">
            <div className="p-6 pt-2">
                {/* Print Only Header */}
                <div className="hidden print:block mb-8 text-center">
                    <div className="bg-[#105393] text-white p-6 -mx-6 -mt-8 mb-6 flex items-center justify-center print:block print:w-[calc(100%+3rem)]">
                        <div className="flex justify-center w-full">
                            <img src="/wevets-logo-2.png" className="h-16 brightness-0 invert object-contain" alt="WeVets Logo" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">WeVets - Unidade Jardins</h2>
                        <p className="text-gray-600">Rua Augusta, 1234 - Jardins, São Paulo - SP</p>
                        <p className="text-gray-600">(11) 99999-9999</p>
                    </div>
                </div>

                <div className="mb-6 text-gray-600 text-sm print:hidden">
                    <p className="mb-1"><strong className="text-gray-800">Dia 14/01/2026 às 14:30</strong></p>
                    <p className="mb-1">WeVets - Unidade Jardins (aqui)</p>
                    <p className="text-sm text-gray-600">Rua Augusta, 1234 - Jardins, São Paulo - SP</p>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Serviços contratados</h4>
                    <div className="space-y-3 print:space-y-1">
                        {MOCK_BUDGET_ITEMS.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-gray-600 border-b border-gray-100 pb-2 text-sm print:border-gray-200">
                                <span>{item.name}</span>
                                <span className="font-medium text-gray-800">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold bg-gray-100 p-4 rounded-lg border border-gray-100 mt-4 print:bg-gray-50 print:border-gray-200">
                        <span className="text-gray-600">Total</span>
                        <span className="text-primary-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="space-y-3 print:hidden">
                    <Button
                        onClick={() => window.print()}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                        leftIcon={<Printer size={18} />}
                    >
                        Imprimir Orçamento
                    </Button>
                    <Button className="w-full">
                        Enviar orçamento ao tutor
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => alert('Orçamento enviado via WhatsApp!')}
                        className="w-full border-green-500 text-green-600 hover:bg-green-50"
                        leftIcon={<MessageCircle size={18} />}
                    >
                        Enviar por WhatsApp
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onSchedule}
                        className="w-full border-primary-300 text-primary-600"
                    >
                        Agendar
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                        Excluir orçamento
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

interface SearchModalProps {
    onClose: () => void;
    onSearch: () => void;
    inputValue?: string;
    onInputChange?: (value: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose, onSearch, inputValue, onInputChange }) => {
    return (
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)] bg-white animate-in fade-in duration-300">
            <div className="max-w-xl w-full text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 tracking-tight">Novo Atendimento</h2>
                <p className="text-gray-500 mb-10 text-base md:text-lg">Localize o pet por meio do CPF do tutor</p>

                <div className="text-left mb-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Digite o CPF do tutor</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <input
                        type="text"
                        placeholder="000.000.000-00"
                        className="flex-1 border border-gray-300 rounded-lg px-6 py-4 text-lg md:text-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all shadow-sm placeholder:text-gray-300"
                        value={inputValue}
                        onChange={(e) => onInputChange?.(e.target.value)}
                    />
                    <Button
                        onClick={onSearch}
                        className="w-full sm:w-auto px-8 py-4 h-auto text-lg hover:shadow-lg justify-center"
                        leftIcon={<span>→</span>}
                    >
                        Pesquisar
                    </Button>
                </div>

                <div className="mt-8 text-left text-sm text-gray-500 border-t border-gray-100 pt-6">
                    <p className="font-bold mb-3 text-gray-400 uppercase tracking-wider text-xs">Cenários de Teste (Refatorado)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => onInputChange?.("111.111.111-11")}>
                            <code className="bg-green-100 px-2 py-1 rounded text-green-700 font-mono text-xs">111.111.111-11</code>
                            <span className="text-gray-700">Fluxo Feliz (1 Pet)</span>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => onInputChange?.("222.222.222-22")}>
                            <code className="bg-blue-100 px-2 py-1 rounded text-blue-700 font-mono text-xs">222.222.222-22</code>
                            <span className="text-gray-700">Múltiplos Pets</span>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => onInputChange?.("333.333.333-33")}>
                            <code className="bg-yellow-100 px-2 py-1 rounded text-yellow-700 font-mono text-xs">333.333.333-33</code>
                            <span className="text-gray-700">Sem Plano (Upsell)</span>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => onInputChange?.("444.444.444-44")}>
                            <code className="bg-red-100 px-2 py-1 rounded text-red-700 font-mono text-xs">444.444.444-44</code>
                            <span className="text-gray-700">Inadimplente (Bloqueio)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export const PetSelectionModal: React.FC<{
    pets: Pet[];
    onSelect: (pet: Pet) => void;
    onClose: () => void;
}> = ({ pets, onSelect, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Selecione o Pet" maxWidth="max-w-2xl">
            <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                    <Card
                        key={pet.id}
                        onClick={() => onSelect(pet)}
                        className="cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4"
                        padding="md"
                    >
                        <img src={pet.image} alt={pet.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                        <div>
                            <h4 className="font-bold text-gray-800">{pet.name}</h4>
                            <p className="text-sm text-gray-600">{pet.type} • {pet.breed}</p>
                            <p className="text-xs text-gray-500 mt-1">{pet.age}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </Modal>
    );
};

import { AnamnesisData } from '../core/domain/attendance';

export const AnamnesisModal: React.FC<{
    onClose: () => void;
    onSave: (data: AnamnesisData) => void;
    initialData?: Partial<AnamnesisData>;
}> = ({ onClose, onSave, initialData }) => {
    const [mainComplaint, setMainComplaint] = useState(initialData?.mainComplaint || '');
    const [historyText, setHistoryText] = useState(JSON.stringify(initialData?.history || {}, null, 2)); // Simplified for now

    const handleSave = () => {
        // Basic mapping for the MVP refactor
        const data: AnamnesisData = {
            mainComplaint,
            history: {
                vaccination: { status: 'unknown' }, // Default for now if not parsed
                // ... parse historyText if needed or keep it simple
            },
            vitals: initialData?.vitals || {},
            systems: initialData?.systems || []
        };
        onSave(data);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Anamnese" maxWidth="max-w-3xl">
            <div className="p-6 pt-2">
                <p className="text-gray-500 mb-6">Preencha os dados da anamnese abaixo.</p>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Queixa principal</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                            placeholder="Descreva o motivo da consulta..."
                            value={mainComplaint}
                            onChange={(e) => setMainComplaint(e.target.value)}
                        ></textarea>
                    </div>
                    {/* Simplified for brevity in this refactor step */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Histórico (JSON temp)</label>
                        <textarea
                            className="w-full border border-gray-200 rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                            value={historyText}
                            onChange={(e) => setHistoryText(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="text-primary-600 hover:bg-primary-50">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                        Salvar Anamnese
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const GracePeriodModal: React.FC<{
    service: Service | null;
    onClose: () => void;
    onAddToBudget: (fee: number) => void;
}> = ({ service, onClose, onAddToBudget }) => {
    if (!service) return null;
    const anticipationFee = 300.00; // Mock fee updated to match screenshot

    return (
        <Modal isOpen={true} onClose={onClose} title="Carência Identificada">
            <div className="p-6 pt-2">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
                    <div className="bg-orange-100 p-1.5 rounded-full text-orange-600 mt-0.5">
                        <Clock size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-orange-800 text-sm mb-1">Serviço em período de carência</h4>
                        <p className="text-orange-700 text-sm">
                            Este serviço possui carência de 60 dias. Para realizar o atendimento agora, é necessário pagar uma taxa de antecipação.
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-2">{service.name}</h4>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Valor da antecipação</span>
                        <span className="font-bold text-gray-800">R$ {anticipationFee.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button variant="outline" onClick={() => onAddToBudget(anticipationFee)} className="w-full border-primary-300 text-primary-600">
                        Adicionar ao orçamento
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-700">
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const LimitExceededModal: React.FC<{
    service: Service | null;
    onClose: () => void;
    onAddToBudget: (fee: number) => void;
}> = ({ service, onClose, onAddToBudget }) => {
    if (!service) return null;
    const limitFee = 300.00; // Mock fee updated to match screenshot style

    return (
        <Modal isOpen={true} onClose={onClose} title="Limite Excedido">
            <div className="p-6 pt-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
                    <div className="bg-red-100 p-1.5 rounded-full text-red-600 mt-0.5">
                        <AlertTriangle size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 text-sm mb-1">Limite de uso atingido</h4>
                        <p className="text-red-700 text-sm">
                            O limite anual para este serviço foi atingido. Para realizar o atendimento, é necessário comprar limite adicional.
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-2">{service.name}</h4>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Valor do limite extra</span>
                        <span className="font-bold text-gray-800">R$ {limitFee.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button variant="outline" onClick={() => onAddToBudget(limitFee)} className="w-full border-primary-300 text-primary-600">
                        Adicionar ao orçamento
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-700">
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const NoCoverageModal: React.FC<{
    service: Service | null;
    onClose: () => void;
}> = ({ service, onClose }) => {
    if (!service) return null;

    return (
        <Modal isOpen={true} onClose={onClose} title="Sem Cobertura">
            <div className="p-6 pt-2">
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
                    <div className="bg-gray-200 p-1.5 rounded-full text-gray-600 mt-0.5">
                        <Info size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Serviço fora do plano contratado</h4>
                        <p className="text-gray-600 text-sm">
                            Este serviço não está coberto pelo plano atual do pet (Plano Básico). O serviço está disponível no Plano Super.
                        </p>
                    </div>
                </div>

                <div className="mb-6 text-center">
                    <h4 className="font-bold text-gray-800 text-lg mb-1">Ofereça um Upgrade!</h4>
                    <p className="text-gray-500 text-sm">O cliente pode migrar para o Plano Super e ter acesso imediato.</p>
                </div>

                <div className="space-y-3">
                    <Button variant="ghost" onClick={onClose} className="w-full text-gray-500 hover:text-gray-700">
                        Voltar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
export const UpdateWeightModal: React.FC<{
    currentWeight: string;
    onClose: () => void;
    onSave: (newWeight: string) => void;
}> = ({ currentWeight, onClose, onSave }) => {
    const [weight, setWeight] = useState(currentWeight.replace('kg', '').trim());

    // Mock Data for Weight History (Last 6 months)
    const history = [
        { month: 'Jun', weight: 4.2 },
        { month: 'Jul', weight: 4.3 },
        { month: 'Ago', weight: 4.2 },
        { month: 'Set', weight: 4.4 },
        { month: 'Out', weight: 4.5 },
        { month: 'Nov', weight: 4.5 },
    ];

    // Simple SVG Chart Logic
    const maxWeight = Math.max(...history.map(h => h.weight)) + 0.5;
    const minWeight = Math.min(...history.map(h => h.weight)) - 0.5;
    const height = 150;
    const width = 300;
    const padding = 20;

    const getX = (index: number) => padding + (index * (width - 2 * padding) / (history.length - 1));
    const getY = (w: number) => height - padding - ((w - minWeight) / (maxWeight - minWeight)) * (height - 2 * padding);

    const points = history.map((h, i) => `${getX(i)},${getY(h.weight)}`).join(' ');

    return (
        <Modal isOpen={true} onClose={onClose} title="Atualizar Peso" maxWidth="max-w-md">
            <div className="p-6 pt-2">
                <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Histórico de Peso (Últimos 6 meses)</h4>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-100 flex justify-center">
                        <svg width={width} height={height} className="overflow-visible">
                            {/* Grid Lines */}
                            {[0, 0.5, 1].map(r => (
                                <line
                                    key={r}
                                    x1={padding}
                                    y1={padding + r * (height - 2 * padding)}
                                    x2={width - padding}
                                    y2={padding + r * (height - 2 * padding)}
                                    stroke="#e5e7eb"
                                    strokeDasharray="4 4"
                                />
                            ))}

                            {/* Line */}
                            <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth="2" />

                            {/* Points */}
                            {history.map((h, i) => (
                                <g key={i}>
                                    <circle cx={getX(i)} cy={getY(h.weight)} r="4" fill="#0ea5e9" stroke="white" strokeWidth="2" />
                                    <text x={getX(i)} y={height + 15} textAnchor="middle" fontSize="10" fill="#6b7280">{h.month}</text>
                                    <text x={getX(i)} y={getY(h.weight) - 10} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="bold">{h.weight}</text>
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>

                <div className="mb-6">
                    <Input
                        label="Peso Atual (kg)"
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="text-lg font-bold"
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1 border-primary-300 text-primary-600">
                        Cancelar
                    </Button>
                    <Button onClick={() => onSave(weight)} className="flex-1">
                        Salvar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const TutorInfoModal: React.FC<{
    tutor: Tutor;
    onClose: () => void;
}> = ({ tutor, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Informações do Tutor" maxWidth="max-w-md">
            <div className="p-6 pt-2 space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Nome Completo</h4>
                    <p className="font-bold text-gray-800 text-lg">{tutor.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">CPF</h4>
                        <p className="font-medium text-gray-800">{tutor.cpf}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Telefone</h4>
                        <p className="font-medium text-gray-800">{tutor.phone}</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Endereço</h4>
                    <p className="font-medium text-gray-800">Av. Paulista, 1000 - Bela Vista</p>
                    <p className="text-gray-600 text-sm">São Paulo - SP, 01310-100</p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Pessoas Autorizadas</h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 bg-gray-100 p-3 rounded-md">
                            <div className="bg-primary-100 p-1.5 rounded-full text-primary-600">
                                <Check size={14} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Maria Almeida dos Santos</p>
                                <p className="text-xs text-gray-500">Mãe • (11) 99999-9999</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 bg-gray-100 p-3 rounded-md">
                            <div className="bg-primary-100 p-1.5 rounded-full text-primary-600">
                                <Check size={14} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">João Silva</p>
                                <p className="text-xs text-gray-500">Marido • (11) 98888-8888</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <Button variant="outline" onClick={onClose} className="w-full border-primary-300 text-primary-600 mt-2">
                    Fechar
                </Button>
            </div>
        </Modal>
    );
};

export const UpgradePlanModal: React.FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Upgrade de Plano" maxWidth="max-w-4xl">
            <div className="p-6 pt-2">
                <p className="text-gray-500 mb-8 text-center">Compare os planos e ofereça a melhor opção para o tutor.</p>

                <div className="grid grid-cols-4 gap-0 border border-gray-200 rounded-xl overflow-hidden mb-8">
                    {/* Header Row */}
                    <div className="p-4 bg-gray-100 border-b border-r border-gray-200 font-bold text-gray-600 flex items-center">Benefícios</div>
                    <div className="p-4 bg-gray-100 border-b border-r border-gray-200 text-center">
                        <div className="font-bold text-gray-600">Conforto</div>
                        <div className="text-xs text-gray-500">(Atual)</div>
                    </div>
                    <div className="p-4 bg-primary-50 border-b border-r border-primary-100 text-center relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500"></div>
                        <div className="font-bold text-primary-700">Super</div>
                        <div className="text-xs text-primary-600">Recomendado</div>
                    </div>
                    <div className="p-4 bg-gray-100 border-b border-gray-200 text-center">
                        <div className="font-bold text-gray-800">Ultra</div>
                    </div>

                    {/* Row 1 */}
                    <div className="p-4 border-b border-r border-gray-200 text-sm font-medium text-gray-700">Consultas</div>
                    <div className="p-4 border-b border-r border-gray-200 text-center text-sm text-gray-600">Coparticipação</div>
                    <div className="p-4 border-b border-r border-primary-100 bg-primary-50/30 text-center text-sm font-bold text-gray-800">Isento</div>
                    <div className="p-4 border-b border-gray-200 text-center text-sm font-bold text-gray-800">Isento</div>

                    {/* Row 2 */}
                    <div className="p-4 border-b border-r border-gray-200 text-sm font-medium text-gray-700">Exames Laboratoriais</div>
                    <div className="p-4 border-b border-r border-gray-200 text-center text-sm text-gray-600">Coparticipação</div>
                    <div className="p-4 border-b border-r border-primary-100 bg-primary-50/30 text-center text-sm font-bold text-gray-800">Ilimitado</div>
                    <div className="p-4 border-b border-gray-200 text-center text-sm font-bold text-gray-800">Ilimitado</div>

                    {/* Row 3 */}
                    <div className="p-4 border-b border-r border-gray-200 text-sm font-medium text-gray-700">Vacinas</div>
                    <div className="p-4 border-b border-r border-gray-200 text-center text-sm text-gray-600 text-red-500"><X size={16} className="mx-auto" /></div>
                    <div className="p-4 border-b border-r border-primary-100 bg-primary-50/30 text-center text-sm font-bold text-green-600"><Check size={16} className="mx-auto" /></div>
                    <div className="p-4 border-b border-gray-200 text-center text-sm font-bold text-green-600"><Check size={16} className="mx-auto" /></div>

                    {/* Row 4 */}
                    <div className="p-4 border-br border-r border-gray-200 text-sm font-medium text-gray-700">Internação</div>
                    <div className="p-4 border-br border-r border-gray-200 text-center text-sm text-gray-600">Coparticipação</div>
                    <div className="p-4 border-br border-r border-primary-100 bg-primary-50/30 text-center text-sm font-bold text-gray-800">10 dias/ano</div>
                    <div className="p-4 border-br border-gray-200 text-center text-sm font-bold text-gray-800">Ilimitado</div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6 border-primary-300 text-primary-600 hover:bg-primary-50">
                        Cancelar
                    </Button>
                    <Button className="px-8 shadow-sm">
                        Selecionar Plano Super (Upgrade)
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

interface AttendanceHistoryModalProps {
    pet: Pet | null;
    onClose: () => void;
}

export const AttendanceHistoryModal: React.FC<AttendanceHistoryModalProps> = ({ pet, onClose }) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(['1']); // First item expanded by default

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getTagStyle = (tag: string) => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes('castrado')) return 'bg-blue-50 text-blue-700 border-blue-200';
        if (lowerTag.includes('vacina')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (lowerTag.includes('alergia') || lowerTag.includes('alérgico')) return 'bg-rose-50 text-rose-700 border-rose-200';
        if (lowerTag.includes('vermifugado')) return 'bg-purple-50 text-purple-700 border-purple-200';
        return 'bg-gray-100 text-gray-600 border-gray-200';
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Histórico de Atendimento - ${pet?.name || 'Pet'}`}
            maxWidth="max-w-5xl"
        >
            <div className="p-6 md:p-8 bg-gray-100/50 h-[80vh] overflow-y-auto">
                {/* Filters */}
                <Card className="mb-10 flex flex-col xl:flex-row items-end gap-4" padding="md">
                    <div className="flex-1 w-full">
                        <Input
                            label="Data Início"
                            type="text"
                            placeholder="DD/MM/AAAA"
                            leftIcon={<CalendarIcon size={18} />}
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => e.target.type = 'text'}
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <Input
                            label="Data Fim"
                            type="text"
                            placeholder="DD/MM/AAAA"
                            leftIcon={<CalendarIcon size={18} />}
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => e.target.type = 'text'}
                        />
                    </div>
                    <div className="flex-[2] w-full">
                        <Select label="Unidade">
                            <option>Todas as unidades</option>
                            <option>Unidade Jardins</option>
                            <option>Unidade Moema</option>
                        </Select>
                    </div>
                    <div className="w-full md:w-auto">
                        <Button variant="outline" className="w-full md:w-auto whitespace-nowrap">
                            Limpar Filtros
                        </Button>
                    </div>
                </Card>

                {/* Timeline */}
                <div className="relative pl-4 space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-[28px] top-6 bottom-6 w-0.5 bg-gray-200/80 -z-10"></div>

                    {MOCK_ATTENDANCE_HISTORY.map((item) => {
                        const isExpanded = expandedIds.includes(item.id);
                        const isNew = item.id === '1'; // Logic could be improved with dates

                        return (
                            <div key={item.id} className="relative pl-14 group">
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-0 w-14 h-14 flex items-center justify-center">
                                    <div className={`w-4 h-4 rounded-full border-[3px] shadow-sm z-10 transition-all duration-300 ${isNew ? 'bg-primary-500 border-white ring-4 ring-primary-100 group-hover:ring-primary-200' : 'bg-white border-gray-300 group-hover:border-primary-400 group-hover:scale-110'}`}></div>
                                </div>

                                <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded
                                    ? 'border-primary-200 shadow-lg shadow-primary-500/5 ring-1 ring-primary-500/10'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                    }`}>
                                    {/* Header */}
                                    <div
                                        className="p-5 cursor-pointer flex justify-between items-start select-none"
                                        onClick={() => toggleExpand(item.id)}
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-primary-700' : 'text-gray-800'}`}>
                                                    {item.type}
                                                </h3>
                                                {isNew && (
                                                    <Badge variant="info">NOVO</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarIcon size={14} className="text-gray-400" />
                                                    {item.date}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} className="text-gray-400" />
                                                    {item.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-gray-400 p-1 rounded-full bg-gray-100 transition-all duration-300 ${isExpanded ? 'rotate-180 bg-primary-50 text-primary-600' : 'group-hover:bg-gray-100'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                            {/* Pet Info Context */}
                                            <div className="mb-6 pb-4 border-b border-gray-50 bg-gray-100/50 -mx-6 px-6 py-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                    Paciente: <span className="text-gray-700 ml-1 normal-case text-sm font-semibold">{pet?.name} • {pet?.breed} • {pet?.age} • {pet?.gender}</span>
                                                </p>
                                            </div>

                                            <div className="space-y-6">
                                                {item.diagnosis && (
                                                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-100">
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Diagnóstico (Queixa Principal)</h4>
                                                        <p className="text-gray-800 leading-relaxed font-medium">{item.diagnosis}</p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {item.treatment && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Conduta</h4>
                                                            <p className="text-gray-700 leading-relaxed text-sm bg-white p-3 rounded-lg border border-gray-100">{item.treatment}</p>
                                                        </div>
                                                    )}

                                                    {/* Tags */}
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Observações Importantes</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {/* Mock Tags just for display */}
                                                            {['Castrado', 'V10 - 2024', 'Vermifugado', 'Alergia a Frango'].map(tag => (
                                                                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold border ${getTagStyle(tag)}`}>
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {item.documents && item.documents.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Anexos</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {item.documents.map((doc, idx) => (
                                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer group">
                                                                    <div className="p-2.5 bg-red-50 rounded-lg text-red-500 group-hover:bg-red-100 transition-colors">
                                                                        <FileText size={20} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <span className="block text-sm font-bold text-gray-700 truncate group-hover:text-primary-700 transition-colors">{doc}</span>
                                                                        <span className="text-xs text-gray-400 uppercase font-bold">PDF</span>
                                                                    </div>
                                                                    <span className="text-gray-300 group-hover:text-primary-400">
                                                                        <ChevronDown size={16} className="-rotate-90" />
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                                                <Button variant="outline" leftIcon={<FileText size={16} />}>
                                                    Ver Prontuário Completo deste Atendimento
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};
