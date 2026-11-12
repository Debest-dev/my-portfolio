import React from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { LinkedInIcon } from "./LinkedInIcon";
import { Reveal } from "./Reveal";

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg-alt)]">
      <div className="mx-auto grid w-full max-w-[1140px] grid-cols-1 items-end gap-5 px-4 pt-12 md:gap-10 md:px-6 md:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
        <Reveal className="space-y-6 lg:self-center lg:pb-0 lg:-mt-[6px]">
          <h1>
            <span className="block text-sm font-medium text-[var(--muted)] md:text-[1.125rem]">
              Hi, I&apos;m
            </span>
            <span className="mt-1 block text-balance text-[clamp(1.5rem,7.2vw,2rem)] font-bold leading-[1.1] tracking-tight text-[var(--text)] min-[340px]:whitespace-nowrap md:text-[clamp(2.25rem,5vw,3.5rem)] md:leading-[1.08] md:whitespace-normal lg:whitespace-nowrap">
              Blessed Anthony Etim.
            </span>
            <span className="mt-2 block text-balance text-[clamp(0.875rem,4.2vw,1rem)] font-medium leading-snug text-[var(--accent)] min-[340px]:whitespace-nowrap md:mt-3 md:text-[clamp(1.25rem,2.4vw,1.75rem)] md:whitespace-normal">
              Graphic Designer &amp; Photoshop Specialist
            </span>
          </h1>

          <p className="!mt-3 max-w-[34ch] text-pretty text-[15px] leading-[1.55] text-[var(--muted)] md:!mt-6 md:max-w-[75ch] md:leading-relaxed xl:text-base">
            Graphic designer with 5+ years of experience in Photoshop-based design,
            <br className="hidden md:block" /> photo retouching and image&nbsp;manipulation.
          </p>

          <div className="!mt-5 flex flex-wrap items-center gap-2 pt-0 md:!mt-6 md:flex-nowrap md:gap-3 md:pt-1">
            <a
              href="#work"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-[var(--accent)] px-3 min-[390px]:px-3.5 text-[13px] font-medium text-white transition duration-200 ease-out hover:bg-[var(--accent-hover)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] md:px-5 md:text-sm"
            >
              View My Work
            </a>
            <a
              href="/cv.pdf"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border border-[var(--border)] px-3 min-[390px]:px-3.5 text-[13px] font-medium text-[var(--text)] transition duration-200 ease-out hover:border-[var(--accent)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] md:px-5 md:text-sm"
            >
              Download CV
            </a>
            <div className="flex shrink-0 items-center gap-2 max-[359px]:w-full md:gap-3">
              <a
                href="https://www.linkedin.com/in/blessedanthonyetim"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in a new tab)"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition duration-200 ease-out hover:border-[var(--accent)] hover:text-[var(--text)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-95"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:debestcreative0@gmail.com"
                aria-label="Send an email"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition duration-200 ease-out hover:border-[var(--accent)] hover:text-[var(--text)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-95"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90} className="flex justify-center lg:justify-end">
          <div className="relative aspect-[1418/1488] max-h-[620px] w-[min(80vw,340px)] md:w-[70%] md:max-w-[420px] lg:w-full lg:max-w-none xl:-mr-16 xl:w-[calc(100%+4rem)]">
            <div className="portrait-fade absolute inset-0">
              <Image
                src="/images/profile.webp"
                alt="Portrait of Blessed Anthony Etim"
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 420px, 600px"
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
