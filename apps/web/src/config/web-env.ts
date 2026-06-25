import { z } from "zod";


const ENVSchema = z.object({
    VITE_BACKEND_URL: z.string().url().min(1),
    VITE_SOCKET_URL: z.string().url().min(1),
});

const parsed = ENVSchema.safeParse(import.meta.env);

if (!parsed.success) {
    console.error("[ERROR] ENV schema validation failed! \n", parsed.error.format());
    throw new Error("Invalid env variables.");
}

export const webEnv = parsed.data;