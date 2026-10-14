import { useApp } from "@/context/AppContext";

// The "Physics · 11A" label at the top of screens. Teachers work inside one
// subject of one class; students see their class only (their screens span
// every subject).
export const Scope = () => {
  const { role, activeClassObj, activeSubject } = useApp();
  const cls = activeClassObj?.short ?? "…";
  if (role === "student") return <>{activeClassObj?.name ?? "…"}</>;
  return <>{activeSubject?.name ?? "No subject"} · {cls}</>;
};
