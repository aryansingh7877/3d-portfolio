"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Zap, Code, Flame, Rocket, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";

interface AchievementCardData {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  tag: string;
  glowColor: string;
  image?: string;
  href: string;
}

const ACHIEVEMENTS_DATA: AchievementCardData[] = [
  {
    id: 1,
    title: "GSSoC 2026 Contributor",
    subtitle: "GS Labs by GirlScript Foundation",
    desc: "Contributor badge for GirlScript Summer of Code 2026 open-source participation.",
    icon: <Award className="w-5 h-5 text-indigo-400" />,
    tag: "Contributor",
    glowColor: "from-indigo-500/20 to-blue-500/5",
    image: "/assets/achievements/gssoc-2026-contributor.jpeg",
    href: "/assets/achievements/gssoc-2026-contributor.jpeg",
  },
  {
    id: 2,
    title: "Decode2Deploy",
    subtitle: "BMSIT&M Coding Club",
    desc: "Participated in a two-round technical event powered by DevsBazaar on 18th and 19th May, 2026.",
    icon: <Code className="w-5 h-5 text-emerald-400" />,
    tag: "Participation",
    glowColor: "from-emerald-500/20 to-teal-500/5",
    image: "/assets/achievements/decode2deploy.png",
    href: "/assets/achievements/decode2deploy.png",
  },
  {
    id: 3,
    title: "DBMS with Oracle PL/SQL",
    subtitle: "SQE Systems & Solutions",
    desc: "Completed offline training with project work in association with MCA BMSIT&M on 26th Feb, 2026.",
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    tag: "Completion",
    glowColor: "from-amber-500/20 to-orange-500/5",
    image: "/assets/achievements/sqe-dbms-oracle.jpeg",
    href: "/assets/achievements/sqe-dbms-oracle.jpeg",
  },
  {
    id: 4,
    title: "Google Digital Certificate",
    subtitle: "Google Digital Garage",
    desc: "Completed a Google digital learning certification awarded to Aryan Singh.",
    icon: <Zap className="w-5 h-5 text-purple-400" />,
    tag: "Certified",
    glowColor: "from-purple-500/20 to-pink-500/5",
    image: "/assets/achievements/google-digital-certificate.png",
    href: "/assets/achievements/google-digital-certificate.pdf",
  },
  {
    id: 5,
    title: "CODE RED 3.0",
    subtitle: "BMSIT&M E-Cell",
    desc: "Actively participated in Round 1 of the national-level 24-hour hackathon CODE RED 3.0.",
    icon: <Rocket className="w-5 h-5 text-rose-400" />,
    tag: "Hackathon",
    glowColor: "from-rose-500/20 to-red-500/5",
    image: "/assets/achievements/code-red-3.png",
    href: "/assets/achievements/code-red-3.pdf",
  },
  {
    id: 6,
    title: "Hackoholic",
    subtitle: "Hackoholic Certificate",
    desc: "Certificate awarded to Aryan Singh for Hackoholic participation.",
    icon: <Flame className="w-5 h-5 text-orange-400" />,
    tag: "Certified",
    glowColor: "from-orange-500/20 to-yellow-500/5",
    image: "/assets/achievements/hackoholic.png",
    href: "/assets/achievements/hackoholic.pdf",
  },
];

// Interactive marquee item card
const AchievementCard = ({ item }: { item: AchievementCardData }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/70 backdrop-blur-xl p-5",
        "w-[360px] md:w-[460px] h-[430px] flex-shrink-0 flex flex-col justify-between transition-all duration-300",
        "hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.03)] cursor-pointer select-none"
      )}
    >
      {/* Background Cyber-Glow follows mouse hover */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          background: isFocused
            ? `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(34, 211, 238, 0.08), transparent 80%)`
            : "",
          opacity: isFocused ? 1 : 0,
        }}
      />

      {/* Cyber gradient corner flare */}
      <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 bg-gradient-to-br", item.glowColor)} />

      <div className="relative z-10 h-60 w-full overflow-hidden rounded-xl border border-white/5 bg-white">
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.title} certificate`}
            fill
            sizes="(max-width: 768px) 360px, 460px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-mono text-neutral-300">
              {item.icon}
              <span>View PDF Certificate</span>
            </div>
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
              {item.icon}
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{item.subtitle}</span>
          </div>
          <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border border-white/10 text-cyan-400/90 bg-cyan-400/5">
            {item.tag}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-lg font-bold tracking-tight text-slate-100 font-display mt-2">
            {item.title}
          </h4>
          <ArrowUpRight className="mt-2 h-4 w-4 flex-shrink-0 text-neutral-500" />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-neutral-400 font-light leading-relaxed relative z-10">
        {item.desc}
      </p>
    </a>
  );
};

const AchievementsSection = () => {
  // Triple items list to guarantee seamless marquee looping without seeing gaps
  const doubledItems = [...ACHIEVEMENTS_DATA, ...ACHIEVEMENTS_DATA, ...ACHIEVEMENTS_DATA];

  return (
    <SectionWrapper id="achievements" className="relative w-full py-48 md:py-64 z-10 pointer-events-none">
      {/* CSS stylesheet for the marquee keyframe loop */}
      <style>{`
        @keyframes marquee-loop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33333%);
          }
        }
        .marquee-list {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee-loop 35s linear infinite;
        }
        .marquee-list:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full px-6 md:px-12 mx-auto pointer-events-auto">
        <SectionHeader 
          id="achievements" 
          title="Achievements" 
          desc="Certifications, hackathons, and technical milestones." 
          className="mb-16 mt-0" 
        />
        
        {/* Overflow hidden wrapper */}
        <div className="relative w-full overflow-hidden py-4 mask-gradient-x">
          {/* Loop marquee list */}
          <div className="marquee-list">
            {doubledItems.map((item, idx) => (
              <AchievementCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>

          {/* Left/Right fading gradients to make it blend into screen edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AchievementsSection;
