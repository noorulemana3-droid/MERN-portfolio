import { NextResponse } from "next/server";
import { submitContact } from "@/actions/contact";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 },
      );
    }

    const result = await submitContact(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Optional email notification via Resend when configured
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:
              process.env.CONTACT_EMAIL_FROM ||
              "Portfolio <onboarding@resend.dev>",
            to: [process.env.CONTACT_EMAIL_TO],
            subject: `Portfolio contact: ${parsed.data.subject}`,
            text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
          }),
        });
      } catch {
        // Contact storage still succeeds even if email fails
      }
    }

    return NextResponse.json({
      message: result.message,
      stored: result.stored ?? false,
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
