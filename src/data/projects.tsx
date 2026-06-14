import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiChakraui,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReactquery,
  SiSanity,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";

const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  chakra: {
    title: "Chakra UI",
    bg: "black",
    fg: "white",
    icon: <SiChakraui />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <SiPython />,
  },
  prisma: {
    title: "prisma",
    bg: "black",
    fg: "white",
    icon: <SiPrisma />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  reactQuery: {
    title: "React Query",
    bg: "black",
    fg: "white",
    icon: <SiReactquery />,
  },
  shadcn: {
    title: "ShanCN UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  docker: {
    title: "Docker",
    bg: "black",
    fg: "white",
    icon: <SiDocker />,
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  sockerio: {
    title: "Socket.io",
    bg: "black",
    fg: "white",
    icon: <SiSocketdotio />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  vue: {
    title: "Vue.js",
    bg: "black",
    fg: "white",
    icon: <SiVuedotjs />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  sanity: {
    title: "Sanity",
    bg: "black",
    fg: "white",
    icon: <SiSanity />,
  },
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: {
    title: "GSAP",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>G</strong>SAP
      </span>
    ),
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "farming-tool-rental",
    category: "Full-Stack Web",
    title: "Farming Tool Rental",
    src: "/assets/projects-screenshots/selected-work/farming-tool-rental.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.mongo,
      ],
    },
    live: "https://github.com/aryansingh7877",
    github: "https://github.com/aryansingh7877",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Agriculture Equipment Rental Platform
          </TypographyP>
          <TypographyP className="font-mono text-neutral-300">
            A full-stack web platform designed to streamline agricultural equipment rental, enabling farmers to list, browse, and rent tools based on availability and location.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Core Features</TypographyH3>
          <ul className="list-disc ml-6 space-y-2 font-mono text-sm text-neutral-400">
            <li><strong>Role-Based Access:</strong> Secure user authentication and authorization using protected routes.</li>
            <li><strong>Equipment Management:</strong> Allows farmers to list machinery, define pricing, and manage availability.</li>
            <li><strong>Real-time Tracking:</strong> Features booking workflows and dynamic availability calendars.</li>
            <li><strong>API Integration:</strong> RESTful APIs for seamless frontend-backend communication and database updates.</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "legal-e-vault",
    category: "Blockchain Verification",
    title: "Legal E-Vault",
    src: "/assets/projects-screenshots/selected-work/legal-e-vault.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.mongo,
      ],
    },
    live: "https://github.com/aryansingh7877",
    github: "https://github.com/aryansingh7877",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Blockchain-based Document Verification
          </TypographyP>
          <TypographyP className="font-mono text-neutral-300">
            A secure full-stack MERN application for storing and verifying legal documents with absolute data integrity and tamper-proof verification.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Technical Architecture</TypographyH3>
          <ul className="list-disc ml-6 space-y-2 font-mono text-sm text-neutral-400">
            <li><strong>Blockchain Security:</strong> Implements SHA-256 hashing and block-linking (hash, previousHash, timestamp) for secure document validation.</li>
            <li><strong>AI Analysis:</strong> Integrated AI-based text extraction and document analysis for automated document processing.</li>
            <li><strong>RESTful API & MERN:</strong> Seamless API layer with MongoDB, Express.js, React.js, and Node.js for robust performance.</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "zentry-clone",
    category: "Cinematic Interaction",
    title: "Zentry Clone",
    src: "/assets/projects-screenshots/selected-work/zentry-clone.webp",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.gsap,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [],
    },
    live: "https://gregarious-pika-83dd08.netlify.app/",
    github: "https://github.com/aryansingh7877",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Cinematic Web Interaction Recreation
          </TypographyP>
          <TypographyP className="font-mono text-neutral-300">
            A recreation of the award-winning Zentry.com website, focusing on high-performance animations, fluid scrolls, and rich UI/UX layout design.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Animation Details</TypographyH3>
          <ul className="list-disc ml-6 space-y-2 font-mono text-sm text-neutral-400">
            <li><strong>Smooth Scroll & GSAP:</strong> Integrated Lenis and GSAP ScrollTrigger to achieve smooth, responsive animations.</li>
            <li><strong>Interactive UI:</strong> Recreated rich hover micro-interactions and immersive mouse-tracking motion layouts.</li>
            <li><strong>Optimization:</strong> Component lifecycle rendering optimizations to ensure high frame rates across devices.</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "formapp",
    category: "Form Automation",
    title: "FormAPP",
    src: "/assets/projects-screenshots/selected-work/formapp.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [],
    },
    live: "https://publicformdata.netlify.app/",
    github: "https://github.com/aryansingh7877/FormAPP",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Google Form Response Bridge
          </TypographyP>
          <TypographyP className="font-mono text-neutral-300">
            A clean form utility that renders public Google Forms and submits responses directly to the linked Google Sheet workflow.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Core Features</TypographyH3>
          <ul className="list-disc ml-6 space-y-2 font-mono text-sm text-neutral-400">
            <li><strong>Public Form Loading:</strong> Accepts Google Form URLs and renders fields in a custom interface.</li>
            <li><strong>Direct Submission:</strong> Sends answers through the connected form response pipeline.</li>
            <li><strong>Focused UX:</strong> Minimal dark interface designed for fast form completion.</li>
          </ul>
        </div>
      );
    },
  },
  {
    id: "fanta",
    category: "Interactive Landing Page",
    title: "Fanta",
    src: "/assets/projects-screenshots/selected-work/fanta.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.gsap,
      ],
      backend: [],
    },
    live: "https://gorgeous-boba-f67577.netlify.app/",
    github: "https://github.com/aryansingh7877/Fanta",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Animated Fanta Product Experience
          </TypographyP>
          <TypographyP className="font-mono text-neutral-300">
            A bright product landing page focused on bold visuals, fruit-themed motion, and polished beverage-brand presentation.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Interaction Details</TypographyH3>
          <ul className="list-disc ml-6 space-y-2 font-mono text-sm text-neutral-400">
            <li><strong>Product Hero:</strong> Large visual composition with layered Fanta can and fruit assets.</li>
            <li><strong>Motion Layout:</strong> Uses animated positioning and smooth page transitions for a dynamic feel.</li>
            <li><strong>Brand Styling:</strong> Orange-forward palette and bold display typography matching the product concept.</li>
          </ul>
        </div>
      );
    },
  },
];

export default projects;
