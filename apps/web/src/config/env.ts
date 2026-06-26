import { z } from "zod";

const ENVSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  VITE_BACKEND_URL: z.string().url().min(1),
});

const parsed = ENVSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "[ERROR] ENV schema validation failed! \n",
    parsed.error.format(),
  );
  throw new Error("Invalid env variables.");
}

export const env = parsed.data;
