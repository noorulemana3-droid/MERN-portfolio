"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TextInput, TextTextarea } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactInput } from "@/lib/validations";

const defaultValues: ContactInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  companyFax: "",
};

type ContactFormProps = {
  className?: string;
};

type ApiSuccess = {
  message: string;
  stored: true;
  id: string;
  emails: {
    ownerAlertSent: boolean;
    confirmationSent: boolean;
  };
};

type ApiError = {
  error: string;
};

export function ContactForm({ className }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [isPending, setIsPending] = useState(false);
  const ignoreDirtyClear = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const watched = watch(["name", "email", "subject", "message"]);
  const filledCount = watched.filter((value) => Boolean(value?.trim())).length;

  const clearFeedbackOnEdit = () => {
    if (ignoreDirtyClear.current) return;
    if (status === "idle") return;
    setStatus("idle");
    setServerMessage("");
    setEmailHint("");
  };

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    setServerMessage("");
    setEmailHint("");
    setIsPending(true);

    try {
      // Always send an empty honeypot from the real UI so browser autofill
      // cannot trigger a fake "success" without saving.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          companyFax: "",
        }),
      });

      const payload = (await response.json()) as ApiSuccess | ApiError;

      if (!response.ok || !("stored" in payload) || !payload.stored) {
        setStatus("error");
        setServerMessage(
          "error" in payload && payload.error
            ? payload.error
            : "Could not save your message. Please try again.",
        );
        return;
      }

      ignoreDirtyClear.current = true;
      reset(defaultValues);
      setStatus("success");
      setServerMessage(payload.message);

      if (payload.emails.ownerAlertSent && payload.emails.confirmationSent) {
        setEmailHint("Alert sent to me — check your inbox for a confirmation.");
      } else if (payload.emails.ownerAlertSent) {
        setEmailHint("I was notified by email about your message.");
      } else if (payload.emails.confirmationSent) {
        setEmailHint("A confirmation email was sent to you.");
      }

      window.setTimeout(() => {
        ignoreDirtyClear.current = false;
      }, 300);
    } catch {
      setStatus("error");
      setServerMessage("Unable to send message. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={clearFeedbackOnEdit}
      className={cn("relative", className)}
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
          autoComplete="off"
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

      {/* Honeypot for API/bot posts only — never submitted as filled from this UI */}
      <div
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <label htmlFor="companyFax">Company fax</label>
        <input
          id="companyFax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("companyFax")}
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
