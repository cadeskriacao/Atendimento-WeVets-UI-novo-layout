import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Attendance, AttendanceStatus, AttendanceStep, CartItem, PrescriptionItem, TriageData, AnamnesisData } from '../types';
const generateId = () => Math.random().toString(36).substring(2, 9);

interface AttendanceContextType {
    attendance: Attendance | null;
    startAttendance: (petId: string, tutorId: string, overrides?: Partial<Attendance>) => void;
    updateStatus: (status: AttendanceStatus) => void;
    setCurrentStep: (step: AttendanceStep) => void;

    // Data Updates
    updateTriage: (data: Partial<TriageData>) => void;
    updateAnamnesis: (data: Partial<AnamnesisData>) => void;

    // Cart Delegation (Wraps existing logic concepts)
    setServices: (items: CartItem[]) => void;

    // Prescription
    addPrescription: (item: Omit<PrescriptionItem, 'id'>) => void;
    removePrescription: (id: string) => void;
    updatePrescriptionItem: (id: string, data: Partial<PrescriptionItem>) => void;

    // Actions
    saveDraft: () => void;
    finishAttendance: () => void;
    cancelAttendance: () => void;
    scheduleAttendance: (info: { date: string; time: string; location: 'clinic' | 'home' }) => void;
    recordBudgetGeneration: () => void;
    startMedicalAttendance: () => void;

    // Helper to check validity
    canFinalize: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
};

interface AttendanceProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = 'wevets_attendance_draft';

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ children }) => {
    const [attendance, setAttendance] = useState<Attendance | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Basic validation or migration could go here
                setAttendance(parsed);
            } catch (e) {
                console.error("Failed to load attendance draft", e);
            }
        }
    }, []);

    // Auto-save logic
    useEffect(() => {
        if (attendance) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [attendance]);

    const startAttendance = (petId: string, tutorId: string, overrides?: Partial<Attendance>) => {
        const newAttendance: Attendance = {
            id: generateId(),
            petId,
            tutorId,
            status: 'INITIATED',
            currentStep: 'ANAMNESIS',
            triage: {
                weight: '',
                temperature: '',
                bloodPressure: '',
                heartRate: '',
                respiratoryRate: ''
            },
            anamnesis: {
                mainComplaint: '',
                history: {
                    vaccination: { status: 'unknown' }
                },
                vitals: {},
                systems: []
            },
            services: [],
            prescriptions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...overrides
        };
        setAttendance(newAttendance);
    };

    const updateStatus = (status: AttendanceStatus) => {
        if (!attendance) return;
        setAttendance({ ...attendance, status, updatedAt: new Date().toISOString() });
    };

    const setCurrentStep = (step: AttendanceStep) => {
        if (!attendance) return;
        setAttendance({ ...attendance, currentStep: step });
    };

    const updateTriage = (data: Partial<TriageData>) => {
        if (!attendance) return;
        setAttendance(prev => prev ? ({
            ...prev,
            triage: { ...prev.triage, ...data }, // Keep legacy triage sync if needed, or deprecate
            updatedAt: new Date().toISOString()
        }) : null);
    };

    const updateAnamnesis = (data: Partial<AnamnesisData>) => {
        if (!attendance) return;
        setAttendance(prev => prev ? ({
            ...prev,
            anamnesis: { ...prev.anamnesis, ...data },
            updatedAt: new Date().toISOString()
        }) : null);
    };

    const setServices = (items: CartItem[]) => {
        if (!attendance) return;
        setAttendance(prev => prev ? ({
            ...prev,
            services: items,
            updatedAt: new Date().toISOString()
        }) : null);
    };

    const addPrescription = (item: Omit<PrescriptionItem, 'id'>) => {
        if (!attendance) return;
        const newItem: PrescriptionItem = { ...item, id: generateId() };
        setAttendance(prev => prev ? ({
            ...prev,
            prescriptions: [...prev.prescriptions, newItem],
            updatedAt: new Date().toISOString()
        }) : null);
    };

    const removePrescription = (id: string) => {
        if (!attendance) return;
        setAttendance(prev => prev ? ({
            ...prev,
            prescriptions: prev.prescriptions.filter(p => p.id !== id),
            updatedAt: new Date().toISOString()
        }) : null);
    };

    const saveDraft = () => {
        // Handled by useEffect, but exposed if manual save needed
        if (attendance) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
        }
    };

    const finishAttendance = () => {
        if (!attendance) return;
        setAttendance({ ...attendance, status: 'FINISHED', updatedAt: new Date().toISOString() });
        // In a real app, here we would POST to server.
        // For now, we might just clear the draft or keep it as 'History'.
        // Let's keep it in state but maybe flush from storage or mark as done.
        console.log("Attendance Finalized:", attendance);
    };

    const cancelAttendance = () => {
        setAttendance(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Derived State
    const canFinalize = !!attendance &&
        attendance.services.length > 0 &&
        attendance.anamnesis.mainComplaint.length > 0 &&
        (!!attendance.triage.weight || !!attendance.anamnesis.vitals.weight) &&
        !!attendance.schedulingInfo;

    return (
        <AttendanceContext.Provider value={{
            attendance,
            startAttendance,
            updateStatus,
            setCurrentStep,
            updateTriage,
            updateAnamnesis,
            setServices,
            addPrescription,
            removePrescription,
            updatePrescriptionItem: (id: string, data: Partial<PrescriptionItem>) => {
                if (!attendance) return;
                setAttendance(prev => prev ? ({
                    ...prev,
                    prescriptions: prev.prescriptions.map(p => p.id === id ? { ...p, ...data } : p),
                    updatedAt: new Date().toISOString()
                }) : null);
            },
            saveDraft,
            finishAttendance,
            cancelAttendance,
            canFinalize,
            scheduleAttendance: (info) => {
                if (!attendance) return;
                setAttendance({
                    ...attendance,
                    status: 'SCHEDULED',
                    schedulingInfo: info,
                    updatedAt: new Date().toISOString()
                });
            },
            recordBudgetGeneration: () => {
                if (!attendance) return;
                setAttendance({
                    ...attendance,
                    budgetGenerated: true,
                    updatedAt: new Date().toISOString()
                });
            },
            startMedicalAttendance: () => {
                if (!attendance || attendance.status !== 'SCHEDULED') return;
                setAttendance({
                    ...attendance,
                    status: 'IN_PROGRESS',
                    updatedAt: new Date().toISOString()
                });
            }
        }}>
            {children}
        </AttendanceContext.Provider>
    );
};
