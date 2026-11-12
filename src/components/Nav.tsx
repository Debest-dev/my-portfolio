"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const links = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1140px] items-center justify-between px-4 md:px-6">
        <a
          href="#"
          className="group flex items-center gap-3 rounded-full pr-2"
          aria-label="Back to top"
        >
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)] transition-colors group-hover:border-[var(--accent)]">
            <Image
              src="/images/nav-logo.webp"
              alt=""
              fill
              sizes="36px"
              className="object-cover object-top"
              priority
            />
          </div>
          <span className="whitespace-nowrap text-base font-semibold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-hover)]">
            Blessed Anthony Etim
          </span>
        </a>

        <nav className="hidden items-center gap-5 md:flex lg:gap-7" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded px-1 text-sm font-medium text-[var(--muted)] transition-colors duration-200 hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-white transition duration-200 ease-out hover:bg-[var(--accent-hover)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97]"
          >
            Let&apos;s talk
          </a>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition duration-200 hover:text-[var(--text)] motion-safe:active:scale-95 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!isOpen}
        className={`absolute inset-x-0 top-full grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out md:hidden ${
          isOpen
            ? "visible grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            className="flex flex-col gap-1 border-b border-[var(--border)] bg-[var(--bg)] px-4 py-3"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[var(--muted)] transition-colors duration-200 hover:text-[var(--text)] active:bg-[var(--card)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
