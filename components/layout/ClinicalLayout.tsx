import React, { ReactNode } from 'react';
import { AttendanceTabs } from './AttendanceTabs';
import { Header } from '../Header';
import { ClinicalStatusBar } from './ClinicalStatusBar';

interface ClinicalLayoutProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    onGoHome?: () => void;
    header?: ReactNode; // New prop for full-width header content
    banner?: ReactNode;
    overlay?: ReactNode; // New prop for overlays (e.g., blockers) that sit below the main header
    hideSidebar?: boolean; // Prop kept for compatibility but left sidebar is removed
}

export const ClinicalLayout: React.FC<ClinicalLayoutProps> = ({
    children,
    rightSidebar,
    onGoHome,
    header,
    banner,
    overlay,
    hideSidebar = false
}) => {
    return (
        <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
            <Header onGoHome={onGoHome} /> {/* Top Navigation Bar */}

            <div className="flex flex-1 w-full max-w-[1600px] mx-auto relative overflow-hidden">
                {/* Overlay Area (Blockers, etc.) - Positioned below Header, covers everything else */}
                {overlay}

                {/* Main Body Area */}
                <main className="flex-1 min-w-0 flex flex-col overflow-hidden relative">
                    {/* PetHeader Area (FIXED) */}
                    {header && (
                        <div className="w-full z-[60] px-3 mt-3 flex-shrink-0">
                            <div className="w-full space-y-3">
                                {header}
                            </div>
                        </div>
                    )}

                    {/* Unified Clinical Content Card */}
                    <div className="flex-1 overflow-hidden pt-3 px-3 pb-[16px] flex flex-col">
                        <div className="w-full flex-1 flex flex-col bg-gray-50 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-200 overflow-hidden">
                            {/* Horizontal Tabs Navigation (Header of the Card) */}
                            {header && <AttendanceTabs />}

                            {/* Scrollable Content (Body of the Card) */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Checkout (FIXED) */}
                {rightSidebar && (
                    <aside className="hidden xl:flex w-[380px] flex-shrink-0 flex-col h-full overflow-hidden pt-3 pr-3 pb-[16px] pl-1 z-10">
                        <div className="h-full w-full">
                            {rightSidebar}
                        </div>
                    </aside>
                )}
            </div>

            {/* {!hideSidebar && <ClinicalStatusBar />} */}
        </div>
    );
};

