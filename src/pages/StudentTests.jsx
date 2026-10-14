import { useNavigate } from "react-router";
import {
  Bento,
  EmptyState,
  PageError,
  PageLoading,
  SectionHeader,
  StatusDot,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { useStudentTests } from "@/hooks/useAttempts";
import { formatDateTime, timeAgo } from "@/lib/time";

const Row = ({ title, meta, children }) => (
  <li className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4 last:border-b-0">
    <div className="min-w-0">
      <div className="truncate text-[14.5px] font-medium text-ink">{title}</div>
      <div className="mt-0.5 text-[12.5px] text-ink-3">{meta}</div>
    </div>
    <div className="flex shrink-0 items-center gap-3">{children}</div>
  </li>
);

const metaFor = (test) =>
  `${test.subject} · ${test.config?.duration ?? 30} min · ${test.questions} questions · ${test.marks} marks`;

const StudentTests = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useStudentTests();
  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;
  const { open, upcoming, done, missed } = data;
  const empty = open.length + upcoming.length + done.length + missed.length === 0;
  const go = (test) => navigate(`/take/${test.id}`);

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-6 tablet:px-10 tablet:py-8">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink tablet:text-[34px]">
          Tests
        </h1>
        <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-ink-2">
          Tests your teacher has opened for your class. Start one when you're
          ready — the timer begins when you press Begin.
        </p>
      </div>

      {empty && (
        <EmptyState
          title="No tests yet"
          body="When your teacher publishes a test for your class, it will appear here."
        />
      )}

      {open.length > 0 && (
        <section className="mb-8">
          <SectionHeader label="Open now" meta={`${open.length}`} />
          <Bento>
            <ul>
              {open.map(({ test, attempt }) => (
                <Row key={test.id} title={test.title} meta={metaFor(test)}>
                  <span className="hidden text-[12.5px] text-ink-3 narrow:inline">
                    {attempt
                      ? "In progress"
                      : test.schedule?.availableUntil
                        ? `Closes ${formatDateTime(test.schedule.availableUntil)}`
                        : "Open until your teacher closes it"}
                  </span>
                  <Button onClick={() => go(test)}>{attempt ? "Resume" : "Start"}</Button>
                </Row>
              ))}
            </ul>
          </Bento>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-8">
          <SectionHeader label="Upcoming" meta={`${upcoming.length}`} />
          <Bento>
            <ul>
              {upcoming.map(({ test }) => (
                <Row key={test.id} title={test.title} meta={metaFor(test)}>
                  <StatusDot tone="primary">
                    Opens {formatDateTime(test.schedule.availableFrom)}
                  </StatusDot>
                </Row>
              ))}
            </ul>
          </Bento>
        </section>
      )}

      {done.length > 0 && (
        <section className="mb-8">
          <SectionHeader label="Submitted" meta={`${done.length}`} />
          <Bento>
            <ul>
              {done.map(({ test, attempt, released, totals }) => (
                <Row
                  key={test.id}
                  title={test.title}
                  meta={`Submitted ${timeAgo(attempt.submittedAt)} · ${test.subject}`}
                >
                  {released && totals ? (
                    <StatusDot tone={totals.complete ? "success" : "primary"}>
                      {totals.complete
                        ? `${totals.earned}/${totals.max}`
                        : `${totals.earned}/${totals.max} so far`}
                    </StatusDot>
                  ) : (
                    <StatusDot tone="muted">Results after close</StatusDot>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/student/history/${attempt.id}`)}
                  >
                    {released ? "Review" : "Details"}
                  </Button>
                </Row>
              ))}
            </ul>
          </Bento>
        </section>
      )}

      {missed.length > 0 && (
        <section className="mb-8">
          <SectionHeader label="Closed" meta={`${missed.length}`} />
          <Bento>
            <ul>
              {missed.map(({ test }) => (
                <Row key={test.id} title={test.title} meta={metaFor(test)}>
                  <StatusDot tone="danger">Not submitted</StatusDot>
                </Row>
              ))}
            </ul>
          </Bento>
        </section>
      )}
    </div>
  );
};

export default StudentTests;
