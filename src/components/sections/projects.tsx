"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Github, FolderKanban } from "lucide-react";

import projects, { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "../ui/animated-modal";
import SmoothScroll from "../smooth-scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Year & Status mappings for the projects
const PROJECT_META: Record<string, { year: string; status: string; desc: string }> = {
  "farming-tool-rental": {
    year: "2024",
    status: "Active",
    desc: "A full-stack web platform designed to streamline agricultural equipment rental, enabling farmers to list, browse, and rent tools based on availability and location.",
  },
  "legal-e-vault": {
    year: "2024",
    status: "Live",
    desc: "A secure full-stack MERN application for storing and verifying legal documents with absolute data integrity and blockchain-inspired security.",
  },
  "zentry-clone": {
    year: "2024",
    status: "Live",
    desc: "A recreation of the award-winning Zentry.com website, focusing on high-performance animations, fluid scrolls, and rich UI/UX layout design.",
  },
  "formapp": {
    year: "2024",
    status: "Live",
    desc: "A form utility that loads public Google Forms and lets users submit answers through a focused custom interface.",
  },
  "fanta": {
    year: "2024",
    status: "Live",
    desc: "A bright animated product landing page for Fanta with layered visuals, bold typography, and smooth brand-focused interactions.",
  },
};

// Interactive Bento Card component
const BentoCard = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 backdrop-blur-2xl p-8 transition-all duration-300",
        "hover:border-cyan-500/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.04)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          background: isFocused
            ? `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(34, 211, 238, 0.08), transparent 80%)`
            : "",
          opacity: isFocused ? 1 : 0,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

// 3D Parallax Tilt Card for the project image
const ProjectImageCard = ({ project, y }: { project: Project; y?: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // High-performance Framer Motion coordinates
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xVal = e.clientX - rect.left - width / 2;
    const yVal = e.clientY - rect.top - height / 2;
    
    // Tilt range: -12 to 12 degrees
    rotateX.set(-(yVal / (height / 2)) * 12);
    rotateY.set((xVal / (width / 2)) * 12);
  };

  const handleMouseEnter = () => {
    scale.set(1.03);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        y, // Apply scroll parallax
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="w-full h-full cursor-pointer relative z-20"
    >
      <BentoCard className="relative w-full h-full p-0 overflow-hidden aspect-[16/10] border border-white/10 hover:border-cyan-500/25">
        <div className="relative w-full h-full min-h-[200px] md:min-h-[280px]">
          <Image
            src={project.src}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{
              transform: "translateZ(30px)",
              transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </BentoCard>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SectionWrapper id="projects" className="relative w-full py-24 z-10 pointer-events-none">
      <div ref={containerRef} className="w-full max-w-7xl px-6 md:px-12 mx-auto pointer-events-auto">
        <SectionHeader id="projects" title="Selected Works" desc="Handcrafted premium digital creations." className="mb-24 mt-0" />
        
        <div className="flex flex-col gap-32 md:gap-48 mt-12">
          {projects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

const ProjectItem = ({ project, index }: { project: Project; index: number }) => {
  const projectRef = useRef<HTMLDivElement>(null);
  const meta = PROJECT_META[project.id] || { year: "2024", status: "Completed", desc: "Interactive web solution." };

  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: projectRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll parallax for the image card
  const yVal = useTransform(scrollYProgress, (progress) => {
    return isDesktop ? (progress - 0.5) * -60 : 0;
  });

  // Staggered entry animations using GSAP
  useGSAP(() => {
    const el = projectRef.current;
    if (!el) return;

    const details = el.querySelector(".project-details");
    const image = el.querySelector(".project-image");

    if (details && image) {
      const isLargeScreen = window.innerWidth >= 768;
      
      gsap.fromTo(
        details,
        { 
          x: isLargeScreen ? -60 : 0, 
          y: isLargeScreen ? 0 : 50, 
          opacity: 0 
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        image,
        { 
          x: isLargeScreen ? 60 : 0, 
          y: isLargeScreen ? 0 : 50, 
          opacity: 0,
          scale: 0.95 
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: isLargeScreen ? 0.15 : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, { scope: projectRef });

  return (
    <div
      ref={projectRef}
      className="relative w-full border-b border-white/5 pb-16 last:border-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Project Details Card wrapped in BentoCard for interactive mouse glow */}
        <div className="md:col-span-7 w-full project-details">
          <BentoCard className="p-8 md:p-10 space-y-6 hover:border-cyan-500/35 hover:shadow-[0_0_50px_rgba(34,211,238,0.03)]">
            
            {/* Outline Project Number + Meta */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 to-zinc-500 font-mono select-none">
                {`0${index + 1}`}
              </span>
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                <span>{meta.year}</span>
                <span>•</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full border border-white/10 text-[9px] uppercase tracking-wider",
                  meta.status === "Live" || meta.status === "Active" ? "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" : "text-neutral-500 bg-neutral-900/50"
                )}>
                  {meta.status}
                </span>
              </div>
            </div>

            {/* Title & Category */}
            <div className="space-y-1">
              <h3 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-slate-100 font-display">
                {project.title}
              </h3>
              <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
                {project.category}
              </p>
            </div>

            {/* Description */}
            <p className="text-md text-neutral-300 font-light leading-relaxed">
              {meta.desc}
            </p>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {[...(project.skills.frontend || []), ...(project.skills.backend || [])].map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02] text-xs text-neutral-400 font-light"
                >
                  {skill.icon && <span className="opacity-80 scale-90 text-[10px]">{skill.icon}</span>}
                  <span className="text-[9px] font-mono">{skill.title}</span>
                </span>
              ))}
            </div>

            {/* Buttons Panel */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
              <Link href={project.live} target="_blank" className="flex-1 min-w-[120px]">
                <button className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-xs font-medium text-white transition-all duration-200">
                  <span>Visit Site</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              {project.github && (
                <Link href={project.github} target="_blank" className="flex-1 min-w-[120px]">
                  <button className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/15 text-xs font-light text-neutral-400 transition-all duration-200">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </button>
                </Link>
              )}

              <Modal>
                <ModalTrigger className="flex-1 min-w-[120px] p-0 bg-transparent text-left rounded-full overflow-hidden">
                  <span className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/30 text-xs font-medium text-cyan-400 transition-all duration-200 cursor-pointer">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Case Study</span>
                  </span>
                </ModalTrigger>
                <ModalBody className="md:max-w-4xl md:max-h-[85%] bg-zinc-950 border-zinc-900 md:rounded-2xl overflow-hidden no-click-outside">
                  <SmoothScroll isInsideModal={true}>
                    <ModalContent className="text-zinc-200 p-8 space-y-6">
                      <ProjectContents project={project} />
                    </ModalContent>
                  </SmoothScroll>
                  <ModalFooter className="bg-zinc-900/40 border-t border-white/5 gap-4">
                    <ModalCloseButton />
                    <Link href={project.live} target="_blank">
                      <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm px-6 py-2 rounded-full transition-all">
                        Visit Project
                      </button>
                    </Link>
                  </ModalFooter>
                </ModalBody>
              </Modal>
            </div>
            
          </BentoCard>
        </div>

        {/* Right Column: Project Image Card (Horizontal Row next to details) */}
        <div className="md:col-span-5 w-full project-image">
          <ProjectImageCard project={project} y={yVal} />
        </div>

      </div>

      {/* Glowing radial gradient backdrop that follows mouse in background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(34,211,238,0.015),transparent_45%)] pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

// Sleek Close button inside the modal footer
const ModalCloseButton = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="px-6 py-2 border border-white/15 hover:bg-white/5 rounded-full text-sm font-light text-neutral-300 transition-all w-28 text-center"
    >
      Close
    </button>
  );
};

const ProjectContents = ({ project }: { project: Project }) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h4 className="text-2xl md:text-4xl text-slate-100 font-extrabold font-display leading-tight">
          {project.title}
        </h4>
        <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
          {project.category}
        </p>
      </div>

      <div className="border-y border-white/5 py-6 flex flex-col md:flex-row justify-around gap-6 text-sm">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-neutral-500">Frontend Stack</span>
          <div className="flex gap-1">
            {project.skills.frontend?.slice(0, 5).map((skill, idx) => (
              <span key={idx} className="p-2 bg-neutral-900 border border-white/5 rounded-lg text-white" title={skill.title}>
                {skill.icon || skill.title[0]}
              </span>
            ))}
          </div>
        </div>

        {project.skills.backend?.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-mono text-neutral-500">Backend Stack</span>
            <div className="flex gap-1">
              {project.skills.backend?.slice(0, 5).map((skill, idx) => (
                <span key={idx} className="p-2 bg-neutral-900 border border-white/5 rounded-lg text-white" title={skill.title}>
                  {skill.icon || skill.title[0]}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Renders the custom React rich layout defined for the project */}
      <div className="prose prose-invert max-w-none text-neutral-400 font-light leading-relaxed space-y-4">
        {project.content}
      </div>
    </div>
  );
};

export default ProjectsSection;
