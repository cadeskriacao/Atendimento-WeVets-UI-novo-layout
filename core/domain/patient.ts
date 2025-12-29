import { z } from 'zod';

export const PatientSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Nome é obrigatório"),
    type: z.string().min(1, "Tipo é obrigatório"), // especie
    breed: z.string().min(1, "Raça é obrigatória"),
    gender: z.enum(['Macho', 'Fêmea']),
    birthDate: z.string(), // ISO Date string YYYY-MM-DD
    age: z.string(), // Computed or stored string like "2 anos"
    weight: z.string().optional(),
    image: z.string().url().optional(),
    plan: z.string().optional(),

    // UI specific badges (optional in domain, but useful for now)
    hasAppointment: z.boolean().optional(),
    appointmentInfo: z.string().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

export const TutorSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Nome do tutor é obrigatório"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    cpf: z.string().optional(),
});

export type Tutor = z.infer<typeof TutorSchema>;
