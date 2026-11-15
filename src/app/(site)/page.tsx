import React from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProjectStrip } from "@/components/ProjectStrip";
import { About } from "@/components/About";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProcessVideo } from "@/components/ProcessVideo";
import { Services } from "@/components/Services";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getWorks } from "@/lib/payloadWorks";

export const revalidate = 300;

export default async function Home() {
  const projects = await getWorks();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav />

      <main className="flex-1 w-full">
        <Hero />
        <ProjectStrip />
        <About />
        <ProjectGrid projects={projects} />
        <ProcessVideo />
        <Services />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
