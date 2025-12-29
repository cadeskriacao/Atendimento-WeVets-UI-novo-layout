import React, { ReactNode } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { TriageView } from './TriageView';
// Will import other views as they are created
import { AnamnesisView } from './AnamnesisView';
import { PrescriptionView } from './PrescriptionView';
import { SummaryView } from './SummaryView';
import { ServiceList } from '../ServiceList'; // We will reuse this, but might need modification

interface ClinicalViewManagerProps {
    // Props passed down from App that might be needed by ServiceList
    serviceListProps: any;
    onFinish?: () => void;
}

export const ClinicalViewManager: React.FC<ClinicalViewManagerProps> = ({ serviceListProps, onFinish }) => {
    const { attendance, updateAnamnesis } = useAttendance();

    if (!attendance) return null;

    switch (attendance.currentStep) {

        case 'ANAMNESIS':
            return <AnamnesisView />;
        case 'SERVICES':
            // We strip the "Layout" aspects from ServiceList if possible via props, or just render it.
            // ServiceList currently seems to be a full page component. We might need to adjust it.
            return (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ServiceList {...serviceListProps} />
                </div>
            );
        case 'PRESCRIPTION':
            return <PrescriptionView />;
        case 'SUMMARY':
            return <SummaryView onFinish={onFinish} />;
        default:
            return <div>Select a step</div>;
    }
};
