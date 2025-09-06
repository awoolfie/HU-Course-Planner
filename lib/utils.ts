import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge conditional class names.
 * Used by shadcn/ui components for styling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
