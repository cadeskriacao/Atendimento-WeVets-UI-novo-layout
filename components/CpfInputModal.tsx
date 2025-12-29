import React, { useState, useEffect } from 'react';
import { Search, User, Phone } from 'lucide-react';
import { Button, Input } from './ui';
import { Modal } from './Modals';

interface CpfInputModalProps {
    onClose: () => void;
    onSearch: (value: string, type: 'cpf' | 'phone') => void;
}

export const CpfInputModal: React.FC<CpfInputModalProps> = ({ onClose, onSearch }) => {
    const [activeTab, setActiveTab] = useState<'cpf' | 'phone'>('cpf');
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset input when switching tabs
    useEffect(() => {
        setInputValue('');
    }, [activeTab]);

    const handleSearch = (value: string) => {
        setIsLoading(true);
        // Simulate a brief search delay for better UX
        setTimeout(() => {
            onSearch(value, activeTab);
        }, 600);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLoading) return;

        let value = e.target.value.replace(/\D/g, '');

        if (activeTab === 'cpf') {
            if (value.length > 11) value = value.slice(0, 11);
            const rawValue = value;

            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            setInputValue(value);

            // Auto-search for CPF (11 digits)
            if (rawValue.length === 11) {
                handleSearch(value);
            }
        } else {
            // Phone Mask Logic (Supports 10 or 11 digits)
            // 11 digits: (11) 91234-5678
            // 10 digits: (11) 1234-5678

            if (value.length > 11) value = value.slice(0, 11);
            const rawValue = value;

            if (rawValue.length <= 10) {
                // Format: (XX) XXXX-XXXX
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                // Format: (XX) XXXXX-XXXX
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }

            setInputValue(value);

            // Auto-search only for 11 digits (Mobile) as it's the most common complete input
            // For 10 digits user might need to click search manually or we can debounce
            if (rawValue.length === 11) {
                handleSearch(value);
            }
        }
    };

    const isValid = () => {
        const raw = inputValue.replace(/\D/g, '');
        if (activeTab === 'cpf') return raw.length === 11;
        return raw.length === 10 || raw.length === 11; // Allow 10 (Landline) or 11 (Mobile)
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Novo Atendimento" maxWidth="max-w-md">
            <div className="p-6">

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => !isLoading && setActiveTab('cpf')}
                        disabled={isLoading}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'cpf'
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <User size={16} />
                        CPF do Tutor
                    </button>
                    <button
                        onClick={() => !isLoading && setActiveTab('phone')}
                        disabled={isLoading}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'phone'
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Phone size={16} />
                        Telefone
                    </button>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                    {activeTab === 'cpf'
                        ? 'Digite o CPF do tutor para buscar os pacientes cadastrados.'
                        : 'Digite o telefone da pessoa autorizada para buscar.'}
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            placeholder={activeTab === 'cpf' ? "000.000.000-00" : "(00) 00000-0000"}
                            value={inputValue}
                            onChange={handleInputChange}
                            autoFocus
                            disabled={isLoading}
                            className={`text-lg tracking-wide pl-11 transition-all ${isLoading ? 'bg-gray-100 text-gray-400' : ''}`}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Search className="text-gray-400" size={20} />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => handleSearch(inputValue)}
                            disabled={!isValid() || isLoading}
                            isLoading={isLoading}
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
