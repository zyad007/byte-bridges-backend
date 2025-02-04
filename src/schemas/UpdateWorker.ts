import { z } from 'zod'
import { WorkerStatus } from '../enum/WorkerStatus'
export const UpdateWorkerSchema = z.object({
    searchUrl: z.string().optional(),
    status: z.nativeEnum(WorkerStatus).optional(),
    notify: z.boolean().optional(),
})

export type UpdateWorkerType = z.infer<typeof UpdateWorkerSchema>