import { ISale } from '../../types';

export const MOCK_SALES: ISale[] = [
    {
        id: 'SALE-001',
        attendanceId: 'ATT-2023-001',
        date: '2023-10-25',
        petName: 'Thor',
        tutorName: 'João Silva',
        tutorCpf: '123.456.789-00',
        status: 'CONCLUÍDA',
        grossValue: 150.00,
        commissionRate: 0.20,
        commissionValue: 30.00,
        netValue: 120.00
    },
    {
        id: 'SALE-002',
        attendanceId: 'ATT-2023-002',
        date: '2023-11-05',
        petName: 'Mel',
        tutorName: 'Ana Souza',
        tutorCpf: '987.654.321-11',
        status: 'CONCLUÍDA',
        grossValue: 350.00,
        commissionRate: 0.20,
        commissionValue: 70.00,
        netValue: 280.00
    },
    {
        id: 'SALE-003',
        attendanceId: 'ATT-2023-003',
        date: '2023-11-10',
        petName: 'Luna',
        tutorName: 'Carlos Pereira',
        tutorCpf: '456.789.123-22',
        status: 'AGUARDANDO_PAGAMENTO',
        grossValue: 1200.00,
        commissionRate: 0.20,
        commissionValue: 240.00,
        netValue: 960.00
    },
    {
        id: 'SALE-004',
        attendanceId: 'ATT-2023-004',
        date: '2023-11-12',
        petName: 'Bob',
        tutorName: 'Mariana Oliveira',
        tutorCpf: '321.654.987-33',
        status: 'CANCELADA',
        grossValue: 80.00,
        commissionRate: 0.20,
        commissionValue: 16.00,
        netValue: 64.00
    },
    {
        id: 'SALE-005',
        attendanceId: 'ATT-2023-005',
        date: '2023-11-15',
        petName: 'Simba',
        tutorName: 'Roberto Costa',
        tutorCpf: '741.852.963-44',
        status: 'CONCLUÍDA',
        grossValue: 450.00,
        commissionRate: 0.20,
        commissionValue: 90.00,
        netValue: 360.00
    },
    {
        id: 'SALE-006',
        attendanceId: 'ATT-2023-006',
        date: '2023-11-20',
        petName: 'Nala',
        tutorName: 'Fernanda Lima',
        tutorCpf: '159.357.258-55',
        status: 'CONCLUÍDA',
        grossValue: 200.00,
        commissionRate: 0.20,
        commissionValue: 40.00,
        netValue: 160.00
    },
    // Historical data for previous month (October)
    {
        id: 'SALE-007',
        attendanceId: 'ATT-2023-007',
        date: '2023-10-10',
        petName: 'Rex',
        tutorName: 'Paulo Santos',
        tutorCpf: '369.258.147-66',
        status: 'CONCLUÍDA',
        grossValue: 300.00,
        commissionRate: 0.20,
        commissionValue: 60.00,
        netValue: 240.00
    },
    {
        id: 'SALE-008',
        attendanceId: 'ATT-2023-008',
        date: '2023-10-15',
        petName: 'Bela',
        tutorName: 'Juliana Martins',
        tutorCpf: '258.147.369-77',
        status: 'CONCLUÍDA',
        grossValue: 150.00,
        commissionRate: 0.20,
        commissionValue: 30.00,
        netValue: 120.00
    }
];
