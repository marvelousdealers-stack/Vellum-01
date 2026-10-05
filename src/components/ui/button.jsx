import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// Button — shadcn/ui pattern (cva variants + data-slot), themed with
// Vellum tokens. Replaces ~45 copies of the same long class string.
//
//   <Button>Save</Button>                       primary
//   <Button variant="outline">Cancel</Button>   bordered white
//   <Button variant="destructive">Delete</Button>
//   <Button size="sm"> · <Button size="icon" aria-label="…">
//
// Like stock shadcn it does NOT default `type`; add type="button" inside
// forms where you don't want submit.
// ═══════════════════════════════════════════════════════════════
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-control)] text-[13px] font-semibold outline-none",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-200",
    "focus-visible:ring-4 focus-visible:ring-ring/25",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-primary)] hover:bg-primary-2",
        destructive:
          "bg-destructive text-on-danger shadow-[var(--shadow-danger)] hover:opacity-90",
        outline:
          "border border-border bg-card text-foreground hover:border-rule-3 hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-overlay",
        ghost: "text-foreground hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 gap-1.5 px-3 text-[12.5px]",
        lg: "h-11 px-6 text-[14px]",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
