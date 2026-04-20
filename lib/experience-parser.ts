import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const parsedRoleSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.union([z.string().min(1), z.literal("Present")]),
  description: z.string().min(1),
  domain: z.string().min(1),
});

export type ParsedRole = z.infer<typeof parsedRoleSchema>;

const parsedRoleArraySchema = z.array(parsedRoleSchema);

function extractTextContent(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  if ("text" in value && typeof (value as { text?: unknown }).text === "string") {
    return (value as { text: string }).text;
  }

  return "";
}

export async function parseExperienceText(text: string): Promise<ParsedRole[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system:
      "Extract work experience from text. Return ONLY a JSON array, no other text, no markdown:\n[{" +
      '"company": string, "role": string, "startDate": string, "endDate": string | "Present", "description": string, "domain": string}]' +
      "\nThe \"domain\" field should be the company's web domain (e.g. \"google.com\") for logo fetching.\nIf no experience found, return [].",
    messages: [{ role: "user", content: text }],
  });

  const content = response.content.find((block) => "text" in block);
  const rawText = extractTextContent(content);
  if (!rawText) {
    return [];
  }

  const parsed = JSON.parse(rawText) as unknown;
  return parsedRoleArraySchema.parse(parsed);
}
