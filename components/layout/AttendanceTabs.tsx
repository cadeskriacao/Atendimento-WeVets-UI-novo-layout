import React from 'react';
import { FileText, ShoppingCart, CheckCircle, Flag, Circle } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { AttendanceStep } from '../../types';

interface AttendanceTabsProps {
    onCancel?: () => void;
    onFinalize?: () => void;
}

export const AttendanceTabs: React.FC<AttendanceTabsProps> = ({ onCancel, onFinalize }) => {
    const { attendance, setCurrentStep, startMedicalAttendance, finishAttendance, cancelAttendance } = useAttendance();

    if (!attendance) return null;

    const steps: { id: AttendanceStep; label: string; icon: React.ReactNode }[] = [
        { id: 'SERVICES', label: 'Serviços', icon: <ShoppingCart size={18} /> },
        { id: 'ANAMNESIS', label: 'Anamnese', icon: <FileText size={18} /> },
        { id: 'PRESCRIPTION', label: 'Encaminhamento', icon: <FileText size={18} /> },
        { id: 'SUMMARY', label: 'Resumo', icon: <CheckCircle size={18} /> },
    ];

    const getStatusIcon = (stepId: AttendanceStep) => {
        if (attendance.currentStep === stepId) return <div className="w-2 h-2 rounded-full bg-primary-500" />;

        if (stepId === 'ANAMNESIS' && (attendance.anamnesis.mainComplaint.length > 0 || attendance.anamnesis.vitals.weight)) return <CheckCircle size={14} className="text-status-success" />;
        if (stepId === 'SERVICES' && attendance.services.length > 0) return <CheckCircle size={14} className="text-status-success" />;
        if (stepId === 'PRESCRIPTION' && attendance.prescriptions.length > 0) return <CheckCircle size={14} className="text-status-success" />;
        if (stepId === 'SUMMARY' && attendance.status === 'FINISHED') return <CheckCircle size={14} className="text-status-success" />;

        return <Circle size={14} className="text-gray-300" />;
    };

    return (
        <div className="w-full bg-white flex flex-col md:flex-row items-center justify-between px-2 md:px-6 py-2 md:py-3 border-b border-gray-200">
            {/* Tabs Navigation */}
            <nav className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {steps.map((step) => {
                    const isActive = attendance.currentStep === step.id;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap min-w-[70px] md:min-w-0 ${isActive
                                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100/50'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                                }`}
                        >
                            <span className={`transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                                {step.icon}
                            </span>
                            <span>{step.label}</span>
                            <div className="hidden md:block ml-1">
                                {getStatusIcon(step.id)}
                            </div>
                        </button>
                    )
                })}
            </nav>

            {/* Desktop Actions Toolbar */}
            <div className="hidden md:flex items-center gap-2 w-full md:w-auto justify-between md:justify-start mt-3 pt-3 border-t border-gray-100 md:mt-0 md:pt-0 md:border-t-0 md:border-l md:pl-4">
                {attendance.status === 'IN_PROGRESS' ? (
                    <button
                        onClick={onFinalize || finishAttendance}
                        className="px-4 py-2 bg-status-success hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Flag size={16} />
                        <span>Finalizar</span>
                    </button>
                ) : (attendance.status === 'SCHEDULED' || attendance.status === 'INITIATED') ? (
                    <button
                        onClick={startMedicalAttendance}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-sm shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Flag size={16} />
                        <span>Iniciar Atendimento</span>
                    </button>
                ) : null}

                {(attendance.status === 'SCHEDULED' || attendance.status === 'IN_PROGRESS' || attendance.status === 'INITIATED') && (
                    <button
                        onClick={onCancel || cancelAttendance}
                        className="px-3 py-2 text-status-error hover:bg-red-50 font-medium rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* Mobile Actions Toolbar (Fixed Bottom) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center gap-3 z-50">
                {(attendance.status === 'SCHEDULED' || attendance.status === 'IN_PROGRESS' || attendance.status === 'INITIATED') && (
                    <button
                        onClick={onCancel || cancelAttendance}
                        className="flex-1 py-3 text-status-error bg-red-50 hover:bg-red-100 font-bold rounded-xl text-sm transition-colors whitespace-nowrap border border-red-100"
                    >
                        Cancelar
                    </button>
                )}

                {attendance.status === 'IN_PROGRESS' ? (
                    <button
                        onClick={onFinalize || finishAttendance}
                        className="flex-[2] py-3 bg-status-success hover:bg-green-700 text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Flag size={18} />
                        <span>Finalizar</span>
                    </button>
                ) : (attendance.status === 'SCHEDULED' || attendance.status === 'INITIATED') ? (
                    <button
                        onClick={startMedicalAttendance}
                        className="flex-[2] py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <Flag size={18} />
                        <span>Iniciar Atendimento</span>
                    </button>
                ) : null}
            </div>
        </div>
    );
};
