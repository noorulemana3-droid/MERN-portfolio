"use server";

import { saveContactMessage } from "@/services/contact";
import { contactSchema, type ContactInput } from "@/lib/validations";

export type SubmitContactResult =
  | {
      ok: true;
      stored: true;
      id: string;
      message: string;
      emails: {
        ownerAlertSent: boolean;
        confirmationSent: boolean;
      };
    }
  | {
      ok: false;
      error: string;
      code: "VALIDATION" | "NOT_CONFIGURED" | "INSERT_FAILED";
    };

export async function submitContact(
  input: ContactInput,
): Promise<SubmitContactResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION",
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  // Honeypot — bots often fill hidden fields; humans leave this empty
  if (parsed.data.website?.trim()) {
    return {
      ok: true,
      stored: true,
      id: "ignored",
      message: "Message sent successfully. I'll get back to you soon.",
      emails: { ownerAlertSent: false, confirmationSent: false },
    };
  }

  const contactData = {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  };

  const saved = await saveContactMessage(contactData);

  if (!saved.ok) {
    return {
      ok: false,
      code: saved.code,
      error: saved.error,
    };
  }

  const { ownerAlertSent, confirmationSent } = saved.emails;
  const message =
    ownerAlertSent || confirmationSent
      ? "Message sent successfully. A confirmation email is on the way."
      : "Message saved successfully. I'll get back to you soon.";

  return {
    ok: true,
    stored: true,
    id: saved.id,
    message,
    emails: saved.emails,
  };
}
