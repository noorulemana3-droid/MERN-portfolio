import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { PROJECTS, SITE } from "@/data/portfolio";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) notFound();

  return (
    <div className="section-pad pt-28">
      <div className="container-narrow">
        <Link
          href="/#projects"
          className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-medium text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl glass shadow-xl shadow-black/5">
          <div
            className="h-56 md:h-72"
            style={{
              backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--accent) 40%, transparent), transparent), url(${project.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="p-6 md:p-10">
            <p className="text-sm text-muted">{project.year}</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
              {project.longDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/90"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold gradient-btn shadow-lg shadow-accent/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
                >
                  <FaGithub className="h-4 w-4" />
                  Repository
                </a>
              ) : null}
              <a
                href={`mailto:${SITE.email}?subject=About ${project.title}`}
                className="focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
              >
                Ask about this project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
