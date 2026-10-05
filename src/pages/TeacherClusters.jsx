import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Bento, Conn, MetricCard, SectionHeader } from "@/components/common";
import { CLUSTERS } from "@/data/materials";
import { cn } from "@/lib/cn";

// ═══════════════════════════════════════════════════════════════
// CLUSTERS
// ═══════════════════════════════════════════════════════════════
const TeacherClusters = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Recurring
        questions
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Recurring <span className="text-ink-3">questions</span>
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            Across 5 past papers we found 18 distinct questions, clustered by
            meaning. Each cluster's size biases the next test toward topics that
            matter.
          </p>
        </div>
        <Conn state="live" />
      </div>

      <div className="bento mb-14">
        <MetricCard
          label="Past papers"
          value={5}
          delta="2020 – 2024"
          deltaTone="success"
        />
        <MetricCard
          label="Questions found"
          value={18}
          delta="Across 5 papers"
          deltaTone="success"
        />
        <MetricCard
          label="Clusters"
          value={5}
          delta="By cosine similarity"
          deltaTone="success"
        />
        <MetricCard
          variant="featured"
          label="Strongest signal"
          value={8}
          unit="×"
          delta="Newton's 2nd Law"
          deltaTone="success"
        />
      </div>

      <section className="mb-10">
        <SectionHeader
          label="Clusters · largest first"
          action="Draft a test →"
          onAction={() => navigate("/teacher/drafts/new")}
        />
        <div className="flex flex-col gap-2">
          {CLUSTERS.map((c, i) => {
            const tone =
              c.count >= 6 ? "danger" : c.count >= 4 ? "warning" : "muted";
            const label =
              c.count >= 6 ? "High weight" : c.count >= 4 ? "Medium" : "Low";
            return (
              <Bento
                key={i}
                as="button"
                onClick={() => {}}
                className="group flex-row items-center gap-4 !py-4 text-left hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary-dim font-mono text-[12px] font-bold tracking-wider text-primary">
                  {c.count}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-medium text-ink">
                    {c.label}
                  </div>
                  <div className="mt-0.5 truncate text-[12.5px] italic text-ink-3">
                    "{c.sample}"
                  </div>
                </div>
                <div className="hidden shrink-0 font-mono text-[12.5px] tabular-nums text-ink-3 tablet:block">
                  <b className="font-semibold text-ink">{c.count}</b> variants ·{" "}
                  {c.years} years
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium",
                    tone === "danger" && "bg-danger-dim text-danger",
                    tone === "warning" && "bg-warning-dim text-warning",
                    tone === "muted" && "bg-raised text-ink-3",
                  )}
                >
                  {label}
                </span>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-ink-3 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </Bento>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TeacherClusters;
