"use server";

import { createServerClient } from "@/lib/supabase/server";
import { contactSchema, type ContactInput } from "@/lib/validations";

export async function submitContact(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid form data",
    };
  }

  const supabase = createServerClient();
  if (!supabase) {
    return {
      ok: true as const,
      stored: false,
      message:
        "Thanks! Your message was validated. Connect Supabase to persist contact submissions.",
    };
  }

  const { error } = await supabase.from("contacts").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return {
      ok: false as const,
      error: "Could not save your message. Please try again later.",
    };
  }

  return {
    ok: true as const,
    stored: true,
    message: "Message sent successfully. I'll get back to you soon.",
  };
}
