import React, { useMemo } from 'react';
import { KPICard } from './KPICard';
import { SalesTable } from './SalesTable';
import { MOCK_SALES } from '../../services/sales/mockSales';
import { DollarSign, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

export const SalesDashboard: React.FC = () => {
    // KPI Calculation Logic
    const kpis = useMemo(() => {
        const currentMonth = new Date().getMonth(); // Current month index (0-11). mock data uses fixed dates (Oct/Nov 2023) so we might need to adjust logic or mock data to match "current time" or just filter by specific months for demo.

        // For demo purposes, let's treat "current month" as November 2023 (10) and "last month" as October 2023 (9) based on mock dates.
        const CURRENT_MONTH_IDX = 10; // November
        const LAST_MONTH_IDX = 9;   // October

        const currentMonthSales = MOCK_SALES.filter(s => new Date(s.date).getMonth() === CURRENT_MONTH_IDX);
        const lastMonthSales = MOCK_SALES.filter(s => new Date(s.date).getMonth() === LAST_MONTH_IDX);

        // 1. Total Attendances (Assuming 1 sale = 1 attendance for simplicity of this KPI in this context, or pass a separate prop)
        const totalAttendances = currentMonthSales.length;
        const lastMonthAttendances = lastMonthSales.length;
        const attendanceGrowth = lastMonthAttendances > 0 ? ((totalAttendances - lastMonthAttendances) / lastMonthAttendances) * 100 : 0;

        // 2. Sales Realized (CONCLUÍDA)
        const completedSales = currentMonthSales.filter(s => s.status === 'CONCLUÍDA');
        const lastCompletedSales = lastMonthSales.filter(s => s.status === 'CONCLUÍDA');

        const totalRevenue = completedSales.reduce((acc, curr) => acc + curr.grossValue, 0);
        const lastTotalRevenue = lastCompletedSales.reduce((acc, curr) => acc + curr.grossValue, 0);
        const revenueGrowth = lastTotalRevenue > 0 ? ((totalRevenue - lastTotalRevenue) / lastTotalRevenue) * 100 : 0;

        // 3. Open Sales (AGUARDANDO_PAGAMENTO)
        const openSales = currentMonthSales.filter(s => s.status === 'AGUARDANDO_PAGAMENTO');
        const openSalesValue = openSales.reduce((acc, curr) => acc + curr.grossValue, 0);
        // Comparison for open sales might be tricky (less is better? or more pending means more pipeline?). Let's treat "more revenue pending" as positive/growth for now, or just show volume.

        return {
            attendances: {
                value: totalAttendances,
                growth: Math.round(attendanceGrowth)
            },
            revenue: {
                value: totalRevenue,
                count: completedSales.length,
                growth: Math.round(revenueGrowth)
            },
            open: {
                value: openSalesValue,
                count: openSales.length
                // No growth for open sales in requirements, just value
            }
        };
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Painel Financeiro</h1>
                <p className="text-gray-500">Acompanhe suas vendas, comissões e recebimentos da WeVets.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPICard
                    title="Total de Atendimentos"
                    value={kpis.attendances.value}
                    comparisonPercentage={kpis.attendances.growth}
                    icon={<ShoppingCart size={24} />}
                    tooltip="Total de atendimentos gerados este mês."
                />

                <KPICard
                    title="Vendas Realizadas"
                    value={formatCurrency(kpis.revenue.value)}
                    subValue={`${kpis.revenue.count} vendas concluídas`}
                    comparisonPercentage={kpis.revenue.growth}
                    icon={<TrendingUp size={24} />}
                    tooltip="Valor total bruto de vendas com pagamento confirmado."
                />

                <KPICard
                    title="Aguardando Pagamento"
                    value={formatCurrency(kpis.open.value)}
                    subValue={`${kpis.open.count} vendas em aberto`}
                    // We can opt not to show comparison for this one or show 0
                    icon={<AlertCircle size={24} />}
                    tooltip="Vendas geradas mas ainda não pagas pelo tutor."
                />
            </div>

            {/* Sales Table */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Extrato de Lançamentos</h2>
                <SalesTable sales={MOCK_SALES} />
            </div>
        </div>
    );
};
