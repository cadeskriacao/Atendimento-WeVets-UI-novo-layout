import React, { useState, useMemo } from 'react';
import { Plus, SearchX } from 'lucide-react';
import { Button } from '../ui';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceItem } from './AttendanceItem';
import { Attendance } from '../../types';
import { MOCK_PETS_LIST, MOCK_TUTOR, SERVICES } from '../../constants';

interface AttendanceCentralProps {
    onStartAttendance: (attendance: Attendance) => void;
    onNewAttendance: () => void;
    extraAttendances?: Attendance[];
}

export const AttendanceCentral: React.FC<AttendanceCentralProps> = ({ onStartAttendance, onNewAttendance, extraAttendances = [] }) => {
    // MOCK DATA GENERATION
    const [attendances, setAttendances] = useState<Attendance[]>(() => {
        const baseAttendances: Attendance[] = [];
        const statuses: Attendance['status'][] = ['SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'WAITING' as any]; // Casting for extra statuses if needed

        for (let i = 1; i <= 25; i++) {
            const status = statuses[Math.floor(Math.random() * statuses.length)] || 'SCHEDULED';
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(i / 5)); // Spread dates over a few days

            baseAttendances.push({
                id: `att-${String(i).padStart(3, '0')}`,
                petId: MOCK_PETS_LIST[i % MOCK_PETS_LIST.length].id,
                tutorId: 'tutor-001',
                status: status,
                currentStep: status === 'FINISHED' ? 'SUMMARY' : 'SERVICES',
                triage: { weight: `${(3 + Math.random() * 5).toFixed(1)}` },
                anamnesis: {
                    mainComplaint: `Queixa simulada ${i}`,
                    history: { vaccination: { status: 'unknown' } },
                    vitals: {},
                    systems: []
                },
                services: [
                    { ...SERVICES[i % SERVICES.length], quantity: 1 }
                ],
                prescriptions: [],
                schedulingInfo: {
                    date: date.toISOString().split('T')[0],
                    time: `${String(9 + (i % 8)).padStart(2, '0')}:00`,
                    location: 'clinic'
                },
                createdAt: date.toISOString(),
                updatedAt: date.toISOString()
            });
        }
        return baseAttendances;
    });

    const [filters, setFilters] = useState({ cpf: '', name: '', date: '' }); // Default date empty to show all
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredAttendances = useMemo(() => {
        // Merge and deduplicate by ID, giving precedence to extraAttendances
        const extraIds = new Set(extraAttendances.map(a => a.id));
        const allAttendances = [...extraAttendances, ...attendances.filter(a => !extraIds.has(a.id))];

        return allAttendances.filter(att => {
            // Filter Logic
            const attDate = att.schedulingInfo?.date || att.createdAt.split('T')[0];
            if (filters.date && attDate !== filters.date) return false;

            if (filters.cpf && !MOCK_TUTOR.cpf.includes(filters.cpf)) return false;
            // Fuzzy search for name (mock check)
            if (filters.name && !MOCK_TUTOR.name.toLowerCase().includes(filters.name.toLowerCase())) return false;

            return true;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [attendances, extraAttendances, filters]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAttendances.length / ITEMS_PER_PAGE);
    const paginatedAttendances = filteredAttendances.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                    <Button variant="primary" leftIcon={<Plus size={18} />} onClick={onNewAttendance}>
                        Novo Atendimento
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <AttendanceFilters onFilterChange={(newFilters) => { setFilters(newFilters); setCurrentPage(1); }} />

            {/* List */}
            <div className="space-y-4">
                {paginatedAttendances.length > 0 ? (
                    <>
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
                            {paginatedAttendances.map(att => {
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

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="text-sm text-gray-500">
                                    Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAttendances.length)}</span> de <span className="font-medium">{filteredAttendances.length}</span> resultados
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-4 py-2 text-sm"
                                    >
                                        Anterior
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                        ? 'bg-primary-600 text-white shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="px-4 py-2 text-sm"
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
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
