import React from "react";

const names = ["KedolikSwap", "SQWAD", "AlphaX", "TokenFi", "MediGo", "PEEC"];

const NameList: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul
    className="marquee-list flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12"
    aria-hidden={hidden || undefined}
  >
    {names.map((name) => (
      <li
        key={name}
        className="marquee-name whitespace-nowrap text-sm font-medium text-[var(--muted)] transition-colors hover:text-white"
      >
        {name}
      </li>
    ))}
  </ul>
);

export const ProjectStrip: React.FC = () => {
  return (
    <section className="flex h-12 w-full items-center border-y border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="flex h-full w-full items-center md:mx-auto md:max-w-[1140px] md:px-6">
        <p className="z-10 shrink-0 whitespace-nowrap bg-[var(--bg-alt)] pl-4 pr-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)] md:pl-0 md:pr-4">
          Projects for
        </p>
        <div
          className="marquee h-full min-w-0 flex-1 overflow-hidden"
          tabIndex={0}
          role="region"
          aria-label="Projects for"
        >
          <div className="marquee-track flex h-full w-max items-center">
            <NameList />
            <NameList hidden />
          </div>
        </div>
      </div>
    </section>
  );
};