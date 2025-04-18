import { Skill, SkillConnection, SkillCategory, Project, WorkExperience, SoftSkill, TechSkill, AchievementStat } from "./types";

// 3D Skill Graph Data
export const skills: Skill[] = [
  { name: "Python", position: [0, 0, 0], color: "#00F7FF", size: 1.2 },
  { name: "AWS", position: [-3, 2, -3], color: "#00F7FF", size: 1.1 },
  { name: "Kafka", position: [3, -1, -2], color: "#00F7FF", size: 1 },
  { name: "AI", position: [2, 2, 2], color: "#FF00FF", size: 1.2 },
  { name: "React", position: [-2, -2, 1], color: "#00F7FF", size: 0.9 },
  { name: "Docker", position: [-4, -1, -1], color: "#00F7FF", size: 0.9 },
  { name: "Terraform", position: [-1, 3, -2], color: "#00F7FF", size: 0.8 },
  { name: "ML", position: [4, 1, 3], color: "#FF00FF", size: 1 }
];

export const skillConnections: SkillConnection[] = [
  { from: "Python", to: "AWS" },
  { from: "Python", to: "Kafka" },
  { from: "Python", to: "AI" },
  { from: "AWS", to: "Terraform" },
  { from: "AWS", to: "Docker" },
  { from: "AI", to: "ML" },
  { from: "Kafka", to: "AWS" },
  { from: "React", to: "Python" }
];

// Skill Categories
export const skillCategories: SkillCategory[] = [
  {
    icon: "fa-code",
    title: "Development",
    color: "teal",
    skills: [
      "Python (Advanced)",
      "TypeScript/JavaScript",
      "React & Next.js",
      "SQL & NoSQL Databases"
    ]
  },
  {
    icon: "fa-cloud",
    title: "Infrastructure",
    color: "magenta",
    skills: [
      "AWS Certified Solutions Architect",
      "Terraform & CloudFormation",
      "Docker & Kubernetes",
      "CI/CD Pipelines"
    ]
  },
  {
    icon: "fa-robot",
    title: "AI & Automation",
    color: "teal",
    skills: [
      "Machine Learning (TensorFlow/PyTorch)",
      "OpenAI API Integration",
      "Process Automation (RPA)",
      "Data Pipelines (Kafka, Airflow)"
    ]
  }
];

// Projects
export const projects: Project[] = [
  {
    id: "orion_token",
    title: "OrionToken",
    description: "A next-generation asset tokenization platform that enables businesses to tokenize, manage, and trade real-world assets (e.g., real estate, invoices, equipment) on public blockchains like Ethereum and Polygon.",
    categories: ["blockchain", "fintech", "web3"],
    year: "2023",
    image: "orion-token.jpg",
    techStack: ["Ethereum/Solidity", "Next.js", "Polygon", "Smart Contracts"],
    githubUrl: "https://github.com/Evan620/OrionToken",
    demoUrl: "#"
  },
  {
    id: "oriontech",
    title: "oriontech.co.ke",
    description: "A modern, AI-powered website for Orion, a Nairobi-based technology consultancy, showcasing services, portfolio projects, and featuring an intelligent OpenAI-driven chatbot for client interactions.",
    categories: ["web", "ai", "consultancy"],
    year: "2023",
    image: "oriontech.jpg",
    techStack: ["React", "OpenAI API", "TailwindCSS", "Node.js"],
    githubUrl: "https://github.com/Evan620/oriontech.co.ke",
    demoUrl: "https://oriontech.co.ke"
  },
  {
    id: "rez_guru_ai",
    title: "RezGuruAI",
    description: "A real estate automation platform combining AI-driven analytics, lead management, document generation, and customizable workflow automation to streamline property operations and market intelligence.",
    categories: ["real-estate", "ai", "automation"],
    year: "2023",
    image: "rezguru.jpg",
    techStack: ["Python", "ML/Analytics", "Document AI", "Cloud Infrastructure"],
    githubUrl: "https://github.com/Evan620/RezGuruAI",
    demoUrl: "#"
  },
  {
    id: "job_genius_ai",
    title: "JobGeniusAI",
    description: "An AI-powered job application assistant that optimizes resumes, matches you to relevant openings, tracks applications, and analyzes skill gaps—integrating OAuth sign-ins with GitHub or LinkedIn.",
    categories: ["career", "ai", "productivity"],
    year: "2023",
    image: "job-genius.jpg",
    techStack: ["React", "OpenAI API", "OAuth", "Node.js/Express"],
    githubUrl: "https://github.com/Evan620/JobGeniusAI",
    demoUrl: "#"
  }
];

// Resume Data
export const workExperience: WorkExperience[] = [
  {
    title: "Senior Automation Engineer",
    company: "TechCorp Industries",
    period: "2020 - Present",
    level: "current",
    achievements: {
      hr: [
        "Led cross-functional team of 6 developers to implement company-wide process automation, reducing manual tasks by 73%",
        "Conducted bi-weekly knowledge sharing sessions, resulting in improved team skill diversity",
        "Established mentorship program for junior engineers with 90% retention rate",
        "Collaborated with HR to define technical career paths and skill matrices"
      ],
      cto: [
        "Architected event-driven ETL pipeline processing 500M+ daily records using Kafka, AWS Lambda and S3",
        "Implemented infrastructure-as-code practices with 99.9% environment consistency across deployments",
        "Engineered ML model deployment pipeline reducing time-to-production from weeks to hours",
        "Optimized processing costs by 65% through serverless architecture and intelligent scaling"
      ]
    }
  },
  {
    title: "Automation Developer",
    company: "Innovate Solutions",
    period: "2017 - 2020",
    level: "past",
    achievements: {
      hr: [
        "Facilitated successful migration of 15+ legacy systems to modern cloud infrastructure",
        "Improved team velocity by 35% through implementation of agile methodologies",
        "Organized quarterly hackathons to foster innovation and team building",
        "Recognized with 'Collaboration Champion' award for cross-department initiatives"
      ],
      cto: [
        "Designed multi-region AWS architecture with 99.99% uptime SLA utilizing Route53, CloudFront and ECS",
        "Developed custom CI/CD pipeline with automated security scanning and canary deployments",
        "Created Python framework for RPA processes with pluggable modules and 85% code reuse",
        "Implemented OAuth2 and OIDC authentication layer with role-based access control"
      ]
    }
  }
];

export const softSkills: SoftSkill[] = [
  { name: "Team Leadership", icon: "fa-users" },
  { name: "Communication", icon: "fa-comments" },
  { name: "Project Management", icon: "fa-tasks" },
  { name: "Problem Solving", icon: "fa-lightbulb" }
];

export const techSkills: TechSkill[] = [
  {
    category: "Languages & Frameworks",
    skills: ["Python (Advanced)", "JavaScript/TypeScript", "SQL", "React", "Flask", "FastAPI"]
  },
  {
    category: "Infrastructure & DevOps",
    skills: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD", "Git"]
  },
  {
    category: "Data & AI",
    skills: ["Kafka", "Pandas", "TensorFlow", "OpenAI API", "PostgreSQL", "MongoDB"]
  },
  {
    category: "Architecture",
    skills: ["Microservices", "Event-Driven", "Serverless", "API Design", "Multi-region", "High Availability"]
  }
];

export const achievementStats: AchievementStat[] = [
  { value: "1,240+", label: "GitHub Contributions" },
  { value: "85+", label: "Projects Completed" },
  { value: "15+", label: "Technical Articles" }
];

export const executiveSummary = {
  stats: [
    { value: "73%", label: "Operational Efficiency Gain", description: "Implemented enterprise-wide process automation reducing manual workload and operational costs." },
    { value: "65%", label: "Cost Reduction", description: "Optimized cloud infrastructure and processing pipelines resulting in significant monthly savings." },
    { value: "99.9%", label: "System Reliability", description: "Designed resilient architectures with self-healing capabilities and proactive monitoring." },
    { value: "4x", label: "Development Velocity", description: "Accelerated time-to-market through optimized CI/CD pipelines and reusable components." }
  ],
  leadership: [
    { icon: "fa-lightbulb", title: "Innovation Driver", description: "Introduced emerging technologies generating new revenue streams" },
    { icon: "fa-chart-line", title: "Strategic Planner", description: "Developed 3-year technology roadmap aligned with business growth" },
    { icon: "fa-users-cog", title: "Team Builder", description: "Assembled high-performing teams with 90% retention rate" }
  ]
};

// Default AI messages for the greeter
export const defaultAIMessages = [
  { role: "system" as const, content: "AI assistant initialized." },
  { role: "ai" as const, content: "Welcome to Lazarus Portfolio. I'm your neural guide. To access the portfolio, please authenticate using terminal commands or explore the sections directly." }
];

// Terminal response helper
export const getTerminalResponse = (command: string): string => {
  const normalizedCommand = command.toLowerCase().trim();
  
  if (normalizedCommand.includes("access") && normalizedCommand.includes("portfolio")) {
    return "Access granted. Portfolio system loaded.";
  } 
  else if (normalizedCommand.includes("help")) {
    return "Available commands: access, help, projects, skills, contact";
  }
  else if (normalizedCommand.includes("projects")) {
    return "Navigating to projects section...";
  }
  else if (normalizedCommand.includes("skills")) {
    return "Navigating to skills matrix...";
  }
  else {
    return `Command not recognized: "${command}"`;
  }
};

// AI response helper 
export const getAIResponse = (message: string): string => {
  const normalizedMessage = message.toLowerCase().trim();
  
  if (normalizedMessage.includes("project") || normalizedMessage.includes("work")) {
    return "I've created various automation projects including an ETL pipeline processing 500M+ daily records. Would you like to see the projects section?";
  } 
  else if (normalizedMessage.includes("skill") || normalizedMessage.includes("technology")) {
    return "My core skills include Python, AWS, AI integration, and data pipeline engineering. The 3D skill web shows how these connect.";
  }
  else if (normalizedMessage.includes("contact") || normalizedMessage.includes("hire")) {
    return "You can reach out via the contact form or connect directly on LinkedIn and GitHub. Would you like me to navigate to the contact section?";
  }
  else if (normalizedMessage.includes("lazarus") || normalizedMessage.includes("you") || normalizedMessage.includes("who")) {
    return "Lazarus is the code name for this portfolio's owner - a senior automation engineer specializing in AWS, Python development, and AI integration. The name symbolizes bringing legacy systems back to life through modern technology.";
  }
  else if (normalizedMessage.includes("do") || normalizedMessage.includes("help") || normalizedMessage.includes("can")) {
    return "I can provide information about Lazarus's skills, projects, and work experience. I can also navigate you to different sections of the portfolio. Try asking about specific skills, project details, or how to get in contact.";
  }
  else {
    return "I'm a portfolio AI assistant for Lazarus. I can tell you about my projects, skills, or work experience. How can I help you today?";
  }
};
