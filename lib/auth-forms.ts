import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  username: z
    .string()
    .trim()
    .min(2)
    .max(39)
    .regex(/^[a-zA-Z0-9-]+$/, "Username can only contain letters, numbers, and hyphens.")
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});
