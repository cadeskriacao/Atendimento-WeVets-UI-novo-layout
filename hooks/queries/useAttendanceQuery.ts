import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../services';
import { Attendance } from '../../core/domain/attendance';
import { AppError } from '../../core/errors/AppError';

// Query Keys
export const attendanceKeys = {
    all: ['attendance'] as const,
    lists: () => [...attendanceKeys.all, 'list'] as const,
    detail: (id: string) => [...attendanceKeys.all, 'detail', id] as const,
};

// -- Hook: Fetch Attendance --
export function useAttendance(id: string) {
    return useQuery({
        queryKey: attendanceKeys.detail(id),
        queryFn: () => services.attendance.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// -- Hook: Create Attendance --
export function useCreateAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ petId, tutorId }: { petId: string; tutorId: string }) =>
            services.attendance.create(petId, tutorId),
        onSuccess: (newAttendance) => {
            queryClient.setQueryData(attendanceKeys.detail(newAttendance.id), newAttendance);
        },
        onError: (error) => {
            console.error("Failed to create attendance", error);
            // Toast logic here typically
        }
    });
}

// -- Hook: Update Attendance --
export function useUpdateAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attendance: Attendance) => services.attendance.save(attendance),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: attendanceKeys.detail(variables.id) });
        },
    });
}

// -- Hook: Finalize Attendance --
export function useFinalizeAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => services.attendance.finalize(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: attendanceKeys.detail(id) });
        },
    });
}
