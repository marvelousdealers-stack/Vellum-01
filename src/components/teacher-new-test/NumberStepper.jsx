import { Icon } from "@/components/common";

// ═══════════════════════════════════════════════════════════════
// NUMBER STEPPER (legacy — draft-tests.jsx has its own local copy)
// Kept for compatibility. Rewritten with inline Tailwind so it
// renders correctly if imported anywhere else in the codebase.
// ═══════════════════════════════════════════════════════════════
export const NumberStepper = ({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  suffix,
  id,
}) => {
  const clamp = (v) => Math.max(min, Math.min(max, v));

  const handleInput = (raw) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (digits === "") {
      onChange(min);
      return;
    }
    onChange(clamp(parseInt(digits, 10)));
  };

  return (
    <div
      role="group"
      aria-labelledby={id}
      className="inline-flex h-10 items-stretch overflow-hidden rounded-[var(--radius-control)] border border-rule-2 bg-sunken"
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label="Decrease"
        className="grid w-10 place-items-center text-[15px] text-ink-2 transition-colors hover:bg-raised hover:text-ink disabled:text-ink-3"
      >
        <Icon name="minus" size={14} />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="w-16 border-x border-rule bg-transparent text-center font-mono text-[15px] font-semibold tabular-nums text-ink outline-none focus:bg-surface"
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onBlur={(e) => {
          if (e.target.value === "") onChange(min);
        }}
        aria-label="Value"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label="Increase"
        className="grid w-10 place-items-center text-[15px] text-ink-2 transition-colors hover:bg-raised hover:text-ink disabled:text-ink-3"
      >
        <Icon name="plus" size={14} />
      </button>
      {suffix && (
        <span className="grid place-items-center border-l border-rule bg-surface px-3.5 font-mono text-[12.5px] font-medium text-ink-3">
          {suffix}
        </span>
      )}
    </div>
  );
};
