import { isChoice } from "./questions";

// An answer is a number (chosen option index) for choice questions and a
// string for written ones.
export const isAnswered = (q, answer) =>
  isChoice(q)
    ? Number.isInteger(answer)
    : typeof answer === "string" && answer.trim().length > 0;

export const answeredCount = (questions, answers) =>
  questions.filter((q) => isAnswered(q, answers?.[q.id])).length;
