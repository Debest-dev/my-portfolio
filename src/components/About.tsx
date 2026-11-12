import React from "react";
import Image from "next/image";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const stats = [
  { value: "5+", label: "Years of experience" },
  { value: "10+", label: "Brands & projects" },
  { value: "Winner", label: "TokenFi 2025 contest" },
];

export const About: React.FC = () => {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <Reveal className="relative mx-auto aspect-[1296/1400] w-full max-w-[280px] max-sm:mx-0 max-sm:aspect-[5/4] max-sm:max-w-none lg:max-w-none">
          <Image
            src="/images/about.webp"
            alt="Portrait of Blessed Anthony Etim"
            fill
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 280px, 440px"
            className="object-contain max-sm:object-cover max-sm:object-top"
          />
        </Reveal>

        <div className="space-y-6">
          <Reveal className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              About me
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
              The creative behind the work.
            </h2>
          </Reveal>

          <Reveal delay={60} className="max-w-[65ch] space-y-4 text-pretty text-base leading-relaxed text-[var(--muted)]">
            <p>
              I’m Blessed Anthony Etim, but most people know me as Debest. I’ve been a
              graphic designer since 2021, working across Web3, Web2, and tech brands.
              Photoshop is my main tool, and I focus on photo editing, image composition,
              and brand visuals.
            </p>
            <p>
              I started as a photo editor at Murphy Studio, retouching clients’
              photographs. Today I head the media team at Dunamis Mbak Itam III, a branch
              of Dunamis International Gospel Centre, where I handle the church’s visuals,
              photo editing, video production, and livestreams.
            </p>
            <p>
              Aside from graphic design, I’m also exploring web development. I created
              NullRug, a security tool that checks crypto tokens and wallets, and I’m
              currently building Orelvar, a technology law publication.
            </p>
          </Reveal>

          <Reveal className="sm:hidden">
            <div className="grid grid-cols-3 divide-x divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              {stats.map((stat) => (
                <div key={stat.label} className="px-2 py-4 text-center">
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-[var(--muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="hidden gap-4 sm:auto-rows-fr sm:grid sm:grid-cols-3 md:gap-6">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70} className="h-full">
                <div
                  className="grid h-full min-h-[64px] grid-cols-[104px_minmax(0,1fr)] items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition duration-200 ease-out hover:border-[var(--accent)] motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0 sm:flex sm:flex-col sm:justify-center sm:text-center md:p-6"
                >
                  <div className="whitespace-nowrap text-2xl font-bold text-[var(--text)]">
                    {stat.value}
                  </div>
                  <div className="text-pretty text-sm leading-snug text-[var(--muted)] sm:mt-1">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={210}>
            <a
              href="#contact"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white transition duration-200 ease-out hover:bg-[var(--accent-hover)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] max-sm:h-12 max-sm:w-full"
            >
              Get in touch
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
};
