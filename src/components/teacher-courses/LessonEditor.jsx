import { useState, useEffect } from "react";
import { Chip, ChipRow, Field, ModalShell, inputClass } from "@/components/common";
import { FileCard } from "@/components/common/lms/FileCard";
import { VideoEmbed } from "@/components/common/lms/VideoEmbed";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// LESSON EDITOR
// ═══════════════════════════════════════════════════════════════
export const LessonEditor = ({ open, onClose, onSave, lesson }) => {
  const toast = useToast();
  const [kind, setKind] = useState(lesson?.kind || "text");
  const [title, setTitle] = useState(lesson?.title || "");
  const [duration, setDuration] = useState(lesson?.duration || "10 min");
  const [body, setBody] = useState(lesson?.body || "");
  const [url, setUrl] = useState(lesson?.url || "");

  useEffect(() => {
    if (!open) return;
    setKind(lesson?.kind || "text");
    setTitle(lesson?.title || "");
    setDuration(lesson?.duration || "10 min");
    setBody(lesson?.body || "");
    setUrl(lesson?.url || "");
  }, [open, lesson]);

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) {
      toast.push("Title is required", "error");
      return;
    }
    if (kind === "video" && !url.trim()) {
      toast.push("Video URL is required", "error");
      return;
    }
    if (kind === "file" && !url.trim()) {
      toast.push("File URL is required", "error");
      return;
    }
    if (kind === "text" && !body.trim()) {
      toast.push("Lesson content is required", "error");
      return;
    }
    onSave({ id: lesson?.id || createId(), kind, title, duration, body, url });
    toast.push(lesson ? "Lesson updated" : "Lesson added", "success");
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={lesson ? "Edit lesson" : "New lesson"}
      maxWidth="720px"
      footer={
        <>
          <Button
            onClick={onClose} variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
          >
            {lesson ? "Save changes" : "Add lesson"}
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <span className="mb-1.5 block text-[12px] font-medium text-ink-3">
          Lesson type
        </span>
        <ChipRow>
          <Chip active={kind === "text"} onClick={() => setKind("text")}>
            Text / notes
          </Chip>
          <Chip active={kind === "video"} onClick={() => setKind("video")}>
            Video
          </Chip>
          <Chip active={kind === "file"} onClick={() => setKind("file")}>
            Reference file
          </Chip>
        </ChipRow>
      </div>
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Newton's three laws, worked examples"
          autoFocus
          className={inputClass}
        />
      </Field>
      <Field label="Duration / size">
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 14 min or 2 pages"
          className={inputClass}
        />
      </Field>
      {kind === "video" && (
        <>
          <Field
            label="Video URL"
            hint="YouTube, Vimeo, and Google Drive links are all recognised."
          >
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={inputClass}
            />
          </Field>
          {url && <VideoEmbed url={url} title={title || "Preview"} />}
        </>
      )}
      {kind === "file" && (
        <>
          <Field
            label="File URL"
            hint="Upload the file to Cloudinary (free tier) and paste the resulting URL."
          >
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/.../reference.pdf"
              className={inputClass}
            />
          </Field>
          {url && <FileCard title={title || "reference.pdf"} url={url} />}
        </>
      )}
      {kind === "text" && (
        <Field label="Content">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write the lesson notes here."
            className={cn(inputClass, "min-h-[140px] resize-y leading-relaxed")}
          />
        </Field>
      )}
    </ModalShell>
  );
};
