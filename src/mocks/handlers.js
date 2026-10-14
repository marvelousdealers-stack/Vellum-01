import { createId } from "@/lib/id";
import { isChoice, validateQuestions } from "@/lib/questions";
import { db, save, users } from "./db";
import {
  answeredIn,
  attemptForStudent,
  confidenceLabel,
  deadlineFor,
  isReleased,
  questionsFor,
  settingsOf,
  statusOf,
  stripQuestion,
  sumMarks,
  tabSwitches,
  testForStudent,
  testForTeacher,
  totalsOf,
  variantIndexFor,
  DEFAULT_SETTINGS,
} from "./engine";
import { buildQuestions, buildVariants } from "./generator";
import { buildGrades } from "./grader";
import { STUDENTS } from "@/data/users";
import { EXTRACTED_TOPICS } from "@/data/materials";

// ═══════════════════════════════════════════════════════════════
// FAKE BACKEND ENDPOINTS (dev only)
//
// One handler per row of API-CONTRACT.md. Each receives
//   { user, params, query, body, now }
// and returns the JSON the real server would send (or throws HttpError).
// Request bodies arrive already converted to the UI's conventions and
// responses are converted back to wire format by server.js, so the
// frontend's adapters are exercised for real.
// ═══════════════════════════════════════════════════════════════
export class HttpError extends Error {
  constructor(status, message, code = null) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
const fail = (status, message, code) => {
  throw new HttpError(status, message, code);
};
const as = (user, role) => user.role === role || fail(403, "You don't have access to this");

// ── classes & subjects (who may see / change what) ──
const classesFor = (user) => {
  const all = db().classes;
  if (user.role === "teacher") return all.filter((c) => c.teacherIds.includes(user.id));
  if (user.role === "student") return all.filter((c) => c.code === user.cls);
  return all;
};
const studentsOf = (cls) => users().filter((u) => u.role === "student" && u.classId === cls.id);
const teachersOf = (cls) => cls.teacherIds.map((id) => users().find((u) => u.id === id)).filter(Boolean);
const classView = (c) => ({
  id: c.id,
  code: c.code,
  name: c.name,
  studentCount: studentsOf(c).length,
  subjectCount: db().subjects.filter((s) => s.classId === c.id).length,
  teachers: teachersOf(c).map((t) => ({ id: t.id, name: t.name })),
});
const userView = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  active: u.active !== false,
  ...(u.role === "student" ? { cls: u.cls ?? null, classId: u.classId ?? null, roll: u.roll } : {}),
  ...(u.role === "teacher"
    ? { classIds: db().classes.filter((c) => c.teacherIds.includes(u.id)).map((c) => c.id) }
    : {}),
});
const findSubject = (id, user) => {
  const sub = db().subjects.find((s) => s.id === id) ?? fail(404, "Subject not found");
  if (user && !classesFor(user).some((c) => c.id === sub.classId)) fail(404, "Subject not found");
  return sub;
};
const cleanSubject = ({ name, outline }, { partial = false } = {}) => {
  const out = {};
  if (!partial || name !== undefined) {
    const n = String(name ?? "").trim();
    if (!n) fail(400, "Give the subject a name", "INVALID_SUBJECT");
    if (n.length > 60) fail(400, "Subject names can be up to 60 characters", "INVALID_SUBJECT");
    out.name = n;
  }
  if (outline !== undefined) {
    if (typeof outline !== "string" || outline.length > 20_000)
      fail(400, "The outline is too long (20,000 characters max)", "INVALID_SUBJECT");
    out.outline = outline;
  }
  return out;
};
const sameName = (classId, name, exceptId) =>
  db().subjects.some(
    (s) => s.classId === classId && s.id !== exceptId && s.name.toLowerCase() === name.toLowerCase(),
  );

// ── admin: accounts & classes ──
const findClass = (id) => db().classes.find((c) => c.id === id) ?? fail(404, "Class not found");
const findUser = (id) => users().find((u) => u.id === id) ?? fail(404, "Account not found");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cleanName = (v, what) => {
  const n = String(v ?? "").trim().replace(/\s+/g, " ");
  if (!n) fail(400, `${what} is required`, "INVALID_INPUT");
  if (n.length > 80) fail(400, `${what} can be up to 80 characters`, "INVALID_INPUT");
  return n;
};
const teacherIdsOf = (ids) => {
  const list = [...new Set(ids ?? [])];
  list.forEach((id) => findUser(id).role === "teacher" || fail(400, "Only teachers can be assigned to a class", "INVALID_INPUT"));
  return list;
};
// "Grade 11 — Section A" → "11A"; anything else → its first letters/digits.
const codeFor = (name) => {
  const grade = /(\d+)/.exec(name)?.[1];
  const section = /section\s+([a-z0-9]+)/i.exec(name)?.[1];
  if (grade && section) return `${grade}${section.toUpperCase()}`;
  return name.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "CLS";
};
const nextRoll = (cls) => {
  const nums = studentsOf(cls).map((u) => Number(/-(\d+)$/.exec(u.roll ?? "")?.[1]) || 0);
  return `${cls.code}-${String(Math.max(0, ...nums) + 1).padStart(2, "0")}`;
};
const percentFor = (name) => {
  const done = db().attempts.filter((a) => a.student === name && a.status === "submitted");
  let earned = 0;
  let max = 0;
  done.forEach((a) => {
    const t = totalsOf(a.questions, a.grades);
    earned += t.earned;
    max += t.max;
  });
  return max ? Math.round((earned / max) * 100) : null;
};

const findTest = (id) => db().tests.find((t) => t.id === id) ?? fail(404, "Test not found");
const touch = (test, patch) => {
  Object.assign(test, patch, { updatedAt: Date.now() });
  save();
  return test;
};

// ── attempts (server-side lifecycle) ─────────────────────────────
const submit = (attempt, test, reason, answers, now) => {
  if (attempt.status === "submitted") return attempt;
  const finalAnswers = { ...attempt.answers, ...(answers ?? {}) };
  Object.assign(attempt, {
    answers: finalAnswers,
    status: "submitted",
    submittedAt: now,
    submitReason: reason,
    grades: buildGrades(attempt.questions, finalAnswers, { aiGrading: settingsOf(test).aiGrading }),
  });
  save();
  return attempt;
};

// Runs before every request, standing in for the server's own timers: close
// attempts that ran out of time, or whose test ended and the student's browser
// never submitted (they poll every ~20 s, so 30 s is generous).
const STOP_GRACE_MS = 30_000;
export const sweep = (now) => {
  db().attempts.forEach((a) => {
    if (a.status !== "in_progress") return;
    const test = db().tests.find((t) => t.id === a.testId);
    if (!test) return;
    if (now >= a.deadline) return submit(a, test, "timeout", null, now);
    const closedAt = test.stoppedAt ?? test.schedule?.availableUntil ?? null;
    if (closedAt && now >= closedAt && now - closedAt > STOP_GRACE_MS) {
      submit(a, test, "stopped", null, now);
    }
    return undefined;
  });
};

const myAttempt = (user, testId) =>
  db().attempts.find((a) => a.testId === testId && a.student === user.name) ?? null;

// ── generation ───────────────────────────────────────────────────
const generateContent = (config, seed) => {
  const opts = { seed, topics: config.focusTopics };
  return config.mode === "personal"
    ? { questionSet: null, variants: buildVariants(config.mix, STUDENTS, opts) }
    : { questionSet: buildQuestions(config.mix, opts), variants: null };
};
const autoTitle = (config) =>
  `${(config.focusTopics ?? []).slice(0, 2).join(" & ") || "Mixed topics"} — Test`;

// ── queue / review shaping ───────────────────────────────────────
const rollOf = (name) => users().find((u) => u.name === name)?.roll ?? "—";

const queueItems = () => {
  const items = [];
  db().attempts.forEach((a) => {
    if (a.status !== "submitted" || !a.grades) return;
    const test = db().tests.find((t) => t.id === a.testId);
    if (!test) return;
    const flags = tabSwitches(a).length;
    a.questions.forEach((q) => {
      if (isChoice(q)) return;
      const g = a.grades[q.id];
      if (!g) return;
      items.push({
        id: `${a.id}:${q.id}`,
        attemptId: a.id,
        questionId: q.id,
        testId: test.id,
        student: a.student,
        roll: rollOf(a.student),
        test: test.title,
        submittedAt: a.submittedAt,
        question: q.text,
        topic: q.topic,
        answer: a.answers[q.id] ?? "",
        modelAnswer: q.expectedAnswer ?? "",
        maxScore: g.max,
        score: g.marks,
        aiScore: g.aiMarks ?? null,
        confidence: confidenceLabel(g.confidence),
        manual: g.aiMarks == null,
        status: g.status === "final" ? "reviewed" : "pending",
        source: g.source,
        rubric: g.rubric,
        feedback: g.feedback ?? "",
        flags,
      });
    });
  });
  return items;
};

// ── the route table ──────────────────────────────────────────────
export const routes = [
  // ───── auth ─────
  {
    method: "POST",
    path: "/auth/login",
    public: true,
    handler: ({ body }) => {
      // The real backend picks the account from the credentials. The fake
      // one also accepts a `role` hint so the demo can sign in as anyone.
      const user =
        users().find((u) => u.email === body?.email?.trim().toLowerCase()) ??
        users().find((u) => u.role === (body?.role ?? "teacher") && u.active) ??
        fail(401, "Wrong email or password");
      if (!user.active) fail(403, "This account has been deactivated. Ask your administrator.", "ACCOUNT_DISABLED");
      return { token: `mock.${user.id}`, user: userView(user) };
    },
  },
  { method: "GET", path: "/auth/me", handler: ({ user }) => userView(user) },

  // ───── admin: accounts ─────
  {
    method: "GET",
    path: "/users",
    handler: ({ user, query }) => {
      as(user, "admin");
      return users()
        .filter((u) => u.role !== "admin" && (!query.role || u.role === query.role))
        .map(userView);
    },
  },
  {
    method: "POST",
    path: "/users",
    handler: ({ user, body }) => {
      as(user, "admin");
      const name = cleanName(body?.name, "Name");
      const email = String(body?.email ?? "").trim().toLowerCase();
      if (!EMAIL.test(email)) fail(400, "Enter a valid email address", "INVALID_INPUT");
      if (users().some((u) => u.email === email)) fail(409, "An account with this email already exists", "DUPLICATE_EMAIL");
      const role = body?.role;
      if (role !== "teacher" && role !== "student") fail(400, "Role must be teacher or student", "INVALID_INPUT");
      const account = { id: createId(), name, email, role, active: true };
      if (role === "student") {
        const cls = findClass(body?.classId ?? fail(400, "Choose a class for the student", "INVALID_INPUT"));
        Object.assign(account, { cls: cls.code, classId: cls.id, roll: nextRoll(cls) });
      }
      users().push(account);
      if (role === "teacher") {
        teacherIdsOf([account.id]); // (validates the new account is a teacher)
        (body?.classIds ?? []).forEach((id) => findClass(id).teacherIds.push(account.id));
      }
      save();
      return userView(account);
    },
  },
  {
    method: "PUT",
    path: "/users/:id",
    handler: ({ user, params, body }) => {
      as(user, "admin");
      const account = findUser(params.id);
      if (account.role === "admin") fail(409, "Administrator accounts can't be changed here", "CANNOT_CHANGE_ADMIN");
      if (body?.active !== undefined) {
        if (account.id === user.id) fail(409, "You can't deactivate your own account", "CANNOT_CHANGE_SELF");
        account.active = !!body.active;
      }
      if (body && "classId" in body) {
        if (account.role !== "student") fail(400, "Only students are enrolled in a class", "INVALID_INPUT");
        const cls = body.classId ? findClass(body.classId) : null;
        Object.assign(account, {
          classId: cls?.id ?? null,
          cls: cls?.code ?? null,
          roll: cls ? (account.roll?.startsWith(`${cls.code}-`) ? account.roll : nextRoll(cls)) : account.roll,
        });
      }
      save();
      return userView(account);
    },
  },
  {
    method: "DELETE",
    path: "/users/:id",
    handler: ({ user, params }) => {
      as(user, "admin");
      const account = findUser(params.id);
      if (account.role === "admin") fail(409, "Administrator accounts can't be removed here", "CANNOT_CHANGE_ADMIN");
      db().users = users().filter((u) => u.id !== account.id);
      db().classes.forEach((c) => (c.teacherIds = c.teacherIds.filter((id) => id !== account.id)));
      save();
      return null;
    },
  },

  // ───── classes & subjects ─────
  {
    method: "GET",
    path: "/classes",
    handler: ({ user }) => classesFor(user).map(classView),
  },
  {
    method: "POST",
    path: "/classes",
    handler: ({ user, body }) => {
      as(user, "admin");
      const name = cleanName(body?.name, "Class name");
      const code = codeFor(name);
      if (db().classes.some((c) => c.code === code || c.name.toLowerCase() === name.toLowerCase()))
        fail(409, `A class like "${name}" already exists`, "DUPLICATE_CLASS");
      const cls = { id: `cls-${code.toLowerCase()}`, code, name, teacherIds: teacherIdsOf(body?.teacherIds) };
      db().classes.push(cls);
      save();
      return classView(cls);
    },
  },
  {
    method: "PUT",
    path: "/classes/:id",
    handler: ({ user, params, body }) => {
      as(user, "admin");
      const cls = findClass(params.id);
      if (body?.name !== undefined) {
        const name = cleanName(body.name, "Class name");
        if (db().classes.some((c) => c.id !== cls.id && c.name.toLowerCase() === name.toLowerCase()))
          fail(409, `A class called "${name}" already exists`, "DUPLICATE_CLASS");
        cls.name = name;
      }
      if (body?.teacherIds !== undefined) cls.teacherIds = teacherIdsOf(body.teacherIds);
      save();
      return classView(cls);
    },
  },
  {
    method: "DELETE",
    path: "/classes/:id",
    handler: ({ user, params }) => {
      as(user, "admin");
      const cls = findClass(params.id);
      if (db().tests.some((t) => t.classId === cls.id))
        fail(409, "This class has tests — delete them first", "CLASS_IN_USE");
      studentsOf(cls).forEach((u) => Object.assign(u, { classId: null, cls: null }));
      db().subjects = db().subjects.filter((s) => s.classId !== cls.id);
      db().classes = db().classes.filter((c) => c.id !== cls.id);
      save();
      return null;
    },
  },
  {
    method: "GET",
    path: "/classes/:id/roster",
    handler: ({ user, params }) => {
      as(user, "admin");
      const cls = findClass(params.id);
      return {
        teachers: teachersOf(cls).map((t) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          classCount: db().classes.filter((c) => c.teacherIds.includes(t.id)).length,
        })),
        students: studentsOf(cls).map((u) => ({
          id: u.id,
          name: u.name,
          roll: u.roll,
          email: u.email,
          active: u.active !== false,
          average: percentFor(u.name),
        })),
      };
    },
  },
  {
    method: "GET",
    path: "/subjects",
    handler: ({ user, query }) => {
      const ids = new Set(classesFor(user).map((c) => c.id));
      return db().subjects.filter(
        (s) => ids.has(s.classId) && (!query.classId || s.classId === query.classId),
      );
    },
  },
  {
    method: "POST",
    path: "/subjects",
    handler: ({ user, body, now }) => {
      as(user, "teacher");
      const cls = classesFor(user).find((c) => c.id === body?.classId) ?? fail(404, "Class not found");
      const fields = cleanSubject(body);
      if (sameName(cls.id, fields.name))
        fail(409, `${cls.code} already has a subject called ${fields.name}`, "DUPLICATE_SUBJECT");
      const subject = { id: createId(), classId: cls.id, outline: "", ...fields, createdAt: now, updatedAt: now };
      db().subjects.push(subject);
      save();
      return subject;
    },
  },
  {
    method: "PUT",
    path: "/subjects/:id",
    handler: ({ user, params, body, now }) => {
      as(user, "teacher");
      const subject = findSubject(params.id, user);
      const fields = cleanSubject(body, { partial: true });
      if (fields.name && sameName(subject.classId, fields.name, subject.id))
        fail(409, `That class already has a subject called ${fields.name}`, "DUPLICATE_SUBJECT");
      Object.assign(subject, fields, { updatedAt: now });
      // Tests carry the subject's name for display; keep it in step.
      if (fields.name) db().tests.forEach((t) => t.subjectId === subject.id && (t.subject = fields.name));
      save();
      return subject;
    },
  },
  {
    method: "DELETE",
    path: "/subjects/:id",
    handler: ({ user, params }) => {
      as(user, "teacher");
      const subject = findSubject(params.id, user);
      if (db().tests.some((t) => t.subjectId === subject.id))
        fail(409, "This subject has tests — delete or move them first", "SUBJECT_IN_USE");
      db().subjects = db().subjects.filter((s) => s.id !== subject.id);
      save();
      return null;
    },
  },

  // ───── materials ─────
  {
    method: "POST",
    path: "/subjects/:id/materials",
    delay: 2600, // extraction is slow on a real server too
    handler: ({ user, params }) => {
      as(user, "teacher");
      findSubject(params.id, user);
      return { topics: EXTRACTED_TOPICS, warnings: [] };
    },
  },

  // ───── tests (read) ─────
  {
    method: "GET",
    path: "/tests",
    handler: ({ user, now }) => {
      if (user.role === "teacher") {
        return [...db().tests]
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .map((t) => testForTeacher(t, now));
      }
      if (user.role === "student") {
        return db()
          .tests.filter(
            (t) =>
              t.status !== "draft" &&
              t.cls === user.cls &&
              (t.mode !== "personal" || variantIndexFor(t, user.name) >= 0),
          )
          .map((t) => testForStudent(t, now));
      }
      return [];
    },
  },

  // ───── tests (teacher writes) ─────
  {
    method: "POST",
    path: "/tests/generate",
    handler: ({ user, body, now }) => {
      as(user, "teacher");
      const { title, subjectId, ...rules } = body;
      if (!subjectId) fail(400, "Pick a subject first", "SUBJECT_REQUIRED");
      const subject = findSubject(subjectId, user);
      const cls = db().classes.find((c) => c.id === subject.classId);
      if (!rules.mix?.some((r) => r.count > 0)) fail(400, "Add at least one question first");
      const test = {
        id: createId(),
        title: title?.trim() || autoTitle(rules),
        subject: subject.name,
        subjectId: subject.id,
        classId: cls.id,
        cls: cls.code,
        status: "draft",
        mode: rules.mode,
        config: rules,
        ...generateContent(rules, 0),
        schedule: null,
        publishedAt: null,
        stoppedAt: null,
        regeneratedAt: null,
        settings: {},
        createdAt: now,
        updatedAt: now,
      };
      db().tests.unshift(test);
      save();
      return testForTeacher(test, now);
    },
  },
  {
    method: "PUT",
    path: "/tests/:id",
    handler: ({ user, params, body, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (statusOf(test, now) !== "draft" && statusOf(test, now) !== "scheduled") {
        fail(409, "This test is live or finished and can't be edited", "NOT_EDITABLE");
      }
      const patch = {};
      ["title", "questionSet", "variants", "config"].forEach((k) => {
        if (body[k] !== undefined) patch[k] = body[k];
      });
      return testForTeacher(touch(test, patch), now);
    },
  },
  {
    method: "POST",
    path: "/tests/:id/regenerate",
    handler: ({ user, params, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (test.status !== "draft") fail(409, "Only drafts can be regenerated");
      const regenCount = (test.regenCount ?? 0) + 1;
      return testForTeacher(
        touch(test, { ...generateContent(test.config, regenCount * 3), regenCount, regeneratedAt: now }),
        now,
      );
    },
  },
  {
    method: "POST",
    path: "/tests/:id/duplicate",
    handler: ({ user, params, now }) => {
      as(user, "teacher");
      const src = findTest(params.id);
      const reId = (qs) => (qs ? qs.map((q) => ({ ...q, id: createId() })) : qs);
      const copy = {
        ...JSON.parse(JSON.stringify(src)),
        id: createId(),
        title: `${src.title} (copy)`,
        status: "draft",
        schedule: null,
        publishedAt: null,
        stoppedAt: null,
        regeneratedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      copy.questionSet = reId(copy.questionSet);
      copy.variants = copy.variants?.map((v) => ({ ...v, questions: reId(v.questions) }));
      db().tests.unshift(copy);
      save();
      return testForTeacher(copy, now);
    },
  },
  {
    method: "DELETE",
    path: "/tests/:id",
    handler: ({ user, params, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (statusOf(test, now) === "live") fail(409, "Stop the test before deleting it");
      db().tests = db().tests.filter((t) => t.id !== test.id);
      db().attempts = db().attempts.filter((a) => a.testId !== test.id);
      save();
      return { deleted: true };
    },
  },
  {
    method: "POST",
    path: "/tests/:id/publish",
    handler: ({ user, params, body, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (test.status !== "draft") fail(409, "This test is already published");
      const sets =
        test.mode === "personal"
          ? (test.variants ?? []).map((v) => v.questions)
          : [test.questionSet ?? []];
      if (sets.some((qs) => validateQuestions(qs).length > 0)) {
        fail(400, "Fix the highlighted questions before publishing", "INVALID_QUESTIONS");
      }
      const { availableFrom, availableUntil, settings } = body ?? {};
      return testForTeacher(
        touch(test, {
          status: "published",
          settings: { ...DEFAULT_SETTINGS, ...settings },
          schedule:
            availableFrom || availableUntil
              ? { availableFrom: availableFrom ?? now, availableUntil: availableUntil ?? null }
              : null,
          publishedAt: now,
          stoppedAt: null,
        }),
        now,
      );
    },
  },
  {
    method: "POST",
    path: "/tests/:id/start-now",
    handler: ({ user, params, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (statusOf(test, now) !== "scheduled") fail(409, "Only a scheduled test can be started early");
      const until = test.schedule?.availableUntil ?? null;
      return testForTeacher(
        touch(test, { schedule: until && until <= now ? null : { availableFrom: now, availableUntil: until } }),
        now,
      );
    },
  },
  {
    method: "POST",
    path: "/tests/:id/stop-now",
    handler: ({ user, params, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (statusOf(test, now) !== "live") fail(409, "This test isn't live");
      return testForTeacher(touch(test, { stoppedAt: now }), now);
    },
  },
  {
    method: "POST",
    path: "/tests/:id/extend",
    handler: ({ user, params, body, now }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      if (statusOf(test, now) !== "live") fail(409, "This test has already ended");
      const ms = Number(body?.minutes) * 60_000;
      if (!(ms > 0)) fail(400, "Enter a number of minutes");
      const until = test.schedule?.availableUntil ?? null;
      if (until) touch(test, { schedule: { ...test.schedule, availableUntil: until + ms } });
      db().attempts.forEach((a) => {
        if (a.testId === test.id && a.status === "in_progress") a.deadline += ms;
      });
      save();
      return { closesAt: until ? until + ms : null };
    },
  },
  {
    method: "GET",
    path: "/tests/:id/attempts",
    handler: ({ user, params }) => {
      as(user, "teacher");
      const test = findTest(params.id);
      return users().filter(
        (u) =>
          u.role === "student" &&
          u.cls === test.cls &&
          (test.mode !== "personal" || variantIndexFor(test, u.name) >= 0),
      ).map((u) => {
        const a = db().attempts.find((x) => x.testId === test.id && x.student === u.name);
        return {
          student: { id: u.id, name: u.name, roll: u.roll },
          attempt: a
            ? {
                id: a.id,
                status: a.status,
                startedAt: a.startedAt,
                deadline: a.deadline,
                submittedAt: a.submittedAt,
                submitReason: a.submitReason,
                progress: { answered: answeredIn(a), total: a.questions.length },
                flags: tabSwitches(a),
              }
            : null,
        };
      });
    },
  },

  // ───── student: taking a test ─────
  {
    method: "GET",
    path: "/tests/:id/start",
    handler: ({ user, params, now }) => {
      as(user, "student");
      const test = findTest(params.id);
      const existing = myAttempt(user, test.id);
      if (existing) return attemptForStudent(existing, test, now);
      if (statusOf(test, now) !== "live") fail(409, "This test isn't open right now", "NOT_OPEN");
      let variantIndex = null;
      if (test.mode === "personal") {
        variantIndex = variantIndexFor(test, user.name);
        if (variantIndex < 0) fail(403, "No test was generated for you — ask your teacher", "NO_VARIANT");
      }
      const attempt = {
        id: createId(),
        testId: test.id,
        student: user.name,
        variantIndex,
        startedAt: now,
        deadline: deadlineFor(test, now),
        status: "in_progress",
        submittedAt: null,
        submitReason: null,
        questions: questionsFor(test, variantIndex),
        answers: {},
        flags: [],
        grades: null,
      };
      db().attempts.push(attempt);
      save();
      return attemptForStudent(attempt, test, now);
    },
  },
  {
    method: "GET",
    path: "/tests/:id/live-status",
    handler: ({ user, params, now }) => {
      as(user, "student");
      const test = findTest(params.id);
      const attempt = myAttempt(user, test.id);
      return {
        stopped: statusOf(test, now) === "completed",
        closesAt: test.schedule?.availableUntil ?? null,
        deadline: attempt?.deadline ?? null,
      };
    },
  },
  {
    method: "PUT",
    path: "/attempts/:id/answers",
    handler: ({ user, params, body }) => {
      as(user, "student");
      const a = db().attempts.find((x) => x.id === params.id && x.student === user.name) ?? fail(404, "Attempt not found");
      if (a.status === "in_progress") {
        a.answers[body.questionId] = body.value;
        save();
      }
      return { ok: true };
    },
  },
  {
    method: "POST",
    path: "/tests/:id/flag",
    handler: ({ user, params, body, now }) => {
      as(user, "student");
      const a = myAttempt(user, params.id) ?? fail(404, "Attempt not found");
      if (a.status === "in_progress") {
        a.flags.push({ type: body.type, at: now });
        save();
      }
      return { ok: true };
    },
  },
  {
    method: "POST",
    path: "/tests/:id/submit",
    handler: ({ user, params, body, now }) => {
      as(user, "student");
      const test = findTest(params.id);
      const a = myAttempt(user, test.id) ?? fail(404, "Attempt not found");
      submit(a, test, body?.reason ?? "manual", body?.answers, now);
      return attemptForStudent(a, test, now);
    },
  },
  {
    method: "GET",
    path: "/attempts",
    handler: ({ user, now }) => {
      as(user, "student");
      return db()
        .attempts.filter((a) => a.student === user.name)
        .map((a) => attemptForStudent(a, db().tests.find((t) => t.id === a.testId), now));
    },
  },

  // ───── grading (teacher) ─────
  {
    method: "GET",
    path: "/grading/queue",
    handler: ({ user }) => {
      as(user, "teacher");
      return queueItems();
    },
  },
  {
    method: "PATCH",
    path: "/grades/:attemptId/:questionId",
    handler: ({ user, params, body, now }) => {
      as(user, "teacher");
      const attempt = db().attempts.find((a) => a.id === params.attemptId);
      const g = attempt?.grades?.[params.questionId] ?? fail(404, "Grade not found");
      const marks = Number(body?.marks);
      if (!Number.isFinite(marks) || marks < 0 || marks > g.max) {
        fail(400, `Marks must be between 0 and ${g.max}`, "INVALID_MARKS");
      }
      const final = body.final !== false;
      attempt.grades[params.questionId] = {
        ...g,
        marks,
        feedback: body.feedback ?? "",
        source: g.aiMarks == null || marks !== g.aiMarks ? "teacher" : g.source,
        status: final ? "final" : g.status === "pending" ? "pending" : "ai_draft",
        reviewedAt: final ? now : g.reviewedAt,
      };
      save();
      return attempt.grades[params.questionId];
    },
  },
  {
    method: "POST",
    path: "/grading/approve",
    handler: ({ user, body, now }) => {
      as(user, "teacher");
      const wanted = new Set((body?.items ?? []).map((i) => `${i.attemptId}:${i.questionId}`));
      let approved = 0;
      db().attempts.forEach((a) => {
        Object.entries(a.grades ?? {}).forEach(([qid, g]) => {
          if (g.status === "ai_draft" && wanted.has(`${a.id}:${qid}`)) {
            a.grades[qid] = { ...g, status: "final", reviewedAt: now };
            approved += 1;
          }
        });
      });
      save();
      return { approved };
    },
  },

  // ───── student review ─────
  {
    method: "GET",
    path: "/attempts/:id/review",
    handler: ({ user, params, now }) => {
      as(user, "student");
      const a = db().attempts.find((x) => x.id === params.id && x.student === user.name);
      if (!a || a.status !== "submitted") fail(404, "Attempt not found");
      const test = findTest(a.testId);
      if (!isReleased(test, a, now)) fail(403, "Results aren't released yet", "NOT_RELEASED");
      return {
        attemptId: a.id,
        test: { title: test.title, subject: test.subject, cls: test.cls },
        submittedAt: a.submittedAt,
        submitReason: a.submitReason,
        flags: tabSwitches(a).length,
        totals: totalsOf(a.questions, a.grades),
        items: a.questions.map((q) => {
          const g = a.grades?.[q.id];
          return {
            question: stripQuestion(q),
            answer: a.answers[q.id] ?? null,
            correctIndex: isChoice(q) ? q.correctIndex : null,
            modelAnswer: isChoice(q) ? "" : (q.expectedAnswer ?? ""),
            grade:
              g?.status === "final"
                ? { status: "final", marks: g.marks, max: g.max, feedback: g.feedback ?? "" }
                : { status: "grading", max: q.marks },
          };
        }),
      };
    },
  },
];

export { sumMarks };
