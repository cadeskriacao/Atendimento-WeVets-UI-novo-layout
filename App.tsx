import React, { useState } from 'react';
import { AlertTriangle, Info, Calendar, X } from 'lucide-react';
import { Header } from './components/Header';
import { PetHeader } from './components/PetHeader';
import { ServiceList } from './components/ServiceList';
import { CartSidebar } from './components/CartSidebar';
import { Button, Banner } from './components/ui';
import { MobileCartBar } from './components/MobileCartBar';
import { PlanSelection } from './components/PlanSelection';
import { FinalizeModal, ScheduleModal, SearchModal, PetSelectionModal, BudgetDetailsModal, AnamnesisModal, GracePeriodModal, ConfirmBudgetModal, LimitExceededModal, NoCoverageModal, ServiceDetailsModal, CancelAttendanceModal, UpdateWeightModal, TutorInfoModal, UpgradePlanModal, AttendanceHistoryModal, InternalOnlyDetailsModal } from './components/Modals';
import { PlanActiveToast, GracePeriodSuccessToast, LimitPurchasedToast, ForwardSuccessToast, UpgradeSuccessToast, FinalizeFeesPaidToast, AttendanceCancelledToast, AttendanceFinalizedToast, ScheduleSuccessToast } from './components/Notifications';
import { CartItem, ModalType, Service, Pet } from './types';
import {
    MOCK_PET,
    MOCK_PETS_LIST,
    MOCK_TUTOR,
    CPF_HAPPY_PATH,
    CPF_MULTI_PET,
    CPF_NO_PLAN,
    CPF_DELINQUENT,
    SERVICES
} from './constants';

import { useAttendance } from './contexts/AttendanceContext';
import { AttendanceSidebar } from './components/layout/AttendanceSidebar';
import { DashboardSidebar } from './components/layout/DashboardSidebar';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { ClinicalLayout } from './components/layout/ClinicalLayout';
import { AttendanceCentral } from './components/central/AttendanceCentral';
import { CpfInputModal } from './components/CpfInputModal'; // New Import
import { Attendance } from './types';
import { ClinicalViewManager } from './components/modules/ClinicalViewManager';
import { useAttendanceStore } from './hooks/stores/useAttendanceStore'; // Import Store
import { mockTutorService } from './services/tutor/MockTutorService'; // Import Service
import { SalesDashboard } from './components/sales/SalesDashboard';

const App: React.FC = () => {
    const { attendance, startAttendance, cancelAttendance, finishAttendance, setServices: setContextServices, updateTriage, scheduleAttendance, recordBudgetGeneration, setCurrentStep, canFinalize, startMedicalAttendance, addPrescription } = useAttendance();

    const [view, setView] = useState<'search' | 'dashboard' | 'planSelection' | 'sales'>('search');
    const [activePet, setActivePet] = useState<Pet | null>(null);
    const [searchResultPets, setSearchResultPets] = useState<Pet[]>([]); // New State for Search Results
    // Local cart for standard flow (non-clinical)
    const [localCartItems, setLocalCartItems] = useState<CartItem[]>([]);

    // Derived cart state based on mode
    const isClinicalMode = !!attendance;
    const cartItems = isClinicalMode ? attendance.services : localCartItems;

    // Use Global Store for Modal State
    const { activeModal, openModal, closeModal } = useAttendanceStore();
    // Adapter to keep existing code working with minimal changes
    const setActiveModal = (modal: ModalType) => {
        if (modal === 'none') {
            closeModal();
        } else {
            openModal(modal);
        }
    };

    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [searchCpf, setSearchCpf] = useState('');

    // Estados de Inadimplência
    const [isDelinquent, setIsDelinquent] = useState(false);
    const [showPlanActiveToast, setShowPlanActiveToast] = useState(false);
    const [isPlanReactivated, setIsPlanReactivated] = useState(false);

    // Estados de Orçamento Salvo
    const [hasSavedBudget, setHasSavedBudget] = useState(false);
    const [isBudgetScheduled, setIsBudgetScheduled] = useState(false);

    // Estado da Anamnese (Legacy local state - kept for non-clinical or transition)
    const [hasAnamnesis, setHasAnamnesis] = useState(false);

    // Estados de Carência, Limite, Encaminhamento e Upgrade
    const [selectedServiceForCheck, setSelectedServiceForCheck] = useState<Service | null>(null);
    const [unlockedServices, setUnlockedServices] = useState<string[]>([]);
    const [showGracePaidToast, setShowGracePaidToast] = useState(false);
    const [showLimitPaidToast, setShowLimitPaidToast] = useState(false);
    const [showForwardToast, setShowForwardToast] = useState(false);
    const [showUpgradeToast, setShowUpgradeToast] = useState(false);

    // Estado para pagamento de taxas na finalização
    const [isFinalizeFeesPaid, setIsFinalizeFeesPaid] = useState(false);
    const [showFinalizePaidToast, setShowFinalizePaidToast] = useState(false);

    // Estado para cancelamento de atendimento
    // Estado para cancelamento de atendimento
    const [showAttendanceCancelledToast, setShowAttendanceCancelledToast] = useState(false);
    const [showAttendanceFinalizedToast, setShowAttendanceFinalizedToast] = useState(false);


    const [scheduleSuccessInfo, setScheduleSuccessInfo] = useState<{ date: string, time: string } | null>(null);
    const [scheduledAttendances, setScheduledAttendances] = useState<Attendance[]>([]); // New state for dashboard list

    // Unified Cart Setter
    const updateCart = (newItems: CartItem[]) => {
        if (isClinicalMode) {
            setContextServices(newItems);
        } else {
            setLocalCartItems(newItems);
        }
    };

    const addToCart = (service: Service, anticipationFee?: number, limitFee?: number) => {
        const existing = cartItems.find(item => item.id === service.id);
        let newItems;
        if (existing) {
            newItems = cartItems.map(item =>
                item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newItems = [...cartItems, { ...service, quantity: 1, anticipationFee, limitFee }];
        }
        updateCart(newItems);
    };

    const updateQuantity = (id: string, delta: number) => {
        const newItems = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        updateCart(newItems);
    };

    const removeFromCart = (id: string) => {
        const newItems = cartItems.filter(item => item.id !== id);
        updateCart(newItems);
    };

    const handleCartAction = (action: 'schedule' | 'quote' | 'finalize' | 'cancel' | 'startAttendance') => {
        if (action === 'finalize') {
            setActiveModal('finalize');
        } else if (action === 'schedule') {
            setActiveModal('schedule');
        } else if (action === 'quote') {
            setActiveModal('confirmBudget');
        } else if (action === 'startAttendance') {
            startMedicalAttendance();
        } else if (action === 'cancel') {
            if (isClinicalMode) {
                setActiveModal('cancelAttendance');
            } else {
                updateCart([]);
                setActivePet(null);
                setView('search');
                resetState();
            }
        }
    };

    const resetState = () => {
        // Delinquency
        setIsDelinquent(false);
        setShowPlanActiveToast(false);
        setIsPlanReactivated(false);

        // Budget
        setHasSavedBudget(false);
        setIsBudgetScheduled(false);

        // Anamnesis
        setHasAnamnesis(false);

        // Grace Period & Limit & Forward & Upgrade
        setUnlockedServices([]);
        setShowGracePaidToast(false);
        setShowLimitPaidToast(false);
        setShowForwardToast(false);
        setShowUpgradeToast(false);
        setSelectedServiceForCheck(null);

        // Finalize Fees
        setIsFinalizeFeesPaid(false);
        setShowFinalizePaidToast(false);

        // Cancelled Attendance
        setShowAttendanceCancelledToast(false);

        // Clinical Context should be reset via cancelAttendance if active
    };

    const handleGoHome = () => {
        if (isClinicalMode) {
            cancelAttendance();
        }
        updateCart([]);
        setActivePet(null);
        setView('search');
        resetState();
        setSearchCpf('');
    };

    const handleSearch = async (cpf: string) => {
        resetState();

        // Use MockTutorService
        const result = await mockTutorService.getTutorByCPF(cpf);

        if (!result) {
            // Handle not found scenarios (e.g., CPF not in mock)
            // For now, default to plan selection if not found or some fallback
            // But per specs, we only care about the 4 scenarios.
            alert("CPF não encontrado na base de testes.");
            return;
        }

        const { tutor, pets, status } = result;
        setSearchResultPets(pets); // Update state

        if (status === 'no_plan') {
            setView('planSelection');
            return;
        }

        if (status === 'delinquent') {
            setIsDelinquent(true);
            // Block user but show dashboard (blocked state)
            setActivePet(pets[0]);
            setView('dashboard');
            return;
        }

        // Active Case
        if (pets.length > 1) {
            // Case 222: Multiple Pets
            setActiveModal('petSelection');
        } else {
            // Case 111: Single Pet -> Direct to Attendance
            startAttendance(pets[0].id, tutor.cpf);
            setActivePet(pets[0]);
            setActiveModal('none'); // Close CPF inputs
            setView('dashboard');
        }
    };

    const handlePetSelect = (pet: Pet) => {
        // Normal flow
        startAttendance(pet.id, MOCK_TUTOR.cpf);
        setActivePet(pet);
        setActiveModal('none');
        setView('dashboard');
    };

    const handleStartAttendanceFromCentral = (attendanceData: Attendance) => {
        // Hydrate context with existing attendance data
        // For MOCK purposes, we just start a "fresh" attendance but ideally we'd load the full object
        // We will pass the mock data to startAttendance if supported, or just init
        startAttendance(attendanceData.petId, MOCK_TUTOR.cpf, attendanceData);

        // Find pet object
        const pet = MOCK_PETS_LIST.find(p => p.id === attendanceData.petId);
        setActivePet(pet || null);

        setView('dashboard');
    };

    const handleSimulatePayment = () => {
        setIsPlanReactivated(true);
        setShowPlanActiveToast(true);
        // Automatically start attendance to match the screenshot flow
        if (activePet) {
            startAttendance(activePet.id, MOCK_TUTOR.cpf);
        }
    };
    const handleOpenBudgetDetails = () => setActiveModal('budgetDetails');
    const handleScheduleFromBudget = () => setActiveModal('schedule');
    const handleConfirmBudgetSchedule = () => {
        setActiveModal('none');
        setHasSavedBudget(false);
        setIsBudgetScheduled(true);
    };
    const handleSaveAnamnesis = () => {
        setHasAnamnesis(true);
        setActiveModal('none');
    };

    const handleServiceClick = (service: Service, type: 'grace' | 'limit' | 'noCoverage' | 'internalOnly') => {
        setSelectedServiceForCheck(service);
        if (type === 'grace') setActiveModal('gracePeriod');
        else if (type === 'limit') setActiveModal('limitExceeded');
        else if (type === 'noCoverage') setActiveModal('noCoverage');
        else if (type === 'internalOnly') setActiveModal('internalOnlyDetails');
    };

    const handleServiceForward = (service: Service) => {
        addPrescription({
            name: service.name,
            dosage: '-',
            frequency: '-',
            duration: '-',
            notes: 'Encaminhamento Interno/Externo'
        });
        setShowForwardToast(true);
    };
    const handleSimulateGracePayment = () => {
        if (selectedServiceForCheck) {
            setUnlockedServices(prev => [...prev, selectedServiceForCheck.id]);
            setShowGracePaidToast(true);
            setActiveModal('none');
        }
    };
    const handleGracePeriodAddToBudget = (anticipationFee: number) => {
        if (selectedServiceForCheck) {
            addToCart(selectedServiceForCheck, anticipationFee, undefined);
            setActiveModal('none');
            setSelectedServiceForCheck(null);
        }
    };
    const handleSimulateLimitPayment = () => {
        if (selectedServiceForCheck) {
            setUnlockedServices(prev => [...prev, selectedServiceForCheck.id]);
            setShowLimitPaidToast(true);
            setActiveModal('none');
        }
    };
    const handleLimitExceededAddToBudget = (limitFee: number) => {
        if (selectedServiceForCheck) {
            addToCart(selectedServiceForCheck, undefined, limitFee);
            setActiveModal('none');
            setSelectedServiceForCheck(null);
        }
    };
    const handleSimulateFinalizeFeesPayment = () => {
        setIsFinalizeFeesPaid(true);
        setShowFinalizePaidToast(true);
    };
    const handleOpenServiceDetails = () => setActiveModal('serviceDetails');
    const handleAddServiceFromDetails = () => setActiveModal('none');
    const handleConfirmBudget = () => {
        setActiveModal('none');
        if (isClinicalMode) {
            recordBudgetGeneration();
        }
    };
    const handleCancelAttendance = () => setActiveModal('cancelAttendance');
    const handleUpdateWeight = () => setActiveModal('updateWeight');
    const handleOpenTutorInfo = () => setActiveModal('tutorInfo');
    const handleOpenUpgradePlan = () => setActiveModal('upgradePlan');
    const handleOpenHistory = () => setActiveModal('attendanceHistory');

    const handleConfirmCancellation = (reason: string) => {
        if (attendance) {
            const cancelledAtt: Attendance = {
                ...attendance,
                status: 'CANCELLED',
                cancellationReason: reason,
                updatedAt: new Date().toISOString()
            };
            // Add to local list so it shows up on dashboard
            setScheduledAttendances(prev => [cancelledAtt, ...prev.filter(a => a.id !== cancelledAtt.id)]);
        }

        setActiveModal('none');
        if (isClinicalMode) {
            cancelAttendance();
        }
        updateCart([]);
        setActivePet(null);
        setView('search');
        resetState();
        setTimeout(() => setShowAttendanceCancelledToast(true), 100);
    };

    const handleAttendanceFinish = () => {
        if (attendance) {
            const finishedAtt: Attendance = {
                ...attendance,
                status: 'FINISHED',
                updatedAt: new Date().toISOString()
            };
            // Add to local list so it shows up on dashboard
            setScheduledAttendances(prev => [finishedAtt, ...prev.filter(a => a.id !== finishedAtt.id)]);
        }

        finishAttendance();

        // Allow time for context updates if needed, then reset UI
        setTimeout(() => {
            setActiveModal('none');
            setActivePet(null);
            setView('search');
            resetState();
            setShowAttendanceFinalizedToast(true);
            setTimeout(() => setShowAttendanceFinalizedToast(false), 3000);
        }, 100);
    };

    const handleSaveBudget = () => {
        if (activePet) {
            const budgetId = `bud-${Date.now()}`;
            const newBudget: Attendance = {
                id: budgetId,
                petId: activePet.id,
                tutorId: MOCK_TUTOR.cpf,
                status: 'BUDGETING',
                currentStep: 'SERVICES',
                triage: { weight: activePet.weight },
                anamnesis: { mainComplaint: '', history: { vaccination: { status: 'unknown' } }, vitals: {}, systems: [] },
                services: [...cartItems],
                prescriptions: [],
                schedulingInfo: { date: new Date().toISOString().split('T')[0], time: '12:00', location: 'clinic' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setScheduledAttendances(prev => [newBudget, ...prev]);
        }

        setActiveModal('none');
        updateCart([]);
        setActivePet(null);
        setView('search');
        resetState();
    };



    if (view === 'search') {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col pb-20 lg:pb-0">
                <Header onGoHome={handleGoHome} />

                <div className="flex flex-1 max-h-[calc(100vh-64px)] overflow-hidden">
                    {/* Left Sidebar */}
                    <aside className="hidden lg:block w-72 p-4 h-full">
                        <DashboardSidebar
                            currentView="search"
                            onNavigate={(view) => setView(view)}
                        />
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto bg-gray-100">
                        <AttendanceCentral
                            onStartAttendance={handleStartAttendanceFromCentral}
                            onNewAttendance={() => {
                                setActiveModal('cpfInput');
                            }}
                            extraAttendances={scheduledAttendances}
                        />
                    </main>
                </div>

                <MobileNavbar
                    currentView="search"
                    onNavigate={(view: 'search' | 'sales') => setView(view)}
                />

                {showAttendanceCancelledToast && (
                    <AttendanceCancelledToast onClose={() => setShowAttendanceCancelledToast(false)} />
                )}
                {showAttendanceFinalizedToast && (
                    <AttendanceFinalizedToast onClose={() => setShowAttendanceFinalizedToast(false)} />
                )}
                {activeModal === 'petSelection' && (
                    <PetSelectionModal

                        pets={searchResultPets.length > 0 ? searchResultPets : MOCK_PETS_LIST}
                        onSelect={handlePetSelect}
                        onClose={() => setActiveModal('none')}
                    />
                )}
                {activeModal === 'cpfInput' && (
                    <CpfInputModal
                        onClose={() => setActiveModal('none')}
                        onSearch={(cpf) => {
                            setSearchCpf(cpf);
                            handleSearch(cpf);
                        }}
                    />
                )}
            </div>

        );
    }

    if (view === 'sales') {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col pb-20 lg:pb-0">
                <Header onGoHome={handleGoHome} />

                <div className="flex flex-1 max-h-[calc(100vh-64px)] overflow-hidden">
                    {/* Left Sidebar */}
                    <aside className="hidden lg:block w-72 p-4 h-full">
                        <DashboardSidebar
                            currentView="sales"
                            onNavigate={(view) => setView(view)}
                        />
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                        <div className="max-w-7xl mx-auto pb-12">
                            <SalesDashboard />
                        </div>
                    </main>
                </div>

                <MobileNavbar
                    currentView="sales"
                    onNavigate={(view: 'search' | 'sales') => setView(view)}
                />
            </div>
        );
    }

    if (view === 'planSelection') {
        return (
            <div className="min-h-screen bg-gray-100 font-sans">
                <Header onGoHome={handleGoHome} />
                <PlanSelection onBack={() => setView('search')} />
            </div>
        );
    }

    // --- CLINICAL LAYOUT REMOVED - UNIFIED BELOW ---

    // --- UNIFIED DASHBOARD LAYOUT (Standard & Clinical) ---
    // If we are in 'dashboard' view but not yet in 'clinical mode' (attendance started), 
    // we still want to show the ClinicalLayout structure.
    return (
        <ClinicalLayout
            onGoHome={handleGoHome}
            hideSidebar={isDelinquent && !isPlanReactivated}
            // Right Sidebar (Cart)
            rightSidebar={
                (!isDelinquent || isPlanReactivated) ? (
                    <CartSidebar
                        items={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onAction={handleCartAction}
                        isAttendanceMode={isClinicalMode}
                        isScheduled={attendance?.status === 'SCHEDULED'}
                        isInProgress={attendance?.status === 'IN_PROGRESS'}
                        canFinalize={canFinalize}
                    />
                ) : null
            }
            // Header
            header={
                <>
                    {activePet && (
                        <PetHeader
                            pet={activePet}
                            tutor={MOCK_TUTOR}
                            onDetailsClick={handleOpenServiceDetails}
                            onUpdateWeightClick={handleUpdateWeight}
                            onTutorInfoClick={handleOpenTutorInfo}
                            onUpgradePlanClick={handleOpenUpgradePlan}
                            onHistoryClick={handleOpenHistory}
                            banner={
                                // Delinquency Banner (if needed, though we use overlay now) or other banners
                                isDelinquent && !isPlanReactivated ? null : // Overlay handles this
                                    hasSavedBudget && !isBudgetScheduled ? (
                                        <Banner
                                            icon={<Calendar className="text-primary-600 flex-shrink-0" size={24} />}
                                            action={<Button onClick={handleOpenBudgetDetails} variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50 px-6 shadow-sm">Detalhes</Button>}
                                        >
                                            Atenção! Existe um orçamento salvo para esse pet. Clique ao lado para acessar.
                                        </Banner>
                                    ) : isBudgetScheduled ? (
                                        <Banner
                                            className="animate-in fade-in slide-in-from-top duration-500"
                                            icon={<Calendar className="text-primary-600 flex-shrink-0" size={24} />}
                                            action={<Button variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50 px-6 h-9 text-sm shadow-sm">Detalhes</Button>}
                                            onClose={() => setIsBudgetScheduled(false)}
                                        >
                                            Pet com atendimento agendado para dia 20/01/2026 às 14:30
                                        </Banner>
                                    ) : null
                            }
                        />
                    )}
                </>
            }
            banner={null}
            overlay={
                isDelinquent && !isPlanReactivated && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-500">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-sm text-center border-t-4 border-status-error animate-in zoom-in-95 duration-300 mx-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 ring-8 ring-red-50/50">
                                <AlertTriangle size={32} className="text-status-error" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Plano Suspenso</h2>
                            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed font-medium">
                                Constam faturas em aberto para este tutor. Para prosseguir com o atendimento, é necessário regularizar as pendências.
                            </p>
                            <div className="space-y-3 w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-red-100 text-status-error font-bold hover:bg-red-50 h-10 md:h-11 rounded-xl text-sm md:text-base transition-all"
                                    onClick={() => alert("Link de pagamento enviado para o tutor via WhatsApp e E-mail!")}
                                >
                                    Enviar Link de Pagamento
                                </Button>
                                <Button
                                    className="w-full bg-status-error hover:bg-red-600 text-white font-bold h-10 md:h-11 rounded-xl text-sm md:text-base shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all border border-transparent"
                                    onClick={handleSimulatePayment}
                                >
                                    Simular Pagamento Realizado
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        >
            {/* Main Content */}

            {/* Toasts */}
            {showPlanActiveToast && <PlanActiveToast onClose={() => setShowPlanActiveToast(false)} />}
            {showGracePaidToast && <GracePeriodSuccessToast onClose={() => setShowGracePaidToast(false)} />}
            {showLimitPaidToast && <LimitPurchasedToast onClose={() => setShowLimitPaidToast(false)} />}
            {showForwardToast && <ForwardSuccessToast onClose={() => setShowForwardToast(false)} />}
            {showUpgradeToast && <UpgradeSuccessToast onClose={() => setShowUpgradeToast(false)} />}
            {showFinalizePaidToast && <FinalizeFeesPaidToast onClose={() => setShowFinalizePaidToast(false)} />}
            {showAttendanceFinalizedToast && <AttendanceFinalizedToast onClose={() => setShowAttendanceFinalizedToast(false)} />}
            {scheduleSuccessInfo && <ScheduleSuccessToast date={scheduleSuccessInfo.date} time={scheduleSuccessInfo.time} onClose={() => setScheduleSuccessInfo(null)} />}

            {/* Main Content Modules */}
            <div className={`transition-all duration-500 pb-20 lg:pb-0 ${(isDelinquent && !isPlanReactivated) ? 'opacity-25 filter blur-sm pointer-events-none' : ''}`}>
                <ClinicalViewManager
                    serviceListProps={{
                        onAddToCart: addToCart,
                        onOpenAnamnesis: () => setActiveModal('anamnesis'),
                        hasAnamnesis: hasAnamnesis,
                        unlockedServices: unlockedServices,
                        onServiceClick: handleServiceClick,
                        onServiceForward: handleServiceForward
                    }}
                    onFinish={handleAttendanceFinish}
                />
            </div>

            {/* Mobile Cart Bar */}
            <MobileCartBar
                items={cartItems}
                onOpenCart={() => setIsMobileCartOpen(true)}
            />

            {/* Mobile Cart Drawer */}
            {isMobileCartOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileCartOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[90%] max-w-[350px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-bold text-lg text-gray-800">Seu Carrinho</h3>
                            <button
                                onClick={() => setIsMobileCartOpen(false)}
                                className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-3 bg-gray-50/30">
                            <CartSidebar
                                items={cartItems}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                                onAction={(action) => {
                                    handleCartAction(action);
                                    if (action !== 'quote') setIsMobileCartOpen(false);
                                }}
                                isAttendanceMode={isClinicalMode}
                                isScheduled={attendance?.status === 'SCHEDULED'}
                                isInProgress={attendance?.status === 'IN_PROGRESS'}
                                canFinalize={canFinalize}
                                className="max-h-full border-0 shadow-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delinquency Overlay */}
            {isDelinquent && !isPlanReactivated && (
                <div className="absolute inset-0 z-50 flex items-start justify-center pt-24 pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border border-red-100 mx-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Plano Suspenso</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Constam faturas em aberto para este tutor. Para prosseguir com o atendimento, é necessário regularizar as pendências.
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    alert('Link de pagamento enviado!');
                                }}
                                variant="outline"
                                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            >
                                Enviar Link de Pagamento
                            </Button>
                            <Button
                                onClick={handleSimulatePayment}
                                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                            >
                                Simular Pagamento Realizado
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modals */}
            {activeModal === 'finalize' && <FinalizeModal items={cartItems} onClose={() => setActiveModal('none')} onConfirm={handleAttendanceFinish} isAttendanceMode={isClinicalMode} isFeesPaid={isFinalizeFeesPaid} onCancelProcess={() => setActiveModal('none')} attendance={attendance} />}
            {activeModal === 'cancelAttendance' && attendance && <CancelAttendanceModal attendance={attendance} onClose={() => setActiveModal('none')} onConfirm={handleConfirmCancellation} />}
            {activeModal === 'schedule' && <ScheduleModal onClose={() => setActiveModal('none')} onConfirm={(data) => {
                if (isClinicalMode) {
                    scheduleAttendance(data);
                    if (attendance) {
                        setScheduledAttendances(prev => [{ ...attendance, status: 'SCHEDULED', schedulingInfo: data, updatedAt: new Date().toISOString() }, ...prev]);
                    }
                } else if (activePet) {
                    const scheduledAtt: Attendance = {
                        id: `sch-${Date.now()}`,
                        petId: activePet.id,
                        tutorId: MOCK_TUTOR.cpf,
                        status: 'SCHEDULED',
                        currentStep: 'SERVICES',
                        triage: { weight: activePet.weight },
                        anamnesis: { mainComplaint: '', history: { vaccination: { status: 'unknown' } }, vitals: {}, systems: [] },
                        services: [...cartItems],
                        prescriptions: [],
                        schedulingInfo: data,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    setScheduledAttendances(prev => [scheduledAtt, ...prev]);
                }

                setScheduleSuccessInfo({ date: data.date, time: data.time });
                setActiveModal('none');
                updateCart([]);
                setActivePet(null);
                setView('search');
                resetState();
            }} />}
            {activeModal === 'budgetDetails' && <BudgetDetailsModal onClose={() => setActiveModal('none')} onSchedule={handleScheduleFromBudget} />}
            {activeModal === 'confirmBudget' && <ConfirmBudgetModal items={cartItems} onClose={() => setActiveModal('none')} onConfirm={handleConfirmBudget} onSave={handleSaveBudget} isAttendanceMode={isClinicalMode} />}
            {activeModal === 'gracePeriod' && <GracePeriodModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} onAddToBudget={handleGracePeriodAddToBudget} />}
            {activeModal === 'limitExceeded' && <LimitExceededModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} onAddToBudget={handleLimitExceededAddToBudget} />}
            {activeModal === 'noCoverage' && <NoCoverageModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} />}
            {activeModal === 'serviceDetails' && <ServiceDetailsModal onClose={() => setActiveModal('none')} onAddService={handleAddServiceFromDetails} onFinalize={() => setActiveModal('finalize')} cartItems={cartItems} />}
            {activeModal === 'updateWeight' && activePet && <UpdateWeightModal currentWeight={activePet.weight || '0kg'} onClose={() => setActiveModal('none')} onSave={(newWeight) => { setActivePet(prev => prev ? { ...prev, weight: newWeight + 'kg' } : null); if (isClinicalMode) { updateTriage({ weight: newWeight }); } setActiveModal('none'); }} />}
            {activeModal === 'tutorInfo' && <TutorInfoModal tutor={MOCK_TUTOR} onClose={() => setActiveModal('none')} />}
            {activeModal === 'upgradePlan' && <UpgradePlanModal onClose={() => setActiveModal('none')} />}
            {activeModal === 'internalOnlyDetails' && <InternalOnlyDetailsModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} onForward={() => { setActiveModal('none'); handleServiceForward(selectedServiceForCheck!); setCurrentStep('PRESCRIPTION'); }} onUpgrade={() => { setActiveModal('upgradePlan'); }} />}
            {activeModal === 'attendanceHistory' && <AttendanceHistoryModal pet={activePet} onClose={() => setActiveModal('none')} />}

        </ClinicalLayout>
    );
};

export default App;
