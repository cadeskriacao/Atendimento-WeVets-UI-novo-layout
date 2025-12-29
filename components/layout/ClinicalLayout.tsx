import React, { ReactNode } from 'react';
import { AttendanceSidebar } from './AttendanceSidebar';
import { Header } from '../Header';
import { ClinicalStatusBar } from './ClinicalStatusBar';

interface ClinicalLayoutProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    onGoHome?: () => void;
    header?: ReactNode; // New prop for full-width header content
    banner?: ReactNode;
    onCancelAttendance?: () => void;
    hideSidebar?: boolean; // New prop to control left sidebar visibility
}

export const ClinicalLayout: React.FC<ClinicalLayoutProps> = ({
    children,
    rightSidebar,
    onGoHome,
    header,
    banner,
    onCancelAttendance,
    hideSidebar = false
}) => {
    return (
        <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
            <Header onGoHome={onGoHome} /> {/* Top Navigation Bar */}

            <div className="flex flex-1 w-full mx-auto relative overflow-hidden">
                {/* Left Sidebar - Navigation (FIXED) */}
                {!hideSidebar && (
                    <aside className="hidden lg:flex z-20 w-64 flex-shrink-0 flex-col h-full p-3 pr-1 overflow-hidden">
                        <AttendanceSidebar onCancel={onCancelAttendance} />
                    </aside>
                )}

                {/* Main Body Area */}
                <main className="flex-1 min-w-0 bg-slate-50/50 flex flex-col overflow-hidden relative">
                    {/* PetHeader Area (FIXED) */}
                    {header && (
                        <div className="w-full z-[60] px-3 mt-3 mb-1 flex-shrink-0">
                            <div className="max-w-7xl mx-auto">
                                {header}
                            </div>
                        </div>
                    )}

                    {/* Scrollable Clinical Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pt-1 pb-16">
                        <div className="max-w-7xl mx-auto space-y-4">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Checkout (FIXED) */}
                {rightSidebar && (
                    <aside className="hidden xl:flex w-[380px] flex-shrink-0 flex-col h-full overflow-hidden p-3 pl-1 z-10">
                        <div className="h-full w-full">
                            {rightSidebar}
                        </div>
                    </aside>
                )}
            </div>

            {!hideSidebar && <ClinicalStatusBar />}
        </div>
    );
};
