import React from 'react';
import { FileText, ShoppingCart, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { AttendanceStep, STATUS_LABELS } from '../../types';

interface AttendanceTabsProps { }

export const AttendanceTabs: React.FC<AttendanceTabsProps> = () => {
    const { attendance, setCurrentStep } = useAttendance();

    if (!attendance) return null;

    const steps: { id: AttendanceStep; label: string; icon: React.ReactNode }[] = [
        { id: 'SERVICES', label: 'Serviços', icon: <ShoppingCart size={18} /> },
        { id: 'ANAMNESIS', label: 'Anamnese', icon: <FileText size={18} /> },
        { id: 'PRESCRIPTION', label: 'Encaminhamento', icon: <FileText size={18} /> },
    ];

    const getStatusIcon = (stepId: AttendanceStep) => {
        if (attendance.currentStep === stepId) return <div className="w-2 h-2 rounded-full bg-primary-500" />;

        if (stepId === 'ANAMNESIS' && (attendance.anamnesis.mainComplaint.length > 0 || attendance.anamnesis.vitals.weight)) return <CheckCircle size={14} className="text-status-success" />;
        if (stepId === 'SERVICES' && attendance.services.length > 0) return <CheckCircle size={14} className="text-status-success" />;
        if (stepId === 'PRESCRIPTION' && attendance.prescriptions.length > 0) return <CheckCircle size={14} className="text-status-success" />;

        return <Circle size={14} className="text-gray-300" />;
    };

    return (
        <div className="w-full bg-white flex flex-col md:flex-row items-center justify-between px-2 md:px-6 py-2 md:py-3 border-b border-gray-200 gap-4">
            {/* Tabs Navigation */}
            <nav className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {steps.map((step) => {
                    const isActive = attendance.currentStep === step.id;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap min-w-[70px] md:min-w-0 ${isActive
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

            {/* Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                <AlertCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wide">Status: {STATUS_LABELS[attendance.status]}</span>
            </div>
        </div>
    );
};
