import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/contact-section";
import { SITE } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE.name} for internships, full-time roles, freelance work, or collaborations.`,
  openGraph: {
    title: `Contact | ${SITE.name}`,
    description: `Reach out to ${SITE.name} via the contact form, email, or social links.`,
    url: `${SITE.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="container-narrow mb-2 px-4 pt-6 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Contact
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Let&apos;s build something solid
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Have an opportunity, project idea, or question? Use the form below —
          I&apos;ll get back to you as soon as I can.
        </p>
      </div>
      <ContactSection standalone />
    </div>
  );
}
