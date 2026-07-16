import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/about/about-section";
import { SkillsSection } from "@/components/skills/skills-section";
import { ProjectsSection } from "@/components/projects/projects-section";
import { ExperienceSection } from "@/components/experience/experience-section";
import { EducationSection } from "@/components/education/education-section";
import { ResumeSection } from "@/components/home/resume-section";
import { ContactSection } from "@/components/contact/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <ResumeSection />
      <ContactSection />
    </>
  );
}
