"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { CERTIFICATIONS } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

export function CertificationsSection() {
  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Certifications"
        title="Verified learning signals"
        description="Preview credentials and download certificates for quick verification."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, index) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="overflow-hidden rounded-3xl glass"
          >
            <div
              className="h-36 bg-accent-soft"
              style={{
                backgroundImage: `linear-gradient(160deg, var(--accent-soft), transparent), url(${cert.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {cert.title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {cert.issuer} · {cert.date}
              </p>
              {cert.credentialId ? (
                <p className="mt-1 text-xs text-muted">
                  ID: {cert.credentialId}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline focus-ring rounded"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview
                  </a>
                ) : null}
                {cert.downloadUrl ? (
                  <a
                    href={cert.downloadUrl}
                    download
                    className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-accent focus-ring rounded"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
