import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useReducedMotion,
  useScroll,
  AnimatePresence
} from "framer-motion";
import { 
  Compass, 
  Palette, 
  Code2, 
  Rocket, 
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
  Workflow
} from "lucide-react";

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
    glowColor: "rgba(56, 189, 248, 0.4)",
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
    glowColor: "rgba(244, 114, 182, 0.4)",
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
    glowColor: "rgba(168, 85, 247, 0.4)",
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
    glowColor: "rgba(52, 211, 153, 0.4)",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = !!useReducedMotion();

  // Active stage state: 0 = Discover, 1 = Design, 2 = Build, 3 = Deploy
  const [activeStage, setActiveStage] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth 3D parallax tilt springs on mouse move
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 140,
    damping: 18,
  });

  // Scroll tracking to trigger active layers progressively on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (manualOverride) return;
      if (latest < 0.28) {
        setActiveStage(0); // Discover
      } else if (latest < 0.52) {
        setActiveStage(1); // Design
      } else if (latest < 0.78) {
        setActiveStage(2); // Build
      } else {
        setActiveStage(3); // Deploy
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, manualOverride]);

  // Layer separation: when hovered or scrolling through, slabs spread apart (46px spacing); at rest, 22px spacing
  const layerSpacing = isHovered || true ? 46 : 22;
  const baseAnchorY = 222;

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

  const selectStageManually = (index: number) => {
    setActiveStage(index);
    setManualOverride(true);
    // After 6 seconds, allow scroll to resume control smoothly
    setTimeout(() => {
      setManualOverride(false);
    }, 6000);
  };

  const defaultStage = processStages[0] as ProcessStageItem;
  const currentStage: ProcessStageItem = stages[activeStage] ?? stages[0] ?? defaultStage;

  return (
    <div 
      ref={containerRef}
      className={`process-bento-card group relative w-full overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-950/90 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 hover:border-purple-500/40 ${className}`}
    >
      {/* Dynamic Background Ambient Glow according to active stage */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl transition-all duration-700 opacity-20"
        style={{ background: currentStage.color }}
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full blur-3xl transition-all duration-700 opacity-15"
        style={{ background: currentStage.color }}
      />

      {/* Top Stage Navigation Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 bg-neutral-900/50 px-6 py-4.5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <Workflow className="h-4 w-4 text-purple-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-300">
            Interactive Methodology Stack
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-neutral-500">
            • Scroll or click slabs to explore
          </span>
        </div>

        {/* 4 Interactive Stage Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => selectStageManually(idx)}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-neutral-800 text-white shadow-sm border"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 border border-transparent"
                }`}
                style={{
                  borderColor: isActive ? stage.color : "transparent",
                  boxShadow: isActive ? `0 0 12px ${stage.glowColor}` : "none",
                }}
              >
                <span 
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? stage.color : "#737373",
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

      {/* Main 2-Column Responsive Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10 items-center">
        
        {/* LEFT COLUMN: 3D Isometric 4-Slab Stack (5 cols on lg) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px] rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-4">
          
          {/* Subtle Ambient Radial Dotted Matrix Grid */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(168_85_247/0.14)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
          />

          {/* 3D Motion Perspective Viewport */}
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: easeCurve }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={handlePointerLeave}
            className="relative flex h-full w-full items-center justify-center [perspective:900px]"
          >
            {/* Parallax Container */}
            <motion.div
              style={{ 
                rotateX: reducedMotion ? 0 : rotateX, 
                rotateY: reducedMotion ? 0 : rotateY, 
                width: 250, 
                height: 290 
              }}
              className="relative shrink-0 scale-[0.92] sm:scale-100 lg:scale-[1.08] [transform-style:preserve-3d]"
            >
              {/* Dashed Orbital Halo */}
              <div 
                aria-hidden="true" 
                className="absolute inset-[16px] rounded-full border border-dashed border-purple-500/20 motion-safe:animate-[spin_70s_linear_infinite]"
              />
              {/* Center Glow Halo */}
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

                  // Unique icon for each of the 4 stages
                  let IconComponent = Compass;
                  if (stage.id === "design") IconComponent = Palette;
                  if (stage.id === "build") IconComponent = Code2;
                  if (stage.id === "deploy") IconComponent = Rocket;

                  return (
                    <motion.g
                      key={stage.id}
                      initial={false}
                      animate={{ 
                        y: targetY - baseAnchorY + (isSelected ? -4 : 0),
                        scale: isSelected ? 1.025 : 1
                      }}
                      transition={{ duration: 0.55, ease: easeCurve }}
                      onClick={() => selectStageManually(idx)}
                      onMouseEnter={() => selectStageManually(idx)}
                      className="cursor-pointer transition-transform"
                    >
                      {/* Left Extruded Face */}
                      <path
                        d={`M60 ${baseAnchorY} L125 ${baseAnchorY + 28} V${baseAnchorY + 28 + 10} L60 ${baseAnchorY + 10} Z`}
                        className="transition-colors duration-300"
                        style={{
                          fill: isSelected 
                            ? stage.color 
                            : "#181429"
                        }}
                      />

                      {/* Right Extruded Face */}
                      <path
                        d={`M125 ${baseAnchorY + 28} L190 ${baseAnchorY} V${baseAnchorY + 10} L125 ${baseAnchorY + 28 + 10} Z`}
                        className="transition-colors duration-300"
                        style={{
                          fill: isSelected 
                            ? `${stage.color}dd`
                            : "#211b38"
                        }}
                      />

                      {/* Top Isometric Rhombus Face */}
                      <path
                        d={`M125 ${baseAnchorY - 28} L190 ${baseAnchorY} L125 ${baseAnchorY + 28} L60 ${baseAnchorY} Z`}
                        strokeWidth={1}
                        className="transition-colors duration-300"
                        style={{
                          fill: isSelected ? "#0d091a" : "#130f24",
                          stroke: isSelected ? stage.color : "#322954",
                          filter: isSelected ? `drop-shadow(0 0 10px ${stage.glowColor})` : "none"
                        }}
                      />

                      {/* Surface Grid Hatching on Slab Surface */}
                      {[-1, 0, 1].map((step) => (
                        <line
                          key={step}
                          x1={60 + 32.5 * (step + 1)}
                          y1={baseAnchorY - 14 * (step + 1)}
                          x2={125 + 32.5 * (step + 1)}
                          y2={baseAnchorY + 28 - 14 * (step + 1)}
                          stroke={isSelected ? stage.color : "#272045"}
                          strokeWidth={0.75}
                          strokeOpacity={isSelected ? 0.45 : 0.25}
                        />
                      ))}

                      {/* Centered Stage Icon on Slab Face */}
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
                    </motion.g>
                  );
                })}
              </svg>

              {/* Floating Stage Indicator Badges pinned to the right of slabs */}
              {stages.map((stage, idx) => {
                const isSelected = activeStage === idx;
                return (
                  <motion.button
                    key={stage.id}
                    type="button"
                    onClick={() => selectStageManually(idx)}
                    initial={false}
                    animate={{
                      top: baseAnchorY - idx * layerSpacing - 12 + (isSelected ? -4 : 0),
                      opacity: isSelected ? 1 : 0.7,
                      scale: isSelected ? 1.05 : 1
                    }}
                    transition={{ duration: 0.55, ease: easeCurve }}
                    style={{ 
                      translateZ: 22,
                      borderColor: isSelected ? stage.color : "rgba(255,255,255,0.1)",
                      backgroundColor: isSelected ? "#0f0c1e" : "rgba(20, 16, 36, 0.85)",
                      boxShadow: isSelected ? `0 0 14px ${stage.glowColor}` : "none"
                    }}
                    className={`absolute -right-4 sm:-right-8 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide shadow-sm transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "text-white border shadow-lg"
                        : "border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <span 
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-mono text-[10px]">{stage.step}</span>
                    <span>{stage.label}</span>
                  </motion.button>
                );
              })}

              {/* Active Stage Callout Pill */}
              <motion.div
                animate={reducedMotion ? false : { y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ translateZ: 24 }}
                className="absolute left-[2%] top-[4%] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-950/90 px-3 py-1 font-mono text-[11px] font-semibold text-neutral-300 shadow-md"
              >
                <Sparkles 
                  className="h-3 w-3" 
                  style={{ color: currentStage.color }}
                />
                <span>Stage {currentStage.step} Active</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Rich Dynamic Stage Content Panel (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: easeCurve }}
              className="flex flex-col gap-5"
            >
              {/* Header with Stage Number & Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-extrabold tracking-wider border shadow-sm"
                  style={{
                    color: currentStage.color,
                    borderColor: `${currentStage.color}66`,
                    backgroundColor: `${currentStage.color}15`,
                    boxShadow: `0 0 12px ${currentStage.glowColor}`
                  }}
                >
                  PHASE {currentStage.step} • {currentStage.label}
                </span>

                <span className="font-mono text-xs text-neutral-400">
                  {currentStage.badge}
                </span>
              </div>

              {/* Title & Lede */}
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {currentStage.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-neutral-300">
                  {currentStage.lede}
                </p>
              </div>

              {/* Deliverables Checklist Grid */}
              <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:p-5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: currentStage.color }} />
                  <span>Key Engineering Deliverables</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentStage.deliverables.map((item) => (
                    <div 
                      key={item}
                      className="flex items-start gap-2 text-xs leading-normal text-neutral-300"
                    >
                      <span 
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: currentStage.color }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Metric Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                {/* Tools Ribbon */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mr-1">
                    Artifacts:
                  </span>
                  {currentStage.tools.map((tool) => (
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
                  <Cpu className="h-3.5 w-3.5" style={{ color: currentStage.color }} />
                  <div>
                    <span 
                      className="font-mono text-xs font-bold mr-1.5"
                      style={{ color: currentStage.color }}
                    >
                      {currentStage.metric}
                    </span>
                    <span className="font-sans text-[11px] text-neutral-400">
                      {currentStage.metricLabel}
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Status Ticker */}
      <div className="border-t border-neutral-800/80 bg-neutral-950/60 px-6 py-3.5 sm:px-8 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-neutral-400">
        <div className="flex items-center gap-2">
          <span 
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: currentStage.color }}
          />
          <span>Continuous Lifecycle: All 4 layers synchronized in production</span>
        </div>
        <div className="text-neutral-500">
          Scroll down to continue • Manoj Raj Full-Stack Architecture
        </div>
      </div>
    </div>
  );
}
