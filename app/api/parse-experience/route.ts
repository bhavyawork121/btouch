import { NextResponse } from "next/server";
import { z } from "zod";
import { parseExperienceText, parsedRoleSchema, type ParsedRole } from "@/lib/experience-parser";

const requestSchema = z.object({
  text: z.string().trim().min(1).max(12000),
});

const responseSchema = z.object({
  roles: z.array(parsedRoleSchema),
});

const errorSchema = z.object({
  error: z.string(),
});

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    const parsedRequest = requestSchema.safeParse(payload);

    if (!parsedRequest.success) {
      return NextResponse.json(
        { error: "Invalid experience text." },
        { status: 400 },
      );
    }

    const roles = await parseExperienceText(parsedRequest.data.text);
    const body = responseSchema.parse({ roles: roles as ParsedRole[] });

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not parse experience text.";
    const body = errorSchema.parse({ error: message });

    return NextResponse.json(body, {
      status: 422,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
