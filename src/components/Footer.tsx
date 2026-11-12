import React from "react";
import { Reveal } from "./Reveal";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg-alt)] py-8 text-xs text-[var(--muted)]">
      <Reveal className="mx-auto flex w-full max-w-[1140px] flex-col justify-between gap-2 px-4 md:flex-row md:items-center md:px-6">
        <p>© {currentYear} Debest Creative</p>
        <p>Graphic Design. Retouching. Digital Imaging.</p>
      </Reveal>
    </footer>
  );
};
