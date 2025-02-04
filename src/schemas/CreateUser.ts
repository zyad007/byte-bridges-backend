import { z } from 'zod'
export const CreateUserSchema = z.object({
    name: z.string({
        required_error: "name is required"
    }).min(3),
    email: z.string({
        required_error: "email is required"
    }).email(),

    phoneNumber: z.string().optional(),
    password: z.string({
        required_error: "password is required"
    }).min(8),
})

export type CreateUserType = z.infer<typeof CreateUserSchema>