import { cn } from "@/lib/utils";
import { inputClasses } from "@/components/ui/input";

// ── Form field wrapper ──
export const Field = ({ label, hint, children }) => (
  <label className="mb-4 block">
    <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
    {children}
    {hint && <span className="mt-1.5 block text-[12px] text-ink-3">{hint}</span>}
  </label>
);

// Same look as <Input>; kept as a class string for existing <input>/<select>/<textarea> usages.
// min-h (not h) so <textarea> can still grow; 44px floor matches touch-target guidance.
export const inputClass = cn(inputClasses, "min-h-11 py-2.5 pointer-coarse:min-h-12");
