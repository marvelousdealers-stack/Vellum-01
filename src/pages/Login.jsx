import { useState } from "react";
import { useNavigate } from "react-router";
import { Wordmark } from "@/components/common";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { ROLE_HOME } from "@/routes/paths";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [role, setRole] = useState("teacher");
  const { setRole: setAppRole } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppRole(role);
    toast.push(`Signed in as ${role}`, "success");
    navigate(ROLE_HOME[role], { replace: true });
  };

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-bg tablet:grid-cols-[1.1fr_1fr]">
      {/* ── Left: brand panel — navy ink on ruled vellum lines ── */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-sidebar-bg p-8 tablet:p-14">
        <Wordmark size={34} tone="sidebar" className="relative z-10" />

        <div className="relative z-10 py-16 tablet:py-0">
          <h1 className="font-serif text-[48px] font-semibold leading-[1.02] tracking-[-0.025em] text-sidebar-ink tablet:text-[72px]">
            Assessment
            <span className="ml-2 inline-block h-[0.72em] w-[5px] translate-y-[0.04em] animate-beacon bg-sidebar-accent align-baseline" />
          </h1>
          <p className="mt-7 max-w-[460px] text-[16.5px] leading-relaxed text-sidebar-ink-2">
            Read a course outline in any form. Weigh what recurs. Draft a
            test. Grade against a rubric. Show every student where they
            actually stand.
          </p>
        </div>

        <div className="relative z-10 text-[13px] font-medium text-sidebar-ink-3">
          Westfield Academy · Spring term 2026
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex items-center justify-center bg-bg p-8 tablet:p-14">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
          <h2 className="font-serif text-[30px] font-semibold tracking-[-0.02em] text-ink">
            Sign in
          </h2>
          <p className="mb-8 mt-1.5 text-[13.5px] text-ink-3">
            Use your school account.
          </p>

          <div className="mb-6 grid grid-cols-1 gap-1.5 narrow:grid-cols-3">
            {["admin", "teacher", "student"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-[var(--radius-container)] border border-rule-2 bg-surface p-3.5 text-left transition-all hover:border-rule-3",
                  role === r && "border-primary bg-primary-soft ring-2 ring-primary/15"
                )}
              >
                <div
                  className={cn(
                    "font-display text-sm font-medium text-ink",
                    role === r && "text-primary"
                  )}
                >
                  {r[0].toUpperCase() + r.slice(1)}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-3">
                  {r === "admin"
                    ? "Manage"
                    : r === "teacher"
                      ? "Build & grade"
                      : "Take & review"}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-medium text-ink-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="r.chen@westfield.edu"
              className="w-full rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-[13px] font-medium text-ink-2">
              Password
            </label>
            <input
              type="password"
              defaultValue="••••••••••"
              className="w-full rounded-[var(--radius-control)] border border-rule-2 bg-surface px-3 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            type="submit" className="mt-2 w-full"
          >
            Continue
          </Button>

          <p className="mt-5 text-center text-[12.5px] text-ink-3">
            Demo build — any credentials work.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
