import { cn } from "@/lib/utils";

// One source of truth for text-field styling; FormField's `inputClass`
// re-exports it so every modal form matches.
export const inputClasses =
  "w-full rounded-[var(--radius-control)] border border-input bg-card px-3 text-[14px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

export function Input({ className, type = "text", ...props }) {
  return <input type={type} data-slot="input" className={cn(inputClasses, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea data-slot="textarea" className={cn(inputClasses, "min-h-24 py-2.5", className)} {...props} />;
}
