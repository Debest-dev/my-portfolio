import React from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProjectStrip } from "@/components/ProjectStrip";
import { About } from "@/components/About";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Services } from "@/components/Services";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav />

      <main className="flex-1 w-full">
        <Hero />
        <ProjectStrip />
        <About />
        <ProjectGrid />
        <Services />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
