import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

// state: "saved" | "saving" | "error"
export const AutoSaveIndicator = ({
  state = "saved",
  errorText = "Couldn't save — retrying. Your answers are kept on this page.",
}) => (
  <div
    role="status"
    className={cn(
      "inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors",
      state === "saved" && "text-success",
      state === "saving" && "text-ink-3",
      state === "error" && "text-danger",
    )}
  >
    {state === "saved" ? <Check size={12} /> : <Sparkles size={12} />}
    {state === "saved"
      ? "Auto-saved"
      : state === "saving"
        ? "Saving…"
        : errorText}
  </div>
);
