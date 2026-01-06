import React from 'react';
import { Activity, FileText, ShoppingCart, Pill, CheckCircle, AlertCircle, Circle, Flag } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { AttendanceStep, STATUS_LABELS } from '../../types';

interface AttendanceSidebarProps {
    onCancel?: () => void;
}

export const AttendanceSidebar: React.FC<AttendanceSidebarProps> = ({ onCancel }) => {
    const { attendance, setCurrentStep, startMedicalAttendance, finishAttendance, cancelAttendance } = useAttendance();

    if (!attendance) return null;

    const steps: { id: AttendanceStep; label: string; icon: React.ReactNode }[] = [
        { id: 'SERVICES', label: 'Serviços', icon: <ShoppingCart size={20} /> },
        { id: 'ANAMNESIS', label: 'Anamnese', icon: <FileText size={20} /> },
        { id: 'PRESCRIPTION', label: 'Encaminhamento', icon: <FileText size={20} /> },
        { id: 'SUMMARY', label: 'Resumo', icon: <CheckCircle size={20} /> },
    ];

    const getStatusIcon = (stepId: AttendanceStep) => {
        // Logic to determine if step is done, in progress or empty
        // For now, simple logic based on current step
        if (attendance.currentStep === stepId) return <div className="w-2 h-2 rounded-full bg-primary-500" />;
        // Specific checks

        if (stepId === 'ANAMNESIS' && (attendance.anamnesis.mainComplaint.length > 0 || attendance.anamnesis.vitals.weight)) return <CheckCircle size={16} className="text-status-success" />;
        if (stepId === 'SERVICES' && attendance.services.length > 0) return <CheckCircle size={16} className="text-status-success" />;
        if (stepId === 'PRESCRIPTION' && attendance.prescriptions.length > 0) return <CheckCircle size={16} className="text-status-success" />;
        if (stepId === 'SUMMARY' && attendance.status === 'FINISHED') return <CheckCircle size={16} className="text-status-success" />;

        return <Circle size={16} className="text-gray-300" />;
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden max-h-full">
            <div className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${attendance.status === 'INITIATED' ? 'bg-primary-50 text-primary-600 border border-primary-100' :
                        attendance.status === 'FINISHED' ? 'bg-green-50 text-status-success border border-green-100' :
                            attendance.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5' :
                                attendance.status === 'SCHEDULED' ? 'bg-amber-50 text-status-warning border border-amber-100' :
                                    'bg-gray-100 text-gray-500 border border-gray-100'
                        }`}>
                        {attendance.status === 'IN_PROGRESS' && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                        )}
                        {STATUS_LABELS[attendance.status]}
                    </span>
                </div>
                <h2 className="font-bold text-gray-900 text-lg leading-tight">Atendimento</h2>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
                {steps.map((step) => {
                    const isActive = attendance.currentStep === step.id;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all group ${isActive
                                ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100/50'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    {step.icon}
                                </span>
                                {step.label}
                            </div>
                            <div className="flex items-center justify-center">
                                {getStatusIcon(step.id)}
                            </div>
                        </button>
                    )
                })}
            </nav>

            <div className={`p-4 border-t border-gray-100 bg-slate-50/50 mt-auto transition-all duration-300 opacity-100`}>
                <div className="space-y-3">
                    {attendance.status === 'IN_PROGRESS' ? (
                        <button
                            onClick={finishAttendance}
                            className="w-full py-4 bg-status-success hover:bg-green-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-4"
                        >
                            <Flag size={24} className="flex-shrink-0" />
                            <div className="flex flex-col items-center leading-tight">
                                <span>Finalizar</span>
                                <span>atendimento</span>
                            </div>
                        </button>
                    ) : (attendance.status === 'SCHEDULED' || attendance.status === 'INITIATED') ? (
                        <button
                            onClick={startMedicalAttendance}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-4"
                        >
                            <Flag size={24} className="flex-shrink-0" />
                            <div className="flex flex-col items-center leading-tight">
                                <span>Iniciar atendimento</span>
                                <span>médico</span>
                            </div>
                        </button>
                    ) : null}

                    {(attendance.status === 'SCHEDULED' || attendance.status === 'IN_PROGRESS') && (
                        <button
                            onClick={onCancel || cancelAttendance}
                            className="w-full py-2 text-status-error hover:text-red-700 hover:bg-red-50 font-medium rounded-lg text-xs transition-colors"
                        >
                            Cancelar atendimento
                        </button>
                    )}
                </div>
            </div>


        </div>
    );
};
