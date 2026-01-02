import { IAttendanceService } from './IAttendanceService';
import { Attendance, AttendanceSchema } from '../../core/domain/attendance';
import { storageService } from '../storage/storage.service';
import { AppError } from '../../core/errors/AppError';

const ATTENDANCE_STORAGE_KEY = 'wevets_attendance_data';

export class MockAttendanceService implements IAttendanceService {
    private readonly delayMs = 600; // Simulate network latency

    private async simulateNetwork(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, this.delayMs));
    }

    async getById(id: string): Promise<Attendance | null> {
        await this.simulateNetwork();
        const all = storageService.getItem<Record<string, Attendance>>(ATTENDANCE_STORAGE_KEY) || {};
        return all[id] || null;
    }

    async save(attendance: Attendance): Promise<void> {
        await this.simulateNetwork();

        // Validate before saving simulation
        const result = AttendanceSchema.safeParse(attendance);
        if (!result.success) {
            console.error('Validation Error in MockService:', result.error);
            throw new AppError('Invalid attendance data', 'VALIDATION_ERROR');
        }

        const all = storageService.getItem<Record<string, Attendance>>(ATTENDANCE_STORAGE_KEY) || {};
        all[attendance.id] = attendance;
        storageService.setItem(ATTENDANCE_STORAGE_KEY, all);
    }

    async create(petId: string, tutorId: string): Promise<Attendance> {
        await this.simulateNetwork();

        const newAttendance: Attendance = {
            id: crypto.randomUUID(),
            petId,
            tutorId,
            status: 'INITIATED',
            currentStep: 'SERVICES',
            triage: {},
            anamnesis: {
                mainComplaint: '', // Will be filled by user
                history: {
                    vaccination: { status: 'unknown' }
                },
                vitals: {},
                systems: []
            },
            services: [],
            prescriptions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await this.save(newAttendance);
        return newAttendance;
    }

    async finalize(id: string): Promise<void> {
        const attendance = await this.getById(id);
        if (!attendance) throw new AppError('Attendance not found', 'NOT_FOUND');

        attendance.status = 'FINISHED';
        attendance.updatedAt = new Date().toISOString();
        await this.save(attendance);
    }
}
