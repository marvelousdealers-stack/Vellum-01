import { useNavigate } from "react-router";
import {
  EmptyState,
  PageError,
  PageLoading,
  SectionHeader,
  StatusDot,
  TableShell,
  Td,
  Th,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { useStudentTests } from "@/hooks/useAttempts";
import { formatDateTime } from "@/lib/time";

// The student's submitted tests. A result only shows once the teacher's
// release setting allows it; until then the row says so instead of guessing.
export const TestHistory = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useStudentTests();
  if (isLoading) return <PageLoading />;
  if (error) return <PageError error={error} onRetry={refetch} />;
  const rows = data.done;

  return (
    <div className="animate-[page-in_0.4s_ease-out]">
      <SectionHeader label="Test history" meta={rows.length ? `${rows.length}` : undefined} />
      {rows.length === 0 ? (
        <EmptyState
          title="No submitted tests yet"
          body="Once you submit a test it will be listed here, and you can review it when results are released."
        />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-rule">
              <Th>Test</Th>
              <Th>Submitted</Th>
              <Th className="text-right">Result</Th>
              <Th>Status</Th>
              <Th className="w-24"></Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ test, attempt, released, totals }) => (
              <tr
                key={attempt.id}
                onClick={() => navigate(`/student/history/${attempt.id}`)}
                className="cursor-pointer border-b border-rule transition-colors last:border-0 hover:bg-raised/50"
              >
                <Td className="font-medium text-ink">{test.title}</Td>
                <Td>{formatDateTime(attempt.submittedAt)}</Td>
                <Td className="text-right font-mono tabular-nums">
                  {released && totals ? `${totals.earned}/${totals.max}` : "—"}
                </Td>
                <Td>
                  {!released ? (
                    <StatusDot tone="muted">Not released</StatusDot>
                  ) : totals?.complete ? (
                    <StatusDot tone="success">Graded</StatusDot>
                  ) : (
                    <StatusDot tone="primary">Being graded</StatusDot>
                  )}
                </Td>
                <Td className="text-right">
                  <Button variant="ghost" size="sm">
                    {released ? "Review" : "Details"}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
};
