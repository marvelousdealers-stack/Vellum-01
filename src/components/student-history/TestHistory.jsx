import { SectionHeader, StatusDot, TableShell, Td, Th } from "@/components/common";
import { PAST_ATTEMPTS } from "@/data/analytics";

// STOPGAP: the original TestHistory view was missing from the codebase
// (it was imported but never exported, which broke the build). This is a
// minimal table over PAST_ATTEMPTS so the route works; redesign in phase 2/3.
export const TestHistory = () => (
  <div className="animate-[page-in_0.4s_ease-out]">
    <SectionHeader label="Test history" />
    <TableShell>
      <thead>
        <tr className="border-b border-rule">
          <Th>Test</Th>
          <Th>Date</Th>
          <Th>Score</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody>
        {PAST_ATTEMPTS.map((a) => (
          <tr key={a.id} className="border-b border-rule last:border-0">
            <Td className="font-medium text-ink">{a.test}</Td>
            <Td>{a.date}</Td>
            <Td className="font-mono tabular-nums">
              {a.score}/{a.total}
            </Td>
            <Td>
              <StatusDot tone={a.flagged ? "warning" : "success"}>
                {a.flagged ? "Flagged" : a.status}
              </StatusDot>
            </Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  </div>
);
