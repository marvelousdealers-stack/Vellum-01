// Integration test — real src/api modules → real client → fake server (src/mocks).
// No browser, no test runner. Run from the project root (needs esbuild):
//
//   npx esbuild tests/integration.test.js --bundle --platform=node --format=esm \
//     --alias:@=./src --loader:.js=jsx \
//     --define:import.meta.env='{"DEV":false,"VITE_USE_MOCK":"true"}' \
//     --outfile=/tmp/int.mjs && node /tmp/int.mjs
//
// Prints "ok" / "FAIL" per check; exit code 1 on any failure. Also run it with
// "VITE_API_BASE_URL":"http://localhost:5000/api" added to the define above.
// Replace with vitest in Phase 10 of plan.md.
// Integration test: real api modules → real client → fake server (src/mocks).
const store = {};
globalThis.window = globalThis;
globalThis.localStorage = { getItem:k=>store[k]??null, setItem:(k,v)=>{store[k]=v}, removeItem:k=>{delete store[k]} };
window.location = { origin: "http://localhost" };
window.addEventListener = () => {};
const assert = (c,m)=>{ if(!c){console.log("FAIL:",m);process.exitCode=1}else console.log("ok  :",m) };

const { installMockServer } = await import("@/mocks/server");
const { db } = await import("@/mocks/db");
const client = await import("@/api/client");
const { login, fetchMe } = await import("@/api/auth");
const T = await import("@/api/tests"); const A = await import("@/api/attempts"); const G = await import("@/api/grades");
const cache = await import("@/api/cache");
installMockServer({ baseUrl: client.BASE_URL, latency: [0, 1] });
client.setAuthToken(null);

const as = async (role) => { const s = await login({ email: "", password: "x", role }); client.setAuthToken(s.token); return s.user; };
const get = (p) => client.call(p);
const code = async (fn) => { try { await fn(); return null; } catch (e) { return e; } };

// ── auth & wire ──
let e = await code(() => get("/tests"));
assert(e?.status===401, "no token → 401");
let unauthorized = 0; client.onUnauthorized(()=>{unauthorized++}); await code(() => get("/tests"));
assert(unauthorized===1, "401 calls the registered handler");
const teacher = await as("teacher");
assert(teacher.role==="teacher" && teacher.id && (await fetchMe()).name===teacher.name, "login + /auth/me (ids adapted)");
const raw = await (await fetch(client.BASE_URL + "/tests", { headers: { Authorization: `Bearer mock.${teacher.id}` } })).json();
assert(raw[0]._id && !("id" in raw[0]) && typeof raw[0].createdAt==="string" && /T.*Z$/.test(raw[0].createdAt), "wire: server sends _id + ISO dates");
const tests = await get("/tests");
assert(tests[0].id && typeof tests[0].createdAt==="number", "client adapts: id + ms timestamps");

// ── teacher list ──
const by = (t) => tests.find(x=>x.title===t);
const exp = { "Wave Optics — Quiz 2":["live",10,30], "Newton's Laws — Unit Test":["draft",12,40], "Thermodynamics — Mid-term":["scheduled",15,60], "Bonding & Structure":["draft",10,30], "Kinematics — Quiz":["completed",8,25] };
for (const [t,[s,q,m]] of Object.entries(exp)) assert(by(t).status===s && by(t).questionCount===q && by(t).totalMarks===m, `${t}: ${s} ${q}q ${m}m`);
assert(by("Wave Optics — Quiz 2").settings.release==="after_close", "settings come back complete (defaults)");

// ── role scoping ──
const stu = await as("student");
const sTests = await get("/tests");
assert(sTests.length===3 && !sTests.some(t=>t.status==="draft"), "student sees only published tests");
assert(sTests.every(t=>!("questionSet" in t) && !("variants" in t) && t.questionCount>0 && t.totalMarks>0), "student tests carry no questions, but counts");
e = await code(() => T.generateTest({ mix:[{type:"mcq",count:1,marks:1}], mode:"class" }));
assert(e?.status===403, "student can't generate a test");
await as("teacher");
e = await code(() => G.reviewGrade("x","y",{marks:1})); assert(e?.status===404, "unknown grade → 404");
await as("student"); e = await code(() => get("/grading/queue")); assert(e?.status===403, "student can't read the grading queue");
await as("teacher");

// ── generate / edit / publish ──
const cfg = { subjectId:"sub-phys-11a", title:"", mix:[{type:"mcq",count:3,marks:2},{type:"truefalse",count:2,marks:1},{type:"short",count:2,marks:4}], targetMarks:16, duration:20, mode:"class", difficulty:"balanced", focusTopics:["Kinematics","Gravitation"], instruction:"", classId:"cls-11a", cls:"11A", subject:"Physics" };
const t1 = await T.generateTest(cfg);
assert(t1.status==="draft" && t1.questionSet.length===7 && t1.title==="Kinematics & Gravitation — Test" && t1.questionCount===7 && t1.totalMarks===16, "generate: draft, 7 questions, auto title, counts");
e = await code(() => T.generateTest({...cfg, mix:[]})); assert(e?.status===400, "empty mix → 400");
const broken = t1.questionSet.map((q,i)=> i===0 ? {...q, correctIndex:null} : q);
await T.saveTest(t1.id, { questionSet: broken });
e = await code(() => T.publishTest(t1.id)); assert(e?.status===400 && e.code==="INVALID_QUESTIONS", "publish with an invalid question → 400");
await T.saveTest(t1.id, { questionSet: t1.questionSet });
const regen = await T.regenerateTest(t1.id); assert(regen.questionSet[0].id!==t1.questionSet[0].id && regen.regenCount===1, "regenerate replaces questions");
const dup = await T.duplicateTest(t1.id); assert(dup.title.endsWith("(copy)") && dup.status==="draft" && dup.questionSet[0].id!==regen.questionSet[0].id, "duplicate: new id/questions, draft");
await T.publishTest(t1.id, { settings: { release:"immediately", aiGrading:true, allowBack:false } });
let t1s = (await get("/tests")).find(t=>t.id===t1.id);
assert(t1s.status==="live" && t1s.settings.allowBack===false && t1s.settings.release==="immediately", "publish now → live, settings stored");
e = await code(() => T.saveTest(t1.id, { title:"x" })); assert(e?.status===409 && e.code==="NOT_EDITABLE", "editing a live test → 409");
e = await code(() => T.deleteTest(t1.id)); assert(e?.status===409, "can't delete a live test");

// schedule + start now
const from = Date.now()+3_600_000;
await T.publishTest(dup.id, { availableFrom: from, availableUntil: from+7_200_000 });
let d1 = (await get("/tests")).find(t=>t.id===dup.id);
assert(d1.status==="scheduled" && d1.schedule.availableFrom===from, "schedule → scheduled (ISO round-trips to ms)");
await T.startTestNow(dup.id);
d1 = (await get("/tests")).find(t=>t.id===dup.id);
assert(d1.status==="live" && d1.schedule.availableUntil===from+7_200_000, "start now → live, keeps close time");

// ── student takes the test ──
await as("student");
const stuTests = await get("/tests");
assert(stuTests.some(t=>t.id===t1.id), "student now sees the new live test");
const att = await A.startAttempt(t1.id);
assert(att.status==="in_progress" && att.questions.length===7 && att.deadline-att.startedAt===20*60_000, "start: attempt with 20-min deadline");
assert(att.questions.every(q=>!("correctIndex" in q) && !("expectedAnswer" in q) && !("rubric" in q)), "attempt questions carry no answer key");
assert(!("grades" in att) && att.released===false && att.totals===null, "attempt: no grades, not released");
assert((await A.startAttempt(t1.id)).id===att.id, "start twice → same attempt");
const sched = (await get("/tests")).find(t=>t.title==="Thermodynamics — Mid-term");
e = await code(() => A.startAttempt(sched.id)); assert(e?.status===409 && e.code==="NOT_OPEN", "scheduled test → 409 NOT_OPEN");
const ls = await T.getLiveStatus(t1.id); assert(ls.stopped===false && ls.deadline===att.deadline, "live-status: not stopped, own deadline");

const mc = att.questions.filter(q=>q.options);
const written = att.questions.filter(q=>!q.options);
await A.saveAnswer(att.id, mc[0].id, 1);
await A.logFlag(t1.id, "tab-switch");
const mine = (await get("/attempts")).find(a=>a.id===att.id);
assert(mine.answers[mc[0].id]===1 && mine.flags.length===1, "answers + flags saved");
// answer all choices by the key (look it up server-side for the test)
const full = db().tests.find(t=>t.id===t1.id).questionSet;
const answers = {}; full.forEach(q => { if (q.options) answers[q.id] = q.correctIndex; else answers[q.id] = q.expectedAnswer; });
const res = await A.submitAttempt(t1.id, { reason:"manual", answers });
assert(res.status==="submitted" && res.released===true && res.totals.earned===full.filter(q=>q.options).reduce((s,q)=>s+q.marks,0), "submit (release: immediately): released, objective marks counted");
assert(res.totals.complete===false && res.totals.notFinal===2, "submit: 2 written answers not final yet");
assert((await A.submitAttempt(t1.id, { reason:"timeout" })).submitReason==="manual", "submit idempotent");

// ── review gating ──
const review = await get(`/attempts/${att.id}/review`);
assert(review.items.length===7 && review.items.every(i=>"correctIndex" in i), "review (immediately): available with answers");
assert(review.items.filter(i=>i.grade.status!=="final").every(i=>!("marks" in i.grade)), "non-final grades expose no marks");

// after_close test: hidden until it ends
await as("teacher");
const t2 = await T.generateTest({...cfg, title:"After close"}); await T.publishTest(t2.id);
await as("student");
const a2 = await A.startAttempt(t2.id); await A.submitAttempt(t2.id, { reason:"manual" });
e = await code(() => get(`/attempts/${a2.id}/review`)); assert(e?.status===403 && e.code==="NOT_RELEASED", "after_close: review → 403 NOT_RELEASED while live");
const listed = (await get("/attempts")).find(a=>a.id===a2.id); assert(listed.released===false && listed.totals===null, "after_close: attempt shows released:false, totals:null");
await as("teacher"); await T.stopTestNow(t2.id);
await as("student");
assert((await get(`/attempts/${a2.id}/review`)).totals, "after_close: released once the test ends");
assert((await get("/attempts")).find(a=>a.id===a2.id).released===true, "attempt flips to released");
e = await code(() => T.getLiveStatus(t2.id)); assert((await T.getLiveStatus(t2.id)).stopped===true, "live-status: stopped");

// ── server-side sweep: timeout & stop grace ──
await as("teacher");
const t3 = await T.generateTest({...cfg, title:"Sweep"}); await T.publishTest(t3.id);
await as("student"); const a3 = await A.startAttempt(t3.id);
db().attempts.find(a=>a.id===a3.id).deadline = Date.now()-1000;
const swept = (await get("/attempts")).find(a=>a.id===a3.id);
assert(swept.status==="submitted" && swept.submitReason==="timeout", "server closes an attempt past its deadline (timeout)");
await as("teacher");
const t4 = await T.generateTest({...cfg, title:"Stopped"}); await T.publishTest(t4.id);
await as("student"); const a4 = await A.startAttempt(t4.id);
await as("teacher"); await T.stopTestNow(t4.id);
await as("student");
assert((await get("/attempts")).find(a=>a.id===a4.id).status==="in_progress", "after a stop the student has a grace period to submit themselves");
db().tests.find(t=>t.id===t4.id).stoppedAt = Date.now()-31_000;
assert((await get("/attempts")).find(a=>a.id===a4.id).submitReason==="stopped", "…then the server closes it (stopped)");

// ── roster + extend ──
await as("teacher");
const roster = await get(`/tests/${t1.id}/attempts`);
assert(roster.length===6 && roster.every(r=>r.student.name && r.student.roll), "roster: one row per class student");
const mayRow = roster.find(r=>r.student.name==="Maya Okafor");
assert(mayRow.attempt.status==="submitted" && mayRow.attempt.progress.total===7 && mayRow.attempt.progress.answered===7 && mayRow.attempt.flags.length===1 && !("answers" in mayRow.attempt), "roster: progress + flags, never the answers");
assert(roster.filter(r=>!r.attempt).length===5, "roster: others haven't started");
const t5 = await T.generateTest({...cfg, title:"Extend"}); const until = Date.now()+3_600_000;
await T.publishTest(t5.id, { availableUntil: until });
await as("student"); const a5 = await A.startAttempt(t5.id);
await as("teacher"); const ext = await T.extendTest(t5.id, 15);
assert(ext.closesAt===until+900_000, "extend: new close time");
await as("student");
assert((await T.getLiveStatus(t5.id)).deadline===a5.deadline+900_000, "extend reaches the open attempt (via live-status deadline)");
await as("teacher"); await T.stopTestNow(t5.id);
e = await code(() => T.extendTest(t5.id, 5)); assert(e?.status===409, "can't extend an ended test");

// ── grading ──
let queue = await get("/grading/queue");
const kin = queue.filter(i=>i.test==="Kinematics — Quiz");
assert(kin.length===18 && kin.every(i=>!i.manual && i.status==="pending" && i.submittedAt>0), "queue: 6 students × 3 written answers");
assert(new Set(kin.map(i=>i.confidence)).size>=2, "queue: spread of confidence");
assert(kin.find(i=>i.student==="Adrian Bell").flags===2 && kin.find(i=>i.student==="Tomás Reyes").roll==="11A-28", "queue: flags + roll");
const target = kin.find(i=>i.student==="Priya Nair");
await G.reviewGrade(target.attemptId, target.questionId, { marks: target.maxScore, feedback:"Good", final:true });
queue = await get("/grading/queue");
let q1 = queue.find(i=>i.id===target.id);
assert(q1.status==="reviewed" && q1.score===target.maxScore && q1.source==="teacher" && q1.feedback==="Good" && q1.aiScore===target.aiScore, "override: reviewed, teacher source, AI suggestion kept");
e = await code(() => G.reviewGrade(target.attemptId, target.questionId, { marks: target.maxScore+1 })); assert(e?.status===400 && e.code==="INVALID_MARKS", "marks above max → 400 INVALID_MARKS");
const hi = queue.filter(i=>i.status==="pending" && i.confidence==="high" && !i.manual);
const ap = await G.approveGrades(hi.map(i=>({attemptId:i.attemptId, questionId:i.questionId})));
assert(ap.approved===hi.length && hi.length>0, `bulk approve ${ap.approved} high-confidence`);
assert((await G.approveGrades(hi.map(i=>({attemptId:i.attemptId, questionId:i.questionId})))).approved===0, "approve idempotent");
queue = await get("/grading/queue");
assert(queue.filter(i=>i.status==="pending" && i.confidence==="high" && !i.manual).length===0 && queue.some(i=>i.status==="pending"), "low/med confidence still need review");

// AI off → manual queue
const t6 = await T.generateTest({...cfg, title:"No AI"}); await T.publishTest(t6.id, { settings:{ aiGrading:false } });
await as("student"); const a6 = await A.startAttempt(t6.id);
const wq = a6.questions.find(q=>!q.options);
await A.submitAttempt(t6.id, { reason:"manual", answers:{ [wq.id]:"my answer" } });
await as("teacher");
const m = (await get("/grading/queue")).find(i=>i.attemptId===a6.id && i.questionId===wq.id);
assert(m.manual===true && m.status==="pending" && m.score===null && m.answer==="my answer", "AI off → manual item, no mark");
await G.reviewGrade(a6.id, wq.id, { marks:2, feedback:"ok", final:true });
assert((await get("/grading/queue")).find(i=>i.id===m.id).status==="reviewed", "manual mark saved");

// finished students see only final marks
await as("student");
const kinAttempt = (await get("/attempts")).find(a=>a.testId===by("Kinematics — Quiz").id);
assert(kinAttempt.released===true && kinAttempt.totals.max===25 && kinAttempt.totals.earned>=10, "student: Kinematics released, totals from final marks");

// ── classes & subjects ──
const S = await import("@/api/subjects");
await as("teacher");
const tClasses = await get("/classes"), tSubjects = await get("/subjects");
assert(tClasses.length===2 && tClasses.every(c=>c.id&&c.code&&c.studentCount>0&&c.teachers.length>0), "teacher: the 2 classes they teach, with counts + teachers");
assert(tSubjects.length===5 && tSubjects[0].name==="Physics" && tSubjects[0].classId===tClasses[0].id, "teacher: 5 subjects in their classes, creation order (Physics first)");
await as("student");
assert((await get("/classes")).length===1 && (await get("/subjects")).length===3, "student: own class + its 3 subjects only");
e = await code(() => S.createSubject({ classId:"cls-11a", name:"Art" })); assert(e?.status===403, "student can't create a subject");
await as("teacher");
const chem = tSubjects.find(x=>x.classId==="cls-11a"&&x.name==="Chemistry");
e = await code(() => T.generateTest({ mix:[{type:"mcq",count:1,marks:1}], mode:"class" })); assert(e?.code==="SUBJECT_REQUIRED", "generate without a subject → SUBJECT_REQUIRED");
const gen = await T.generateTest({ subjectId: chem.id, mix:[{type:"mcq",count:1,marks:1}], mode:"class" });
assert(gen.subject==="Chemistry" && gen.cls==="11A" && gen.subjectId===chem.id, "generate: subject, class derive from subjectId");
const bio = await S.createSubject({ classId:"cls-11a", name:"  Biology " });
assert(bio.name==="Biology" && bio.classId==="cls-11a", "create subject trims the name");
e = await code(() => S.createSubject({ classId:"cls-11a", name:"biology" })); assert(e?.code==="DUPLICATE_SUBJECT" && e.status===409, "duplicate name in a class → 409");
e = await code(() => S.createSubject({ classId:"cls-11a", name:"  " })); assert(e?.code==="INVALID_SUBJECT" && e.status===400, "blank name → 400");
e = await code(() => S.createSubject({ classId:"nope", name:"X" })); assert(e?.status===404, "unknown class → 404");
await S.updateSubject(chem.id, { name:"Chemistry II", outline:"Atoms, bonding" });
const renamed = (await get("/tests")).filter(x=>x.subjectId===chem.id);
assert(renamed.length>=2 && renamed.every(x=>x.subject==="Chemistry II"), "rename carries through to tests");
e = await code(() => S.deleteSubject(chem.id)); assert(e?.code==="SUBJECT_IN_USE" && e.status===409, "subject with tests can't be deleted");
await S.deleteSubject(bio.id);
assert(!(await get("/subjects")).some(x=>x.id===bio.id), "empty subject deleted");
e = await code(() => client.call(`/subjects/${bio.id}/materials`, { method:"POST", body:new FormData() })); assert(e?.status===404, "materials for a missing subject → 404");

// ── admin: accounts & classes ──
const AD = await import("@/api/admin");
await as("teacher");
e = await code(() => get("/users")); assert(e?.status===403, "teacher can't list accounts");
e = await code(() => AD.createClass({ name:"Grade 9 — Section C" })); assert(e?.status===403, "teacher can't create a class");
await as("admin");
const allUsers = await get("/users");
assert(allUsers.length===3+6+11 && !allUsers.some(u=>u.role==="admin") && allUsers.every(u=>u.id&&u.email&&u.active===true), "admin: lists teachers + students, never admins");
assert(allUsers.find(u=>u.name==="Dr. R. Chen").classIds.length===2, "teacher account carries the classes they teach");
const newT = await AD.createUser({ name:" Ms.  A. Mensah ", email:"A.Mensah@westfield.edu", role:"teacher", classIds:["cls-10a"] });
assert(newT.name==="Ms. A. Mensah" && newT.email==="a.mensah@westfield.edu" && newT.classIds.join()==="cls-10a", "create teacher: trims, lowercases email, assigns class");
e = await code(() => AD.createUser({ name:"X", email:"a.mensah@westfield.edu", role:"teacher" })); assert(e?.code==="DUPLICATE_EMAIL" && e.status===409, "duplicate email → 409");
e = await code(() => AD.createUser({ name:"X", email:"nope", role:"teacher" })); assert(e?.code==="INVALID_INPUT", "bad email → 400");
e = await code(() => AD.createUser({ name:"New Kid", email:"nk@westfield.edu", role:"student" })); assert(e?.code==="INVALID_INPUT", "student needs a class");
const kid = await AD.createUser({ name:"New Kid", email:"nk@westfield.edu", role:"student", classId:"cls-10a" });
assert(kid.cls==="10A" && kid.roll==="10A-19", "create student: class code + next roll number");
const ro = await get("/classes/cls-10a/roster");
assert(ro.students.length===6 && ro.teachers.length===2 && ro.students.find(x=>x.id===kid.id).average===null, "roster: new student + teacher listed, no average yet");
const may = (await get("/classes/cls-11a/roster")).students.find(x=>x.name==="Maya Okafor");
assert(may.average>=40 && may.average<=100, "roster: average comes from submitted attempts");
await AD.updateUser(kid.id, { classId:"cls-11b" });
assert((await get("/classes/cls-11b/roster")).students.some(x=>x.id===kid.id) && (await get("/users")).find(u=>u.id===kid.id).roll==="11B-22", "move student to another class (new roll)");
await AD.updateUser(kid.id, { classId:null });
assert((await get("/users")).find(u=>u.id===kid.id).cls===null, "remove student from class");
await AD.updateUser(kid.id, { active:false });
const kidRes = await fetch(client.BASE_URL + "/tests", { headers: { Authorization: `Bearer mock.${kid.id}` } });
assert(kidRes.status===401, "deactivated account's token stops working");
e = await code(() => login({ email:"nk@westfield.edu", password:"x" })); assert(e?.code==="ACCOUNT_DISABLED" && e.status===403, "deactivated account can't sign in");
e = await code(() => AD.updateUser("u-admin", { active:false })); assert(e?.status===409, "admin accounts can't be changed here");
e = await code(() => AD.deleteUser("u-admin")); assert(e?.status===409, "admin accounts can't be removed here");
await AD.deleteUser(kid.id); await AD.deleteUser(newT.id);
assert(!(await get("/users")).some(u=>u.id===kid.id||u.id===newT.id) && !(await get("/classes")).flatMap(c=>c.teachers).some(t=>t.id===newT.id), "remove accounts (also from classes' teachers)");
const nc = await AD.createClass({ name:"Grade 9 — Section C", teacherIds:["u-osei"] });
assert(nc.code==="9C" && nc.id==="cls-9c" && nc.teachers[0].name==="Mr. D. Osei" && nc.studentCount===0, "create class: derived code, teachers assigned");
e = await code(() => AD.createClass({ name:"grade 9 — section c" })); assert(e?.code==="DUPLICATE_CLASS" && e.status===409, "duplicate class → 409");
e = await code(() => AD.createClass({ name:"Z", teacherIds:["u-maya.okafor"] })); assert(e?.code==="INVALID_INPUT", "only teachers can be assigned to a class");
const upd = await AD.updateClass(nc.id, { name:"Grade 9 — Section C (Honours)", teacherIds:["u-osei","u-park"] });
assert(upd.name.endsWith("(Honours)") && upd.teachers.length===2 && upd.code==="9C", "update class: rename + reassign teachers, code stays");
e = await code(() => AD.deleteClass("cls-11a")); assert(e?.code==="CLASS_IN_USE" && e.status===409, "class with tests can't be deleted");
await AD.deleteClass(nc.id);
assert(!(await get("/classes")).some(c=>c.id===nc.id), "empty class deleted");
await as("teacher");

// ── network failure ──
const realFetch = window.fetch; window.fetch = async () => { throw new TypeError("offline"); };
e = await code(() => get("/tests")); window.fetch = realFetch;
assert(e?.code==="NETWORK" && e.status===0 && /connection/.test(e.message), "network failure → friendly ApiError");
e = await code(() => get("/nope")); assert(e?.status===404, "unknown endpoint → 404");

// ── cache: refetch after a write ──
await as("teacher");
cache.clearCache(); let n = 0; const f = () => { n++; return get("/tests"); };
cache.register(["tests"], f); await cache.load(["tests"], f);
await T.saveTest(by("Bonding & Structure").id, { title:"Bonding & Structure" });
await new Promise(r=>setTimeout(r,30));
assert(n===2, "a successful write refetches the ['tests'] list");
