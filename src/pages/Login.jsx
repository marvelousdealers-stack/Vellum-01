import { useState } from "react";
import { useNavigate } from "react-router";
import { Wordmark } from "@/components/common";
import { login } from "@/api/auth";
import { USE_MOCK } from "@/api/client";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { ROLE_HOME } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_EMAIL = {
  admin: "s.whitfield@westfield.edu",
  teacher: "r.chen@westfield.edu",
  student: "maya.okafor@westfield.edu",
};

const Login = () => {
  // The role cards exist only for the fake server, so the demo can sign in
  // as anyone. With a real backend the account decides the role.
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState(USE_MOCK ? DEMO_EMAIL.teacher : "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  const pickRole = (r) => {
    setRole(r);
    if (USE_MOCK) setEmail(DEMO_EMAIL[r]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const session = await login({ email, password, role });
      signIn(session);
      toast.push(`Signed in as ${session.user.name}`, "success");
      navigate(ROLE_HOME[session.user.role], { replace: true });
    } catch (err) {
      setError(err?.message || "Couldn't sign in — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-bg tablet:grid-cols-[1.1fr_1fr]">
      {/* ── Left: brand panel — navy ink on ruled vellum lines ── */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-sidebar-bg px-5 py-4 tablet:p-14">
        <Wordmark size={34} tone="sidebar" className="relative z-10" />

        <div className="relative z-10 py-16 max-tablet:hidden tablet:py-0">
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

        <div className="relative z-10 text-[13px] font-medium text-sidebar-ink-3 max-tablet:hidden">
          Westfield Academy · Spring term 2026
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex items-start justify-center bg-bg px-5 py-8 tablet:items-center tablet:p-14">
        <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
          <h2 className="font-serif text-[30px] font-semibold tracking-[-0.02em] text-ink">
            Sign in
          </h2>
          <p className="mb-8 mt-1.5 text-[13.5px] text-ink-3">
            Use your school account.
          </p>

          {USE_MOCK && (
          <div className="mb-6 grid grid-cols-3 gap-2">
            {["admin", "teacher", "student"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => pickRole(r)}
                className={cn(
                  "rounded-[var(--radius-container)] border border-border bg-surface p-3 text-left narrow:p-3.5 transition-all hover:border-rule-3",
                  role === r && "border-primary bg-primary-soft ring-2 ring-primary/15"
                )}
              >
                <div
                  className={cn(
                    "font-display text-[14px] font-semibold text-ink",
                    role === r && "text-primary"
                  )}
                >
                  {r[0].toUpperCase() + r.slice(1)}
                </div>
                <div className="mt-0.5 text-[12px] leading-snug text-ink-3">
                  {r === "admin"
                    ? "Manage"
                    : r === "teacher"
                      ? "Build & grade"
                      : "Take & review"}
                </div>
              </button>
            ))}
          </div>
          )}

          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required={!USE_MOCK}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="mb-3 text-[13px] text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={busy}>
            {busy ? "Signing in…" : "Continue"}
          </Button>

          {USE_MOCK && (
            <p className="mt-5 text-center text-[12.5px] text-ink-3">
              Demo build — pick a role; any password works.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
