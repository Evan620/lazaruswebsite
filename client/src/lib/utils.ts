import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function typeText(
  element: HTMLElement, 
  text: string, 
  speed = 50
): Promise<void> {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Add glitch effect to an element
export function addGlitchEffect(element: HTMLElement): void {
  element.classList.add("animate-glitch");
  setTimeout(() => {
    element.classList.remove("animate-glitch");
  }, 500);
}

// Format a date in cyberpunk style
export function formatCyberpunkDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  
  return `${year}.${month}.${day}`;
}

// Synthetic typing delay
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
