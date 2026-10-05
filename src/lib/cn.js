import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose class names safely.
 *
 *   cn("px-4 py-2", isActive && "bg-primary text-on-primary", className)
 *
 * - clsx handles falsy / conditional / array / object inputs.
 * - twMerge resolves Tailwind conflicts so the last utility wins
 *   (e.g. cn("p-4", "p-2") -> "p-2").
 *
 * Use this instead of string concatenation ANYWHERE you build class
 * names dynamically. It is the single most impactful utility in the
 * entire Tailwind workflow.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));
