"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { 
  SiTypescript, SiJavascript, SiHtml5, SiCss3, 
  SiMongodb, SiFirebase, SiExpress, SiTailwindcss, 
  SiThreedotjs, SiFigma, SiGithub, SiGit 
} from "react-icons/si";
import { RiNextjsFill, RiReactjsFill, RiNodejsFill } from "react-icons/ri";
import { TbBrandFramerMotion } from "react-icons/tb";

// Tech stack items mapping
const TECH_ITEMS = [
  { name: "React", icon: <RiReactjsFill className="w-5 h-5 text-[#61dafb]" /> },
  { name: "Next.js", icon: <RiNextjsFill className="w-5 h-5 text-white" /> },
  { name: "TypeScript", icon: <SiTypescript className="w-5 h-5 text-[#007acc]" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="w-5 h-5 text-[#38bdf8]" /> },
  { name: "Framer Motion", icon: <TbBrandFramerMotion className="w-5 h-5 text-[#ff007f]" /> },
  { name: "Three.js", icon: <SiThreedotjs className="w-5 h-5 text-white" /> },
  { name: "Node.js", icon: <RiNodejsFill className="w-5 h-5 text-[#6cc24a]" /> },
  { name: "Express", icon: <SiExpress className="w-5 h-5 text-zinc-400" /> },
  { name: "MongoDB", icon: <SiMongodb className="w-5 h-5 text-[#4db33d]" /> },
  { name: "Firebase", icon: <SiFirebase className="w-5 h-5 text-[#ffca28]" /> },
  { name: "Git", icon: <SiGit className="w-5 h-5 text-[#f1502f]" /> },
  { name: "GitHub", icon: <SiGithub className="w-5 h-5 text-white" /> },
  { name: "Figma", icon: <SiFigma className="w-5 h-5 text-[#f24e1e]" /> },
];

// Education timeline items
const EDUCATION_TIMELINE = [
  {
    year: "2025 - 2027",
    role: "Master of Computer Applications (MCA)",
    institution: "B.M.S. Institute of Technology and Management",
    desc: "Rigorous postgraduate studies in computer science, software design, and database systems. Score: 7.7 CGPA.",
    current: true,
  },
  {
    year: "2022 - 2025",
    role: "Bachelor of Computer Applications (BCA)",
    institution: "University of Rajasthan",
    desc: "Undergraduate degree focusing on core software engineering, programming methodologies, and application design. Score: 72.1%.",
    current: false,
  },
  {
    year: "2020 - 2022",
    role: "Secondary Highschool",
    institution: "State Board",
    desc: "Completed secondary education with focused studies in scientific foundations and informatics. Score: 84.4%.",
    current: false,
  },
];

// Interactive Card component with hover glow effect (Apple Style)
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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
      {/* Radial Hover Glow (Cyan Gradient) */}
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

const AboutSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  // Parallax shifts for storytelling block and bento blocks
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const cardY1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const cardY2 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const cardY3 = useTransform(scrollYProgress, [0, 1], [110, -110]);

  return (
    <SectionWrapper
      id="about"
      className="flex flex-col items-center justify-center min-h-screen py-24 z-10 pointer-events-none"
    >
      <div ref={scrollRef} className="w-full max-w-7xl px-6 md:px-12 mx-auto pointer-events-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE: Large Typography Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-3">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter text-slate-100 font-display select-none"
            >
              ABOUT
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl font-mono text-neutral-400 font-thin tracking-wider uppercase"
            >
              Creative Developer
            </motion.p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-4" />
          </div>

          {/* RIGHT SIDE: Storytelling Description & Bento Cards */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Storytelling Text Bento Panel */}
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <BentoCard className="space-y-6 text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">// Profile Story</h3>
                <p>
                  Hello! I&apos;m <span className="text-white font-semibold">Aryan Singh</span>, a Full Stack Web Developer who lives at the intersection of robust backend systems and beautiful, interactive frontend designs.
                </p>
                <p>
                  My philosophy is that web applications should be more than static interfaces—they should be highly performant, intuitive, and secure platforms. I design efficient database schemas, optimize API latency, and code clean frontend structures to solve real-world problems.
                </p>
                <p className="font-mono text-xs text-neutral-500 pt-4 border-t border-white/5">
                  // Passionate about scalability, MERN stack, database design, and building clean web systems.
                </p>
              </BentoCard>
            </motion.div>

            {/* Bento Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              
              {/* PANEL 1: Small Bio */}
              <motion.div style={{ y: cardY1 }} className="md:col-span-2">
                <BentoCard className="flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Bio</h3>
                    <p className="text-2xl md:text-3xl font-light text-slate-100 leading-snug">
                      Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-medium">immersive digital worlds</span> with high-performance animations, responsive architectures, and intelligent AI features.
                    </p>
                  </div>
                  <div className="mt-8 flex justify-between items-center text-xs font-mono text-neutral-500 border-t border-white/5 pt-4">
                    <span>DESIGN PHILOSOPHY</span>
                    <span>MINIMALISM & INTERACTION</span>
                  </div>
                </BentoCard>
              </motion.div>

              {/* PANEL 2: Education (Timeline) */}
              <motion.div style={{ y: cardY2 }}>
                <BentoCard className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">Education</h3>
                    <div className="relative pl-6 border-l border-neutral-800 space-y-8">
                      {EDUCATION_TIMELINE.map((item, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot marker */}
                          <div 
                            className={cn(
                              "absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2",
                              item.current 
                                ? "bg-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" 
                                : "bg-neutral-900 border-neutral-700"
                            )} 
                          />
                          <span className="text-xs font-mono text-neutral-500 block mb-1">
                            {item.year}
                          </span>
                          <h4 className="text-md font-semibold text-slate-200 leading-snug">
                            {item.role}
                          </h4>
                          <p className="text-sm text-neutral-400 mt-1 font-light">
                            {item.institution}
                          </p>
                          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </BentoCard>
              </motion.div>

              {/* PANEL 3: Tech Stack */}
              <motion.div style={{ y: cardY3 }}>
                <BentoCard className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-6">Tech Stack</h3>
                    <p className="text-sm text-neutral-400 mb-6 font-light leading-relaxed">
                      A curated collection of frameworks and tools I use to build scalable products.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {TECH_ITEMS.map((tech) => (
                        <div
                          key={tech.name}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.03] text-sm text-slate-300 font-light hover:border-white/20 hover:bg-white/[0.07] transition-all duration-200 cursor-default"
                        >
                          {tech.icon}
                          <span className="text-xs font-mono">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 text-xxs font-mono text-neutral-600">
                    * & OTHER CREATIVE UTILITIES
                  </div>
                </BentoCard>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
