import React, { useState } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { FileText, Thermometer, Mic, Heart, AlertCircle, Check, ChevronDown, ChevronUp, Syringe, Home, Utensils, Activity, AlertTriangle, ShieldCheck, Upload, Paperclip } from 'lucide-react';
import { SystemReview } from '../../types';
import { Button, Input } from '../ui';

const SYSTEMS_LIST = [
    { id: 'Digestivo', label: 'Sistema Digestivo' },
    { id: 'Respiratorio', label: 'Sistema Respiratório' },
    { id: 'Geniturinario', label: 'Sistema Geniturinário' },
    { id: 'Cardiovascular', label: 'Sistema Cardiovascular' },
    { id: 'Musculoesqueletico', label: 'Musculoesquelético' },
    { id: 'Neurologico', label: 'Sistema Neurológico' },
    { id: 'Tegumentar', label: 'Sistema Tegumentar' },
];

export const AnamnesisView: React.FC = () => {
    const { attendance, updateAnamnesis } = useAttendance();
    const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

    if (!attendance) return null;

    const { anamnesis } = attendance;

    // --- History Handlers ---
    const handleHistoryUpdate = (section: 'history', field: keyof typeof anamnesis.history, value: any) => {
        updateAnamnesis({
            history: {
                ...anamnesis.history,
                [field]: value
            }
        });
    };

    const handleVaccinationUpdate = (field: string, value: any) => {
        updateAnamnesis({
            history: {
                ...anamnesis.history,
                vaccination: {
                    ...anamnesis.history.vaccination,
                    [field]: value
                }
            }
        });
    };

    // --- Vitals Handlers ---
    const handleVitalsUpdate = (field: string, value: string) => {
        updateAnamnesis({
            vitals: {
                ...anamnesis.vitals,
                [field]: value
            }
        });
    };

    // --- Systems Handlers ---
    const getSystemStatus = (name: string) => {
        return anamnesis.systems.find(s => s.systemName === name)?.status || 'not_observed';
    };

    const getSystemObs = (name: string) => {
        return anamnesis.systems.find(s => s.systemName === name)?.observations || '';
    };

    const toggleSystemStatus = (name: string, status: 'normal' | 'abnormal' | 'not_observed') => {
        const existing = anamnesis.systems.filter(s => s.systemName !== name);
        const newItem: SystemReview = {
            systemName: name,
            status,
            observations: status === 'abnormal' ? getSystemObs(name) : ''
        };

        updateAnamnesis({ systems: [...existing, newItem] });

        if (status === 'abnormal') {
            setExpandedSystem(name);
        } else if (expandedSystem === name) {
            setExpandedSystem(null);
        }
    };

    const updateSystemObs = (name: string, text: string) => {
        const systems = anamnesis.systems.map(s => {
            if (s.systemName === name) {
                return { ...s, observations: text };
            }
            return s;
        });
        updateAnamnesis({ systems });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

            {/* Header section removed per user preference for cleaner look */}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* --- Left Column (Context & Vitals) - HIDDEN BY USER REQUEST --- */}

                {/* --- Right Column (Main Inputs) --- */}
                <div className="xl:col-span-12 space-y-8">

                    {/* 1. Main Complaint */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <h3 className="font-bold text-gray-800 flex items-center justify-between flex-1 w-full sm:w-auto">
                                <span>Queixa Principal <span className="hidden sm:inline">(Relato do Tutor)</span> <span className="text-red-500 text-xs ml-1">*</span></span>
                            </h3>
                            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                                <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors shadow-sm flex-1 sm:flex-none justify-center">
                                    <Upload size={14} className="text-primary-500" />
                                    ANEXAR
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const current = anamnesis.attachments || [];
                                                updateAnamnesis({ attachments: [...current, file.name] });
                                            }
                                        }}
                                    />
                                </label>
                                <div className="p-1 px-2 bg-white rounded border border-gray-200 text-xs font-mono text-gray-400 whitespace-nowrap">
                                    {anamnesis.mainComplaint?.length || 0} char
                                </div>
                            </div>
                        </div>
                        <div className="p-0">
                            <textarea
                                className="w-full h-48 p-4 outline-none resize-none text-gray-700 leading-relaxed placeholder:text-gray-300 focus:bg-primary-50/10 transition-colors"
                                placeholder="Descreva o motivo principal da consulta, sintomas relatados e tempo de evolução..."
                                value={anamnesis.mainComplaint || ''}
                                onChange={(e) => updateAnamnesis({ mainComplaint: e.target.value })}
                            />
                        </div>

                        {/* Attachments List */}
                        {anamnesis.attachments && anamnesis.attachments.length > 0 && (
                            <div className="px-4 py-3 bg-gray-100/50 border-t border-gray-50">
                                <div className="flex flex-wrap gap-2">
                                    {anamnesis.attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm animate-in zoom-in-95 duration-200">
                                            <Paperclip size={12} className="text-gray-400" />
                                            <span className="text-[11px] font-medium text-gray-600 max-w-[150px] truncate">{file}</span>
                                            <button
                                                onClick={() => {
                                                    const filtered = anamnesis.attachments?.filter((_, i) => i !== idx);
                                                    updateAnamnesis({ attachments: filtered });
                                                }}
                                                className="ml-1 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <AlertCircle size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Systems Review - HIDDEN BY USER REQUEST */}
                </div>
            </div>


            {/* Diagnostic Hypothesis (Conclusion) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">Hipótese Diagnóstica / Conclusão</h3>
                </div>
                <div className="p-0">
                    <textarea
                        className="w-full h-24 p-4 outline-none resize-none text-gray-700 leading-relaxed focus:bg-emerald-50/10 transition-colors"
                        placeholder="Descreva suas suspeitas, conclusões ou próximos passos..."
                        value={anamnesis.diagnosticHypothesis || ''}
                        onChange={(e) => updateAnamnesis({ diagnosticHypothesis: e.target.value })}
                    />
                </div>
            </div>

        </div>
    );
};
