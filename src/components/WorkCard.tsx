"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { WorkProject, imageAlt, imageVariants } from "@/data/works";

interface WorkCardProps {
  project: WorkProject;
  index: number;
  onOpen: (project: WorkProject, trigger: HTMLElement) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ project, index, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const panelId = `work-process-${project.slug}`;

  const variants = imageVariants(project.slug, project.cover);
  const base = variants[0];
  const coverImage = project.images.find((img) => img.file === project.cover);
  const bottomHalf = project.coverCrop === "bottom-half";
  const contain = project.coverFit === "contain";
  const objectPosition = bottomHalf
    ? "center bottom"
    : contain
    ? "center"
    : project.coverPosition ?? "center";
  const coverClass = bottomHalf
    ? "absolute inset-x-0 bottom-0 h-[200%] w-full object-cover"
    : `absolute inset-0 h-full w-full ${contain ? "object-contain" : "object-cover"}`;
  const shownTools = project.tools.slice(0, 3);
  const extraTools = project.tools.length - shownTools.length;

  return (
    <article className="group flex flex-col space-y-3 rounded-2xl p-1">
      <button
        type="button"
        onClick={(e) => onOpen(project, e.currentTarget)}
        aria-haspopup="dialog"
        className="block w-full rounded-2xl text-left"
      >
        <span className="block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-colors group-hover:border-[var(--accent)]">
          <span className="relative block aspect-[4/3] w-full">
            <img
              src={base.src}
              srcSet={variants.map((v) => `${v.src} ${v.width}w`).join(", ")}
              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
              alt={coverImage ? imageAlt(project, coverImage) : project.title}
              width={base.width}
              height={base.height}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
              className={coverClass}
              style={{ objectPosition }}
            />
          </span>
        </span>
        <span className="mt-3 block space-y-1">
          <span className="block truncate text-sm font-semibold leading-5 text-[var(--text)] transition-colors group-hover:text-[var(--accent-hover)]">
            {project.title}
          </span>
          <span className="block text-xs leading-4 text-[var(--muted)]">{project.section}</span>
        </span>
      </button>

      <p className="line-clamp-2 min-h-10 text-xs leading-5 text-[var(--muted)]">{project.summary}</p>

      <div className="flex h-7 items-center gap-1.5 overflow-hidden">
        {shownTools.map((tool) => (
          <span
            key={tool}
            className="min-w-0 truncate whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg-alt)] px-2.5 py-1 text-xs leading-4 text-[var(--muted)]"
            title={tool}
          >
            {tool}
          </span>
        ))}
        {extraTools > 0 && (
          <span className="flex-shrink-0 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg-alt)] px-2.5 py-1 text-xs leading-4 text-[var(--muted)]">
            +{extraTools}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex h-11 w-full flex-shrink-0 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] md:h-9"
      >
        View process
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        aria-hidden={!expanded}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="list-disc space-y-1.5 pl-4 pt-1 text-xs leading-5 text-[var(--muted)]">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};