import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ModalShell, StatusDot } from "@/components/common";
import { useToast } from "@/context/ToastContext";
import { EXTRACTED_TEXT_SAMPLE } from "@/data/materials";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// EXTRACTED TEXT REVIEW
// ═══════════════════════════════════════════════════════════════
export const ExtractedTextReview = ({ open, onClose, onConfirm }) => {
  const toast = useToast();
  const [edits, setEdits] = useState(() =>
    Object.fromEntries(EXTRACTED_TEXT_SAMPLE.map((f) => [f.id, f.text])),
  );

  if (!open) return null;

  const qualityLabel = (q) =>
    q === "high" ? "Clean read" : q === "med" ? "Some guesswork" : "Poor read";
  const qualityTone = (q) =>
    q === "high" ? "success" : q === "med" ? "warning" : "danger";

  const handleConfirm = () => {
    onConfirm?.(edits);
    toast.push("Extracted text saved to subject", "success");
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Review extracted text"
      maxWidth="720px"
      footer={
        <>
          <Button
            onClick={onClose} variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={() => toast.push("Re-extraction queued", "info")} variant="outline"
          >
            Re-extract all
          </Button>
          <Button
            onClick={handleConfirm}
          >
            Save corrected text
          </Button>
        </>
      }
    >
      <div className="mb-5 flex items-start gap-2.5 rounded-[var(--radius-control)] border border-primary/25 bg-primary-soft px-4 py-3 text-[12.5px] leading-relaxed text-primary">
        <Sparkles size={13} className="mt-0.5 shrink-0" />
        <span>
          <strong className="font-semibold">Check before saving.</strong> Each
          file below was read by a different method. Correct any OCR or
          transcription errors here — the corrected text is what feeds topic
          detection and question generation.
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {EXTRACTED_TEXT_SAMPLE.map((f) => (
          <div
            key={f.id}
            className="overflow-hidden rounded-[var(--radius-container)] border border-rule bg-bg"
          >
            <div className="flex items-center gap-3 border-b border-rule bg-surface px-4 py-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-control)] bg-primary-dim font-mono text-[12px] font-bold tracking-wider text-primary">
                {f.kind}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium text-ink">
                  {f.label}
                </div>
                <div className="mt-0.5 truncate font-mono text-[12px] text-ink-3">
                  {f.route === "DIRECT"
                    ? "Direct text extraction"
                    : f.route === "VISION"
                      ? "Vision model transcription"
                      : "Pasted text"}
                </div>
              </div>
              <StatusDot tone={qualityTone(f.quality)}>
                {qualityLabel(f.quality)}
              </StatusDot>
            </div>
            <div className="p-4">
              <textarea
                value={edits[f.id]}
                onChange={(e) =>
                  setEdits((prev) => ({ ...prev, [f.id]: e.target.value }))
                }
                rows={6}
                className="w-full min-h-[140px] resize-y rounded-[var(--radius-control)] border border-rule-2 bg-bg px-3.5 py-3 font-display text-[15px] leading-relaxed text-ink outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
};
