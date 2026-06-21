import { z } from "zod";


export const UpdateProfileRequestSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.email().trim().transform(val => val.toLowerCase()),
    password: z.string().min(4).optional(),
    avatar_url: z.url().optional()
})

export type UpdateProfileRequestType = z.infer<typeof UpdateProfileRequestSchema>;
