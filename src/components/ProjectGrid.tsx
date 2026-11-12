"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { works, WorkProject, WorkSection } from "@/data/works";
import { WorkCard } from "./WorkCard";
import { ProjectDialog } from "./ProjectDialog";
import { Section } from "./Section";

type WorkFilter = "All" | WorkSection;

const FILTERS: WorkFilter[] = ["All", "Retouching", "Compositing", "Campaign design"];

export const ProjectGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("All");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const scrollRowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [canOverflow, setCanOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScroll = useCallback(() => {
    const el = scrollRowRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const overflow = scrollWidth > clientWidth + 1;

    setCanOverflow(overflow);
    setCanScrollLeft(overflow && scrollLeft > 2);
    setCanScrollRight(overflow && scrollLeft < scrollWidth - clientWidth - 2);

    if (track && thumb && overflow) {
      const trackWidth = track.clientWidth;
      const thumbWidth = Math.max(16, (clientWidth / scrollWidth) * trackWidth);
      const maxScroll = scrollWidth - clientWidth;
      const maxThumbLeft = trackWidth - thumbWidth;
      const thumbLeft = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbLeft : 0;

      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${thumbLeft}px)`;
    }
  }, []);

  useEffect(() => {
    const el = scrollRowRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    const ro = new ResizeObserver(() => {
      updateScroll();
    });
    ro.observe(el);
    if (trackRef.current) ro.observe(trackRef.current);

    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [updateScroll]);

  useEffect(() => {
    if (canOverflow) {
      updateScroll();
    }
  }, [canOverflow, updateScroll]);

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const scrollEl = scrollRowRef.current;
    if (!track || !scrollEl) return;

    e.preventDefault();
    track.setPointerCapture(e.pointerId);

    const scrollToCoord = (clientX: number, smooth: boolean) => {
      const rect = track.getBoundingClientRect();
      const trackWidth = rect.width;
      const scrollWidth = scrollEl.scrollWidth;
      const clientWidth = scrollEl.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;

      const thumbW = Math.max(16, (clientWidth / scrollWidth) * trackWidth);
      const maxThumbLeft = trackWidth - thumbW;
      const clickX = clientX - rect.left;
      const targetThumbLeft = Math.max(0, Math.min(maxThumbLeft, clickX - thumbW / 2));
      const targetScrollLeft = maxThumbLeft > 0 ? (targetThumbLeft / maxThumbLeft) * maxScroll : 0;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (smooth && !prefersReducedMotion) {
        scrollEl.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
      } else {
        scrollEl.scrollLeft = targetScrollLeft;
      }
    };

    scrollToCoord(e.clientX, true);

    const onPointerMove = (moveEvent: PointerEvent) => {
      scrollToCoord(moveEvent.clientX, false);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      try {
        track.releasePointerCapture(upEvent.pointerId);
      } catch {}
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  const maskStyle = useMemo<React.CSSProperties>(() => {
    if (!canOverflow) return {};
    if (canScrollLeft && canScrollRight) {
      const mask =
        "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)";
      return { WebkitMaskImage: mask, maskImage: mask };
    }
    if (canScrollRight) {
      const mask = "linear-gradient(to right, black 0, black calc(100% - 24px), transparent 100%)";
      return { WebkitMaskImage: mask, maskImage: mask };
    }
    if (canScrollLeft) {
      const mask = "linear-gradient(to right, transparent 0, black 24px, black 100%)";
      return { WebkitMaskImage: mask, maskImage: mask };
    }
    return {};
  }, [canOverflow, canScrollLeft, canScrollRight]);

  const visibleProjects = useMemo(
    () => (activeFilter === "All" ? works : works.filter((w) => w.section === activeFilter)),
    [activeFilter]
  );

  const openProject = openSlug ? works.find((w) => w.slug === openSlug) ?? null : null;

  const handleOpen = (project: WorkProject, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenSlug(project.slug);
  };

  const handleClose = () => setOpenSlug(null);

  return (
    <Section id="work" alt>
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
              Featured Work
            </h2>
            <p className="text-sm text-[var(--muted)]">
              A collection of graphic design, photo retouching, compositing and photography.
            </p>
          </div>

          <div className="relative w-full">
            <div
              ref={scrollRowRef}
              style={maskStyle}
              className="flex w-full gap-2 overflow-x-auto whitespace-nowrap snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
            >
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={isActive}
                    className={`h-11 shrink-0 snap-start whitespace-nowrap rounded-full px-4 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            {canOverflow && (
              <div
                ref={trackRef}
                aria-hidden="true"
                onPointerDown={handleTrackPointerDown}
                className="mt-2 h-1 w-full cursor-pointer select-none rounded-full bg-[color-mix(in_srgb,var(--border)_60%,transparent)] relative touch-none"
              >
                <div
                  ref={thumbRef}
                  className="h-full rounded-full bg-[var(--accent)] absolute left-0 top-0 pointer-events-none"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <WorkCard key={project.slug} project={project} index={index} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      {openProject && (
        <ProjectDialog
          project={openProject}
          onClose={handleClose}
          returnFocusTo={triggerRef.current}
        />
      )}
    </Section>
  );
};