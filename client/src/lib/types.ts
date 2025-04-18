// Skill Types
export interface Skill {
  name: string;
  position: [number, number, number];
  color: string;
  size: number;
}

export interface SkillConnection {
  from: string;
  to: string;
}

export interface SkillCategory {
  icon: string;
  title: string;
  skills: string[];
  color: "teal" | "magenta";
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  categories: string[];
  year: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

// Resume Types
export type ResumeMode = "hr" | "cto" | "summary";

export interface WorkExperience {
  title: string;
  company: string;
  period: string;
  achievements: {
    hr: string[];
    cto: string[];
  };
  level: "current" | "past";
}

export interface SoftSkill {
  name: string;
  icon: string;
}

export interface TechSkill {
  category: string;
  skills: string[];
}

export interface AchievementStat {
  value: string;
  label: string;
}

// AI Responses
export interface AIMessage {
  role: "user" | "ai" | "system";
  content: string;
}
