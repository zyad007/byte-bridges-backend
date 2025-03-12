import { z } from 'zod'
export const ContractSearchSchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
    type: z.enum(['fixed', 'hourly']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    sortBy: z.enum(['createdAt', 'total', 'paid', 'progress', 'deadline', 'nextDeadline']).optional(),
})


export type ContractSearchType = z.infer<typeof ContractSearchSchema>