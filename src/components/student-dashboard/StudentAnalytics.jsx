import { TrendingUp, Users, Target } from "lucide-react";
import { Bento, MetricCard, SectionHeader } from "@/components/common";
import { SmallMultiple } from "@/components/common/charts/SmallMultiple";
import { Spark } from "@/components/common/charts/Spark";
import { Trend } from "@/components/common/charts/Trend";
import { TOPICS, TREND } from "@/data/analytics";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// STUDENT ANALYTICS
// ═══════════════════════════════════════════════════════════════
export const StudentAnalytics = () => {
  const last = TREND[TREND.length - 1];
  const own = TOPICS.map((t) => ({
    ...t,
    accuracy: t.accuracy + (t.name === "Newton's Laws" ? 3 : t.name === "Wave Optics" ? -8 : 2),
  }));
  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        My progress <span className="text-ink-3">/</span> Physics
      </div>
      <div className="mb-8">
        <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
          Your progress <span className="text-ink-3">· Physics</span>
        </h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-ink-2">
          Six tests so far. You started below the class. You finished three points ahead.
        </p>
      </div>

      <div className="bento mb-14">
        <MetricCard variant="featured" span="sm:col-span-2" icon={TrendingUp} iconTone="primary"
                    label="Your average" value={last.maya} unit="%" delta="+18 since T1" deltaTone="success"
                    sparkline={<Spark data={TREND.map((d) => d.maya)} color="var(--color-primary)" height={32} />} />
        <MetricCard icon={Users} iconTone="neutral" label="Class average" value={last.class} unit="%" delta="You're 2 pts ahead" deltaTone="success" />
        <MetricCard icon={Target} iconTone="success" label="Strongest topic" value="Newton's Laws" delta="95%" deltaTone="success" />
      </div>

      <section className="mb-14">
        <SectionHeader label="Your score vs. the class · T1 → T6" />
        <Bento>
          <div className="mb-1 text-[13px] font-semibold text-ink">You (solid) · Class average (dashed)</div>
          <div className="mb-5 text-[13px] text-ink-3">The lines cross at T4. You've been ahead since.</div>
          <Trend data={TREND} focal={last.maya} series={[
            { key: "maya", color: "var(--color-primary)", width: 2.4, label: "You" },
            { key: "class", color: "var(--color-ink-3)", width: 1.4, dash: "4 4", label: "Class average" },
          ]} />
        </Bento>
      </section>

      <section className="mb-14">
        <SectionHeader label="Your topic profile" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-px overflow-hidden rounded-[var(--radius-container)] border border-rule bg-rule">
          {[...own].sort((a, b) => a.accuracy - b.accuracy).map((t, i) => <SmallMultiple key={i} topic={t} />)}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => window.print()}>
          Export as PDF
        </Button>
        <Button variant="outline">
          Full test history
        </Button>
      </div>
    </div>
  );
};
