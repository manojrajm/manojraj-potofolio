import { ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Clock, Copy, Database, Github, Globe, Layers, Linkedin, Mail, Menu, Server, Sparkles, X } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { experiencePoints, navItems, projects, skillGroups } from "@/data/portfolio";

import { TerminalLoader } from "./TerminalLoader";
import { ParticleText } from "./ParticleText";
import { SkillIcon } from "./SkillIcons";
import { Bento16 } from "@/components/blocks/bento-16";

const PersistentExperience = lazy(() => import("@/three/Experience"));
const GITHUB = "https://github.com/manojrajm";
const LINKEDIN = "https://in.linkedin.com/in/manoj-raj-m-7b140621b";
const EMAIL = "mailto:gauthamtamizha007@gmail.com";

function MagneticLink({ href, children, external = false, variant = "cinematic" }: { href: string; children: React.ReactNode; external?: boolean; variant?: "cinematic" | "cinematicOutline" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.12}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px)`;
  };
  return (
    <Button asChild variant={variant} size="cinematic">
      <a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} data-cursor="OPEN">
        {children}
      </a>
    </Button>
  );
}

function Cursor() {
  const [state, setState] = useState({ x: -50, y: -50, label: "" });
  useEffect(() => {
    const move = (event: globalThis.MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setState({ x: event.clientX, y: event.clientY, label: target?.dataset["cursor"] ?? "" });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div className={`custom-cursor ${state.label ? "is-active" : ""}`} style={{ transform: `translate3d(${state.x}px, ${state.y}px, 0)` }}>{state.label}</div>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <>
    <header className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="#top" aria-label="MR home"><span className="brand-accent">M</span><span className="brand-accent">R</span><span>.</span></a>
      <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map(item => <a key={item} href={`#${item}`}>{item}</a>)}</nav>
      <Button variant="ghost" size="icon" className="menu-button" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></Button>
    </header>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ clipPath: "circle(0% at 90% 5%)" }} animate={{ clipPath: "circle(150% at 90% 5%)" }} exit={{ clipPath: "circle(0% at 90% 5%)" }} transition={{ duration: .55 }}>
      <Button variant="ghost" size="icon" className="mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></Button>
      <nav>{navItems.map((item, i) => <motion.a initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * .06 }} key={item} href={`#${item}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{item}</motion.a>)}</nav>
    </motion.div>}</AnimatePresence>
  </>;
}

function Hero() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, .16], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, .12], [1, 0]);

  const stackCode = `const developer = {
  name: "Manoj Raj",
  role: "Full Stack & DevOps",
  stack: ["React", "Node", "MSSQL"]
};`;

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-vignette" />
      {/* Background Cyber Code Snippets */}
      <div className="hero-bg-code code-top-right" aria-hidden="true">interface Pipeline &#123; stage: &apos;deploy&apos; &#125;</div>
      <div className="hero-bg-code code-mid-right" aria-hidden="true">const client = new MSSQL.ConnectionPool()</div>
      <div className="hero-bg-code code-lower-mid" aria-hidden="true">docker-compose up --build -d</div>
      <div className="hero-bg-code code-bottom-right" aria-hidden="true">SELECT * FROM system_logs</div>

      <motion.div className="hero-copy-grid" style={reduced ? {} : { y, opacity }}>
        {/* Left Column: Information, Badges, Name, Actions, Code Card */}
        <div className="hero-left-content">
          <div className="status-badge">
            <span className="status-dot-pulse" />
            <span>AVAILABLE FOR SELECT PROJECTS</span>
          </div>

          <h1 id="hero-title" className="hero-main-name particle-heading-wrapper" aria-label="MANOJ RAJ">
            <ParticleText
              segments={[
                { text: "M", isAccent: true },
                { text: "ANOJ ", isAccent: false },
                { text: "R", isAccent: true },
                { text: "AJ", isAccent: false },
              ]}
              particleSize={2.1}
              density={3.6}
              color="#ffffff"
              highlightColor="#8b5cf6"
              scatter={180}
              gatherDuration={1500}
              stagger={380}
              pointerRepel={45}
              repelRadius={120}
              idleDrift={0.65}
              trigger="hover"
              fontSize="clamp(3.8rem, 8.5vw, 7.5rem)"
              fontWeight={900}
              fontFamily='"Archivo Black", sans-serif'
              align="left"
              glow={true}
            />
          </h1>

          <div className="hero-role-pill">
            <span>FULL STACK DEVELOPER &amp; LEARNING DEVOPS</span>
          </div>

          <p className="hero-lede-desc">
            Architecting high-availability web systems, scalable REST APIs, enterprise database schemas and cloud deployment pipelines.
          </p>

          <div className="hero-actions-row">
            <MagneticLink href="#projects">View my work <ArrowDown /></MagneticLink>
            <MagneticLink href="#contact" variant="cinematicOutline">Let&apos;s connect <ArrowUpRight /></MagneticLink>
          </div>

          {/* Clean stack.config.ts card that does NOT overlap text */}
          <div className="hero-code-box" aria-label="Developer configuration snippet">
            <div className="code-box-bar">
              <div className="code-box-dots">
                <span className="c-dot red" />
                <span className="c-dot yellow" />
                <span className="c-dot green" />
              </div>
              <span className="code-box-file">stack.config.ts</span>
            </div>
            <pre className="code-box-pre"><code>{stackCode}</code></pre>
          </div>
        </div>

        {/* Right Column: 3D Stage & Right Stat Cards */}
        <div className="hero-right-stage">
          {/* Spacer allowing the 3D robot model to float visibly in the empty stage */}
          <div className="hero-stage-spacer" />

          {/* Right Metrics Cards */}
          <div className="hero-stat-stack">
            <div className="stat-pill-card">
              <div className="stat-pill-head">
                <span className="stat-val">99.9%</span>
                <span className="stat-glow-dot" />
              </div>
              <span className="stat-caption">DEPLOYMENT UPTIME</span>
            </div>

            <div className="stat-pill-card">
              <div className="stat-pill-head">
                <span className="stat-val">5+</span>
              </div>
              <span className="stat-caption">ENTERPRISE ERP &amp; SAAS</span>
            </div>

            <div className="stat-pill-card">
              <div className="stat-pill-head">
                <span className="stat-badge-text">DEVOPS ENGINE</span>
              </div>
              <span className="stat-caption">CI/CD • NGINX • DOCKER</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="hero-meta">
        <span>Coimbatore, Tamil Nadu</span>
        <span>Full Stack Developer</span>
        <span>React • Node • MSSQL • DevOps</span>
      </div>
      <a className="scroll-cue" href="#about">Scroll to explore <ArrowDown /></a>
    </section>
  );
}

function Marquee() {
  return <section className="marquee-section" aria-label="Core disciplines"><div className="marquee marquee-forward"><span>BUILD • SHIP • SCALE • AUTOMATE • BUILD • SHIP • SCALE • AUTOMATE •</span></div><div className="marquee marquee-reverse"><span>REACT • NODE.JS • MSSQL • JAVASCRIPT • SAAS • ERP • REACT • NODE.JS • MSSQL •</span></div></section>;
}

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="section-index">01 / ABOUT</div>
      <div className="about-grid">
        <div className="about-stage-spacer" aria-hidden="true" />
        <div className="about-copy">
          <h2 className="about-tech-heading about-anim-text">
            <span className="brand-accent">BEHIND</span> THE CODE
          </h2>
          <p className="about-anim-text">
            I’m Manoj Raj, a Full Stack Developer focused on building practical, scalable software products. I work across modern frontend interfaces, backend APIs, databases and deployment workflows — turning business processes into reliable digital systems.
          </p>
          <p className="about-anim-text">
            My experience includes building ERP workflows, SaaS products, real-time interfaces and database-backed applications using React, Node.js, Express.js and Microsoft SQL Server.
          </p>
          <dl className="facts about-anim-text">
            <div>
              <dt>Based in</dt>
              <dd>Coimbatore, Tamil Nadu</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>B.Tech / B.E. Information Technology — 2024</dd>
            </div>
            <div>
              <dt>Currently</dt>
              <dd>Dyna4cast Technologies</dd>
            </div>
          </dl>
        </div>
        <div className="glass-cube" aria-hidden="true">
          <div>REACT</div>
          <div>NODE</div>
          <div>SQL</div>
          <div>API</div>
        </div>
      </div>
    </section>
  );
}

const experiencePillars = [
  {
    icon: Layers,
    title: "Enterprise ERP Workflows",
    badge: "CORE ARCHITECTURE",
    desc: "Architecting enterprise ERP business workflows, complex data grids, interactive CRUD screens, and role-based automation.",
    chips: ["React.js", "Component Architecture", "ERP Logic"],
    accent: "#8b5cf6"
  },
  {
    icon: Database,
    title: "Full-Stack API Engineering",
    badge: "DATA & APIS",
    desc: "Building scalable Node.js & Express RESTful APIs, optimizing relational schemas, stored procedures, and queries in Microsoft SQL Server.",
    chips: ["Node.js", "Express.js", "MSSQL", "REST APIs"],
    accent: "#06b6d4"
  },
  {
    icon: Server,
    title: "Production CI/CD & DevOps",
    badge: "DEPLOYMENT & OPS",
    desc: "Deploying high-reliability systems with Nginx reverse proxy, PM2 process clustering, and automated GitHub Actions CI/CD workflows.",
    chips: ["Nginx", "PM2", "GitHub Actions", "Zero Downtime"],
    accent: "#10b981"
  }
];

function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="section-index">02 / EXPERIENCE</div>
      <div className="experience-grid">
        <div className="experience-content">
          <h2 className="exp-tech-heading exp-anim-text">
            <span className="brand-accent">ENGINEERING</span> JOURNEY
          </h2>

          <div className="experience-bento-hub exp-anim-text">
            {/* Top Telemetry Bar */}
            <div className="bento-telemetry-bar">
              <div className="bento-status-pill">
                <span className="bento-pulse-dot" />
                <span>ACTIVE ROLE • DYNA4CAST TECHNOLOGIES</span>
              </div>
              <div className="bento-meta-pill">
                <span>2026 March  — PRESENT • COIMBATORE, TN</span>
              </div>
            </div>

            {/* Company & Role Header */}
            <div className="bento-header-info">
              <div className="bento-title-row">
                <h3 className="bento-company-name">
                  Dyna4cast Technologies <span className="bento-pvt-tag">Private Limited</span>
                </h3>
                <span className="bento-role-badge">FULL STACK DEVELOPER</span>
              </div>
              <p className="bento-lede-summary">
                Leading the engineering of production enterprise ERP products, full-stack application workflows, database-backed APIs, and deployment automation.
              </p>
            </div>

            {/* 3 Modular Workstream Capability Cards */}
            <div className="bento-pillars-grid">
              {experiencePillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div key={pillar.title} className="bento-pillar-card" style={{ "--pillar-accent": pillar.accent } as React.CSSProperties}>
                    <div className="pillar-header">
                      <div className="pillar-icon-box">
                        <IconComponent className="pillar-icon" />
                      </div>
                      <span className="pillar-badge">{pillar.badge}</span>
                    </div>
                    <h4 className="pillar-title">{pillar.title}</h4>
                    <p className="pillar-desc">{pillar.desc}</p>
                    <div className="pillar-chips-wrap">
                      {pillar.chips.map(chip => (
                        <span key={chip} className="pillar-chip">{chip}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Tech Stack Ribbon */}
            <div className="bento-stack-ribbon">
              <span className="ribbon-label">PRODUCTION STACK</span>
              <div className="ribbon-chips">
                {["React.js", "JavaScript", "Node.js", "Express.js", "MSSQL", "REST APIs", "Nginx", "GitHub Actions", "PM2"].map(tech => (
                  <span key={tech} className="ribbon-chip">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="experience-stage-spacer" aria-hidden="true" />
      </div>
    </section>
  );
}

const skillCategories = [
  { id: "ALL", label: "ALL", count: 35 },
  { id: "Languages", label: "Languages", count: 5 },
  { id: "Frontend", label: "Frontend", count: 9 },
  { id: "Backend", label: "Backend", count: 5 },
  { id: "Databases", label: "Databases", count: 5 },
  { id: "Tools & DevOps", label: "DevOps", count: 11 },
] as const;

function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const shockwaveRef = useRef<HTMLDivElement>(null);

  // Outer Orbit: Languages (5) + Tools & DevOps (11) = 16 items
  const outerSkills = [
    ...skillGroups[0].items.map(item => ({ item, group: skillGroups[0].label })),
    ...skillGroups[4].items.map(item => ({ item, group: skillGroups[4].label })),
  ];

  // Inner Orbit: Frontend (9) + Backend (5) + Databases (5) = 19 items
  const innerSkills = [
    ...skillGroups[1].items.map(item => ({ item, group: skillGroups[1].label })),
    ...skillGroups[2].items.map(item => ({ item, group: skillGroups[2].label })),
    ...skillGroups[3].items.map(item => ({ item, group: skillGroups[3].label })),
  ];

  const outerNodes = outerSkills.map((node, i) => {
    const angleDeg = -90 + (i * 360) / outerSkills.length;
    const rad = (angleDeg * Math.PI) / 180;
    const x = +(50 + Math.cos(rad) * 47).toFixed(2);
    const y = +(50 + Math.sin(rad) * 47).toFixed(2);
    const clockAngle = +((i * 360) / outerSkills.length).toFixed(2);
    return { ...node, x, y, clockAngle, orbit: "outer" };
  });

  const innerNodes = innerSkills.map((node, j) => {
    const offsetDeg = 9.47;
    const angleDeg = -90 + offsetDeg + (j * 360) / innerSkills.length;
    const rad = (angleDeg * Math.PI) / 180;
    const x = +(50 + Math.cos(rad) * 35.5).toFixed(2);
    const y = +(50 + Math.sin(rad) * 35.5).toFixed(2);
    const clockAngle = +(((j * 360) / innerSkills.length + offsetDeg) % 360).toFixed(2);
    return { ...node, x, y, clockAngle, orbit: "inner" };
  });

  const allNodes = [...outerNodes, ...innerNodes];
  const activeCount = activeCategory === "ALL"
    ? allNodes.length
    : allNodes.filter(n => n.group === activeCategory).length;

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    if (shockwaveRef.current) {
      shockwaveRef.current.classList.remove("trigger-shockwave");
      void shockwaveRef.current.offsetWidth;
      shockwaveRef.current.classList.add("trigger-shockwave");
    }
  };

  return (
    <section id="skills" className="section skills-section">

      {/* Technical Heading & Subtitle - Full Left Aligned like Experience */}
      <div className="skills-header-block">
        <h2 className="exp-tech-heading skills-anim-heading">
          <span className="brand-accent">CORE</span> STACK
        </h2>
        <p className="skills-lede-sub skills-anim-sub">
          Technologies I build with every day — from interface logic to cloud orchestration.
        </p>
      </div>

      {/* 3-Column Skills Stage Grid: [Left: Presenter Character] [Center: Technology Orbit] [Right: Vertical Filter Dock] */}
      <div className="skills-stage-grid">
        {/* Left Column on Desktop: Presenter Character Stage Spacer */}
        <div className="skills-presenter-spacer" aria-hidden="true">
          <div className="presenter-floor-halo" />
        </div>

        {/* Center Column on Desktop: The Technology Orbit */}
        <div className="technology-orbit-wrapper">
          <div className="technology-orbit" data-cursor="EXPLORE">
            {/* Phase 9: Rotating Gradient Ring, Thin Neon Stroke & Glow */}
            <div className="orbit-glow-ring" aria-hidden="true" />
            <div className="orbit-ring orbit-ring-outer" aria-hidden="true" />
            <div className="orbit-ring orbit-ring-inner" aria-hidden="true" />
            <div className="orbit-ring orbit-ring-radar" aria-hidden="true" />

            {/* Phase 4: Meaningful Central Badge */}
            <div className="constellation-core-hud" aria-hidden="true">
              <div className="hud-ring-spinner" />
              <span className="hud-badge">ARCHITECT // STACK</span>
              <strong className="hud-category">
                {activeCategory === "ALL" ? "FULL STACK" : activeCategory.toUpperCase()}
              </strong>
              <span className="hud-status">
                <i className="hud-dot" /> {activeCount} CAPABILITIES
              </span>
            </div>

            {/* Phase 7 & 9: Purple Radial Energy Splash Pulse */}
            <div ref={shockwaveRef} className="constellation-shockwave" aria-hidden="true" />

            {/* Phase 5: All 35 Technology Nodes with Logos & Tooltips */}
            {allNodes.map(node => {
              const isSelected = activeCategory === "ALL" || node.group === activeCategory;
              return (
                <button
                  key={node.item}
                  className={`skill-node-pro ${node.orbit} ${isSelected ? "is-active" : "is-dimmed"}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                  data-clock-angle={node.clockAngle}
                  aria-label={`${node.item}, ${node.group}`}
                >
                  <span className="skill-icon-wrap">
                    <SkillIcon name={node.item} className="skill-node-svg" />
                  </span>
                  <span className="skill-name">{node.item}</span>
                  <span className="skill-tooltip" aria-hidden="true">
                    {node.group} • {node.item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column on Desktop: Vertical Cyber Filter Dock */}
        <aside className="skills-vertical-dock" role="tablist" aria-label="Technology category filter">
          <div className="dock-header">
            <span className="dock-telemetry-tag">FILTER // STACK</span>
          </div>
          <div className="dock-pill-stack">
            {skillCategories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`dock-filter-pill ${isActive ? "is-active" : ""}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  <span className="dock-pill-indicator">
                    <span className="dock-pulse-dot" />
                  </span>
                  <span className="dock-cat-name">{cat.label}</span>
                  <span className="dock-count-badge">{cat.count}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Projects() {
  return <section id="projects" className="projects-section"><div className="section project-heading"><div className="section-index">04 / SELECTED WORK</div><h2 className="display-heading">BUILT TO<br />SOLVE.</h2><p>Products and engineering concepts shaped around real workflows.</p></div><div className="project-stack">{projects.map((project, index) => <article key={project.name} className="project-card" style={{ top: `${88 + index * 12}px`, zIndex: index + 1 }} data-cursor="VIEW"><div className="project-image"><img src={project.image} alt={project.alt} width={1280} height={800} loading="lazy" /><div className="project-number">{project.number}</div></div><div className="project-content"><div><p className="project-category">{project.category}</p><h3>{project.name}</h3>{project.note && <p className="project-note">{project.note}</p>}</div><p className="project-description">{project.description}</p><ul className="project-features">{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul><div className="project-footer"><div className="stack-list">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div>{project.href && <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.label}: ${project.name}`}>{project.label} <ArrowUpRight /></a>}</div></div></article>)}</div></section>;
}

function Process() {
  return (
    <section id="process" className="process-outer-section">
      <Bento16 />
    </section>
  );
}

function StackWall() {
  return <section className="stack-wall" aria-label="Engineering stack">{["REACT", "NODE", "MSSQL", "JAVASCRIPT", "TYPESCRIPT", "REST API", "GIT", "NGINX"].map((item, i) => <div key={item} className={i % 2 ? "align-right" : ""}><span>{item}</span></div>)}</section>;
}

function GithubSection() {
  const codeSample = `const product = build({
  frontend: "React",
  backend: "Node.js",
  database: "MSSQL",
  mindset: "problem solving"
});`;
  return <section className="section github-section"><div><div className="section-index">06 / OPEN SOURCE</div><h2 className="display-heading">BUILT IN<br />PUBLIC</h2><p>Experiments, utilities and product work — documented in code.</p><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">github.com/manojrajm <ArrowUpRight /></a></div><div className="code-window" aria-label="Visual code example"><div className="code-toolbar"><i /><i /><i /><span>product.ts</span></div><pre><code>{codeSample}</code></pre></div></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTimeString(new Intl.DateTimeFormat("en-US", istOptions).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("gauthamtamizha007@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <footer id="contact" className="contact-section">
      {/* Background 2D Global Dot Matrix World Map with Neon Purple Radar Hubs */}
      <div className="contact-map-backdrop" aria-hidden="true">
        <img
          src="/images/contact-world-map-dark.png"
          alt=""
          className="contact-map-image"
          width={1024}
          height={503}
          loading="lazy"
        />
      </div>

      <div className="contact-content">
        {/* Telemetry Header Ribbon */}
        <div className="contact-telemetry-row">
          <div className="telemetry-pill status-available">
            <span className="telemetry-dot pulse-dot" />
            <span>AVAILABLE FOR GLOBAL ROLES &amp; CONTRACTS</span>
          </div>
          {timeString && (
            <div className="telemetry-pill">
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>COIMBATORE: {timeString} IST</span>
            </div>
          )}

        </div>


        <h2 className="contact-main-heading">
          LET&apos;S BUILD<br />
          <span>SOMETHING.</span>
        </h2>

        <p className="contact-lede">
          Have an idea, product, or enterprise engineering problem worth solving? From modern React interfaces to scalable MSSQL &amp; Node.js APIs, and containerized CI/CD pipelines — let&apos;s build it together.
        </p>

        {/* 1-Click Interactive Copy Email Action Card */}
        {/* <div className="contact-email-bar">
          <div className="contact-email-address">
            <Mail className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="font-mono text-xs sm:text-sm text-neutral-200">
              gauthamtamizha007@gmail.com
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className={`contact-copy-action ${copied ? "is-copied" : ""}`}
            aria-label="Copy email address"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-neutral-400" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div> */}

        {/* Direct Connect Actions */}
        <div className="contact-links">
          <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
            <Linkedin /> LinkedIn
          </a>
          <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <Github /> GitHub
          </a>
          <a href={EMAIL} aria-label="Send direct email">
            <Mail /> Direct Mail
          </a>
        </div>
      </div>

      <div className="footer-line">
        <span>
          <span className="brand-accent">M</span>ANOJ<span className="brand-accent">R</span>AJ
        </span>
        <span>FULL STACK DEVELOPER &amp; DEVOPS ARCHITECT</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  const reduced = useReducedMotion() ?? false;
  useEffect(() => {
    let cleanup = () => { };
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".reveal-text, .section-index, .display-heading").forEach(el => gsap.from(el, { opacity: 0, y: 50, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));

        // About Section: Left-to-Right Slide & Fade-In with GSAP ScrollTrigger
        gsap.fromTo(
          ".about-anim-text",
          { opacity: 0, x: -85, filter: "blur(6px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 1.0,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-copy",
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Experience Section: Bottom-to-Top Fade-In with GSAP ScrollTrigger
        gsap.fromTo(
          ".exp-anim-text",
          { opacity: 0, y: 70, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.0,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#experience",
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Bento Pillar Cards: Bottom-to-Top Staggered Fade-In
        gsap.fromTo(
          ".bento-pillar-card",
          { opacity: 0, y: 55, scale: 0.96, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".experience-bento-hub",
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Skills Section: Clockwise Sequential Reveal & Shockwave Splash Blast
        const skillNodes = gsap.utils.toArray<HTMLElement>(".skill-node-pro");
        if (skillNodes.length > 0) {
          skillNodes.sort((a, b) => {
            const angleA = parseFloat(a.dataset["clockAngle"] || "0");
            const angleB = parseFloat(b.dataset["clockAngle"] || "0");
            return angleA - angleB;
          });

          const skillsTl = gsap.timeline({
            scrollTrigger: {
              trigger: "#skills",
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          // 1. Heading, subtitle, and vertical filter dock entrance
          skillsTl.fromTo(
            ".skills-anim-heading, .skills-anim-sub, .skills-vertical-dock",
            { opacity: 0, y: 35, filter: "blur(5px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              stagger: 0.1,
              ease: "power2.out",
            }
          );

          // 2. Central Badge & Orbit Rings entrance
          skillsTl.fromTo(
            ".constellation-core-hud, .orbit-glow-ring",
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.8)",
            },
            "-=0.3"
          );

          // 3. Phase 7: 8-Sector Clockwise Reveal Sequence (Scale 0.6 -> 1, rotation, soft bounce)
          skillsTl.fromTo(
            skillNodes,
            { scale: 0.6, opacity: 0, rotation: -8, filter: "blur(4px)" },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              filter: "blur(0px)",
              duration: 0.55,
              stagger: 0.035, // Smooth clockwise ripple through 35 nodes (~1.2s total)
              ease: "back.out(1.8)", // Soft bounce
            },
            "-=0.2"
          );

          // 4. Phase 7: Final Purple Splash Pulse around full circle (+200ms after reveal)
          skillsTl.fromTo(
            ".constellation-shockwave",
            { scale: 0.2, opacity: 0.95 },
            {
              scale: 2.8,
              opacity: 0,
              duration: 1.25,
              ease: "power2.out",
            },
            "+=0.2"
          );
        }

        // Projects Multi-Plane Parallax & Stacking Recede Engine
        const projectCards = gsap.utils.toArray<HTMLElement>(".project-card");
        projectCards.forEach((card, index) => {
          // 1. Inner Image Parallax Scrub (image glides inside overflow container)
          const img = card.querySelector<HTMLElement>(".project-image img");
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -14 },
              {
                yPercent: 14,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }

          // 2. Floating Project Number Counter-Parallax
          const numBadge = card.querySelector<HTMLElement>(".project-number");
          if (numBadge) {
            gsap.to(numBadge, {
              yPercent: -22,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          // 3. Stacking Card Recede: As card i+1 stacks on top, card i scales down and dims smoothly
          if (index < projectCards.length - 1) {
            const nextCard = projectCards[index + 1];
            if (nextCard) {
              gsap.to(card, {
                scale: 0.94,
                opacity: 0.55,
                filter: "blur(1.5px) brightness(0.65)",
                ease: "none",
                scrollTrigger: {
                  trigger: nextCard,
                  start: "top 75%",
                  end: "top 18%",
                  scrub: true,
                },
              });
            }
          }
        });

        gsap.utils.toArray<HTMLElement>(".stack-wall div").forEach((el, i) => gsap.fromTo(el, { xPercent: i % 2 ? 18 : -18, filter: "blur(8px)" }, { xPercent: 0, filter: "blur(0px)", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom center", scrub: 1 } }));
        gsap.to(".marquee-forward span", { xPercent: -18, ease: "none", scrollTrigger: { trigger: ".marquee-section", scrub: 1 } });
        gsap.fromTo(".marquee-reverse span", { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".marquee-section", scrub: 1 } });
      });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
      cleanup = () => ctx.revert();
    });
    return () => cleanup();
  }, []);
  return (
    <div className="portfolio">
      <div className="hero-canvas" data-cursor="EXPLORE">
        <ClientOnly fallback={<div className="scene-fallback" />}>
          <Suspense fallback={<div className="scene-fallback" />}>
            <PersistentExperience reducedMotion={reduced} />
          </Suspense>
        </ClientOnly>
      </div>
      <TerminalLoader />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Process />
        <StackWall />
        <GithubSection />
      </main>
      <Contact />
    </div>
  );
}
