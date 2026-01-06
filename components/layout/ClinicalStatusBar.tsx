import React from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { AlertCircle, Save, Zap } from 'lucide-react';
import { Button } from '../ui';
import { STATUS_LABELS } from '../../types';

export const ClinicalStatusBar: React.FC = () => {
    const { attendance } = useAttendance();

    if (!attendance) return null;

    return (
        <div className="hidden md:flex fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-2 z-40 items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">Sessão Ativa</span>
                    <span className="text-xs font-mono text-gray-600">#{attendance.id.substring(0, 8)}</span>
                </div>

                <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-2 text-gray-400">
                    <Save size={14} />
                    <span className="text-[10px] font-medium uppercase tracking-wide">
                        Auto-save: {new Date(attendance.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">


                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Status: {STATUS_LABELS[attendance.status]}</span>
                </div>
            </div>
        </div>
    );
};
