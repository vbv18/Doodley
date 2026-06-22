import "dotenv/config";
import { z } from "zod";


const ENVSchema = z.object({
    WS_PORT: z.coerce.number(),
});

const parsed = ENVSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("[ERROR] ENV schema validation failed! \n", parsed.error.format());
    process.exit(1);
}

export const wsEnv = parsed.data;