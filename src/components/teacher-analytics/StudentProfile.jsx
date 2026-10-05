import { Download, TrendingUp, Users, Target } from "lucide-react";
import {
  Bento,
  MetricCard,
  SectionHeader,
  StatusDot,
  TableShell,
  Td,
  Th,
} from "@/components/common";
import { SmallMultiple } from "@/components/common/charts/SmallMultiple";
import { Trend } from "@/components/common/charts/Trend";
import { useToast } from "@/context/ToastContext";
import { PAST_ATTEMPTS, TOPICS, TREND } from "@/data/analytics";
import { STUDENT_PROFILES } from "@/data/users";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// STUDENT PROFILE
// ═══════════════════════════════════════════════════════════════
export const StudentProfile = ({ student, onBack }) => {
  const toast = useToast();
  const profile = STUDENT_PROFILES[student.name] || STUDENT_PROFILES.default;

  const ownTopics = TOPICS.map((t) => ({
    ...t,
    accuracy: Math.max(
      20,
      Math.min(100, t.accuracy + (profile.bias?.[t.name] ?? 0)),
    ),
  }));

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <Button
        onClick={onBack} variant="ghost" size="sm" className="mb-3"
      >
        ← Back to analytics
      </Button>

      <div className="mb-5 flex items-center gap-2 font-mono text-[12px] font-medium text-ink-3">
        Physics · Grade 11A <span className="text-ink-3">/</span> Students{" "}
        <span className="text-ink-3">/</span> {student.name}
      </div>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
            {student.name} <span className="text-ink-3">· 11A</span>
          </h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
            Overall {student.overall}% across {profile.attempts} attempts.
            Strongest in {student.strong}. Needs work on {student.weak}.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            onClick={() =>
              toast.push(`Report exported for ${student.name}`, "success")
            } variant="outline"
          >
            <Download size={13} />
            Export report
          </Button>
          <Button
            onClick={() =>
              toast.push(`Note added to ${student.name}'s file`, "success")
            }
          >
            Add note
          </Button>
        </div>
      </div>

      <div className="bento mb-14">
        <MetricCard
          variant="featured"
          span="sm:col-span-2"
          icon={TrendingUp}
          iconTone="primary"
          label="Overall"
          value={student.overall}
          unit="%"
          delta="Class avg 84%"
          deltaTone="success"
        />
        <MetricCard
          icon={Users}
          iconTone="neutral"
          label="Attempts"
          value={profile.attempts}
          delta="Across 3 tests"
          deltaTone="success"
        />
        <MetricCard
          icon={Target}
          iconTone="success"
          label="Strongest topic"
          value={<span className="text-[16px]">{student.strong}</span>}
          delta={`${profile.strongScore}% accuracy`}
          deltaTone="success"
        />
      </div>

      <section className="mb-14">
        <SectionHeader label="Score trajectory · T1 → T6 · vs class average" />
        <Bento>
          <div className="mb-1 text-[13px] font-semibold text-ink">
            Student (solid) · Class average (dashed)
          </div>
          <div className="mb-5 text-[13px] text-ink-3">
            {profile.trailing
              ? `Started ${profile.gap > 0 ? "below" : "above"} the class and finished ${Math.abs(profile.gap)} points ${profile.gap > 0 ? "ahead" : "behind"}.`
              : "Consistently tracking close to the class average."}
          </div>
          <Trend
            data={TREND.map((d) => ({
              ...d,
              student: d.class + (profile.bias?.overall ?? 0),
            }))}
            focal={TREND[TREND.length - 1].class + (profile.bias?.overall ?? 0)}
            series={[
              {
                key: "student",
                color: "var(--color-primary)",
                width: 2.4,
                label: student.name,
              },
              {
                key: "class",
                color: "var(--color-ink-3)",
                width: 1.4,
                dash: "4 4",
                label: "Class average",
              },
            ]}
          />
        </Bento>
      </section>

      <section className="mb-14">
        <SectionHeader label="Topic profile · accuracy per topic" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-px overflow-hidden rounded-[var(--radius-container)] border border-rule bg-rule">
          {[...ownTopics]
            .sort((a, b) => a.accuracy - b.accuracy)
            .map((t, i) => (
              <SmallMultiple key={i} topic={t} />
            ))}
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader label="Recent attempts · last 4" />
        <TableShell>
          <thead>
            <tr className="border-b border-rule-2">
              <Th>Test</Th>
              <Th>Date</Th>
              <Th className="text-right">Score</Th>
              <Th>Verdict</Th>
              <Th className="text-right">Flags</Th>
            </tr>
          </thead>
          <tbody>
            {PAST_ATTEMPTS.slice(0, 4).map((a, i) => {
              const tone =
                a.score >= 80
                  ? "success"
                  : a.score >= 65
                    ? "warning"
                    : "danger";
              const label =
                a.score >= 80
                  ? "Strong"
                  : a.score >= 65
                    ? "Solid"
                    : "Needs work";
              return (
                <tr
                  key={i}
                  className="border-b border-rule transition-colors last:border-b-0 hover:bg-raised/50"
                >
                  <Td className="text-[13.5px] font-medium text-ink">
                    {a.test}
                  </Td>
                  <Td className="font-mono text-[12px]">{a.date}</Td>
                  <Td className="text-right font-mono tabular-nums text-ink">
                    {a.score} / {a.total}
                  </Td>
                  <Td>
                    <StatusDot tone={tone}>{label}</StatusDot>
                  </Td>
                  <Td className="text-right font-mono">
                    {a.flagged ? (
                      <span className="rounded-full bg-warning-dim px-2 py-0.5 text-[12px] font-semibold text-warning">
                        {a.flagged}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      </section>
    </div>
  );
};
