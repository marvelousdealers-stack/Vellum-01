import { useState } from "react";
import { AlertTriangle, Play } from "lucide-react";

// ── Video URL parser ──
export const parseVideoUrl = (url) => {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  if (yt)
    return {
      provider: "YouTube",
      embed: `https://www.youtube.com/embed/${yt[1]}`,
    };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo)
    return {
      provider: "Vimeo",
      embed: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive)
    return {
      provider: "Google Drive",
      embed: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };
  return { provider: "Direct", embed: url };
};

export const VideoEmbed = ({ url, title }) => {
  const parsed = parseVideoUrl(url);
  const [playing, setPlaying] = useState(false);

  if (!parsed) {
    return (
      <div className="mb-4 flex items-center gap-3.5 rounded-[var(--radius-container)] border border-rule bg-bg px-6 py-6 text-ink-3">
        <AlertTriangle size={20} />
        <div>
          <strong className="block text-[14px] text-ink-2">
            Video unavailable
          </strong>
          <p className="mt-0.5 text-[12.5px]">
            No URL was provided for this lesson.
          </p>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        onClick={() => setPlaying(true)}
        className="hero-glow group relative mb-4 flex aspect-video w-full flex-col items-center justify-center gap-3.5 overflow-hidden rounded-[var(--radius-bento)] border border-rule-2 bg-bg transition-all duration-300 hover:border-primary"
      >
        <div className="relative z-10 grid size-16 place-items-center rounded-full bg-primary pl-1 text-on-primary shadow-[var(--shadow-primary)] transition-transform duration-500 group-hover:scale-105">
          <Play size={26} fill="currentColor" />
        </div>
        <div className="relative z-10 px-6 text-center">
          <div className="mx-auto max-w-[80%] font-display text-[16px] font-semibold text-ink">
            {title}
          </div>
          <div className="mt-1 text-[12px] text-ink-3">
            Hosted on {parsed.provider}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-[var(--radius-bento)] border border-rule-2 bg-bg">
      <iframe
        src={parsed.embed}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
};
