"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SITE, SOCIAL_LINKS } from "@/data/portfolio";
import { SocialIcons } from "@/components/common/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section, SectionHeading } from "@/components/ui/section";
import { contactSchema, type ContactInput } from "@/lib/validations";

export function ContactSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();

      if (!response.ok) {
        setStatus("error");
        setServerMessage(payload.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setServerMessage(payload.message || "Message sent successfully.");
      reset();
    } catch {
      setStatus("error");
      setServerMessage("Unable to send message. Please try again.");
    }
  };

  return (
    <Section id="contact">
      {!standalone ? (
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something solid"
          description="Open to roles, freelance work, and product collaborations. Send a message and I'll get back to you."
        />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 shadow-xl shadow-black/5 md:p-8"
        >
          <h3 className="font-display text-lg font-bold text-foreground">
            Direct channels
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Prefer email or socials? Reach out anytime — based in{" "}
            {SITE.location}.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p>
              <span className="text-muted">Email</span>
              <br />
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium text-accent hover:underline"
              >
                {SITE.email}
              </a>
            </p>
            <p className="inline-flex items-center gap-2 text-muted">
              <MapPin className="h-4 w-4 text-accent" />
              {SITE.location}
            </p>
          </div>
          <div className="mt-6">
            <p className="mb-3 text-sm text-muted">Social</p>
            <SocialIcons links={SOCIAL_LINKS} />
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 shadow-xl shadow-black/5 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-muted" htmlFor="name">
                Name
              </label>
              <Input id="name" {...register("name")} placeholder="Your name" />
              {errors.name ? (
                <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@example.com"
              />
              {errors.email ? (
                <p className="mt-1 text-xs text-danger">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-muted" htmlFor="subject">
              Subject
            </label>
            <Input
              id="subject"
              {...register("subject")}
              placeholder="Internship opportunity"
            />
            {errors.subject ? (
              <p className="mt-1 text-xs text-danger">
                {errors.subject.message}
              </p>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-muted" htmlFor="message">
              Message
            </label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Tell me about the role or project..."
            />
            {errors.message ? (
              <p className="mt-1 text-xs text-danger">
                {errors.message.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="mt-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </Button>

          {status === "success" ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-accent">
              <CheckCircle2 className="h-4 w-4" />
              {serverMessage}
            </p>
          ) : null}
          {status === "error" ? (
            <p className="mt-4 text-sm text-danger">{serverMessage}</p>
          ) : null}
        </motion.form>
      </div>
    </Section>
  );
}
