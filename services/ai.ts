import {
  AI_CONTEXT,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCES,
  PROJECTS,
  SITE,
  SKILL_GROUPS,
} from "@/data/portfolio";

export function buildPortfolioKnowledge() {
  const projectLines = PROJECTS.map(
    (p) =>
      `- ${p.title}: ${p.description} Tech: ${p.technologies.join(", ")}. Filters: ${p.filters.join(", ")}.`,
  ).join("\n");

  const skillLines = SKILL_GROUPS.map(
    (g) => `- ${g.title}: ${g.skills.join(", ")}`,
  ).join("\n");

  const experienceLines = EXPERIENCES.map(
    (e) =>
      `- ${e.role} at ${e.company} (${e.startDate}–${e.endDate}): ${e.description}`,
  ).join("\n");

  const educationLines = EDUCATION.map(
    (e) =>
      `- ${e.degree} at ${e.institution} (${e.startDate}–${e.endDate}). ${e.highlights.join(" ")}`,
  ).join("\n");

  const certLines = CERTIFICATIONS.map(
    (c) => `- ${c.title} by ${c.issuer} (${c.date})`,
  ).join("\n");

  return `
${AI_CONTEXT}

Profile:
- Name: ${SITE.name}
- Role: ${SITE.role}
- Location: ${SITE.location}
- Email: ${SITE.email}
- Tagline: ${SITE.tagline}

Skills:
${skillLines}

Projects:
${projectLines}

Experience:
${experienceLines}

Education:
${educationLines}

Certifications:
${certLines}
`.trim();
}

export function localAssistantReply(message: string) {
  const q = message.toLowerCase();

  if (q.includes("project")) {
    const featured = PROJECTS.filter((p) => p.featured)
      .map((p) => p.title)
      .join(", ");
    return `Featured projects include ${featured}. Ask about any project by name for more detail.`;
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
    return `${SITE.name} focuses on the MERN stack, Next.js, TypeScript, React, and full-stack web delivery. Top skills are listed in the Skills section.`;
  }

  if (q.includes("experience") || q.includes("intern")) {
    return `${SITE.name} has internship experience as a MERN Stack Developer Intern at DaFiLabs. See the Experience section for dates and highlights.`;
  }

  if (q.includes("education") || q.includes("degree") || q.includes("university")) {
    const edu = EDUCATION[0];
    return edu
      ? `${SITE.name} is pursuing ${edu.degree} at ${edu.institution} (${edu.startDate}–${edu.endDate}).`
      : "Education details are available in the Education section.";
  }

  if (q.includes("contact") || q.includes("hire") || q.includes("email")) {
    return `You can reach ${SITE.name} at ${SITE.email} or via the contact form on this site.`;
  }

  return `${SITE.name} is a software engineer focused on modern MERN and Next.js products. Ask about projects, skills, experience, education, or how to get in touch.`;
}
