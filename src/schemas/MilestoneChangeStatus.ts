import { z } from 'zod'
export const MilestoneChangeStatusSchema = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
})


export type ChangeMilestoneStatusType = z.infer<typeof MilestoneChangeStatusSchema>