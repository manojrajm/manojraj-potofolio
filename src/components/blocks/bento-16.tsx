import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useReducedMotion
} from "framer-motion";
import { 
  Compass, 
  Palette, 
  Code2, 
  Rocket, 
  Sparkles,
  Workflow,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowDown
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ProcessStageItem {
  id: "discover" | "design" | "build" | "deploy";
  step: "01" | "02" | "03" | "04";
  label: string;
  badge: string;
  title: string;
  lede: string;
  color: string;
  glowColor: string;
  deliverables: string[];
  tools: string[];
  metric: string;
  metricLabel: string;
}

export const processStages: ProcessStageItem[] = [
  {
    id: "discover",
    step: "01",
    label: "DISCOVER",
    badge: "Problem & Domain Framing",
    title: "Deconstruct, Clarify & Architect",
    lede: "Unpack domain workflows, map entity boundaries, clarify constraints, and define data models before writing a single line of production code.",
    color: "#38bdf8", // Sky Cyan
    glowColor: "rgba(56, 189, 248, 0.45)",
    deliverables: [
      "Domain entity mapping & relational ER schemas",
      "User journey flows & edge-case matrix",
      "API contract specifications & schema validations",
      "Non-functional performance & throughput SLAs"
    ],
    tools: ["Domain Analysis", "ER Schemas", "System Architecture", "OpenAPI"],
    metric: "100%",
    metricLabel: "Contract Clarity Before Implementation"
  },
  {
    id: "design",
    step: "02",
    label: "DESIGN",
    badge: "System & UX Architecture",
    title: "Intuitive Interfaces & Fluid Systems",
    lede: "Shape high-clarity UX systems, responsive layouts, micro-interaction states, and cohesive component tokens that make complex workflows feel effortless.",
    color: "#f472b6", // Fuchsia Pink
    glowColor: "rgba(244, 114, 182, 0.45)",
    deliverables: [
      "Design token architecture & semantic dark themes",
      "High-fidelity responsive layouts & interaction states",
      "Interactive 3D Three.js & WebGL prototypes",
      "Component accessibility & cognitive ergonomics"
    ],
    tools: ["Figma", "Design Tokens", "Tailwind CSS", "Three.js", "Framer Motion"],
    metric: "< 16ms",
    metricLabel: "Frame-Budget Interactive Latency"
  },
  {
    id: "build",
    step: "03",
    label: "BUILD",
    badge: "Full-Stack Engineering",
    title: "Modular Code & Resilient Tiers",
    lede: "Construct scalable web applications with React 19, strict TypeScript contracts, high-throughput Node.js services, and transactional database schemas.",
    color: "#a855f7", // Electric Purple
    glowColor: "rgba(168, 85, 247, 0.45)",
    deliverables: [
      "React 19 modern frontend with SSR hydration",
      "Scalable Node.js / Express microservices",
      "ACID relational storage in MSSQL & PostgreSQL",
      "End-to-end type safety, error boundaries & tests"
    ],
    tools: ["React 19", "TypeScript", "Node.js", "MSSQL", "PostgreSQL", "Prisma"],
    metric: "0",
    metricLabel: "Runtime Type Errors Across Tiers"
  },
  {
    id: "deploy",
    step: "04",
    label: "DEPLOY",
    badge: "Delivery & Production Health",
    title: "Automated Pipelines & Edge Reliability",
    lede: "Automate zero-downtime releases with containerized workflows, robust GitHub Actions CI/CD pipelines, reverse proxy routing, and real-time observability.",
    color: "#34d399", // Emerald Mint
    glowColor: "rgba(52, 211, 153, 0.45)",
    deliverables: [
      "Automated GitHub Actions build, test & lint pipelines",
      "Docker containerization & environment parity",
      "Nginx reverse proxy, SSL cert automation & HTTP/2",
      "Structured health checks, logging & observability"
    ],
    tools: ["GitHub Actions", "Docker", "Nginx", "Linux", "CI/CD", "Winston"],
    metric: "99.9%",
    metricLabel: "Automated Deployment Uptime & Pipeline SLA"
  }
];

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface Bento16Props {
  stages?: ProcessStageItem[];
  className?: string;
}

export function Bento16({
  stages = processStages,
  className = ""
}: Bento16Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();

  // Scroll progression state driven by GSAP ScrollTrigger
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax spring physics for 3D cursor tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 140,
    damping: 18,
  });

  // Setup GSAP Pinned ScrollTrigger
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    const pinEl = pinTargetRef.current;
    if (!sectionEl || !pinEl) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top top",
      end: "+=2800", // 4 distinct, comfortable scroll stages
      pin: pinEl,
      pinSpacing: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // 4 equal scroll intervals for the 4 stages
        if (p < 0.25) {
          setActiveStage(0); // 01 Discover
        } else if (p < 0.50) {
          setActiveStage(1); // 02 Design
        } else if (p < 0.75) {
          setActiveStage(2); // 03 Build
        } else {
          setActiveStage(3); // 04 Deploy
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const jumpToStage = (idx: number) => {
    setActiveStage(idx);
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    const trigger = ScrollTrigger.getById(sectionEl.id) || ScrollTrigger.getAll().find(st => st.trigger === sectionEl);
    if (trigger) {
      const targetScroll = trigger.start + (idx / 3.2) * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  const defaultStage = processStages[0] as ProcessStageItem;
  const currentStage: ProcessStageItem = stages[activeStage] ?? stages[0] ?? defaultStage;

  // Isometric Slab Vertical Anchoring
  const baseAnchorY = 224;
  const layerSpacing = 46; // Always spread in exploded architectural view

  return (
    <div 
      ref={sectionRef} 
      className={`process-pinned-track w-full ${className}`}
    >
      {/* Pinned Stage Container (Stays fixed in viewport during scroll) */}
      <div 
        ref={pinTargetRef}
        className="process-pin-container flex flex-col justify-center w-full min-h-screen max-w-[1440px] mx-auto px-4 sm:px-8 py-4 overflow-hidden"
      >
        {/* Section Header */}
        <div className="process-header-block mb-3 sm:mb-4">
          <div className="section-index">05 / METHODOLOGY &amp; ARCHITECTURE</div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="display-heading process-display-heading">
              FROM IDEA TO<br />PRODUCTION
            </h2>
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span>Scroll {activeStage + 1} of 4 • {currentStage.label}</span>
            </div>
          </div>
          <p className="skills-lede-sub process-lede-sub">
            Interactive isometric methodology stack — scroll down through the 4 tiers to inspect engineering deliverables, architecture contracts, and production reliability.
          </p>
        </div>

        {/* Main Process Bento Stage Card */}
        <div className="process-bento-card relative w-full overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300">
          
          {/* Dynamic Ambient Background Glow */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl transition-all duration-700 opacity-25"
            style={{ background: currentStage.color }}
          />
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full blur-3xl transition-all duration-700 opacity-20"
            style={{ background: currentStage.color }}
          />

          {/* Top Progress & Navigation Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 bg-neutral-900/60 px-5 py-3 sm:px-8">
            <div className="flex items-center gap-2.5">
              <Workflow className="h-4 w-4 text-purple-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
                Continuous Full-Stack Pipeline
              </span>
            </div>

            {/* 4 Clickable Stage Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {stages.map((stage, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => jumpToStage(idx)}
                    className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-white shadow-sm border"
                        : "text-neutral-400 hover:text-neutral-200 border border-transparent hover:bg-neutral-800/50"
                    }`}
                    style={{
                      borderColor: isActive ? stage.color : "transparent",
                      backgroundColor: isActive ? "#181429" : "transparent",
                      boxShadow: isActive ? `0 0 14px ${stage.glowColor}` : "none",
                    }}
                  >
                    <span 
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? stage.color : "#525252",
                        boxShadow: isActive ? `0 0 8px ${stage.color}` : "none"
                      }}
                    />
                    <span className="font-mono text-[11px]">{stage.step}</span>
                    <span>{stage.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scroll Progress Bar */}
          <div className="relative h-1 w-full bg-neutral-900 overflow-hidden">
            <div 
              className="h-full transition-all duration-150 ease-out"
              style={{
                width: `${Math.min(100, Math.max(5, scrollProgress * 100))}%`,
                background: `linear-gradient(90deg, #38bdf8, #f472b6, #a855f7, #34d399)`,
                boxShadow: `0 0 10px ${currentStage.color}`
              }}
            />
          </div>

          {/* Main 2-Column Responsive Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 lg:p-8 items-center min-h-[440px]">
            
            {/* LEFT COLUMN: 3D Isometric 4-Layer Stack (Always visible, pinned on screen) */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[340px] sm:min-h-[380px] rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-3 sm:p-4">
              
              {/* Radial Dotted Matrix Grid */}
              <div 
                aria-hidden="true" 
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(168_85_247/0.14)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]"
              />

              {/* 3D Motion Perspective Viewport */}
              <motion.div
                onPointerMove={handlePointerMove}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={handlePointerLeave}
                className="relative flex h-full w-full items-center justify-center [perspective:900px]"
              >
                {/* Parallax Container with Mouse Tilt */}
                <motion.div
                  style={{ 
                    rotateX: reducedMotion ? 0 : rotateX, 
                    rotateY: reducedMotion ? 0 : rotateY, 
                    width: 250, 
                    height: 290 
                  }}
                  className="relative shrink-0 scale-[0.92] sm:scale-100 lg:scale-[1.08] [transform-style:preserve-3d]"
                >
                  {/* Dashed Orbital Guide */}
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-[16px] rounded-full border border-dashed border-purple-500/25 motion-safe:animate-[spin_70s_linear_infinite]"
                  />
                  {/* Stage-Synced Center Glow */}
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-[36px] rounded-full blur-2xl transition-all duration-500"
                    style={{ backgroundColor: currentStage.glowColor }}
                  />

                  {/* Isometric 4-Layer Stack SVG */}
                  <svg 
                    aria-hidden="true" 
                    viewBox="0 0 250 290" 
                    className="absolute inset-0 h-full w-full overflow-visible"
                  >
                    {stages.map((stage, idx) => {
                      const targetY = baseAnchorY - idx * layerSpacing;
                      const isSelected = activeStage === idx;

                      let IconComponent = Compass;
                      if (stage.id === "design") IconComponent = Palette;
                      if (stage.id === "build") IconComponent = Code2;
                      if (stage.id === "deploy") IconComponent = Rocket;

                      return (
                        <g
                          key={stage.id}
                          onClick={() => jumpToStage(idx)}
                          className="cursor-pointer transition-transform duration-300"
                          style={{
                            transform: `translateY(${targetY - baseAnchorY + (isSelected ? -6 : 0)}px) scale(${isSelected ? 1.03 : 1})`,
                            transformOrigin: "125px 224px",
                          }}
                        >
                          {/* Left Extruded Face */}
                          <path
                            d={`M60 ${baseAnchorY} L125 ${baseAnchorY + 28} V${baseAnchorY + 28 + 10} L60 ${baseAnchorY + 10} Z`}
                            className="transition-colors duration-300"
                            style={{
                              fill: isSelected ? stage.color : "#1a152e"
                            }}
                          />

                          {/* Right Extruded Face */}
                          <path
                            d={`M125 ${baseAnchorY + 28} L190 ${baseAnchorY} V${baseAnchorY + 10} L125 ${baseAnchorY + 28 + 10} Z`}
                            className="transition-colors duration-300"
                            style={{
                              fill: isSelected ? `${stage.color}cc` : "#231c3d"
                            }}
                          />

                          {/* Top Isometric Rhombus Face */}
                          <path
                            d={`M125 ${baseAnchorY - 28} L190 ${baseAnchorY} L125 ${baseAnchorY + 28} L60 ${baseAnchorY} Z`}
                            strokeWidth={1}
                            className="transition-colors duration-300"
                            style={{
                              fill: isSelected ? "#0e0a1f" : "#120e24",
                              stroke: isSelected ? stage.color : "#332a57",
                              filter: isSelected ? `drop-shadow(0 0 14px ${stage.glowColor})` : "none"
                            }}
                          />

                          {/* Surface Architectural Grid Lines */}
                          {[-1, 0, 1].map((step) => (
                            <line
                              key={step}
                              x1={60 + 32.5 * (step + 1)}
                              y1={baseAnchorY - 14 * (step + 1)}
                              x2={125 + 32.5 * (step + 1)}
                              y2={baseAnchorY + 28 - 14 * (step + 1)}
                              stroke={isSelected ? stage.color : "#2b224d"}
                              strokeWidth={0.75}
                              strokeOpacity={isSelected ? 0.5 : 0.25}
                            />
                          ))}

                          {/* Centered Stage Icon */}
                          <IconComponent
                            x={118}
                            y={baseAnchorY - 7}
                            width={14}
                            height={14}
                            strokeWidth={2}
                            className="transition-colors duration-300"
                            style={{
                              color: isSelected ? stage.color : "#94a3b8"
                            }}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Floating Layer Indicator Badges pinned to the right of slabs */}
                  {stages.map((stage, idx) => {
                    const isSelected = activeStage === idx;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => jumpToStage(idx)}
                        style={{
                          top: baseAnchorY - idx * layerSpacing - 12 + (isSelected ? -6 : 0),
                          transform: "translateZ(22px)",
                          borderColor: isSelected ? stage.color : "rgba(255,255,255,0.1)",
                          backgroundColor: isSelected ? "#120e24" : "rgba(18, 14, 34, 0.85)",
                          boxShadow: isSelected ? `0 0 16px ${stage.glowColor}` : "none"
                        }}
                        className={`absolute -right-4 sm:-right-8 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide shadow-sm transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "text-white border scale-105 opacity-100"
                            : "border-neutral-800 text-neutral-400 hover:text-white opacity-70"
                        }`}
                      >
                        <span 
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="font-mono text-[10px]">{stage.step}</span>
                        <span>{stage.label}</span>
                      </button>
                    );
                  })}

                  {/* Active Stage Callout Pill */}
                  <div
                    style={{ transform: "translateZ(24px)" }}
                    className="absolute left-[2%] top-[4%] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-950/90 px-3 py-1 font-mono text-[11px] font-semibold text-neutral-300 shadow-md"
                  >
                    <Sparkles 
                      className="h-3 w-3" 
                      style={{ color: currentStage.color }}
                    />
                    <span>Layer {currentStage.step} Active</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Parallax Stage Cards Stack (Glides in & out with parallax) */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[420px] flex items-center">
              
              {stages.map((stage, idx) => {
                const isActive = activeStage === idx;
                const isPassed = idx < activeStage;
                const isUpcoming = idx > activeStage;

                // Parallax translation offset
                let yOffset = 0;
                let opacity = 0;
                let scale = 0.95;
                let pointerEvents: "auto" | "none" = "none";

                if (isActive) {
                  yOffset = 0;
                  opacity = 1;
                  scale = 1;
                  pointerEvents = "auto";
                } else if (isPassed) {
                  yOffset = -45; // Slides up with parallax exit
                  opacity = 0;
                  scale = 0.94;
                  pointerEvents = "none";
                } else if (isUpcoming) {
                  yOffset = 45; // Slides up from bottom with parallax entrance
                  opacity = 0;
                  scale = 0.94;
                  pointerEvents = "none";
                }

                return (
                  <div
                    key={stage.id}
                    className="absolute inset-0 flex flex-col justify-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      transform: `translateY(${yOffset}px) scale(${scale})`,
                      opacity,
                      pointerEvents,
                      zIndex: isActive ? 10 : 1
                    }}
                  >
                    {/* Header with Stage Number & Badge */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span 
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-extrabold tracking-wider border shadow-sm"
                        style={{
                          color: stage.color,
                          borderColor: `${stage.color}66`,
                          backgroundColor: `${stage.color}15`,
                          boxShadow: `0 0 14px ${stage.glowColor}`
                        }}
                      >
                        PHASE {stage.step} • {stage.label}
                      </span>

                      <span className="font-mono text-xs text-neutral-400">
                        {stage.badge}
                      </span>
                    </div>

                    {/* Title & Lede */}
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                        {stage.title}
                      </h3>
                      <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-neutral-300 max-w-2xl">
                        {stage.lede}
                      </p>
                    </div>

                    {/* Deliverables Checklist Grid */}
                    <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:p-5">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: stage.color }} />
                        <span>Key Engineering Deliverables</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stage.deliverables.map((item) => (
                          <div 
                            key={item}
                            className="flex items-start gap-2 text-xs leading-normal text-neutral-300"
                          >
                            <span 
                              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tools & Metric Ribbon */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {/* Tools Ribbon */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mr-1">
                          Artifacts:
                        </span>
                        {stage.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-md border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-neutral-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      {/* Metric Guarantee Badge */}
                      <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-1.5">
                        <Cpu className="h-3.5 w-3.5" style={{ color: stage.color }} />
                        <div>
                          <span 
                            className="font-mono text-xs font-bold mr-1.5"
                            style={{ color: stage.color }}
                          >
                            {stage.metric}
                          </span>
                          <span className="font-sans text-[11px] text-neutral-400">
                            {stage.metricLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* Bottom Status Ticker */}
          <div className="border-t border-neutral-800/80 bg-neutral-950/80 px-5 py-3 sm:px-8 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-neutral-400">
            <div className="flex items-center gap-2">
              <span 
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentStage.color }}
              />
              <span>
                {activeStage < 3 
                  ? `Scroll down to advance to Stage 0${activeStage + 2} (${stages[activeStage + 1]?.label})` 
                  : "✓ All 4 Methodology Layers complete • Scroll down to continue"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400">
              <span>Section Pinned ({Math.round(scrollProgress * 100)}%)</span>
              <ArrowDown className="h-3 w-3 text-purple-400 animate-bounce" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
