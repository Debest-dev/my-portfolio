import React from "react";
import { Download } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const roles = [
  {
    role: "Independent Graphic Designer",
    org: "Debest Creative",
    period: "2021 to Present",
  },
  {
    role: "Photo Editor",
    org: "Murphy Studio",
    period: "2022 to 2025",
  },
  {
    role: "Head of Media",
    org: "Dunamis Mbak Itam III (Dunamis International Gospel Centre)",
    period: "2024 to Present",
  },
];

const blocks = [
  {
    label: "Achievement",
    text: "Winner, TokenFi 2025 infographic design competition ($300 prize, about 10,700 views).",
  },
  {
    label: "Education",
    text: "University of Uyo, LL.B. (in progress).",
  },
  {
    label: "Software",
    text: "Adobe Photoshop (expert).",
  },
];

export const Experience: React.FC = () => {
  return (
    <Section id="experience" alt>
      <div className="space-y-8">
        <Reveal className="flex flex-wrap items-center justify-between gap-x-2 gap-y-4">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
            Experience
          </h2>
          <a
            href="/cv.pdf"
            download
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text)] transition duration-200 ease-out hover:border-[var(--accent)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] sm:px-5"
          >
            <Download className="h-4 w-4 text-[var(--accent)]" />
            <span>Download CV</span>
          </a>
        </Reveal>

        <Reveal delay={60}>
          {roles.map((item) => (
            <div
              key={item.role}
              className="border-b border-[var(--border)] py-4 md:hidden"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0 text-[15px] font-medium text-[var(--text)]">
                  {item.role}
                </div>
                <div className="hidden shrink-0 whitespace-nowrap text-right text-[13px] text-[var(--muted)] min-[360px]:block">
                  {item.period}
                </div>
              </div>
              <div className="mt-1 w-full text-sm text-[var(--muted)]">
                {item.org}
              </div>
              <div className="mt-1 text-[13px] text-[var(--muted)] min-[360px]:hidden">
                {item.period}
              </div>
            </div>
          ))}
          <div className="hidden md:block">
            {roles.map((item) => (
              <div
                key={item.role}
                className="flex flex-col justify-between gap-1 border-b border-[var(--border)] py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <div className="min-w-0">
                  <div className="font-medium text-[var(--text)]">{item.role}</div>
                  <div className="text-pretty text-[15px] text-[var(--muted)] sm:text-sm">{item.org}</div>
                </div>
                <div className="shrink-0 whitespace-nowrap text-[15px] text-[var(--muted)] sm:text-right sm:text-sm">
                  {item.period}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="md:hidden">
          <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {blocks.map((block) => (
              <div
                key={block.label}
                className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-2 px-4 py-3.5"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {block.label}
                </div>
                <p className="text-sm leading-relaxed text-[var(--text)]">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="hidden gap-4 md:auto-rows-fr md:grid md:grid-cols-3 md:gap-6">
          {blocks.map((block, i) => (
            <Reveal key={block.label} delay={i * 70} className="h-full">
              <div
                className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition duration-200 ease-out hover:border-[var(--accent)] motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 md:p-6"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {block.label}
                </div>
                <p className="mt-2 text-pretty text-[15px] leading-relaxed text-[var(--text)] md:text-sm">
                  {block.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
};