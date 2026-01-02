import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { Button, Input } from '../ui';

interface AttendanceFiltersProps {
    onFilterChange: (filters: { cpf: string; name: string; date: string }) => void;
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({ onFilterChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today

    const handleClear = () => {
        setInputValue('');
        setDate(new Date().toISOString().split('T')[0]);
        onFilterChange({ cpf: '', name: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const digitsOnly = rawValue.replace(/\D/g, '');

        // If input starts with 3 digits, treat as CPF and apply mask
        const isCpfMode = /^\d{3}/.test(rawValue);

        if (isCpfMode) {
            let value = digitsOnly;
            if (value.length > 11) value = value.slice(0, 11);

            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            setInputValue(value);
            // When in CPF mode, clear name filter to avoid conflict (AND logic in parent)
            onFilterChange({ cpf: digitsOnly, name: '', date });
        } else {
            setInputValue(rawValue);
            // When in Name mode, clear cpf filter
            onFilterChange({ cpf: '', name: rawValue, date });
        }
    };

    return (
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-2">

            <div className="flex-1 flex items-center px-4 gap-3 w-full border-b md:border-b-0 border-gray-100 pb-2 md:pb-0">
                <Search className="text-gray-400" size={20} />
                <Input
                    placeholder="Buscar por nome do tutor ou CPF..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="border-none shadow-none focus:ring-0 text-base py-3 px-0 w-full"
                />
            </div>

            <div className="hidden md:block h-8 w-px bg-gray-200" />

            <div className="relative px-2 py-2 md:py-0 flex justify-between items-center md:block w-full md:w-auto">
                <input
                    type="date"
                    className="border-none text-sm text-gray-500 font-medium focus:ring-0 cursor-pointer w-full md:w-auto"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        onFilterChange({
                            cpf: /^\d{3}/.test(inputValue) ? inputValue.replace(/\D/g, '') : '',
                            name: /^\d{3}/.test(inputValue) ? '' : inputValue,
                            date: e.target.value
                        });
                    }}
                />

                {/* Clear Button (Mobile: inline, Desktop: absolute/managed via parent flex) */}
                {(inputValue || date !== new Date().toISOString().split('T')[0]) && (
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        >
                            <X size={16} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Clear Button (Desktop) */}
            {(inputValue || date !== new Date().toISOString().split('T')[0]) && (
                <div className="hidden md:block">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600 mr-2"
                        onClick={handleClear}
                    >
                        <X size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
};
