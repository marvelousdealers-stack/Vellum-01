import { TrendingUp, Target, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Bento, Conn, MetricCard, SectionHeader } from "@/components/common";
import { InteractiveDotPlot } from "@/components/common/charts/InteractiveDotPlot";
import { SmallMultiple } from "@/components/common/charts/SmallMultiple";
import { TOPICS, TREND } from "@/data/analytics";
import { STUDENTS } from "@/data/users";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// TEACHER ANALYTICS
// ═══════════════════════════════════════════════════════════════
export const AnalyticsOverview = ({ onStudentClick }) => {
  const last = TREND[TREND.length - 1];
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Analytics
      </div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            Analytics <span className="text-ink-3">· T1 – T6</span>
          </h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
            Everything the class has done this term, in one place.
          </p>
        </div>
        <Conn state="live" secs={12} />
      </div>

      <div className="bento mb-14">
        <MetricCard icon={TrendingUp} iconTone="primary" label="Class average" value={last.class} unit="%" delta="+12 since T1" deltaTone="success" />
        <MetricCard icon={Target} iconTone="neutral" label="Spread (σ)" value={`±${last.spread}`} delta="Narrowing" deltaTone="success" />
        <MetricCard icon={AlertTriangle} iconTone="warning" label="Below target" value={2} unit="of 6" delta="Wave Optics" deltaTone="warning" />
        <MetricCard icon={CheckCircle2} iconTone="success" label="Tests graded" value={6} delta="100%" deltaTone="success" />
      </div>

      <section className="mb-14">
        <SectionHeader label="Topic accuracy · sorted weakest first" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Bento className="min-h-[340px]">
            <InteractiveDotPlot rows={TOPICS} />
          </Bento>
          <Bento>
            <p className="text-[14px] leading-relaxed text-ink-2">
              <strong className="font-semibold text-ink">Wave Optics (46%)</strong> and{" "}
              <strong className="font-semibold text-ink">Electromagnetism (58%)</strong> are the only topics below the 75% target.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
              The strongest topics can safely receive less weight in the next draft.
            </p>
          </Bento>
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader label="Topic trajectories · T1 → T6" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-px overflow-hidden rounded-[var(--radius-container)] border border-rule bg-rule">
          {[...TOPICS].sort((a, b) => a.accuracy - b.accuracy).map((t, i) => <SmallMultiple key={i} topic={t} />)}
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader label="Students · sorted by overall" />
        <div className="overflow-hidden rounded-[var(--radius-container)] border border-rule bg-surface shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-rule-2">
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-3">Student</th>
                  <th className="px-4 py-2.5 text-right text-[12px] font-semibold text-ink-3">Overall</th>
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-3">Weakest</th>
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-ink-3">Strongest</th>
                  <th className="px-4 py-2.5 text-right text-[12px] font-semibold text-ink-3">Flags</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((s, i) => (
                  <tr key={i} onClick={() => onStudentClick?.(s)} className="cursor-pointer border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50">
                    <td className="px-4 py-3 text-[13.5px] font-medium text-ink">{s.name}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">{s.overall}%</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-danger-dim px-2 py-0.5 text-[12px] font-medium text-danger">{s.weak}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-success-dim px-2 py-0.5 text-[12px] font-medium text-success">{s.strong}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {s.flags ? <span className="rounded-full bg-warning-dim px-2 py-0.5 text-[12px] font-semibold text-warning">{s.flags}</span> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => window.print()}>
          Export as PDF
        </Button>
        <Button variant="outline">
          Filter by test
        </Button>
        <Button variant="ghost">
          Export CSV
        </Button>
      </div>
    </div>
  );
};
