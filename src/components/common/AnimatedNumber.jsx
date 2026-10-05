import { useCountUp } from "@/hooks/useCountUp";

// ═══════════════════════════════════════════════════════════════
// AnimatedNumber
// Renders the animated value with locale-aware grouping and an
// optional prefix/suffix. Respects reduced-motion via useCountUp.
// ═══════════════════════════════════════════════════════════════
export const AnimatedNumber = ({
  value,
  duration = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const { value: animated, ref } = useCountUp(value, { duration });

  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(animated);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
