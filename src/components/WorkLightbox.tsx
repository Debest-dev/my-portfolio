"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { WorkProject, imageAlt, imageVariants } from "@/data/works";

interface WorkLightboxProps {
  project: WorkProject;
  startIndex: number;
  onClose: () => void;
}

const largestVariant = (project: WorkProject, file: string) => {
  const variants = imageVariants(project.slug, file);
  return variants[variants.length - 1];
};

export const WorkLightbox: React.FC<WorkLightboxProps> = ({ project, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const count = project.images.length;

  const goNext = useCallback(() => setIndex((i) => Math.min(i + 1, count - 1)), [count]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => previouslyFocused?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  useEffect(() => {
    if (index + 1 < count) {
      const preload = new Image();
      preload.src = largestVariant(project, project.images[index + 1].file).src;
    }
  }, [index, count, project]);

  const image = project.images[index];
  const variant = largestVariant(project, image.file);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} - image viewer`}
      className="fixed inset-0 z-[60] flex flex-col bg-black/95"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (delta <= -48) goNext();
        if (delta >= 48) goPrev();
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm tabular-nums text-white/80">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30 [@media(pointer:coarse)]:hidden"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <img
          key={image.file}
          src={variant.src}
          alt={imageAlt(project, image)}
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
        <button
          type="button"
          onClick={goNext}
          disabled={index === count - 1}
          aria-label="Next image"
          className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30 [@media(pointer:coarse)]:hidden"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <p className="flex min-h-11 items-center justify-center px-4 py-3 text-center text-sm text-white/80">
        {image.caption ?? ""}
      </p>
    </div>
  );
};