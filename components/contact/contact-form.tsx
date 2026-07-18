"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitContact } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { TextInput, TextTextarea } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactInput } from "@/lib/validations";

const defaultValues: ContactInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

type ContactFormProps = {
  className?: string;
};

export function ContactForm({ className }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: "onChange",
  });

  // Clear success/error once the user starts editing again
  useEffect(() => {
    if (!isDirty || status === "idle") return;
    setStatus("idle");
    setServerMessage("");
    setEmailHint("");
  }, [isDirty, status]);

  const watched = watch(["name", "email", "subject", "message"]);
  const filledCount = watched.filter((value) => Boolean(value?.trim())).length;

  const onSubmit = (values: ContactInput) => {
    setStatus("idle");
    setServerMessage("");
    setEmailHint("");

    startTransition(async () => {
      try {
        const result = await submitContact(values);

        if (!result.ok) {
          setStatus("error");
          setServerMessage(result.error);
          return;
        }

        setStatus("success");
        setServerMessage(result.message);

        if (result.emails.ownerAlertSent && result.emails.confirmationSent) {
          setEmailHint("Alert sent to me — check your inbox for a confirmation.");
        } else if (result.emails.ownerAlertSent) {
          setEmailHint("I was notified by email about your message.");
        } else if (result.emails.confirmationSent) {
          setEmailHint("A confirmation email was sent to you.");
        }

        reset(defaultValues);
      } catch {
        setStatus("error");
        setServerMessage("Unable to send message. Please try again.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(className)}
      noValidate
    >
      <div className="mb-4 flex items-center justify-between gap-3 text-xs text-muted">
        <span>All fields required</span>
        <span aria-live="polite">
          {filledCount}/4 filled
          {isPending ? " · sending…" : null}
        </span>
      </div>

      <fieldset disabled={isPending} className="min-w-0 border-0 p-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="name"
            label="Name"
            placeholder="Your name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <TextInput
          id="subject"
          label="Subject"
          className="mt-4"
          placeholder="Internship opportunity"
          error={errors.subject?.message}
          {...register("subject")}
        />

        <TextTextarea
          id="message"
          label="Message"
          className="mt-4"
          placeholder="Tell me about the role or project..."
          error={errors.message?.message}
          {...register("message")}
        />
      </fieldset>

      {/* Honeypot — hidden from users, visible to bots */}
      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Button type="submit" className="mt-6" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving & notifying...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </Button>

      {status === "success" ? (
        <div className="mt-4 space-y-2" role="status" aria-live="polite">
          <p className="inline-flex items-center gap-2 text-sm text-accent">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {serverMessage}
          </p>
          {emailHint ? (
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <Mail className="h-4 w-4 shrink-0" />
              {emailHint}
            </p>
          ) : null}
        </div>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
