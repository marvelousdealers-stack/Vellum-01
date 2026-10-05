export const NumberStepper = ({ value, onChange, min = 1, max = 60, suffix }) => {
  const clamp = (v) => Math.max(min, Math.min(max, v));
  return (
    <div className="inline-flex h-10 items-stretch overflow-hidden rounded-[var(--radius-control)] border border-rule-2 bg-sunken">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="grid w-9 place-items-center text-[15px] text-ink-2 transition-colors hover:bg-raised hover:text-ink disabled:text-ink-3"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9]/g, "");
          onChange(v === "" ? min : clamp(parseInt(v, 10)));
        }}
        className="w-14 border-x border-rule bg-transparent text-center font-mono text-[15px] font-semibold tabular-nums text-ink outline-none focus:bg-surface"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="grid w-9 place-items-center text-[15px] text-ink-2 transition-colors hover:bg-raised hover:text-ink disabled:text-ink-3"
      >
        +
      </button>
      {suffix && (
        <span className="grid place-items-center border-l border-rule bg-surface px-3.5 font-mono text-[12.5px] font-medium text-ink-3">
          {suffix}
        </span>
      )}
    </div>
  );
};
