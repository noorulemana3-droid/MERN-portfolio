"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialIcons } from "@/components/common/social-icons";
import { Section, SectionHeading } from "@/components/ui/section";
import { SITE, SOCIAL_LINKS } from "@/data/portfolio";

export function ContactSection({
  standalone = false,
}: {
  standalone?: boolean;
}) {
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
          className="glass glass-lift rounded-2xl p-6 md:p-8"
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass glass-lift relative rounded-2xl p-6 md:p-8"
        >
          <ContactForm />
        </motion.div>
      </div>
    </Section>
  );
}
