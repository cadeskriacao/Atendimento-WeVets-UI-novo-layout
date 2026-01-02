import React, { useState } from 'react';
import { Pet, Tutor } from '../types';
import { Cat, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Badge } from './ui';

interface PetHeaderProps {
    pet: Pet;
    tutor: Tutor;
    onDetailsClick?: () => void;
    isAttendanceActive?: boolean;
    onUpdateWeightClick?: () => void;
    onTutorInfoClick?: () => void;
    onUpgradePlanClick?: () => void;
    onHistoryClick?: () => void;
    banner?: React.ReactNode;
}

export const PetHeader: React.FC<PetHeaderProps> = ({
    pet,
    tutor,
    onUpdateWeightClick,
    onTutorInfoClick,
    onUpgradePlanClick,
    onHistoryClick,
    banner
}) => {
    const [isTutorExpanded, setIsTutorExpanded] = useState(false);

    const calculateAge = (birthDate: string) => {
        try {
            const [day, month, year] = birthDate.split('/').map(Number);
            const birth = new Date(year, month - 1, day);
            const today = new Date();
            let years = today.getFullYear() - birth.getFullYear();
            let months = today.getMonth() - birth.getMonth();
            if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
                years--;
                months += 12;
            }
            return `${years} anos`;
        } catch (e) {
            return '';
        }
    };

    const age = calculateAge(pet.birthDate);

    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-5">
                <div className="flex flex-row gap-4 lg:gap-6 items-center">
                    {/* Pet Avatar */}
                    <div className="flex-shrink-0">
                        {pet.image ? (
                            <img src={pet.image} alt={pet.name} className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-md ring-1 ring-gray-100" />
                        ) : (
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-white shadow-md ring-1 ring-gray-100">
                                <Cat size={24} className="md:w-10 md:h-10" />
                            </div>
                        )}
                    </div>

                    {/* Pet Details - Compact */}
                    <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-3 md:gap-5 items-center w-full min-w-0">

                        {/* Identity & Basic Info */}
                        <div className="xl:col-span-8 flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base md:text-xl font-bold text-gray-900 leading-tight tracking-tight truncate">{pet.name}</h2>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge variant="neutral" className="bg-primary-50 text-primary-700 border-primary-100 font-bold px-2 h-5 md:h-6 text-[10px] md:text-[11px] rounded-full">WeVets Conforto</Badge>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 font-medium leading-tight">
                                <span>{pet.type}</span>
                                <span className="text-gray-300">•</span>
                                <span>{pet.gender}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-900 font-bold">{pet.weight}</span>
                                <span className="text-gray-300 hidden sm:inline">•</span>
                                <span className="hidden sm:inline">{pet.breed}</span>
                                <span className="text-gray-300 hidden sm:inline">•</span>
                                <span className="hidden sm:inline">{age}</span>
                            </div>

                            <div className="mt-1 md:mt-2 flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onHistoryClick}
                                    className="h-6 text-[10px] md:text-[11px] font-bold uppercase tracking-wider border-primary-100 text-primary-600 hover:bg-primary-50 px-2 rounded-full"
                                >
                                    Histórico
                                </Button>
                                <Badge variant="neutral" className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] md:text-[11px] px-2 h-6 rounded-full font-medium hidden sm:inline-flex">Coparticipação</Badge>
                                <Badge variant="neutral" className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] md:text-[11px] px-2 h-6 rounded-full font-medium hidden sm:inline-flex">Rede Credenciada</Badge>
                            </div>
                        </div>

                        {/* Tutor & Actions - Right (Accordion on Mobile) */}
                        <div className="xl:col-span-4 border-t xl:border-t-0 xl:border-l border-gray-100 pt-3 md:pt-4 xl:pt-0 xl:pl-6 flex flex-col gap-2 w-full">

                            {/* Mobile Accordion Header */}
                            <button
                                onClick={() => setIsTutorExpanded(!isTutorExpanded)}
                                className="xl:hidden flex items-center justify-between w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1"
                            >
                                <span>Informações do Tutor</span>
                                {isTutorExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {/* Content (Hidden on mobile unless expanded, always visible on XL) */}
                            <div className={`${isTutorExpanded ? 'flex' : 'hidden'} xl:flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200`}>
                                <div className="flex flex-col gap-0.5">
                                    <div className="hidden xl:block text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tutor(a)</div>
                                    <div className="font-bold text-gray-800 text-sm flex items-center justify-between">
                                        <span className="truncate max-w-[150px]">{tutor.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onTutorInfoClick}
                                            className="h-5 px-1.5 text-[10px] font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded"
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {tutor.phone}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-1">
                                    <Button
                                        variant="outline"
                                        onClick={onUpgradePlanClick}
                                        className="flex-1 border-primary-100 text-primary-600 hover:bg-primary-50 font-bold text-[10px] uppercase tracking-wider rounded-lg h-8 transition-all"
                                    >
                                        Upgrade
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {banner && (
                <div className="border-t border-gray-100 bg-gray-100/50">
                    {banner}
                </div>
            )}
        </div>
    );
};
