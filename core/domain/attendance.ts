import { z } from 'zod';
import { CartItemSchema } from './service';

export const AttendanceStatusSchema = z.enum([
    'INITIATED',
    'BUDGET_SENT',
    'IN_PROGRESS',
    'FINISHED',
    'CANCELLED',
    'SCHEDULED'
]);

export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const AttendanceStepSchema = z.enum([
    'ANAMNESIS',
    'SERVICES',
    'PRESCRIPTION',
    'SUMMARY'
]);

export type AttendanceStep = z.infer<typeof AttendanceStepSchema>;

export const TriageDataSchema = z.object({
    weight: z.string().optional(),
    temperature: z.string().optional(),
    bloodPressure: z.string().optional(),
    heartRate: z.string().optional(),
    respiratoryRate: z.string().optional(),
    notes: z.string().optional(),
});

export type TriageData = z.infer<typeof TriageDataSchema>;

export const PrescriptionItemSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Nome do medicamento é obrigatório"),
    dosage: z.string().min(1, "Dosagem é obrigatória"),
    frequency: z.string().min(1, "Frequência é obrigatória"),
    duration: z.string().min(1, "Duração é obrigatória"),
    notes: z.string().optional(),
});

export type PrescriptionItem = z.infer<typeof PrescriptionItemSchema>;

export const SystemReviewSchema = z.object({
    systemName: z.string(),
    status: z.enum(['normal', 'abnormal', 'not_observed']),
    observations: z.string().optional(), // Required if abnormal commonly, but strictly optional in schema
});

export const AnamnesisHistorySchema = z.object({
    environment: z.enum(['casa', 'apartamento', 'sitio', 'rua']).optional(),
    diet: z.enum(['razão_seca', 'úmida', 'natural', 'mista']).optional(),
    vaccination: z.object({
        status: z.enum(['up_to_date', 'outdated', 'unknown']),
        lastDate: z.string().optional(),
        notes: z.string().optional(),
    }),
    deworming: z.object({
        date: z.string().optional(),
        product: z.string().optional(),
    }).optional(),
});

export const AnamnesisVitalsSchema = z.object({
    weight: z.string().optional(),
    temp: z.string().optional(),
    heartRate: z.string().optional(),
    respRate: z.string().optional(),
    ecc: z.string().optional(),
});

export const AnamnesisDataSchema = z.object({
    mainComplaint: z.string().min(1, "Queixa principal é obrigatória"),
    history: AnamnesisHistorySchema,
    vitals: AnamnesisVitalsSchema,
    systems: z.array(SystemReviewSchema),
    diagnosticHypothesis: z.string().optional(),
    attachments: z.array(z.string()).optional(),
});

export type AnamnesisData = z.infer<typeof AnamnesisDataSchema>;

export const AttendanceSchema = z.object({
    id: z.string().uuid(),
    petId: z.string().uuid(),
    tutorId: z.string().uuid(),
    status: AttendanceStatusSchema,
    currentStep: AttendanceStepSchema,

    triage: TriageDataSchema,
    anamnesis: AnamnesisDataSchema,
    services: z.array(CartItemSchema),
    prescriptions: z.array(PrescriptionItemSchema),

    schedulingInfo: z.object({
        date: z.string(),
        time: z.string(),
        location: z.enum(['clinic', 'home']),
    }).optional(),

    budgetGenerated: z.boolean().optional(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;
