import { ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { experiencePoints, navItems, projects, skillGroups } from "@/data/portfolio";

const HeroScene = lazy(() => import("@/components/canvas/HeroScene"));
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

function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const next = Math.min(100, Math.round(((time - start) / 900) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setVisible(false), 180);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <AnimatePresence>{visible && <motion.div className="loader" initial={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}><div className="loader-mark">MR</div><div className="loader-name">MANOJRAJ <span>FULL STACK DEVELOPER</span></div><div className="loader-progress">{String(progress).padStart(3, "0")}%</div></motion.div>}</AnimatePresence>;
}

function Cursor() {
  const [state, setState] = useState({ x: -50, y: -50, label: "" });
  useEffect(() => {
    const move = (event: globalThis.MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setState({ x: event.clientX, y: event.clientY, label: target?.dataset.cursor ?? "" });
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
      <a className="brand" href="#top" aria-label="ManojRaj home">MANOJRAJ<span>.</span></a>
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
  return <section id="top" className="hero" aria-labelledby="hero-title">
    <div className="hero-canvas" data-cursor="EXPLORE"><ClientOnly fallback={<div className="scene-fallback" />}><Suspense fallback={<div className="scene-fallback" />}><HeroScene reducedMotion={reduced} /></Suspense></ClientOnly></div>
    <div className="hero-vignette" />
    <motion.div className="hero-copy" style={reduced ? undefined : { y, opacity }}>
      <p className="eyebrow">The engineer / 2026</p>
      <h1 id="hero-title">I BUILD<br/><span>DIGITAL SYSTEMS.</span></h1>
      <p className="hero-lede">Full Stack Developer crafting scalable web applications, ERP platforms and SaaS products.</p>
      <div className="hero-actions"><MagneticLink href="#projects">View my work <ArrowDown /></MagneticLink><MagneticLink href="#contact" variant="cinematicOutline">Let&apos;s connect <ArrowUpRight /></MagneticLink></div>
    </motion.div>
    <div className="hero-meta"><span>Coimbatore, India</span><span>Full Stack Developer</span><span>React • Node • MSSQL</span></div>
    <a className="scroll-cue" href="#about">Scroll to explore <ArrowDown /></a>
  </section>;
}

function Marquee() {
  return <section className="marquee-section" aria-label="Core disciplines"><div className="marquee marquee-forward"><span>BUILD • SHIP • SCALE • AUTOMATE • BUILD • SHIP • SCALE • AUTOMATE •</span></div><div className="marquee marquee-reverse"><span>REACT • NODE.JS • MSSQL • JAVASCRIPT • SAAS • ERP • REACT • NODE.JS • MSSQL •</span></div></section>;
}

function About() {
  return <section id="about" className="section about-section"><div className="section-index">01 / ABOUT</div><div className="about-grid"><h2 className="display-heading reveal-text">ABOUT<br/>ME</h2><div className="about-copy"><p>I’m Manoj Raj, a Full Stack Developer focused on building practical, scalable software products. I work across modern frontend interfaces, backend APIs, databases and deployment workflows — turning business processes into reliable digital systems.</p><p>My experience includes building ERP workflows, SaaS products, real-time interfaces and database-backed applications using React, Node.js, Express.js and Microsoft SQL Server.</p><dl className="facts"><div><dt>Based in</dt><dd>Coimbatore, Tamil Nadu</dd></div><div><dt>Education</dt><dd>B.Tech / B.E. Information Technology — 2024</dd></div><div><dt>Currently</dt><dd>Dyna4cast Technologies</dd></div></dl></div><div className="glass-cube" aria-hidden="true"><div>REACT</div><div>NODE</div><div>SQL</div><div>API</div></div></div></section>;
}

function Experience() {
  return <section id="experience" className="section experience-section"><div className="section-index">02 / EXPERIENCE</div><h2 className="display-heading">EXPERIENCE</h2><div className="timeline"><div className="timeline-rail"><span /></div><article><div className="timeline-top"><p>Present</p><p>Coimbatore, Tamil Nadu</p></div><h3>Dyna4cast Technologies<br/><span>Private Limited</span></h3><p className="role">Full Stack Developer</p><div className="experience-body"><ul>{experiencePoints.map(point => <li key={point}>{point}</li>)}</ul><div className="tech-cloud">{["React.js","JavaScript","Node.js","Express.js","MSSQL","REST APIs","Nginx","GitHub Actions","PM2"].map(item => <span key={item}>{item}</span>)}</div></div></article></div></section>;
}

function Skills() {
  const all = skillGroups.flatMap(group => group.items.map(item => ({ item, group: group.label })));
  return <section id="skills" className="section skills-section"><div className="section-index">03 / CAPABILITIES</div><div className="skills-intro"><h2 className="display-heading">SYSTEM<br/>ARCHITECTURE</h2><p>A connected full-stack toolkit — from interface logic to production infrastructure.</p></div><div className="constellation" data-cursor="EXPLORE"><div className="constellation-core"><span>FULL STACK</span>MANOJRAJ</div>{all.map(({item, group}, i) => <button key={item} className="skill-node" style={{ "--i": i, "--total": all.length } as React.CSSProperties} aria-label={`${item}, ${group}`}><small>{group}</small>{item}</button>)}</div></section>;
}

function Projects() {
  return <section id="projects" className="projects-section"><div className="section project-heading"><div className="section-index">04 / SELECTED WORK</div><h2 className="display-heading">BUILT TO<br/>SOLVE.</h2><p>Products and engineering concepts shaped around real workflows.</p></div><div className="project-stack">{projects.map((project, index) => <article key={project.name} className="project-card" style={{ top: `${88 + index * 12}px`, zIndex: index + 1 }} data-cursor="VIEW"><div className="project-image"><img src={project.image} alt={project.alt} width={1280} height={800} loading="lazy"/><div className="project-number">{project.number}</div></div><div className="project-content"><div><p className="project-category">{project.category}</p><h3>{project.name}</h3>{project.note && <p className="project-note">{project.note}</p>}</div><p className="project-description">{project.description}</p><ul className="project-features">{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul><div className="project-footer"><div className="stack-list">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div>{project.href && <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.label}: ${project.name}`}>{project.label} <ArrowUpRight /></a>}</div></div></article>)}</div></section>;
}

function Process() {
  const stages = [["01","DISCOVER","Understand the workflow and problem."],["02","DESIGN","Turn the workflow into a clear user experience."],["03","BUILD","Develop frontend, APIs, database and integrations."],["04","DEPLOY","Test, optimize and deploy production-ready software."]] as const;
  return <section className="section process-section"><div className="section-index">05 / PROCESS</div><h2 className="display-heading">FROM IDEA TO<br/>PRODUCTION</h2><div className="process-grid">{stages.map(([n,title,copy]) => <article key={title}><span>{n}</span><div className="process-shape" aria-hidden="true"/><h3>{title}</h3><p>{copy}</p></article>)}</div></section>;
}

function StackWall() {
  return <section className="stack-wall" aria-label="Engineering stack">{["REACT","NODE","MSSQL","JAVASCRIPT","TYPESCRIPT","REST API","GIT","NGINX"].map((item,i) => <div key={item} className={i % 2 ? "align-right" : ""}><span>{item}</span></div>)}</section>;
}

function GithubSection() {
  return <section className="section github-section"><div><div className="section-index">06 / OPEN SOURCE</div><h2 className="display-heading">BUILT IN<br/>PUBLIC</h2><p>Experiments, utilities and product work — documented in code.</p><a className="text-link" href={GITHUB} target="_blank" rel="noreferrer">github.com/manojrajm <ArrowUpRight /></a></div><div className="code-window" aria-label="Visual code example"><div className="code-toolbar"><i/><i/><i/><span>product.ts</span></div><pre><code><span>const</span> product = build({`\n`}  frontend: <em>&quot;React&quot;</em>,{`\n`}  backend: <em>&quot;Node.js&quot;</em>,{`\n`}  database: <em>&quot;MSSQL&quot;</em>,{`\n`}  mindset: <em>&quot;problem solving&quot;</em>{`\n`}});</code></pre></div></section>;
}

function Contact() {
  return <footer id="contact" className="contact-section"><div className="contact-orbit" aria-hidden="true"><i/><i/><i/></div><div className="contact-content"><div className="section-index">07 / CONTACT</div><h2>LET&apos;S BUILD<br/><span>SOMETHING.</span></h2><p>Have an idea, product or engineering problem worth solving?</p><div className="contact-links"><a href={LINKEDIN} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a><a href={GITHUB} target="_blank" rel="noreferrer"><Github/> GitHub</a><a href={EMAIL}><Mail/> Email</a></div></div><div className="footer-line"><span>MANOJRAJ</span><span>FULL STACK DEVELOPER</span><span>© 2026</span></div></footer>;
}

export default function PortfolioPage() {
  useEffect(() => {
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".reveal-text, .section-index, .display-heading").forEach(el => gsap.from(el, { opacity: 0, y: 50, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
        gsap.utils.toArray<HTMLElement>(".stack-wall div").forEach((el, i) => gsap.fromTo(el, { xPercent: i % 2 ? 18 : -18, filter: "blur(8px)" }, { xPercent: 0, filter: "blur(0px)", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom center", scrub: 1 } }));
        gsap.to(".marquee-forward span", { xPercent: -18, ease: "none", scrollTrigger: { trigger: ".marquee-section", scrub: 1 } });
        gsap.fromTo(".marquee-reverse span", { xPercent: -18 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".marquee-section", scrub: 1 } });
      });
      cleanup = () => ctx.revert();
    });
    return () => cleanup();
  }, []);
  return <div className="portfolio"><Loader/><Cursor/><Navbar/><main><Hero/><Marquee/><About/><Experience/><Skills/><Projects/><Process/><StackWall/><GithubSection/></main><Contact/></div>;
}
