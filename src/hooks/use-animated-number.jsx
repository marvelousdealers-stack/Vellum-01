import React, { useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// useReducedMotion
// Reads the user's OS preference. Subscribe to changes so the
// component reacts if the user flips the setting mid-session.
// ═══════════════════════════════════════════════════════════════
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
};

// ═══════════════════════════════════════════════════════════════
// useCountUp
// Animates from 0 to `target` using requestAnimationFrame with a
// cubic ease-out curve. Per research: rAF avoids drift and frame
// drops that setInterval causes; ease-out decelerates smoothly
// into the final value.
//
// Runs once when the element becomes 40% visible, then stops
// observing — no re-triggering on scroll.
//
// If prefers-reduced-motion is on, the value jumps straight to
// target. No animation, no flashing, no vestibular trigger.
// ═══════════════════════════════════════════════════════════════
export const useCountUp = (target, { duration = 900, start = 0 } = {}) => {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : start);
  const elementRef = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    const el = elementRef.current;
    if (!el) return;

    const run = () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const from = start;
      const delta = target - from;
      const startTime = performance.now();

      // Cubic ease-out: fast start, smooth deceleration.
      // Reference: https://easings.net/#easeOutCubic
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setValue(from + delta * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [target, duration, start, reduced]);

  return { value, ref: elementRef };
};

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