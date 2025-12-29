import { Attendance } from '../../core/domain/attendance';

export interface IAttendanceService {
    /**
     * Retrieves an attendance by ID.
     */
    getById(id: string): Promise<Attendance | null>;

    /**
     * Creates or updates an attendance.
     */
    save(attendance: Attendance): Promise<void>;

    /**
     * Creates a new blank attendance for a specific pet.
     */
    create(petId: string, tutorId: string): Promise<Attendance>;

    /**
     * Finalizes the current attendance.
     */
    finalize(id: string): Promise<void>;
}
