import React, { useState } from 'react';
import { AlertTriangle, Info, Calendar, X } from 'lucide-react';
import { Header } from './components/Header';
import { PetHeader } from './components/PetHeader';
import { ServiceList } from './components/ServiceList';
import { CartSidebar } from './components/CartSidebar';
import { Button, Banner } from './components/ui';
import { MobileCartBar } from './components/MobileCartBar';
import { PlanSelection } from './components/PlanSelection';
import { FinalizeModal, ScheduleModal, SearchModal, PetSelectionModal, BudgetDetailsModal, AnamnesisModal, GracePeriodModal, ConfirmBudgetModal, LimitExceededModal, NoCoverageModal, ServiceDetailsModal, CancelAttendanceModal, UpdateWeightModal, TutorInfoModal, UpgradePlanModal, AttendanceHistoryModal } from './components/Modals';
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
import { ClinicalLayout } from './components/layout/ClinicalLayout';
import { AttendanceCentral } from './components/central/AttendanceCentral';
import { CpfInputModal } from './components/CpfInputModal'; // New Import
import { Attendance } from './types';
import { ClinicalViewManager } from './components/modules/ClinicalViewManager';
import { useAttendanceStore } from './hooks/stores/useAttendanceStore'; // Import Store
import { mockTutorService } from './services/tutor/MockTutorService'; // Import Service
import { SalesDashboard } from './components/sales/SalesDashboard';

const App: React.FC = () => {
    const { attendance, startAttendance, cancelAttendance, setServices: setContextServices, updateTriage, scheduleAttendance, recordBudgetGeneration } = useAttendance();

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
    const [showAttendanceCancelledToast, setShowAttendanceCancelledToast] = useState(false);
    const [showAttendanceFinalizedToast, setShowAttendanceFinalizedToast] = useState(false);
    const [isPanicMode, setIsPanicMode] = useState(false);
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

    const handleCartAction = (action: 'schedule' | 'quote' | 'finalize' | 'cancel') => {
        if (action === 'finalize') {
            setActiveModal('finalize');
        } else if (action === 'schedule') {
            setActiveModal('schedule');
        } else if (action === 'quote') {
            setActiveModal('confirmBudget');
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
            if (isPanicMode) {
                handlePetSelect(pets[0]);
            } else {
                startAttendance(pets[0].id, tutor.cpf);
                setActivePet(pets[0]);
                setActiveModal('none'); // Close CPF inputs
                setView('dashboard');
            }
        }
    };

    const handlePetSelect = (pet: Pet) => {
        if (isPanicMode) {
            // Panic Flow: Immediate start with Emergency Service
            const emergencyService: CartItem = {
                id: 'emergency-001',
                code: 'EMERGENCY',
                name: 'Taxa de Emergência (Pronto Socorro)',
                category: 'Emergência',
                price: 350.00,
                copay: 0,
                tags: [{ label: 'Emergência', type: 'error' }],
                actionType: 'cart',
                quantity: 1
            };

            // Create emergency attendance
            const newAttendance: Partial<Attendance> = {
                status: 'IN_PROGRESS',
                currentStep: 'ANAMNESIS',
                anamnesis: {
                    mainComplaint: 'EMERGÊNCIA - PRONTO SOCORRO',
                    history: { vaccination: { status: 'unknown' } },
                    vitals: {},
                    systems: []
                },
                services: [emergencyService],
                schedulingInfo: {
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    location: 'clinic'
                }
            };

            startAttendance(pet.id, MOCK_TUTOR.cpf, newAttendance);
            setActivePet(pet);
            setActiveModal('none');
            setView('dashboard'); // Dashboard view displays clinical layout when attendance is active
            setIsPanicMode(false); // Reset panic mode
        } else {
            // Normal flow
            startAttendance(pet.id, MOCK_TUTOR.cpf);
            setActivePet(pet);
            setActiveModal('none');
            setView('dashboard');
        }
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

    const handleServiceClick = (service: Service, type: 'grace' | 'limit' | 'noCoverage') => {
        setSelectedServiceForCheck(service);
        if (type === 'grace') setActiveModal('gracePeriod');
        else if (type === 'limit') setActiveModal('limitExceeded');
        else if (type === 'noCoverage') setActiveModal('noCoverage');
    };

    const handleServiceForward = (service: Service) => setShowForwardToast(true);
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

    const handleConfirmCancellation = () => {
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
        // Allow time for context updates if needed, then reset UI
        setTimeout(() => {
            setActiveModal('none');
            updateCart([]);
            setActivePet(null);
            setView('search');
            resetState();
            setShowAttendanceFinalizedToast(true);
            setTimeout(() => setShowAttendanceFinalizedToast(false), 3000);
        }, 100);
    };



    if (view === 'search') {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
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
                                setIsPanicMode(false);
                                setActiveModal('cpfInput');
                            }}
                            onPanic={() => {
                                setIsPanicMode(true);
                                setActiveModal('cpfInput');
                            }}
                            extraAttendances={scheduledAttendances}
                        />
                    </main>
                </div>

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
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
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
            onCancelAttendance={handleCancelAttendance}
        >
            {/* Financial Blocker Overlay */}
            {isDelinquent && !isPlanReactivated && (
                <div className="absolute inset-0 z-50 flex items-start pt-20 justify-center bg-white/80 backdrop-blur-sm rounded-lg transition-all duration-500">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md text-center border-l-8 border-primary-500 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendência Financeira</h2>
                        <p className="text-gray-600 mb-8">
                            O tutor possui mensalidades em aberto. Para prosseguir com o atendimento, é necessário regularizar a situação.
                        </p>
                        <div className="space-y-3 w-full">
                            <Button
                                size="lg"
                                className="w-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                                onClick={handleSimulatePayment}
                            >
                                Regularizar Agora
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-primary-600 text-primary-600 font-bold hover:bg-primary-50"
                                onClick={() => alert("Link de pagamento enviado para o tutor via WhatsApp e E-mail!")}
                            >
                                Enviar link de pagamento
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
            <div className={`transition-all duration-500 ${(isDelinquent && !isPlanReactivated) ? 'opacity-25 filter blur-sm pointer-events-none' : ''}`}>
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
            {activeModal === 'finalize' && <FinalizeModal items={cartItems} onClose={() => setActiveModal('none')} isAttendanceMode={isClinicalMode} isFeesPaid={isFinalizeFeesPaid} onCancelProcess={handleCancelAttendance} />}
            {activeModal === 'cancelAttendance' && <CancelAttendanceModal onClose={() => setActiveModal('finalize')} onConfirm={handleConfirmCancellation} />}
            {activeModal === 'schedule' && <ScheduleModal onClose={() => setActiveModal('none')} onConfirm={isClinicalMode ? (data) => {
                scheduleAttendance(data);
                // Add to local list for dashboard visibility
                if (attendance) {
                    const scheduledAtt: Attendance = {
                        ...attendance,
                        status: 'SCHEDULED',
                        schedulingInfo: data,
                        updatedAt: new Date().toISOString()
                    };
                    setScheduledAttendances(prev => [scheduledAtt, ...prev]);
                }
                setScheduleSuccessInfo({ date: data.date, time: data.time });
                setActiveModal('none');
            } : hasSavedBudget ? handleConfirmBudgetSchedule : undefined} />}
            {activeModal === 'budgetDetails' && <BudgetDetailsModal onClose={() => setActiveModal('none')} onSchedule={handleScheduleFromBudget} />}
            {activeModal === 'confirmBudget' && <ConfirmBudgetModal items={cartItems} onClose={() => setActiveModal('none')} onConfirm={handleConfirmBudget} isAttendanceMode={isClinicalMode} />}
            {activeModal === 'gracePeriod' && <GracePeriodModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} onAddToBudget={handleGracePeriodAddToBudget} />}
            {activeModal === 'limitExceeded' && <LimitExceededModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} onAddToBudget={handleLimitExceededAddToBudget} />}
            {activeModal === 'noCoverage' && <NoCoverageModal service={selectedServiceForCheck} onClose={() => setActiveModal('none')} />}
            {activeModal === 'serviceDetails' && <ServiceDetailsModal onClose={() => setActiveModal('none')} onAddService={handleAddServiceFromDetails} onFinalize={() => setActiveModal('finalize')} cartItems={cartItems} />}
            {activeModal === 'updateWeight' && activePet && <UpdateWeightModal currentWeight={activePet.weight || '0kg'} onClose={() => setActiveModal('none')} onSave={(newWeight) => { setActivePet(prev => prev ? { ...prev, weight: newWeight + 'kg' } : null); if (isClinicalMode) { updateTriage({ weight: newWeight }); } setActiveModal('none'); }} />}
            {activeModal === 'tutorInfo' && <TutorInfoModal tutor={MOCK_TUTOR} onClose={() => setActiveModal('none')} />}
            {activeModal === 'upgradePlan' && <UpgradePlanModal onClose={() => setActiveModal('none')} />}
            {activeModal === 'attendanceHistory' && <AttendanceHistoryModal pet={activePet} onClose={() => setActiveModal('none')} />}

        </ClinicalLayout>
    );
};

export default App;
