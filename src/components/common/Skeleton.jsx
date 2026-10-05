// ═══════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════
export const Skeleton = ({
  width = "100%",
  height = 16,
  radius = 6,
  style,
}) => (
  <span
    aria-hidden
    className="skeleton inline-block shrink-0 animate-[skeleton-shimmer_1.4s_ease-in-out_infinite] rounded-md"
    style={{
      width,
      height,
      borderRadius: radius,
      background:
        "linear-gradient(90deg, var(--color-rule) 0%, var(--color-rule-2) 40%, var(--color-rule) 80%)",
      backgroundSize: "200% 100%",
      ...style,
    }}
  />
);

export const SkeletonText = ({ lines = 3, widths }) => (
  <div className="flex flex-col gap-2" aria-hidden>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height={12}
        width={widths?.[i] || (i === lines - 1 ? "62%" : "100%")}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div
    className="flex flex-col gap-4 rounded-[var(--radius-container)] border border-rule bg-surface p-5 shadow-[var(--shadow-card)]"
    aria-hidden
  >
    <Skeleton height={18} width="42%" />
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonRow = () => (
  <div
    className="flex items-center gap-3.5 border-b border-rule py-4"
    aria-hidden
  >
    <Skeleton height={36} width={36} radius={8} />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton height={13} width="46%" />
      <Skeleton height={10} width="72%" />
    </div>
    <Skeleton height={20} width={72} />
  </div>
);
