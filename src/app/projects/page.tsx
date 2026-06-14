"use client";

import React from "react";
import SmoothScroll from "@/components/smooth-scroll";
import ProjectsSection from "@/components/sections/projects";
import CyberpunkBackground from "@/components/cyberpunk-background";
import AnimatedBackground from "@/components/animated-background";
import { cn } from "@/lib/utils";

function Page() {
  return (
    <SmoothScroll>
      <CyberpunkBackground />
      <AnimatedBackground />
      <main className={cn("bg-slate-100 dark:bg-transparent canvas-overlay-mode pt-16")}>
        <ProjectsSection />
      </main>
    </SmoothScroll>
  );
}

export default Page;
