import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Status / tag pill. Color is always paired with a text label (never color-only).
export const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[12px] font-semibold [&_svg]:size-3",
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-secondary text-ink-2",
        primary: "border-primary/20 bg-primary-dim text-primary",
        success: "border-success/20 bg-success-dim text-success",
        warning: "border-warning/25 bg-warning-dim text-warning",
        danger: "border-danger/20 bg-danger-dim text-danger",
        outline: "border-border text-ink-2",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({ className, variant, ...props }) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
