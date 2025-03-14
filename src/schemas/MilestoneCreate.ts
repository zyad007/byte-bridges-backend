import { z } from 'zod'
export const MilestoneCreateSchema = z.object({

    title: z.string({
        required_error: "title is required"
    }).min(3),

    description: z.string().optional(),

    amount: z.number({ required_error: "amount is required" }).optional(),

    dueDate: z.string()
        .transform((str) => new Date(str))
        .refine((date) => !isNaN(date.getTime()), { message: "Invalid date format" })
        .optional()
})


export type CreateMilestoneType = z.infer<typeof MilestoneCreateSchema>