import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string): string {
  if (!str) return "";

  // Handle camelCase and snake_case by inserting a space before uppercase letters or after underscores
  const spacedString = str
    .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
    .replace(/[_-]/g, " "); // Replace underscores or hyphens with spaces

  // Capitalize the first letter of each word and join them
  return spacedString
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim(); // Trim any leading/trailing spaces
}

export function extractPageNameFromUrl(url: string): string {
  if (!url) return "";

  try {
    const pathSegments = new URL(url).pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) {
      return "";
    }

    let lastSegment = pathSegments[pathSegments.length - 1];

    // Remove trailing underscores and numbers (e.g., _2, _beta)
    lastSegment = lastSegment.replace(/_\d+$/, "").replace(/_beta$/, "");

    return toTitleCase(lastSegment);
  } catch (error) {
    console.error("Invalid URL:", error);
    // If it's not a valid URL, try to process it as a simple path segment
    const parts = url.split("/").filter(Boolean);
    if (parts.length > 0) {
      let lastPart = parts[parts.length - 1];
      lastPart = lastPart.replace(/_\d+$/, "").replace(/_beta$/, "");
      return toTitleCase(lastPart);
    }
    return "";
  }
}
