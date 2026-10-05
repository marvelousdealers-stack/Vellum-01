import { MOCK_MODE, mockDelay, request } from "./client";
import { EXTRACTED_TOPICS } from "@/data/materials";

// Matches the guide's §7.3: each uploaded item is tagged "outline" or
// "past paper" (plus an optional year for past papers), and the backend
// decides how to extract it (direct text, vision model, or as-is for
// pasted text) based on its type. The "route" label here is a client-side
// best guess only, for the queued-file UI — the real decision always
// happens server-side once a backend exists.
export const guessRoute = (file) => {
  if (!file || typeof file === "string") return { kind: "TXT", route: "AS-IS" };
  const type = file.type || "";
  if (type === "application/pdf") return { kind: "PDF", route: "DIRECT" };
  if (type.startsWith("image/")) return { kind: "IMG", route: "VISION" };
  return { kind: "TXT", route: "AS-IS" };
};

export const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "text/plain",
];

export const MAX_FILE_BYTES = 25 * 1024 * 1024;

 // 25 MB

/**
 * Upload a batch of outline/past-paper material for a subject.
 * `items` is an array of { file: File, tag: "outline" | "pastpaper", year? }
 * or { text: string, tag } for pasted text.
 *
 * Real endpoint: POST /api/subjects/:subjectId/materials (multipart/form-data)
 * Real response: { topics: [{ name, weight, thin }], warnings?: string[] }
 */
export const uploadMaterials = async (subjectId, items) => {
  if (MOCK_MODE) {
    await mockDelay(2600);
    return { topics: EXTRACTED_TOPICS, warnings: [] };
  }

  const form = new FormData();
  items.forEach((item) => {
    form.append("tag[]", item.tag);
    if (item.year) form.append("year[]", String(item.year));
    if (item.file) form.append("files", item.file);
    else form.append("pastedText[]", item.text || "");
  });
  return request(`/subjects/${subjectId}/materials`, { method: "POST", body: form });
};
