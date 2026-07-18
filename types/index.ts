export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  name: string;
  href: string;
  icon: "github" | "linkedin" | "twitter" | "email" | "instagram";
};

export type SkillGroup = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

export type ProjectFilter =
  | "all"
  | "mern"
  | "java"
  | "react"
  | "backend"
  | "mobile";

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  gallery?: string[];
  technologies: string[];
  filters: Exclude<ProjectFilter, "all">[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  year: number;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  type: "internship" | "freelance" | "academic" | "full-time";
  startDate: string;
  endDate: string;
  description: string;
  tags: string[];
  highlights: string[];
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  image: string;
  downloadUrl?: string;
};

export type AboutPillar = {
  title: string;
  description: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export type GithubStats = {
  publicRepos: number;
  followers: number;
  following: number;
  avatarUrl: string;
  bio: string | null;
  name: string | null;
  htmlUrl: string;
};
