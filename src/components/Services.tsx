"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const services = [
  {
    number: "01",
    title: "Photo Retouching & Colour Correction",
    line: "Portrait editing, colour adjustments and image refinement.",
  },
  {
    number: "02",
    title: "Image Manipulation & Compositing",
    line: "Combining visual elements into one believable result.",
  },
  {
    number: "03",
    title: "Non-Destructive Editing",
    line: "Editable workflows that preserve the original image.",
  },
  {
    number: "04",
    title: "Layer Management & Masking",
    line: "Organised layers, masks and controlled adjustments.",
  },
  {
    number: "05",
    title: "Typography & Text Effects",
    line: "Compelling type compositions and text treatments.",
  },
  {
    number: "06",
    title: "Asset Preparation",
    line: "Exporting images and graphics for different platforms.",
  },
];

export const Services: React.FC = () => {
  const [open, setOpen] = useState<string | null>("01");

  return (
    <Section id="services">
      <div className="space-y-8">
        <Reveal>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
            What I do
          </h2>
        </Reveal>

        <Reveal className="sm:hidden">
          <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {services.map((service) => {
              const isOpen = open === service.number;
              return (
                <div key={service.number}>
                  <button
                    type="button"
                    id={`service-trigger-${service.number}`}
                    aria-expanded={isOpen}
                    aria-controls={`service-panel-${service.number}`}
                    onClick={() => setOpen(isOpen ? null : service.number)}
                    className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2 text-left"
                  >
                    <span className="text-xs font-semibold text-[var(--accent)]">
                      {service.number}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-[var(--text)]">
                      {service.title}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-[250ms] ease-out ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    id={`service-panel-${service.number}`}
                    role="region"
                    aria-labelledby={`service-trigger-${service.number}`}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-[250ms] ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-4 pb-3 text-sm leading-normal text-[var(--muted)]">
                        {service.line}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <div className="hidden gap-4 sm:auto-rows-fr sm:grid sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.number} delay={(i % 3) * 70} className="h-full">
              <div
                className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition duration-200 ease-out hover:border-[var(--accent)] motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 md:p-6"
              >
                <span className="text-sm font-semibold text-[var(--accent)]">
                  {service.number}
                </span>
                <h3 className="mt-2 text-balance text-base font-semibold text-[var(--text)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-pretty text-[15px] leading-relaxed text-[var(--muted)] md:text-sm">
                  {service.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="text-pretty text-[15px] text-[var(--muted)] md:text-sm">
            Also: AI and web development.
          </p>
        </Reveal>
      </div>
    </Section>
  );
};