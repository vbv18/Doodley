import "dotenv/config";
import { z } from "zod";

const ENVSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().optional(),

    ACCESS_TOKEN_SECRET: z.string().min(1)
})

const parsed = ENVSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("[ERROR] ENV schema validation failed! \n", parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;