import { z } from "zod";
import { accentOptions } from "@/lib/theme";

const nullableString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (!value) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  });

export const cardConfigFormSchema = z.object({
  username: z.string().trim().min(2).max(39).regex(/^[a-zA-Z0-9-]+$/),
  displayName: z.string().trim().min(2).max(80),
  headline: nullableString,
  bio: nullableString,
  avatarUrl: nullableString,
  currentRole: nullableString,
  currentCompany: nullableString,
  linkedinHandle: nullableString,
  githubHandle: nullableString,
  leetcodeHandle: nullableString,
  cfHandle: nullableString,
  gfgHandle: nullableString,
  theme: z.enum(["dark", "light", "auto"]),
  accentColor: z.enum(accentOptions),
});
