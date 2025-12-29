import { z } from 'zod';

export const ServiceCategorySchema = z.enum([
    'Consulta',
    'Vacina',
    'Exame',
    'Cirurgia',
    'Internação',
    'Emergência'
]);

export const ServiceTagSchema = z.object({
    label: z.string(),
    type: z.enum(['success', 'warning', 'error', 'neutral']),
    icon: z.enum(['check', 'x', 'clock']).optional(),
});

export const ServiceActionTypeSchema = z.enum(['cart', 'forward', 'none', 'upgrade']);

export const ServiceSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    category: ServiceCategorySchema,
    price: z.number().min(0),
    copay: z.number().min(0),
    tags: z.array(ServiceTagSchema),
    warning: z.string().optional(),
    disabled: z.boolean().optional(),
    actionType: ServiceActionTypeSchema,
});

export type Service = z.infer<typeof ServiceSchema>;

export const CartItemSchema = ServiceSchema.extend({
    quantity: z.number().min(1),
    anticipationFee: z.number().optional(),
    limitFee: z.number().optional(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
