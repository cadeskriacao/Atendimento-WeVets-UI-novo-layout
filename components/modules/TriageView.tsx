import React from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { Button } from '../ui'; // Assuming Button exists in ui
import { Save } from 'lucide-react';

export const TriageView: React.FC = () => {
    const { attendance, updateTriage } = useAttendance();

    if (!attendance) return null;

    const handleChange = (field: keyof typeof attendance.triage, value: string) => {
        updateTriage({ [field]: value });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Triagem</h2>
                    <p className="text-gray-500 text-sm">Registro de sinais vitais e dados preliminares.</p>
                </div>
                {/* Auto-save indicator is global, but maybe a manual save here too? */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                        <input
                            type="text"
                            placeholder="Ex: 12.5"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={attendance.triage.weight || ''}
                            onChange={(e) => handleChange('weight', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
                        <input
                            type="text"
                            placeholder="Ex: 38.5"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={attendance.triage.temperature || ''}
                            onChange={(e) => handleChange('temperature', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequência Cardíaca (bpm)</label>
                        <input
                            type="text"
                            placeholder="Ex: 100"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={attendance.triage.heartRate || ''}
                            onChange={(e) => handleChange('heartRate', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pressão Arterial (mmHg)</label>
                        <input
                            type="text"
                            placeholder="Ex: 120/80"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={attendance.triage.bloodPressure || ''}
                            onChange={(e) => handleChange('bloodPressure', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequência Respiratória (mpm)</label>
                        <input
                            type="text"
                            placeholder="Ex: 24"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={attendance.triage.respiratoryRate || ''}
                            onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
                    <textarea
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Observações adicionais sobre o estado do paciente..."
                        value={attendance.triage.notes || ''}
                        onChange={(e) => handleChange('notes', e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button variant="outline" className="text-gray-500">
                    <Save size={16} className="mr-2" />
                    Salvo Automaticamente
                </Button>
            </div>
        </div>
    );
};
