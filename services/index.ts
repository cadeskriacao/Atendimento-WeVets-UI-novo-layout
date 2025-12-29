import { MockAttendanceService } from './attendance/MockAttendanceService';
import { IAttendanceService } from './attendance/IAttendanceService';

// Simple Singleton Service Container
class Services {
    private static _attendanceService: IAttendanceService;

    static get attendance(): IAttendanceService {
        if (!this._attendanceService) {
            // Here we could switch to RealAttendanceService based on env vars
            this._attendanceService = new MockAttendanceService();
        }
        return this._attendanceService;
    }
}

export const services = Services;
