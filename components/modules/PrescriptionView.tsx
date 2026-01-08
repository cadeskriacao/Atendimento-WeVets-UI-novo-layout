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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">


                <div className="w-full flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 text-lg">Itens de Encaminhamento</h3>
                        <span className="text-[10px] font-bold bg-primary-600 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary-200 whitespace-nowrap">
                            {attendance.prescriptions.length} ITEM(NS)
                        </span>
                    </div>

                    <div className="relative group z-40">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-300 outline-none transition-all text-sm font-medium shadow-sm"
                            placeholder="Comece a digitar o remédio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {searchTerm.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

                    <div>
                        {attendance.prescriptions.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 mb-4 shadow-sm">
                                    <FileText size={32} />
                                </div>
                                <p className="text-gray-400 max-w-xs font-medium text-sm">Use a busca acima para adicionar itens ao encaminhamento.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {attendance.prescriptions.map((item) => {
                                    const doseCheck = getDosageStatus(item);
                                    let bgParams;

                                    if (doseCheck.color === 'emerald') {
                                        bgParams = 'bg-status-success';
                                    } else if (doseCheck.color === 'red') {
                                        bgParams = 'bg-status-error';
                                    } else {
                                        bgParams = 'bg-status-info';
                                    }

                                    return (
                                        <div key={item.id} className="group relative bg-white border border-gray-200 rounded-2xl hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all p-5 overflow-hidden">
                                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 rounded-full ${bgParams} transition-colors`} />

                                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                                <div className="md:w-1/3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                                                    </div>
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Scissors size={10} /> Posologia
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                                            value={item.dosage}
                                                            onChange={(e) => updatePrescriptionItem(item.id, { dosage: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Clock size={10} /> Frequência
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                                            value={item.frequency}
                                                            onChange={(e) => updatePrescriptionItem(item.id, { frequency: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            <Activity size={10} /> Duração
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                                            value={item.duration}
                                                            onChange={(e) => updatePrescriptionItem(item.id, { duration: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col justify-end md:justify-center items-center md:border-l md:border-gray-100 md:pl-4 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0 mt-2 md:mt-0">
                                                    <button
                                                        onClick={() => removePrescription(item.id)}
                                                        className="flex items-center gap-2 px-4 py-2 md:p-2 text-red-500 md:text-gray-400 hover:text-status-error hover:bg-red-50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest md:normal-case md:font-normal"
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
                </div>
            </div>
        </div>
    );
};
