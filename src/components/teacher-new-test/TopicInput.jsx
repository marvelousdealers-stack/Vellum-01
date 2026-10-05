import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// TOPIC INPUT (legacy — draft-tests.jsx has its own local copy)
// ═══════════════════════════════════════════════════════════════
export const TopicInput = ({
  value,
  onChange,
  suggestions = [],
  max = 6,
  placeholder = "Type or pick a topic…",
}) => {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const add = (topic) => {
    const t = topic.trim();
    if (!t) return;
    if (value.includes(t)) {
      setInput("");
      return;
    }
    if (value.length >= max) return;
    onChange([...value, t]);
    setInput("");
  };

  const remove = (topic) => onChange(value.filter((t) => t !== topic));

  const filtered = suggestions
    .filter((s) => !value.includes(s.name))
    .filter((s) => s.name.toLowerCase().includes(input.trim().toLowerCase()));

  const exactMatch =
    value.includes(input.trim()) ||
    suggestions.some(
      (s) => s.name.toLowerCase() === input.trim().toLowerCase()
    );
  const showCustom = input.trim() && !exactMatch && value.length < max;

  const handleKey = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      add(input);
    }
    if (e.key === "Backspace" && !input && value.length) remove(value[value.length - 1]);
    if (e.key === "Escape") setInput("");
  };

  return (
    <div className="relative">
      <div
        onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
        className="flex min-h-[46px] cursor-text flex-wrap items-center gap-1.5 rounded-[var(--radius-control)] border border-rule-2 bg-sunken px-2.5 py-2 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"
      >
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-[var(--radius-control)] bg-primary-dim py-1 pl-2.5 pr-1 text-[12.5px] font-medium text-primary"
          >
            {t}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(t);
              }}
              aria-label={`Remove ${t}`}
              className="px-1 text-[15px] leading-none opacity-60 transition-opacity hover:opacity-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-[13.5px] text-ink outline-none placeholder:text-ink-3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 160)}
          onKeyDown={handleKey}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={value.length >= max}
          aria-label="Add a topic"
        />
      </div>

      {focused && (filtered.length > 0 || showCustom) && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-[240px] overflow-y-auto rounded-[var(--radius-container)] border border-rule-2 bg-raised p-1.5 shadow-2xl"
        >
          {filtered.slice(0, 5).map((s) => (
            <button
              key={s.name}
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-control)] px-2.5 py-2 text-left text-[13.5px] text-ink-2 transition-colors hover:bg-surface hover:text-ink"
              onMouseDown={(e) => {
                e.preventDefault();
                add(s.name);
              }}
            >
              <span className="truncate">{s.name}</span>
              {s.meta && (
                <span className="shrink-0 font-mono text-[12px] text-ink-3">
                  {s.meta}
                </span>
              )}
            </button>
          ))}
          {showCustom && (
            <button
              type="button"
              className="mt-0.5 flex w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border-t border-rule px-2.5 py-2 text-left text-[13.5px] font-medium text-primary transition-colors hover:bg-surface"
              onMouseDown={(e) => {
                e.preventDefault();
                add(input);
              }}
            >
              <span className="truncate">Add "{input.trim()}"</span>
              <span className="shrink-0 font-mono text-[12px]">Custom</span>
            </button>
          )}
        </div>
      )}

      <div className="mt-1.5 font-mono text-[12px] text-ink-3">
        {value.length}/{max} selected · press Enter to add a custom topic
      </div>
    </div>
  );
};
