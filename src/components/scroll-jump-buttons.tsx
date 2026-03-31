"use client";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
}

export function ScrollJumpButtons() {
  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col gap-3">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Jump to top"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-700 shadow-md backdrop-blur transition hover:border-zinc-300 hover:text-zinc-950"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={scrollToBottom}
        aria-label="Jump to bottom"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-700 shadow-md backdrop-blur transition hover:border-zinc-300 hover:text-zinc-950"
      >
        ↓
      </button>
    </div>
  );
}
