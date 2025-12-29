import React from 'react';
import { useAttendanceStore } from '../../hooks/stores/useAttendanceStore';
import { useAttendance, useUpdateAttendance, useFinalizeAttendance } from '../../hooks/queries/useAttendanceQuery';
import {
    AnamnesisModal,
    ConfirmBudgetModal,
    ServiceDetailsModal,
    // ... import other modals as needed
} from '../Modals';
import { AnamnesisData } from '../../core/domain/attendance';

export const ModalsContainer: React.FC = () => {
    const { activeModal, closeModal } = useAttendanceStore();

    // TODO: Get real ID from route/store
    const attendanceId = 'mock-id';
    const { data: attendance } = useAttendance(attendanceId);
    const updateAttendance = useUpdateAttendance();

    if (!attendance) return null;

    const handleSaveAnamnesis = async (data: AnamnesisData) => {
        updateAttendance.mutate({
            ...attendance,
            anamnesis: data,
            currentStep: 'SERVICES' // Advance step logic
        });
        closeModal();
    };

    return (
        <>
            {activeModal === 'anamnesis' && (
                <AnamnesisModal

                    onClose={closeModal}
                    onSave={handleSaveAnamnesis}
                    initialData={attendance.anamnesis as any} // Cast for now until Modals.tsx types are updated
                />
            )}

            {/* Add other modals here as we migrate them */}
        </>
    );
};
