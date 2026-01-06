import { create } from 'zustand';
import { ModalType } from '../../types';

interface AttendanceUIState {
    activeModal: ModalType;
    selectedServiceId: string | null;
    selectedPetId: string | null;

    // Actions
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
    setSelectedServiceId: (id: string | null) => void;
    setSelectedPetId: (id: string | null) => void;
}

export const useAttendanceStore = create<AttendanceUIState>((set) => ({
    activeModal: 'none',
    selectedServiceId: null,
    selectedPetId: null,

    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: 'none' }),
    setSelectedServiceId: (id) => set({ selectedServiceId: id }),
    setSelectedPetId: (id) => set({ selectedPetId: id }),
}));
