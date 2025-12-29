import React, { useState, useMemo } from 'react';
import { Plus, SearchX, Zap } from 'lucide-react';
import { Button } from '../ui';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceItem } from './AttendanceItem';
import { Attendance } from '../../types';
import { MOCK_PETS_LIST, MOCK_TUTOR, SERVICES } from '../../constants';

interface AttendanceCentralProps {
    onStartAttendance: (attendance: Attendance) => void;
    onNewAttendance: () => void;
    onPanic: () => void;
    extraAttendances?: Attendance[];
}

export const AttendanceCentral: React.FC<AttendanceCentralProps> = ({ onStartAttendance, onNewAttendance, onPanic, extraAttendances = [] }) => {
    // MOCK DATA GENERATION
    // Simulating a list of attendances fetched from backend
    const [attendances, setAttendances] = useState<Attendance[]>([
        {
            id: 'att-001',
            petId: MOCK_PETS_LIST[0].id,
            tutorId: 'tutor-001',
            status: 'SCHEDULED',
            currentStep: 'ANAMNESIS',
            triage: { weight: '4.5' },
            anamnesis: {
                mainComplaint: '',
                history: { vaccination: { status: 'unknown' } },
                vitals: {},
                systems: []
            },
            services: [
                { ...SERVICES[0], quantity: 1 }, // Consulta
            ],
            prescriptions: [],
            schedulingInfo: { date: '2025-12-29', time: '09:00', location: 'clinic' },
            createdAt: '2025-12-29T08:45:00',
            updatedAt: '2025-12-29T08:45:00'
        },
        {
            id: 'att-002',
            petId: MOCK_PETS_LIST[1].id,
            tutorId: 'tutor-001', // Same tutor for mock simplicity
            status: 'IN_PROGRESS',
            currentStep: 'SERVICES',
            triage: { weight: '3.2', temperature: '38.5' },
            anamnesis: {
                mainComplaint: 'Vômito recorrente há 2 dias',
                history: { vaccination: { status: 'up_to_date' } },
                vitals: { weight: '3.2', temp: '38.5' },
                systems: []
            },
            services: [
                { ...SERVICES[1], quantity: 1 }, // Consulta Plantão
            ],
            prescriptions: [],
            createdAt: '2025-12-29T10:15:00',
            updatedAt: '2025-12-29T10:30:00'
        },
        {
            id: 'att-003',
            petId: MOCK_PETS_LIST[0].id, // reusing pet
            tutorId: 'tutor-001',
            status: 'FINISHED',
            currentStep: 'SUMMARY',
            triage: {},
            anamnesis: { mainComplaint: 'Retorno para vacina', history: { vaccination: { status: 'outdated' } }, vitals: {}, systems: [] },
            services: [{ ...SERVICES[7], quantity: 1 }], // Vacina
            prescriptions: [],
            createdAt: '2025-12-28T14:00:00',
            updatedAt: '2025-12-28T14:45:00'
        }
    ]);

    const [filters, setFilters] = useState({ cpf: '', name: '', date: new Date().toISOString().split('T')[0] });

    const filteredAttendances = useMemo(() => {
        // Merge local mock with extra (newly scheduled) attendances
        const allAttendances = [...extraAttendances, ...attendances];

        return allAttendances.filter(att => {
            // Filter Logic
            // 1. Date (Simple string comparison for mock)
            const attDate = att.schedulingInfo?.date || att.createdAt.split('T')[0];
            // Allow showing all if no date filter, but default is today. 
            // If checking newly scheduled for future dates, we need to ensure filter matches.
            if (filters.date && attDate !== filters.date) return false;

            // 2. CPF & Name (Mocking check against MOCK_TUTOR since we don't have full tutor DB here)
            // In real app, Attendance would have populated Tutor object or we filter on backend
            if (filters.cpf && !MOCK_TUTOR.cpf.includes(filters.cpf)) return false;
            // Fuzzy search for name
            if (filters.name && !MOCK_TUTOR.name.toLowerCase().includes(filters.name.toLowerCase())) return false;

            return true;
        });
    }, [attendances, extraAttendances, filters]);

    const handleStart = (id: string) => {
        const attendance = attendances.find(a => a.id === id);
        if (attendance) {
            onStartAttendance(attendance);
        }
    };

    const handleCancel = (id: string) => {
        if (confirm('Tem certeza que deseja cancelar este atendimento? esta ação é irreversível.')) {
            setAttendances(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Central de Atendimentos</h1>
                    <p className="text-gray-500 mt-1">Gerencie a fila de espera e atendimentos do dia</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 border-none font-black tracking-wider"
                        leftIcon={<Zap size={18} fill="currentColor" />}
                        onClick={onPanic}
                    >
                        EMERGÊNCIA
                    </Button>
                    <Button variant="primary" leftIcon={<Plus size={18} />} onClick={onNewAttendance}>
                        Novo Atendimento
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <AttendanceFilters onFilterChange={setFilters} />

            {/* List */}
            <div className="space-y-4">
                {filteredAttendances.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
                        {filteredAttendances.map(att => {
                            // Find Pet Info (Mock)
                            const pet = MOCK_PETS_LIST.find(p => p.id === att.petId) || MOCK_PETS_LIST[0];

                            return (
                                <AttendanceItem
                                    key={att.id}
                                    attendance={att}
                                    petName={pet.name}
                                    tutorName={MOCK_TUTOR.name}
                                    onStartAttendance={handleStart}
                                    onCancelAttendance={handleCancel}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <SearchX size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700">Nenhum atendimento encontrado</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">
                            Não encontramos resultados para os filtros selecionados. Tente buscar por outra data ou limpe os filtros.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
