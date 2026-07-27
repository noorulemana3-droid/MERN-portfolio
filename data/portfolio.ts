import type {
  AboutPillar,
  Certification,
  Education,
  Experience,
  NavItem,
  Project,
  SkillGroup,
  SocialLink,
} from "@/types";

export const SITE = {
  name: "Noor-Ul-Eman",
  shortName: "Noor",
  title: "Noor-Ul-Eman | Software Engineer | MERN Stack Developer",
  description:
    "Building modern, scalable web applications with Next.js, React, Node.js, and AI-powered solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  email: "nooruleman.a.3@gmail.com",
  location: "Pakistan",
  role: "Software Engineer | MERN Stack Developer",
  subtitle: "Software Engineer · MERN Stack Developer",
  tagline:
    "Building modern, scalable web applications with Next.js, React, Node.js, and AI-powered solutions.",
  panelTitle: "Building scalable systems that feel effortless to use.",
  panelBody:
    "Full-stack MERN development with a strong interest in AI, clean architecture, and continuous learning.",
  resumePath: "/resume/Noor-Resume.pdf",
  githubUsername:
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "noorulemana3-droid",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "GitHub", href: "/#github" },
  { label: "Contact", href: "/#contact" },
];

/** Highlighted skills with proficiency for progress-bar UI */
export const FEATURED_SKILLS = [
  { name: "React", level: 90 },
  { name: "Next.js", level: 88 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 82 },
  { name: "MongoDB", level: 75 },
  { name: "Tailwind CSS", level: 88 },
  { name: "Express.js", level: 80 },
  { name: "PostgreSQL", level: 72 },
] as const;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/noorulemana3-droid",
    icon: "github",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/noor-ul-eman-785a17366",
    icon: "linkedin",
  },
  { name: "Email", href: "mailto:nooruleman.a.3@gmail.com", icon: "email" },
];

export const HERO_ROLES = [
  "Software Engineer",
  "Full-Stack MERN Developer",
  "Frontend Specialist",
  "Problem Solver",
];

export const HERO_STATS = [
  { label: "Projects", value: "5+" },
  { label: "Skill Areas", value: "6+" },
  { label: "Years Learning", value: "3+" },
];

export const ABOUT = {
  eyebrow: "About",
  title: "Engineer first. Builder always.",
  description:
    "Passionate about software engineering and the craft of turning ideas into reliable, modern applications.",
  lead: "I'm Noor-Ul-Eman, a Full-Stack MERN Developer focused on building scalable, responsive web applications. I care about clean architecture, smooth user experiences, and backends that stay dependable under real usage.",
  body: "Beyond the MERN stack, I continuously learn around AI and machine learning, mobile development with React Native, and computer science fundamentals that sharpen how I design systems and solve problems.",
};

export const ABOUT_PILLARS: AboutPillar[] = [
  {
    title: "Full-stack craft",
    description:
      "I love shipping complete products — React UIs, Node APIs, and MongoDB models that work as one system.",
  },
  {
    title: "Scalable backends",
    description:
      "Interested in auth, API design, and data structures that stay maintainable as features grow.",
  },
  {
    title: "AI curiosity",
    description:
      "Exploring NLP, transformers, and practical ML workflows alongside everyday product engineering.",
  },
  {
    title: "Clean problem solving",
    description:
      "Continuous learning, readable code, and thoughtful trade-offs over flashy shortcuts.",
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "mern",
    title: "MERN Stack",
    description: "Primary focus — end-to-end web applications",
    skills: [
      "MongoDB",
      "Express.js",
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "JWT Authentication",
      "Mongoose",
      "Tailwind CSS",
      "Responsive Design",
      "API Integration",
      "CRUD Applications",
      "State Management",
      "Git & GitHub",
      "Vercel",
      "Supabase",
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    description: "Interfaces that feel fast, polished, and accessible",
    skills: [
      "React",
      "Next.js",
      "React Native",
      "Expo",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "JavaScript",
      "TypeScript",
      "Responsive UI",
      "Framer Motion",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "APIs, auth, data modeling, and server logic",
    skills: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "REST APIs",
      "Authentication",
      "API Design",
      "Database Design",
      "SSR",
      "Route Handlers",
      "Supabase",
    ],
  },
  {
    id: "languages",
    title: "Programming Languages",
    description: "Languages used across web, systems, and coursework",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    description: "Delivery tooling for shipping and collaboration",
    skills: ["Git & GitHub", "Vercel", "Figma", "Postman", "Docker", "VS Code"],
  },
  {
    id: "cs",
    title: "Computer Science",
    description: "Systems foundations that sharpen engineering judgment",
    skills: [
      "Data Structures",
      "Algorithms",
      "Operating Systems",
      "Database Systems",
      "Software Engineering",
      "OOP",
    ],
  },
];

/** Flat skill list for AI / legacy consumers */
export const SKILLS = SKILL_GROUPS.flatMap((group) =>
  group.skills.map((name) => ({
    name,
    level: 80,
    category: group.id,
  })),
);

export const PROJECTS: Project[] = [
  {
    id: "portfolio-mern-stack-developer-intern",
    title: "MERN Portfolio",
    description:
      "A modern developer portfolio showcasing skills, projects, experience, and a functional contact system.",
    longDescription:
      "A production-ready portfolio built with Next.js, TypeScript, Tailwind CSS, Supabase, and Framer Motion. It features a responsive UI, project showcase, AI assistant, resume section, admin dashboard with 2FA, and Contact Us flows designed for recruiters.",
    image: "/images/projects/portfolio-screen.png",
    coverVariant: "desktop",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Prisma",
      "Framer Motion",
      "Vercel",
    ],
    filters: ["mern", "react", "backend"],
    featured: true,
    liveUrl: "https://mern-portfolio-lilac.vercel.app",
    githubUrl: "https://github.com/noorulemana3-droid/MERN-portfolio",
    year: 2026,
  },
  {
    id: "expenseiq-ai",
    title: "ExpenseIQ AI",
    description:
      "Cross-platform expense tracker with AI categorization, Realtime sync, Chrome extension, Android, and desktop.",
    longDescription:
      "ExpenseIQ AI is a full-stack expense tracker built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Supabase (Auth, PostgreSQL, Realtime). It includes expense CRUD, AI-assisted category suggestions, HTML Canvas analytics, a Chrome extension Quick Add flow, an Expo Android app, and a Tauri desktop shell — all sharing one backend. Live on Vercel with a Downloads page for client artifacts.",
    image: "/images/projects/expenseiq-screen.png",
    coverVariant: "desktop",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Prisma",
      "React Native",
      "Expo",
      "Tauri",
      "Chrome Extension",
      "Vercel",
    ],
    filters: ["mern", "react", "backend", "mobile"],
    featured: true,
    liveUrl: "https://expenseiq-ai-three.vercel.app",
    githubUrl: "https://github.com/noorulemana3-droid/ExpenseIQ-AI",
    year: 2026,
  },
  {
    id: "boutique-coffee",
    title: "Boutique Coffee Made Simple",
    description:
      "A modern coffee shop website with product showcase and contact functionality.",
    longDescription:
      "A responsive React application featuring Home, About, Products, Employees, and Contact pages with product filtering, search, form validation, and a clean user experience.",
    image: "/images/projects/boutique-coffee-screen.png",
    coverVariant: "desktop",
    technologies: ["React", "JavaScript", "CSS", "React Router"],
    filters: ["react"],
    featured: true,
    githubUrl: "https://github.com/noorulemana3-droid/BOUTIQUE-COFFEE-MADE",
    year: 2026,
  },
  {
    id: "soundwave-spotify-clone",
    title: "SoundWave - Spotify Clone",
    description:
      "A Spotify-inspired music streaming application built with React Native and Expo.",
    longDescription:
      "SoundWave is a mobile music streaming application featuring playlists, search, album screens, responsive UI, and smooth navigation. Developed using React Native and Expo to deliver a modern cross-platform experience.",
    image: "/images/projects/soundwave-screen.png",
    coverVariant: "desktop",
    technologies: ["React Native", "Expo", "TypeScript", "React Navigation"],
    filters: ["react", "mobile"],
    featured: true,
    githubUrl:
      "https://github.com/noorulemana3-droid/SoundWave--------Spotify-Clone",
    year: 2026,
  },
  {
    id: "online-mock-interview-simulator",
    title: "Online Mock Interview Simulator",
    description:
      "Java Swing desktop application for practicing technical, HR, and behavioral interviews.",
    longDescription:
      "A desktop-based mock interview simulator built with Java Swing. It provides multiple interview categories, timed MCQs, score calculation, grading, and performance feedback to help students prepare for interviews.",
    image: "/images/projects/mock-interview-screen.png",
    coverVariant: "desktop",
    technologies: ["Java", "Java Swing", "OOP"],
    filters: ["java"],
    featured: true,
    githubUrl:
      "https://github.com/noorulemana3-droid/Online_Mock_Interview_Simulator",
    year: 2026,
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "e1",
    role: "MERN Stack Developer Intern",
    company: "DaFiLabs",
    location: "Remote",
    type: "internship",
    startDate: "2026",
    endDate: "Present",
    description:
      "Developing modern full-stack web applications using the MERN Stack, with a focus on responsive UI, scalable architecture, and deployment.",
    tags: [
      "Backend Development",
      "Frontend Development",
      "API Development",
      "Database Design",
      "Team Collaboration",
    ],
    highlights: [
      "Shipped ExpenseIQ AI — Next.js + Supabase expense tracker with Realtime, Canvas analytics, Chrome extension, Expo Android, and Tauri desktop.",
      "Built a production-ready portfolio using Next.js, TypeScript, Tailwind CSS, and Supabase.",
      "Developed responsive and reusable React components following modern development practices.",
      "Integrated GitHub, Vercel, and cloud services for version control and deployment.",
      "Collaborated with mentors on project planning, code reviews, and feature implementation.",
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    id: "edu1",
    degree: "Bachelor of Science in Software Engineering",
    institution: "University of Central Punjab",
    location: "Pakistan",
    startDate: "2023",
    endDate: "2027",
    gpa: "3.18 / 4.0",
    highlights: [
      "Focus on full-stack development, algorithms, and software engineering principles.",
      "Hands-on coursework in operating systems, databases, web engineering, and AI fundamentals.",
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "c1",
    title: "Meta Front-End Developer",
    issuer: "Meta",
    date: "2025",
    image: "/images/certs/meta-frontend.svg",
    credentialUrl:
      "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    downloadUrl: "/images/certs/meta-frontend.svg",
  },
  {
    id: "c2",
    title: "Google UX Design",
    issuer: "Google",
    date: "2025",
    image: "/images/certs/google-ux.svg",
    credentialUrl:
      "https://www.coursera.org/professional-certificates/google-ux-design",
    downloadUrl: "/images/certs/google-ux.svg",
  },
  {
    id: "c3",
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "2024",
    image: "/images/certs/fcc-js.svg",
    credentialUrl: "https://www.freecodecamp.org/certification/",
    downloadUrl: "/images/certs/fcc-js.svg",
  },
];

export const AI_CONTEXT = `
You are Noor-Ul-Eman's AI Portfolio Assistant.

Answer questions about:
- Skills
- Projects
- Experience
- Education
- Technologies
- Career Goals
- Contact Information

Recommend relevant projects when appropriate.

Be professional, concise, friendly, and recruiter-focused.

Do not generate information that is not present in the portfolio.
`.trim();
