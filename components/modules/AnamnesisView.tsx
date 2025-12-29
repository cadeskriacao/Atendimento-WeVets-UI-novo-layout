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

                {/* --- Left Column (Context & Vitals) --- */}
                <div className="xl:col-span-4 space-y-6">

                    {/* 3. Vitals (Fast Entry) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-4">
                            Sinais Vitais
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Peso (kg)</label>
                                <Input
                                    className="h-10 mt-1"
                                    placeholder="0.00"
                                    value={anamnesis.vitals?.weight || ''}
                                    onChange={(e) => handleVitalsUpdate('weight', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Temp (°C)</label>
                                    <Input
                                        className="h-10 mt-1"
                                        placeholder="38.5"
                                        value={anamnesis.vitals?.temp || ''}
                                        onChange={(e) => handleVitalsUpdate('temp', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">FC (bpm)</label>
                                    <Input
                                        className="h-10 mt-1"
                                        placeholder="100"
                                        value={anamnesis.vitals?.heartRate || ''}
                                        onChange={(e) => handleVitalsUpdate('heartRate', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">FR (mpm)</label>
                                <Input
                                    className="h-10 mt-1"
                                    placeholder="24"
                                    value={anamnesis.vitals?.respRate || ''}
                                    onChange={(e) => handleVitalsUpdate('respRate', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. History & Context */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="font-bold text-gray-800 mb-4">
                            Histórico e Manejo
                        </h3>

                        <div className="space-y-5">
                            {/* Environment */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Ambiente</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['casa', 'apartamento', 'sitio'].map((env) => (
                                        <button
                                            key={env}
                                            onClick={() => handleHistoryUpdate('history', 'environment', env)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalized
                                                ${anamnesis.history?.environment === env
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                        >
                                            {env.charAt(0).toUpperCase() + env.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Diet */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Alimentação</label>
                                <select
                                    className="w-full h-10 rounded-lg border-gray-200 bg-gray-100 text-sm focus:ring-2 focus:ring-primary-100 outline-none px-2"
                                    value={anamnesis.history?.diet || ''}
                                    onChange={(e) => handleHistoryUpdate('history', 'diet', e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="razão_seca">Ração Seca</option>
                                    <option value="úmida">Úmida (Sachê/Lata)</option>
                                    <option value="natural">Alimentação Natural</option>
                                    <option value="mista">Mista</option>
                                </select>
                            </div>

                            {/* Vaccination Status */}
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                        Vacinação
                                    </label>
                                    {anamnesis.history?.vaccination?.status === 'outdated' && (
                                        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 rounded animate-pulse">ATRASADA</span>
                                    )}
                                </div>
                                <div className="flex gap-1 mb-3">
                                    <button
                                        onClick={() => handleVaccinationUpdate('status', 'up_to_date')}
                                        className={`flex-1 py-1.5 rounded text-[10px] font-bold border ${anamnesis.history?.vaccination?.status === 'up_to_date' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-gray-400 border-gray-200'}`}
                                    >
                                        EM DIA
                                    </button>
                                    <button
                                        onClick={() => handleVaccinationUpdate('status', 'outdated')}
                                        className={`flex-1 py-1.5 rounded text-[10px] font-bold border ${anamnesis.history?.vaccination?.status === 'outdated' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-gray-400 border-gray-200'}`}
                                    >
                                        ATRASADA
                                    </button>
                                    <button
                                        onClick={() => handleVaccinationUpdate('status', 'unknown')}
                                        className={`flex-1 py-1.5 rounded text-[10px] font-bold border ${anamnesis.history?.vaccination?.status === 'unknown' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-white text-gray-400 border-gray-200'}`}
                                    >
                                        NÃO SABE
                                    </button>
                                </div>
                                <Input
                                    type="date"
                                    className="h-8 text-xs bg-white"
                                    value={anamnesis.history?.vaccination?.lastDate || ''}
                                    onChange={(e) => handleVaccinationUpdate('lastDate', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column (Main Inputs) --- */}
                <div className="xl:col-span-8 space-y-8">

                    {/* 1. Main Complaint */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 flex items-center justify-between flex-1">
                                <span>Queixa Principal (Relato do Tutor) <span className="text-red-500 text-xs ml-1">*Obrigatório</span></span>
                            </h3>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors shadow-sm">
                                    <Upload size={14} className="text-primary-500" />
                                    ANEXAR ARQUIVO
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
                                <div className="p-1 px-2 bg-white rounded border border-gray-200 text-xs font-mono text-gray-400">
                                    {anamnesis.mainComplaint?.length || 0} caracteres
                                </div>
                            </div>
                        </div>
                        <div className="p-0">
                            <textarea
                                className="w-full h-32 p-4 outline-none resize-none text-gray-700 leading-relaxed placeholder:text-gray-300 focus:bg-primary-50/10 transition-colors"
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

                    {/* 2. Systems Review (Anamnesis Guiada) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-100">
                            <h3 className="font-bold text-gray-800">
                                Revisão de Sistemas
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Marque anormalidades para detalhar observações.</p>
                        </div>

                        <div className="p-4 grid grid-cols-1 gap-3">
                            {SYSTEMS_LIST.map((sys) => {
                                const status = getSystemStatus(sys.id);
                                const isAbnormal = status === 'abnormal';
                                const isNormal = status === 'normal';

                                return (
                                    <div key={sys.id} className={`border rounded-xl transition-all ${isAbnormal ? 'border-red-200 bg-red-50/10' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <div className="p-3 flex items-center justify-between">
                                            <span className={`font-medium ${isAbnormal ? 'text-red-700' : 'text-gray-700'}`}>{sys.label}</span>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleSystemStatus(sys.id, 'normal')}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isNormal ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}
                                                >
                                                    Normal
                                                </button>
                                                <button
                                                    onClick={() => toggleSystemStatus(sys.id, 'abnormal')}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isAbnormal ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}
                                                >
                                                    Alterado
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expandable Text Area for Abnormalities */}
                                        {isAbnormal && (
                                            <div className="p-3 pt-0 animate-in slide-in-from-top-2">
                                                <textarea
                                                    className="w-full h-24 p-3 rounded-lg border border-red-100 bg-white text-sm text-gray-700 focus:border-red-300 focus:ring-1 focus:ring-red-200 outline-none resize-none"
                                                    placeholder={`Descreva as alterações observadas no ${sys.label}...`}
                                                    value={getSystemObs(sys.id)}
                                                    onChange={(e) => updateSystemObs(sys.id, e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
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
