import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3),
  email: z
    .email()
    .trim()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(4),
});

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(4),
});
