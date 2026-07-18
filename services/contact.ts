import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  isResendConfigured,
  sendContactEmails,
  type ContactEmailResult,
} from "@/services/email";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactSaveResult =
  | { ok: true; id: string; emails: ContactEmailResult }
  | { ok: false; code: "NOT_CONFIGURED" | "INSERT_FAILED"; error: string };

function toContactInsert(input: ContactPayload) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };
}

/** Save contact to DB, then send Resend alerts. */
export async function saveContactMessage(
  input: ContactPayload,
): Promise<ContactSaveResult> {
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      code: "NOT_CONFIGURED",
      error:
        "Contact storage is not configured. Add DATABASE_URL to your environment.",
    };
  }

  try {
    const row = await prisma.contact.create({
      data: toContactInsert(input),
      select: { id: true },
    });

    const emails = isResendConfigured()
      ? await sendContactEmails(input, row.id)
      : { ownerAlertSent: false, confirmationSent: false };

    if (!isResendConfigured()) {
      console.warn(
        "[contact] saved without email — set RESEND_API_KEY to enable alerts",
      );
    }

    return { ok: true, id: row.id, emails };
  } catch (error) {
    console.error(
      "[contact] insert failed:",
      error instanceof Error ? error.message : error,
    );
    return {
      ok: false,
      code: "INSERT_FAILED",
      error: "Could not save your message. Please try again later.",
    };
  }
}
