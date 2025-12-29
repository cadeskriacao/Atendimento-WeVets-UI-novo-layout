import React from 'react';
import { ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    subValue?: string; // e.g., "Quantity: 15"
    comparisonPercentage?: number;
    icon?: React.ReactNode;
    tooltip?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, subValue, comparisonPercentage, icon, tooltip }) => {
    const isPositive = comparisonPercentage !== undefined && comparisonPercentage >= 0;
    const comparisonColor = isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    const ArrowIcon = isPositive ? ArrowUp : ArrowDown;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium text-sm">{title}</span>
                    {tooltip && (
                        <div className="group relative">
                            <HelpCircle size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </div>
                {icon && <div className="text-primary-500 bg-primary-50 p-2 rounded-lg">{icon}</div>}
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                    {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
                </div>

                {comparisonPercentage !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${comparisonColor}`}>
                        <ArrowIcon size={12} strokeWidth={3} />
                        <span>{Math.abs(comparisonPercentage)}%</span>
                        <span className="font-normal opacity-80 ml-1">vs mês ant.</span>
                    </div>
                )}
            </div>
        </div>
    );
};
