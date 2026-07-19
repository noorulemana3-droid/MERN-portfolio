import { Resend } from "resend";
import { SITE } from "@/data/portfolio";

type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getOwnerInbox() {
  return (process.env.CONTACT_EMAIL_TO?.trim() || SITE.email).toLowerCase();
}

/**
 * Resend free tier requires onboarding@resend.dev (or a verified domain).
 * Unquoted env values like `Portfolio <onboarding@...>` often get truncated
 * to just `Portfolio` on some hosts — detect and fall back.
 */
function getFromAddress() {
  const configured = process.env.CONTACT_EMAIL_FROM?.trim();
  const fallback = `${SITE.name} Portfolio <onboarding@resend.dev>`;

  if (!configured) return fallback;

  // Must look like "Name <email@domain>" or a bare email
  const looksValid =
    /^.+\s<[^>]+@[^>]+>$/.test(configured) ||
    /^[^<>\s]+@[^<>\s]+$/.test(configured);

  if (!looksValid) {
    console.warn(
      `[email] CONTACT_EMAIL_FROM looks invalid ("${configured}"). Using ${fallback}`,
    );
    return fallback;
  }

  return configured;
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export type ContactEmailResult = {
  ownerAlertSent: boolean;
  confirmationSent: boolean;
  ownerError?: string;
};

/**
 * Emails YOU (portfolio owner) about every new contact.
 * Visitor confirmation is only sent when Resend allows it
 * (same inbox, or after you verify a custom domain).
 */
export async function sendContactEmails(
  input: ContactEmailPayload,
  contactId: string,
): Promise<ContactEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY missing — skipping contact alerts");
    return {
      ownerAlertSent: false,
      confirmationSent: false,
      ownerError: "RESEND_API_KEY missing",
    };
  }

  const from = getFromAddress();
  const owner = getOwnerInbox();
  const submitter = input.email.trim().toLowerCase();
  const safe = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    subject: escapeHtml(input.subject),
    message: escapeHtml(input.message).replaceAll("\n", "<br />"),
  };

  console.info("[email] sending owner alert", { from, to: owner, contactId });

  const ownerHtml = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">New portfolio contact</h2>
      <p style="margin:0 0 16px;color:#444">Someone reached out via ${escapeHtml(SITE.name)}'s contact form.</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;color:#666;width:100px">Name</td><td style="padding:8px 0"><strong>${safe.name}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${safe.subject}</td></tr>
        <tr><td style="padding:8px 0;color:#666;vertical-align:top">Message</td><td style="padding:8px 0">${safe.message}</td></tr>
        <tr><td style="padding:8px 0;color:#666">ID</td><td style="padding:8px 0;font-family:monospace;font-size:12px">${escapeHtml(contactId)}</td></tr>
      </table>
    </div>
  `;

  const ownerResult = await resend.emails.send({
    from,
    to: [owner],
    replyTo: input.email,
    subject: `New contact: ${input.subject}`,
    html: ownerHtml,
    text: `New contact from ${input.name} <${input.email}>\nSubject: ${input.subject}\n\n${input.message}\n\nID: ${contactId}`,
  });

  const ownerAlertSent = !ownerResult.error;
  let ownerError: string | undefined;
  if (!ownerAlertSent) {
    ownerError =
      typeof ownerResult.error === "object" &&
      ownerResult.error &&
      "message" in ownerResult.error
        ? String((ownerResult.error as { message?: string }).message)
        : JSON.stringify(ownerResult.error);
    console.error("[email] owner alert failed:", ownerResult.error, {
      from,
      to: owner,
    });
  } else {
    console.info("[email] owner alert sent", { id: ownerResult.data?.id });
  }

  let confirmationSent = false;
  const canEmailVisitor =
    process.env.RESEND_SEND_CONFIRMATIONS === "true" ||
    submitter === owner;

  if (canEmailVisitor && submitter !== owner) {
    const confirmationResult = await resend.emails.send({
      from,
      to: [input.email],
      subject: `Thanks for contacting ${SITE.name}`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#111">
          <h2 style="margin:0 0 12px">Thanks for reaching out, ${safe.name}</h2>
          <p style="margin:0 0 12px;color:#444">
            I received your message about <strong>${safe.subject}</strong> and will get back to you soon.
          </p>
          <p style="margin:0;color:#666;font-size:14px">— ${escapeHtml(SITE.name)}</p>
        </div>
      `,
      text: `Hi ${input.name},\n\nThanks for your message about "${input.subject}". I'll get back to you soon.\n\n— ${SITE.name}`,
    });
    confirmationSent = !confirmationResult.error;
    if (!confirmationSent) {
      console.error("[email] confirmation failed:", confirmationResult.error);
    }
  } else if (submitter === owner) {
    confirmationSent = ownerAlertSent;
  }

  return { ownerAlertSent, confirmationSent, ownerError };
}
