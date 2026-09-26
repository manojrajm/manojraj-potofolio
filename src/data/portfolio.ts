import vizhabookImage from "@/assets/vizhabook.jpg";
import bharaniImage from "@/assets/bharani-erp.jpg";
import thainaImage from "@/assets/thaina.jpg";
import skillpulseImage from "@/assets/skillpulse.jpg";
import lockragImage from "@/assets/lockrag.jpg";

export const navItems = ["about", "experience", "skills", "projects", "contact"] as const;

export interface Project {
  number: string;
  name: string;
  category: string;
  description: string;
  features: readonly string[];
  stack: readonly string[];
  image: string;
  alt: string;
  href?: string;
  label?: string;
  note?: string;
}

export const projects: readonly Project[] = [
  {
    number: "01",
    name: "VIZHABOOK",
    category: "SAAS / EVENT MANAGEMENT",
    description: "A digital event gift and moi accounting platform designed to replace traditional handwritten event ledgers with a structured, cloud-backed digital workflow.",
    features: ["Event accounting", "Digital gift records", "Multi-counter workflow", "Cloud-backed data"],
    stack: ["React", "Node.js", "Supabase", "PostgreSQL"],
    image: vizhabookImage,
    alt: "VizhaBook event accounting product visualization",
    href: "https://github.com/manojrajm/VizhaBook",
    label: "View repository",
  },
  {
    number: "02",
    name: "BHARANI ERP",
    category: "INDUSTRIAL ERP / FULL STACK",
    description: "An industrial ERP application designed to digitize manufacturing workflows across production, quality, stores, accounts, purchase and dispatch.",
    features: ["ERP workflows", "Reports & filters", "CRUD operations", "Production data"],
    stack: ["React", "Node.js", "Express.js", "MSSQL"],
    image: bharaniImage,
    alt: "Industrial ERP manufacturing and data-flow visualization",
  },
  {
    number: "03",
    name: "THAINA",
    category: "PRODUCT / SAAS PROJECT",
    description: "A modern HRMS and payroll SaaS concept focused on employee management, attendance, leave, payroll, expenses, documents and work journals.",
    features: ["Employee management", "Attendance & leave", "Payroll concept", "Work journals"],
    stack: ["React", "TypeScript", "NestJS", "Prisma", "Redis"],
    image: thainaImage,
    alt: "Thaina HR SaaS product concept visualization",
    note: "Concept and planned product direction",
  },
  {
    number: "04",
    name: "SKILLPULSE",
    category: "LEARNING / PRODUCTIVITY",
    description: "A learning product concept built around study tracking, quizzes, database-backed workflows and clear progress visualization.",
    features: ["Study tracking", "Quiz system", "Learning workflows", "Progress visualization"],
    stack: ["Product design", "Data workflows", "Analytics"],
    image: skillpulseImage,
    alt: "SkillPulse learning analytics environment visualization",
    note: "Product concept",
  },
  {
    number: "05",
    name: "LOCKRAG",
    category: "AI / RAG",
    description: "Dependency-version-aware Retrieval Augmented Generation for software projects — aligning retrieved knowledge with a project's real version context.",
    features: ["Documents", "Embeddings", "Vector search", "Version context", "Developer answer"],
    stack: ["LangChain", "RAG", "Version context", "AI engineering"],
    image: lockragImage,
    alt: "LockRAG version-aware retrieval pipeline visualization",
    href: "https://github.com/manojrajm/LockRAG",
    label: "View repository",
    note: "AI engineering project",
  },
];

export const skillGroups = [
  {
    label: "Languages",
    items: ["JavaScript", "Java", "Python", "TypeScript", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React.js", "React Router", "HTML5", "CSS3", "Styled Components", "Bootstrap", "jQuery", "AngularJS", "Responsive UI"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "Java JDBC", "REST API Development", "Maven"],
  },
  {
    label: "Databases",
    items: ["Microsoft SQL Server", "Firebase Firestore", "MySQL", "MongoDB", "PostgreSQL"],
  },
  {
    label: "Tools & DevOps",
    items: ["Git", "GitHub", "GitHub Actions", "CI/CD", "Self-Hosted Runners", "PM2", "Nginx", "Postman", "VS Code", "IntelliJ IDEA", "Figma"],
  },
] as const;

export const experiencePoints = [
  "Building ERP workflows and business applications",
  "Developing React interfaces and reusable components",
  "Building backend APIs with Node.js and Express.js",
  "Working with Microsoft SQL Server",
  "Implementing CRUD workflows and data-driven screens",
  "Debugging frontend, API and SQL issues",
  "Working with deployment and production workflows",
] as const;
