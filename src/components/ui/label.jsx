import { cn } from "@/lib/utils";

export function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn("mb-1.5 block text-[13px] font-medium text-ink-2", className)}
      {...props}
    />
  );
}
