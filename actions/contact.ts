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
        ownerError?: string;
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

  // Honeypot — bots that POST a filled field are ignored.
  // The real contact form always sends companyFax as "".
  if (parsed.data.companyFax?.trim()) {
    return {
      ok: true,
      stored: true,
      id: "ignored",
      message: "Message sent successfully. I'll get back to you soon.",
      emails: { ownerAlertSent: false, confirmationSent: false },
    };
  }

  try {
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

  const { ownerAlertSent, confirmationSent, ownerError } = saved.emails;
  let message =
    ownerAlertSent || confirmationSent
      ? "Message sent successfully. A confirmation email is on the way."
      : "Message saved successfully. I'll get back to you soon.";

  if (!ownerAlertSent) {
    message =
      "Message saved to the database, but the email notification could not be sent. I'll still see it in the admin dashboard.";
    if (ownerError) {
      console.error("[contact] owner email error detail:", ownerError);
    }
  }

  return {
    ok: true,
    stored: true,
    id: saved.id,
    message,
    emails: saved.emails,
  };
  } catch (error) {
    console.error(
      "[contact] submitContact failed:",
      error instanceof Error ? error.message : error,
    );
    return {
      ok: false,
      code: "INSERT_FAILED",
      error: "Could not save your message. Please try again later.",
    };
  }
}
