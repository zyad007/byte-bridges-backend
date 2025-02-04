import { z } from 'zod'
export const CreateWorkerSchema = z.object({
    searchUrl: z.string({
        required_error: "searchUrl is required"
    })
})

export type CreateWorkerType = z.infer<typeof CreateWorkerSchema>