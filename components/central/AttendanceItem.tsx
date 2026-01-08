import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Calendar, AlertCircle, Play, XCircle, Stethoscope, DollarSign, History, Trash2 } from 'lucide-react';
import { Button } from '../ui';
import { Attendance, STATUS_LABELS } from '../../types';

interface AttendanceItemProps {
    attendance: Attendance;
    petName: string;
    tutorName: string;
    onStartAttendance: (id: string) => void;
    onCancelAttendance: (id: string) => void;
}

export const AttendanceItem: React.FC<AttendanceItemProps> = ({
    attendance,
    petName,
    tutorName,
    onStartAttendance,
    onCancelAttendance
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'BUDGETING': return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'FINISHED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isActionable = attendance.status === 'SCHEDULED' || attendance.status === 'IN_PROGRESS' || attendance.status === 'BUDGETING';

    return (
        <div className={`border-b border-gray-100 bg-white transition-all ${isExpanded ? 'bg-gray-100/50' : 'hover:bg-gray-100'}`}>
            {/* Header / Main Row */}
            <div
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Left: Pet & Tutor Info */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                        {petName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight">{petName}</h3>
                        <p className="text-sm text-gray-500 font-medium">{tutorName}</p>
                    </div>
                </div>

                {/* Middle: Time & Status */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        {attendance.schedulingInfo?.date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-700">
                                    {attendance.schedulingInfo.date.split('-').reverse().join('/')}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            <span className="font-medium text-gray-700">{attendance.schedulingInfo?.time || '--:--'}</span>
                        </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(attendance.status)}`}>
                        {STATUS_LABELS[attendance.status]}
                    </span>

                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Expanded Accordion Content */}
            {isExpanded && (
                <div className="px-4 pb-4 md:px-6 md:pb-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* 1. Clinical Summary */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 font-bold text-gray-700 text-sm uppercase tracking-wide">
                                <Stethoscope size={16} className={`${attendance.status === 'CANCELLED' ? 'text-gray-400' : 'text-primary-500'}`} />
                                {attendance.status === 'CANCELLED' ? 'Motivo do Cancelamento' : 'Resumo Clínico'}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-3">
                                {attendance.status === 'CANCELLED' ? (
                                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2">
                                        <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-red-700 font-bold">{attendance.cancellationReason || 'Motivo não informado'}</p>
                                    </div>
                                ) : (
                                    <>
                                        {attendance.anamnesis.mainComplaint ? (
                                            <p><span className="font-bold text-gray-800">Queixa:</span> {attendance.anamnesis.mainComplaint}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">Nenhuma queixa registrada</p>
                                        )}

                                        {attendance.anamnesis.diagnosticHypothesis && (
                                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                <span className="block font-black text-[10px] text-blue-400 uppercase tracking-widest mb-1">Hipótese Diagnóstica</span>
                                                <p className="text-blue-900 font-bold text-xs">{attendance.anamnesis.diagnosticHypothesis}</p>
                                            </div>
                                        )}

                                        {attendance.prescriptions.length > 0 && (
                                            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                                                <span className="block font-black text-[10px] text-purple-400 uppercase tracking-widest mb-1">Encaminhamento</span>
                                                <ul className="space-y-1">
                                                    {attendance.prescriptions.map(p => (
                                                        <li key={p.id} className="text-purple-900 text-xs font-bold flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                                            {p.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="flex gap-2 text-[10px]">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold uppercase tracking-wide border border-gray-200">Peso: {attendance.triage.weight || '--'}kg</span>
                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold uppercase tracking-wide border border-gray-200">Temp: {attendance.triage.temperature || '--'}°C</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 2. Financial Summary */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 font-bold text-gray-700 text-sm uppercase tracking-wide">
                                <DollarSign size={16} className="text-emerald-500" />
                                Financeiro
                            </h4>
                            <div className="text-sm text-gray-600">
                                <p className="mb-2">Itens no carrinho: <span className="font-bold text-gray-900">{attendance.services.length}</span></p>
                                <p className="text-lg font-bold text-emerald-700">
                                    {attendance.services.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                        </div>

                        {/* 3. Quick History */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 font-bold text-gray-700 text-sm uppercase tracking-wide">
                                <History size={16} className="text-blue-500" />
                                Histórico Recente
                            </h4>
                            <div className="text-xs space-y-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex justify-between items-center text-gray-500 bg-gray-100 p-2 rounded">
                                        <span>2{i}/10/2024</span>
                                        <span className="font-medium">Consulta de Rotina</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions Toolbar */}
                    {isActionable && (
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                            {attendance.status === 'BUDGETING' ? (
                                <Button
                                    variant="outline"
                                    className="text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    onClick={(e) => { e.stopPropagation(); onCancelAttendance(attendance.id); }}
                                    leftIcon={<Trash2 size={18} />}
                                >
                                    Excluir Orçamento
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="text-status-error border-red-200 hover:bg-red-50 hover:border-red-300"
                                    onClick={(e) => { e.stopPropagation(); onCancelAttendance(attendance.id); }}
                                    leftIcon={<XCircle size={18} />}
                                >
                                    Cancelar Atendimento
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                className="bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20"
                                onClick={(e) => { e.stopPropagation(); onStartAttendance(attendance.id); }}
                                leftIcon={<Play size={18} />}
                            >
                                {attendance.status === 'SCHEDULED' ? 'Iniciar Triagem' : attendance.status === 'BUDGETING' ? 'Editar Orçamento' : 'Continuar Atendimento'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
