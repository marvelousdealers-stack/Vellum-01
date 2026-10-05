import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export const AutoSaveIndicator = ({ saved }) => (
  <div
    className={cn(
      "inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors",
      saved ? "text-success" : "text-ink-3",
    )}
  >
    {saved ? <Check size={12} /> : <Sparkles size={12} />}
    {saved ? "Auto-saved just now" : "Saving…"}
  </div>
);
