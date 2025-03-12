import { z } from 'zod'
export const CreateContractSchema = z.object({

    ownerName: z.string({
        required_error: "ownerName is required"
    }).min(3),

    ownerEmail: z.string({
        required_error: "ownerEmail is required"
    }).email().optional(),

    ownerPhone: z.string().optional(),

    title: z.string({
        required_error: "title is required"
    }).min(3),

    description: z.string().optional(),

    type: z.enum(['fixed', 'hourly']).optional(),

    startDate: z.string({ required_error: "startDate is required" })
        .transform((str) => new Date(str))
        .refine((date) => !isNaN(date.getTime()), { message: "Invalid date format" }),

    deadline: z.string()
        .transform((str) => str ? new Date(str) : undefined)
        .refine((date) => date ? !isNaN(date.getTime()) : true, { message: "Invalid date format" })
        .optional(),

    nextDeadline: z.string()
        .transform((str) => str ? new Date(str) : undefined)
        .refine((date) => date ? !isNaN(date.getTime()) : true, { message: "Invalid date format" })
        .optional(),

    total: z.number({
        required_error: "total is required"
    }),

    paid: z.number().optional(),

    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
})


export type CreateContractType = z.infer<typeof CreateContractSchema>