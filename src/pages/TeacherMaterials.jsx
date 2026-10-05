import { useState, useRef, useEffect } from "react";
import { Upload, Minus, Sparkles, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { ACCEPTED_TYPES, MAX_FILE_BYTES, guessRoute, uploadMaterials } from "@/api/materials";
import { Bento, Conn, SectionHeader } from "@/components/common";
import { ExtractedTextReview } from "@/components/teacher-materials/ExtractedTextReview";
import { EXTRACTED_TOPICS } from "@/data/materials";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";
import { Button } from "@/components/ui/button";

const TeacherMaterials = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [visibleTopics, setVisibleTopics] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState([]);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const fileInputRef = useRef(null);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const accepted = [];
    const rejected = [];
    incoming.forEach((file) => {
      const tooBig = file.size > MAX_FILE_BYTES;
      const wrongType =
        ACCEPTED_TYPES.length &&
        !ACCEPTED_TYPES.includes(file.type) &&
        file.type !== "";
      if (tooBig) rejected.push(`${file.name} is over the 25 MB limit`);
      else if (wrongType)
        rejected.push(`${file.name} isn't a supported file type`);
      else accepted.push(file);
    });
    if (rejected.length) setErrors(rejected);
    const newItems = accepted.map((file) => {
      const { kind, route } = guessRoute(file);
      return {
        id: createId(),
        kind,
        route,
        label: file.name,
        meta: `${(file.size / 1024 / 1024).toFixed(1)} MB · queued`,
        file,
      };
    });
    if (newItems.length) setItems((prev) => [...prev, ...newItems]);
  };

  const addPastedText = () => {
    const text = pasteText.trim();
    if (!text) return;
    setItems((prev) => [
      ...prev,
      {
        id: createId(),
        kind: "TXT",
        route: "AS-IS",
        label: "Pasted text",
        meta: `${text.length.toLocaleString()} chars · pasted text`,
        text,
      },
    ]);
    setPasteText("");
    setPasteOpen(false);
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const startProcessing = async () => {
    if (!items.length || phase === "processing") return;
    setPhase("processing");
    setErrors([]);
    try {
      await uploadMaterials("physics-11a", items);
      setPhase("extracted");
    } catch (err) {
      setPhase("idle");
      setErrors([err.message || "Upload failed. Try again."]);
    }
  };

  useEffect(() => {
    if (phase !== "extracted") return;
    setVisibleTopics(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setVisibleTopics(i);
      if (i >= EXTRACTED_TOPICS.length) clearInterval(t);
    }, 140);
    return () => clearInterval(t);
  }, [phase]);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Materials
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Feed it <span className="text-ink-3">anything</span>
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            Paste text, drop a typed PDF, or photograph a whiteboard. Each item
            is read the way that suits it. Past papers are optional.
          </p>
        </div>
        <Conn state={phase === "processing" ? "polling" : "live"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="min-w-0 flex flex-col gap-4">
          <label
            htmlFor="materials-file-input"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "hero-glow group relative flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-bento)] border-2 border-dashed px-8 py-14 text-center transition-all duration-300 tablet:py-20",
              dragOver
                ? "border-primary bg-primary-soft"
                : "border-rule-2 bg-surface/40 hover:border-primary/40 hover:bg-surface/60",
            )}
          >
            <input
              ref={fileInputRef}
              id="materials-file-input"
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
              className="absolute size-px opacity-0"
            />

            <div className="relative z-10 mb-5 grid size-16 place-items-center rounded-2xl bg-primary-dim text-primary shadow-[var(--shadow-primary)] transition-transform duration-500 group-hover:scale-105">
              <Upload size={28} />
            </div>
            <h3 className="relative z-10 mb-2 font-display text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Drop files or click to browse
            </h3>
            <p className="relative z-10 text-[13.5px] text-ink-2">
              PDF · JPG · PNG · HEIC · plain text — mixed in one submission
            </p>
            <div className="relative z-10 mt-5 flex flex-wrap justify-center gap-1.5">
              <span className="rounded-full border border-primary/25 bg-primary-soft px-2.5 py-0.5 text-[12px] font-medium text-primary">
                Course outline
              </span>
              <span className="rounded-full border border-rule-2 bg-surface/60 px-2.5 py-0.5 text-[12px] font-medium text-ink-2">
                Past paper
              </span>
              <span className="rounded-full border border-rule-2 bg-surface/60 px-2.5 py-0.5 text-[12px] font-medium text-ink-2">
                Reference
              </span>
            </div>
          </label>

          <div>
            <Button
              type="button"
              onClick={() => setPasteOpen((v) => !v)} variant="outline" size="sm"
            >
              {pasteOpen ? "Cancel paste" : "Or paste text instead"}
            </Button>
            {pasteOpen && (
              <div className="mt-3">
                <textarea
                  rows={5}
                  placeholder="Paste an outline or notes here…"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="w-full min-h-[120px] resize-y rounded-[var(--radius-control)] border border-rule-2 bg-sunken px-3.5 py-3 text-[13.5px] leading-relaxed text-ink outline-none transition-all placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  onClick={addPastedText}
                  disabled={!pasteText.trim()} size="sm" className="mt-2"
                >
                  Add text
                </Button>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              role="alert"
              className="rounded-[var(--radius-control)] border border-warning/30 bg-warning-dim px-4 py-2.5 text-[12.5px] font-medium text-warning"
            >
              {errors.join(" · ")}
            </div>
          )}

          {items.length > 0 && (
            <Bento variant="quiet" className="!p-0">
              <div className="border-b border-rule px-5 py-3.5">
                <div className="text-[12px] font-semibold text-ink-3">
                  Queued · {items.length} item{items.length === 1 ? "" : "s"}
                </div>
              </div>
              <div className="flex flex-col divide-y divide-rule">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3.5 px-5 py-3.5"
                  >
                    <div
                      className={cn(
                        "grid size-10 place-items-center rounded-[10px] font-mono text-[12px] font-bold tracking-wider",
                        it.kind === "PDF" && "bg-danger-dim text-danger",
                        it.kind === "IMG" && "bg-primary-dim text-primary",
                        it.kind === "TXT" && "bg-warning-dim text-warning",
                      )}
                    >
                      {it.kind}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[13.5px] font-medium text-ink">
                        {it.label}
                      </div>
                      <div className="mt-0.5 truncate font-mono text-[12px] text-ink-3">
                        {it.meta}
                      </div>
                      {phase === "processing" && (
                        <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-rule">
                          <div className="h-full w-1/3 animate-slide bg-primary" />
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "shrink-0 font-mono text-[12px] font-medium",
                        phase === "extracted"
                          ? "text-success"
                          : phase === "processing"
                            ? "text-primary"
                            : "text-ink-3",
                      )}
                    >
                      {phase === "extracted"
                        ? "✓ Extracted"
                        : phase === "processing"
                          ? "Reading…"
                          : "Queued"}
                    </div>
                    {phase === "idle" && (
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        aria-label={`Remove ${it.label}`}
                        className="grid size-6 place-items-center rounded text-ink-3 transition-colors hover:bg-danger-dim hover:text-danger"
                      >
                        <Minus size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Bento>
          )}

          {phase === "idle" && items.length > 0 && (
            <Button
              type="button"
              onClick={startProcessing} className="w-fit"
            >
              <Sparkles size={13} />
              Read {items.length} {items.length === 1 ? "item" : "items"} →
            </Button>
          )}
        </div>

        <Bento className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-120px)]">
          <SectionHeader label="Extracted topics" />

          {phase === "idle" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="grid size-12 place-items-center rounded-xl bg-raised text-ink-3">
                <FileText size={20} />
              </div>
              <p className="max-w-[280px] text-[13px] leading-relaxed text-ink-3">
                Topics will appear here once your materials are read. Each is
                weighed by how often it recurs across past papers, and by how
                much of the outline it covers.
              </p>
            </div>
          )}

          {phase === "processing" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="size-6 animate-spin-slow rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[13px] leading-relaxed text-ink-3">
                Reading materials and grouping questions by topic…
              </p>
            </div>
          )}

          {phase === "extracted" && (
            <>
              <div className="flex flex-col divide-y divide-rule">
                {EXTRACTED_TOPICS.slice(0, visibleTopics).map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3 font-display text-[14px] transition-opacity duration-300"
                    style={{
                      animation: "qin 400ms cubic-bezier(0.2,0,0,1) forwards",
                    }}
                  >
                    <span className="min-w-0 flex-1 truncate text-ink">
                      {t.name}
                      {t.thin && (
                        <span className="ml-2 rounded-full bg-warning-dim px-1.5 py-0.5 text-[12px] font-semibold text-warning">
                          Thin · web
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-[12px] font-medium tabular-nums text-ink-3">
                      {t.weight}×
                    </span>
                    <span className="h-1 w-14 overflow-hidden rounded-full bg-rule">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-2"
                        style={{ width: `${t.weight * 12}%` }}
                      />
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-2 border-t border-rule pt-5">
                <Button
                  onClick={() => setReviewOpen(true)} variant="outline"
                >
                  Review extracted text
                </Button>
                <Button
                  onClick={() => navigate("/teacher/clusters")}
                >
                  Review recurring questions →
                </Button>
              </div>
            </>
          )}
        </Bento>
      </div>

      <ExtractedTextReview
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={(edits) => console.log("Saved:", edits)}
      />
    </div>
  );
};

export default TeacherMaterials;
