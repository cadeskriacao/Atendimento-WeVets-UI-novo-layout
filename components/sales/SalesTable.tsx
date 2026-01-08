import React, { useState } from 'react';
import { ISale, SaleStatus } from '../../types';
import { Badge } from '../ui';
import { Search, Filter, Calendar as CalendarIcon, ChevronDown, Download, Info } from 'lucide-react';

interface SalesTableProps {
    sales: ISale[];
}

export const SalesTable: React.FC<SalesTableProps> = ({ sales }) => {
    const [filterStatus, setFilterStatus] = useState<SaleStatus | 'ALL'>('ALL');
    const [filterDate, setFilterDate] = useState<'ALL' | 'THIS_MONTH'>('THIS_MONTH');
    const [searchTerm, setSearchTerm] = useState('');

    // Hardcoded for demo consistency with Mock Data (Nov 2023)
    const DEMO_CURRENT_MONTH_IDX = 10; // November
    const DEMO_CURRENT_YEAR = 2023;

    const filteredSales = sales.filter(sale => {
        const matchesStatus = filterStatus === 'ALL' || sale.status === filterStatus;
        const matchesSearch =
            sale.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.id.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (filterDate === 'THIS_MONTH') {
            const saleDate = new Date(sale.date);
            matchesDate = saleDate.getMonth() === DEMO_CURRENT_MONTH_IDX && saleDate.getFullYear() === DEMO_CURRENT_YEAR;
        }

        return matchesStatus && matchesSearch && matchesDate;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const StatusBadge = ({ status }: { status: SaleStatus }) => {
        switch (status) {
            case 'CONCLUÍDA':
                return <Badge variant="success">Concluída</Badge>;
            case 'AGUARDANDO_PAGAMENTO':
                return <Badge variant="warning">Aguardando Pagamento</Badge>;
            case 'CANCELADA':
                return <Badge variant="error">Cancelada</Badge>;
            default:
                return <Badge variant="neutral">{status}</Badge>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header / Filter Toolbar */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por tutor, pet ou ID..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Filter size={16} />
                            <span>{filterStatus === 'ALL' ? 'Todos Status' : filterStatus}</span>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                        {/* Dropdown simple implementation */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:block z-20">
                            <button onClick={() => setFilterStatus('ALL')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Todos</button>
                            <button onClick={() => setFilterStatus('CONCLUÍDA')} className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">Concluídas</button>
                            <button onClick={() => setFilterStatus('AGUARDANDO_PAGAMENTO')} className="w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50">Aguardando</button>
                            <button onClick={() => setFilterStatus('CANCELADA')} className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">Canceladas</button>
                        </div>
                    </div>

                    <button
                        onClick={() => setFilterDate(prev => prev === 'THIS_MONTH' ? 'ALL' : 'THIS_MONTH')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium ${filterDate === 'THIS_MONTH'
                            ? 'bg-primary-50 border-primary-100 text-primary-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <CalendarIcon size={16} />
                        <span>Este Mês</span>
                    </button>

                    <button className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors ml-auto md:ml-0" title="Exportar">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID / Data</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente / Pet</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Valor Bruto</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Comissão WV</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Líquido</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors cursor-pointer">{sale.id}</span>
                                        <span className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{sale.tutorName}</span>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <span className="bg-orange-100 text-orange-700 px-1.5 rounded font-medium">{sale.petName}</span>
                                            <span>• CPF: {sale.tutorCpf}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={sale.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 font-medium">
                                    {formatCurrency(sale.grossValue)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-red-500 text-sm font-medium">-{formatCurrency(sale.commissionValue)}</span>
                                        <span className="text-[10px] text-gray-400">({sale.commissionRate * 100}%)</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                                            {formatCurrency(sale.netValue)}
                                        </span>
                                        <div className="group/info relative">
                                            <Info size={14} className="text-gray-300 hover:text-gray-500 cursor-help" />
                                            {/* Tooltip */}
                                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-10">
                                                Bruto: {formatCurrency(sale.grossValue)} <br />
                                                - Taxa: {formatCurrency(sale.commissionValue)} <br />
                                                = Líquido: {formatCurrency(sale.netValue)}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredSales.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <Search size={40} className="text-gray-200 mb-3" />
                        <h3 className="font-medium text-gray-900">Nenhuma venda encontrada</h3>
                        <p className="text-sm">Tente ajustar seus filtros de busca.</p>
                    </div>
                )}
            </div>

            {/* Pagination Footer (Static for now) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span>Mostrando {filteredSales.length} de {sales.length} resultados</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
                    <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Próximo</button>
                </div>
            </div>
        </div>
    );
};
