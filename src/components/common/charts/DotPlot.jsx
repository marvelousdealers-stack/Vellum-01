import { cn } from "@/lib/cn";

export const DotPlot = ({ rows }) => {
  const sorted = [...rows].sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="py-2">
      {sorted.map((r, i) => {
        const tone =
          r.accuracy < 60
            ? "bg-danger"
            : r.accuracy < 80
              ? "bg-warning"
              : "bg-success";

        return (
          <div
            key={i}
            className="grid grid-cols-[160px_1fr_56px] items-center gap-4 py-2"
          >
            <div className="truncate font-mono text-[13px] text-ink-2">
              {r.name}
            </div>
            <div className="relative h-4.5">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-rule" />
              {[25, 50, 75].map((p) => (
                <div
                  key={p}
                  className="absolute top-0 bottom-0 w-px bg-rule"
                  style={{ left: `${p}%` }}
                />
              ))}
              <div
                className={cn(
                  "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left] duration-500",
                  tone
                )}
                style={{ left: `${r.accuracy}%` }}
              />
            </div>
            <div className="text-right font-mono text-[13px] font-medium tabular-nums text-ink">
              {r.accuracy}%
            </div>
          </div>
        );
      })}
      <div className="mt-1.5 grid grid-cols-[160px_1fr_56px] gap-4">
        <div />
        <div className="flex justify-between font-mono text-[12px] text-ink-3">
          <span>0%</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
