import React, { useState } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { FileText, Plus, Trash2, Info, Search, Flag, CheckCircle, AlertTriangle, Clock, Scissors, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '../ui';
import { PrescriptionItem } from '../../types';

export const PrescriptionView: React.FC = () => {
    const { attendance, addPrescription, removePrescription, updatePrescriptionItem } = useAttendance();
    const [searchTerm, setSearchTerm] = useState('');

    if (!attendance) return null;

    const petWeight = parseFloat(attendance?.anamnesis?.vitals?.weight || attendance?.triage?.weight || '0');

    // Mock medicines with dosage metadata
    const MEDICINES = [
        { id: '1', name: 'Amoxicilina 500mg', baseDose: '12.5mg/kg', maxDose: 20, unit: 'comp', frequency: 'BID (12/12h)' },
        { id: '2', name: 'Dipirona Gotas 500mg/ml', baseDose: '25mg/kg', maxDose: 40, unit: 'gotas', frequency: 'TID (8/8h)' },
        { id: '3', name: 'Meloxicam 2mg', baseDose: '0.1mg/kg', maxDose: 0.2, unit: 'comp', frequency: 'SID (24/24h)' },
        { id: '4', name: 'Prednisolona 5mg', baseDose: '0.5mg/kg', maxDose: 2, unit: 'comp', frequency: 'SID (24/24h)' },
        { id: '5', name: 'Cerenia 16mg', baseDose: '2mg/kg', maxDose: 8, unit: 'comp', frequency: 'SID (24/24h)' },
    ];

    const filteredMedicines = (term: string) => MEDICINES.filter(m => m.name.toLowerCase().includes(term.toLowerCase()));

    const handleAddItem = (medicine: typeof MEDICINES[0]) => {
        addPrescription({
            name: medicine.name,
            dosage: medicine.baseDose,
            frequency: medicine.frequency,
            duration: '7 dias',
            notes: ''
        });
        setSearchTerm('');
    };

    const isLocked = attendance.status !== 'IN_PROGRESS';

    const getDosageStatus = (item: PrescriptionItem) => {
        if (!petWeight || isNaN(petWeight)) return { status: 'unknown', label: 'Peso não informado', color: 'gray' };

        const nameLower = (item.name || '').toLowerCase();
        const dosageStr = (item.dosage || '').toLowerCase();

        const mgMatch = dosageStr.match(/(\d+\.?\d*)\s*mg/);
        if (mgMatch) {
            const mg = parseFloat(mgMatch[1]);
            const mgPerKg = mg / petWeight;

            const meta = MEDICINES.find(m => nameLower.includes(m.name.split(' ')[0].toLowerCase()));
            if (meta) {
                if (mgPerKg > meta.maxDose) return { status: 'unsafe', label: 'Dose Alta!', color: 'red' };
                return { status: 'safe', label: 'Dose Segura', color: 'emerald' };
            }
        }
        return { status: 'neutral', label: 'Validado', color: 'blue' };
    };

    return (
        <div className="relative h-full flex flex-col">
            {isLocked && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-50/50 backdrop-blur-[8px] rounded-2xl border border-gray-100 shadow-inner p-4">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center w-full max-w-sm animate-in zoom-in-95 duration-300 relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4 md:mb-6 ring-8 ring-primary-50/50">
                            <FileText size={32} className="md:w-10 md:h-10 text-primary-600" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">Encaminhamento Bloqueado</h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 md:mb-8">
                            Para prescrever medicamentos, primeiro é necessário <span className="font-bold text-primary-600">Iniciar o atendimento médico</span> através do menu lateral.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-4 py-2 rounded-full">
                            <Info size={14} />
                            Protocolo de Segurança WeVets
                        </div>
                    </div>
                </div>
            )}

            <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 ${isLocked ? 'pointer-events-none select-none grayscale-[0.5] opacity-30 shadow-none overflow-hidden' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <span className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                <FileText size={24} />
                            </span>
                            Encaminhamento Médico
                        </h2>
                        <p className="text-gray-500 mt-1">Gere encaminhamentos e solicitações com segurança.</p>
                    </div>

                    {/* Peso Atual - HIDDEN BY USER REQUEST */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Search & Recommendations */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Buscar no Dicionário VET</label>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:bg-white focus:border-primary-300 outline-none transition-all text-sm font-medium"
                                    placeholder="Comece a digitar o remédio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                {searchTerm.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {filteredMedicines(searchTerm).map(med => (
                                            <button
                                                key={med.id}
                                                onClick={() => handleAddItem(med)}
                                                className="w-full px-5 py-4 text-left hover:bg-primary-50 transition-colors flex items-center justify-between group"
                                            >
                                                <div>
                                                    <div className="font-bold text-gray-800">{med.name}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded italic">{med.baseDose}</span>
                                                        <span>•</span>
                                                        <span>Padrão: {med.frequency}</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                                    <Plus size={18} />
                                                </div>
                                            </button>
                                        ))}
                                        {filteredMedicines(searchTerm).length === 0 && (
                                            <div className="p-6 text-center text-sm text-gray-400">Nenhum medicamento encontrado.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Smart Check Card - HIDDEN BY USER REQUEST */}
                    </div>

                    {/* Right: Prescribed Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-100/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-gray-500">
                                        <Clock size={18} />
                                    </div>
                                    <h3 className="font-bold text-gray-800">Itens de Encaminhamento</h3>
                                </div>
                                <span className="text-[10px] font-black bg-primary-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary-200">
                                    {attendance.prescriptions.length} ITEM(NS)
                                </span>
                            </div>

                            <div className="p-6">
                                {attendance.prescriptions.length === 0 ? (
                                    <div className="text-center py-20 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-200 mb-4 border border-gray-100 border-dashed">
                                            <FileText size={40} />
                                        </div>
                                        <p className="text-gray-400 max-w-xs font-medium">Use a busca ao lado para adicionar itens ao encaminhamento.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {attendance.prescriptions.map((item) => {
                                            const doseCheck = getDosageStatus(item);
                                            // Using semantic colors now
                                            // 'emerald' -> 'status-success'
                                            // 'red' -> 'status-error'
                                            // 'blue' -> 'status-info'

                                            // Tailwind doesn't allow dynamic class construction like `bg-${color}-500` if those classes aren't in safelist, 
                                            // BUT with standard config it might work if the color name matches theme. 
                                            // To be robust, let's map it explicitly to our new semantic tokens.

                                            let bgParams, badgeParams;

                                            if (doseCheck.color === 'emerald') {
                                                bgParams = 'bg-status-success';
                                                badgeParams = 'bg-green-50 text-status-success border-green-100';
                                            } else if (doseCheck.color === 'red') {
                                                bgParams = 'bg-status-error';
                                                badgeParams = 'bg-red-50 text-status-error border-red-100';
                                            } else {
                                                bgParams = 'bg-status-info';
                                                badgeParams = 'bg-blue-50 text-status-info border-blue-100';
                                            }

                                            return (
                                                <div key={item.id} className="group relative bg-white border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all p-5 overflow-hidden">
                                                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${bgParams} transition-colors`} />

                                                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                                        <div className="md:w-1/3">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-black text-gray-900 text-lg leading-tight">{item.name}</h4>
                                                            </div>
                                                            {/* Dosage validation badges - HIDDEN BY USER REQUEST */}
                                                        </div>

                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <Scissors size={10} /> Posologia
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                                                    value={item.dosage}
                                                                    onChange={(e) => updatePrescriptionItem(item.id, { dosage: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <Clock size={10} /> Frequência
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                                                    value={item.frequency}
                                                                    onChange={(e) => updatePrescriptionItem(item.id, { frequency: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                                    <Activity size={10} /> Duração
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                                                    value={item.duration}
                                                                    onChange={(e) => updatePrescriptionItem(item.id, { duration: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-row md:flex-col justify-end md:justify-center items-center md:border-l md:border-gray-100 md:pl-4 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0 mt-2 md:mt-0">
                                                            <button
                                                                onClick={() => removePrescription(item.id)}
                                                                className="flex items-center gap-2 px-4 py-2 md:p-2 text-red-500 md:text-gray-200 hover:text-status-error hover:bg-red-50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest md:normal-case md:font-normal"
                                                                title="Remover medicamento"
                                                            >
                                                                <Trash2 size={20} />
                                                                <span className="md:hidden">Remover</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="p-5 bg-gray-100/80 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-gray-400 bg-white/50 p-3 rounded-xl border border-dashed border-gray-200">
                                    <Info size={18} className="flex-shrink-0" />
                                    <p className="text-[11px] font-medium leading-relaxed italic">
                                        Dica: Todas as alterações são salvas automaticamente em tempo real.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
