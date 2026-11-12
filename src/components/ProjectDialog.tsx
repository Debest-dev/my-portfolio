"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { WorkProject, imageAlt, imageVariants } from "@/data/works";
import { WorkLightbox } from "./WorkLightbox";

interface ProjectDialogProps {
  project: WorkProject;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), video[controls], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const scrollbarClasses =
  "[scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border)] [&::-webkit-scrollbar-thumb:hover]:bg-[var(--accent)]";

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ project, onClose, returnFocusTo }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lightboxOpen = lightboxIndex !== null;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, [returnFocusTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxOpen) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#050a14]/90 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-6"
        onClick={onClose}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
          onClick={(e) => e.stopPropagation()}
          className="flex h-[100dvh] w-full flex-col bg-[#0d1830] md:h-auto md:max-h-[88vh] md:max-w-[1000px] md:rounded-2xl md:border md:border-[var(--border)] md:shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex flex-shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[#0d1830] px-4 py-3 md:rounded-t-2xl md:px-6 md:py-4">
            <div className="min-w-0">
              <h3
                id="project-dialog-title"
                className="truncate text-base font-semibold tracking-tight text-[var(--text)]"
              >
                {project.title}
              </h3>
              <p className="text-xs text-[var(--muted)]">{project.section}</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--text)]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6 ${scrollbarClasses}`}>
            <div className="space-y-5">
              <p className="text-sm leading-6 text-[var(--muted)]">{project.summary}</p>

              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs leading-4 text-[var(--muted)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-6 text-[var(--muted)]">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              {project.layersScreenshot && (
                <figure className="space-y-2">
                  <img
                    src={project.layersScreenshot}
                    alt={`${project.title} - Layers panel`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-xl border border-[var(--border)]"
                  />
                  <figcaption className="text-xs text-[var(--muted)]">Layers panel</figcaption>
                </figure>
              )}

              {project.screenRecording && (
                <video
                  controls
                  preload="metadata"
                  poster={project.screenRecording.poster}
                  src={project.screenRecording.src}
                  className="w-full rounded-xl border border-[var(--border)]"
                />
              )}

              <div className="columns-2 gap-3 md:columns-3 md:gap-4">
                {project.images.map((image, i) => {
                  const variants = imageVariants(project.slug, image.file);
                  const base = variants[0];
                  return (
                    <button
                      key={image.file}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Open ${imageAlt(project, image)} full screen`}
                      className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] text-left transition-colors hover:border-[var(--accent)] md:mb-4"
                    >
                      <img
                        src={base.src}
                        srcSet={variants.map((v) => `${v.src} ${v.width}w`).join(", ")}
                        sizes="(max-width: 768px) calc(50vw - 22px), 312px"
                        alt={imageAlt(project, image)}
                        width={base.width}
                        height={base.height}
                        loading={i < 4 ? "eager" : "lazy"}
                        decoding="async"
                        className="block h-auto w-full"
                        style={{ aspectRatio: `${base.width} / ${base.height}` }}
                      />
                      {image.caption && (
                        <span className="block border-t border-[var(--border)] px-2.5 py-1.5 text-xs leading-4 text-[var(--muted)]">
                          {image.caption}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <WorkLightbox
          project={project}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};