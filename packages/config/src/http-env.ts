import "dotenv/config";
import { z } from "zod";

const ENVSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    ALLOWED_ORIGIN: z.string().transform((val) => val.split(",").map((origin) => origin.trim())),

    HTTP_PORT: z.coerce.number().int().positive(),

    DATABASE_URL: z.string(),

    SALT_ROUNDS: z.coerce.number().int().positive().default(12),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_TTL: z.string().regex(/^\d+[mhd]$/),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_TTL: z.string().regex(/^\d+[d]$/),

    MAX_SESSIONS_PER_USER: z.coerce.number().default(4)


})

const parsed = ENVSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("[ERROR] ENV schema validation failed! \n", parsed.error.format());
    process.exit(1);
}

export const httpEnv = parsed.data;