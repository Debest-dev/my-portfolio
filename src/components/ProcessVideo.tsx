import React from "react";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export const ProcessVideo: React.FC = () => {
  return (
    <Section id="process" alt className="!pt-0 md:!pt-0">
      <div className="space-y-8">
        <Reveal className="space-y-2">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
            How I retouch
          </h2>
          <p className="text-pretty text-sm text-[var(--muted)] md:text-base">
            A sample portrait edit, from raw photo to finished result.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
            <video
              controls
              playsInline
              preload="none"
              poster="/videos/retouch-poster.webp"
              className="block h-full w-full object-cover"
            >
              <source src="/videos/retouch-process.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </div>
    </Section>
  );
};
