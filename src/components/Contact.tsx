import React from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { LinkedInIcon } from "./LinkedInIcon";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const rows = [
  {
    label: "Email",
    value: "debestcreative0@gmail.com",
    href: "mailto:debestcreative0@gmail.com",
    icon: Mail,
    external: false,
  },
  {
    label: "Phone",
    value: "+234 912 203 5664",
    href: "tel:+2349122035664",
    icon: Phone,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "blessedanthonyetim",
    href: "https://www.linkedin.com/in/blessedanthonyetim",
    icon: LinkedInIcon,
    external: true,
  },
];

export const Contact: React.FC = () => {
  return (
    <Section id="contact">
      <div className="space-y-8">
        <Reveal className="space-y-2">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
            Have a project in mind?
          </h2>
          <p className="text-pretty text-base text-[var(--muted)]">
            Available for remote creative and Photoshop-based&nbsp;work.
          </p>
        </Reveal>

        <Reveal className="lg:hidden">
          <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {rows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`flex min-h-[56px] items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:bg-[var(--bg-alt)] ${
                  row.label === "Email"
                    ? "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
                    : ""
                }`}
              >
                <row.icon className="h-5 w-5 flex-shrink-0 text-[var(--accent)]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase leading-snug tracking-wider text-[var(--muted)]">
                    {row.label}
                  </span>
                  <span className="block whitespace-nowrap text-sm font-medium leading-snug text-[var(--text)]">
                    {row.value}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-[var(--muted)]" />
              </a>
            ))}
          </div>
        </Reveal>

        <div className="hidden gap-4 md:gap-6 lg:auto-rows-fr lg:grid lg:grid-cols-3">
          {rows.map((row, i) => (
            <Reveal key={row.label} delay={i * 70} className="h-full">
              <a
                href={row.href}
                {...(row.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex h-full min-h-[76px] min-w-0 items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition duration-200 ease-out hover:border-[var(--accent)] motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.99] md:p-6"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <row.icon className="h-5 w-5 flex-shrink-0 text-[var(--accent)]" />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {row.label}
                    </span>
                    <span className="block whitespace-nowrap text-sm font-medium text-[var(--text)]">
                      {row.value}
                    </span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-[var(--muted)]" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
};