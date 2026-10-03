import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface LogEntry {
  time: string;
  type: "sys" | "font" | "mesh" | "tex" | "shader" | "devops" | "r3f" | "status" | "ready";
  asset: string;
  status: string;
  statusColor?: string;
}

const BOOT_LOGS: LogEntry[] = [
  { time: "0.000s", type: "sys", asset: "TanStack Start SSR Kernel (Node v24.13)", status: "ok ✓" },
  { time: "0.012s", type: "font", asset: "Space Grotesk 700 Display", status: "ok ✓" },
  { time: "0.024s", type: "font", asset: "JetBrains Mono Code Edition", status: "ok ✓" },
  { time: "0.041s", type: "mesh", asset: "/models/character/Char.glb [65-Bone Rig]", status: "1.8 MB ✓", statusColor: "#eab308" },
  { time: "0.058s", type: "tex", asset: "/images/projects/bharani-erp.jpg [MSSQL/ERP]", status: "202 KB ✓", statusColor: "#eab308" },
  { time: "0.072s", type: "tex", asset: "/images/projects/lockrag.jpg [FastAPI/Chroma]", status: "129 KB ✓", statusColor: "#eab308" },
  { time: "0.086s", type: "tex", asset: "/images/projects/vizhabook.jpg [Tamil Culture]", status: "115 KB ✓", statusColor: "#eab308" },
  { time: "0.099s", type: "tex", asset: "/images/projects/skillpulse.jpg [React 19 Realtime]", status: "107 KB ✓", statusColor: "#eab308" },
  { time: "0.114s", type: "tex", asset: "/images/contact-world-map-dark.png [Telemetry]", status: "84 KB ✓", statusColor: "#eab308" },
  { time: "0.128s", type: "shader", asset: "StudioLighting & PBR Lightformers", status: "cache ✓", statusColor: "#38bdf8" },
  { time: "0.144s", type: "devops", asset: "Docker Engine Container Virtualization", status: "ok ✓" },
  { time: "0.162s", type: "r3f", asset: "65-Bone Rigged Humanoid FK Pipeline", status: "ready ✓", statusColor: "#c084fc" },
  { time: "0.180s", type: "status", asset: "Telemetry Link Established [Coimbatore, IN]", status: "ok ✓" },
  { time: "0.198s", type: "ready", asset: "SYSTEM INITIALIZED — LAUNCHING ARCHITECT...", status: "100% ✓", statusColor: "#10b981" },
];

const ASCII_MR = [
  "███╗   ███╗ ██████╗ ",
  "████╗ ████║ ██╔══██╗",
  "██╔████╔██║ ██████╔╝",
  "██║╚██╔╝██║ ██╔══██╗",
  "██║ ╚═╝ ██║ ██║  ██║",
  "╚═╝     ╚═╝ ╚═╝  ╚═╝",
];

const CODE_LINES = [
  "const architect: Developer = {",
  '  name: "ManojRaj",',
  '  role: "Full Stack Developer & DevOps Architect",',
  '  location: "Coimbatore, India",',
  '  frontend: ["React 19", "Three.js", "TailwindCSS"],',
  '  backend: ["Node.js", "Express", "MSSQL", "REST APIs"],',
  '  devops: ["Docker", "CI/CD", "Linux", "Git"],',
  '  status: "READY_FOR_ENGAGEMENT",',
  "};",
];

export function TerminalLoader({ onComplete }: { onComplete?: () => void }) {
  const { progress: r3fProgress } = useProgress();
  const [visible, setVisible] = useState(true);
  const [displayedLogsCount, setDisplayedLogsCount] = useState(1);
  const [codeLineIndex, setCodeLineIndex] = useState(0);
  const [cursorBlink, setCursorBlink] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Blinking cursor
  useEffect(() => {
    const timer = setInterval(() => setCursorBlink((v) => !v), 450);
    return () => clearInterval(timer);
  }, []);

  // Progressive log reveal
  useEffect(() => {
    const totalLogs = BOOT_LOGS.length;
    const interval = setInterval(() => {
      setDisplayedLogsCount((prev) => {
        if (prev < totalLogs) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 110);

    return () => clearInterval(interval);
  }, []);

  // Progressive code line reveal
  useEffect(() => {
    const codeInterval = setInterval(() => {
      setCodeLineIndex((prev) => {
        if (prev < CODE_LINES.length) {
          return prev + 1;
        }
        clearInterval(codeInterval);
        return prev;
      });
    }, 140);

    return () => clearInterval(codeInterval);
  }, []);

  // Compute combined progress
  const simulatedProgress = Math.min(
    100,
    Math.round((displayedLogsCount / BOOT_LOGS.length) * 100)
  );
  const effectiveProgress = Math.max(simulatedProgress, Math.round(r3fProgress || 0));

  // Exit trigger once all logs are displayed and assets ready
  useEffect(() => {
    if (displayedLogsCount >= BOOT_LOGS.length && effectiveProgress >= 100) {
      const exitTimer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 550);
      return () => clearTimeout(exitTimer);
    }
    return undefined;
  }, [displayedLogsCount, effectiveProgress, onComplete]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [displayedLogsCount]);

  const displayedLogs = useMemo(() => {
    return BOOT_LOGS.slice(0, displayedLogsCount);
  }, [displayedLogsCount]);

  const progressBar = useMemo(() => {
    const totalChars = 32;
    const filledChars = Math.round((effectiveProgress / 100) * totalChars);
    const emptyChars = totalChars - filledChars;
    return "█".repeat(filledChars) + "░".repeat(emptyChars);
  }, [effectiveProgress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="terminal-loader-overlay"
          initial={{ y: 0, opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
          aria-label="System Boot Sequence Loader"
        >
          {/* Top Window Header */}
          <div className="terminal-header-bar">
            <div className="terminal-traffic-lights">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="terminal-header-title">
              <span className="terminal-host">manojraj@digital-architect</span>
              <span className="terminal-sep">:</span>
              <span className="terminal-path">~/kernel/boot.sh</span>
            </div>
            <div className="terminal-header-badge">
              <span className="terminal-pulse-dot" />
              <span className="terminal-badge-text">SYSTEM_BOOT</span>
            </div>
          </div>

          {/* Main Terminal Split Body */}
          <div className="terminal-body-grid">
            {/* Left Side: Boot Telemetry Stream */}
            <div className="terminal-logs-pane" ref={logsContainerRef}>
              <div className="terminal-logs-inner">
                {displayedLogs.map((log, idx) => (
                  <div key={`log-${idx}`} className="terminal-log-line">
                    <span className="log-timestamp">[{log.time}]</span>
                    <span className={`log-type log-type-${log.type}`}>
                      {log.type.padEnd(7, " ")}
                    </span>
                    <span className="log-asset">{log.asset}</span>
                    <span className="log-dots">
                      {".".repeat(
                        Math.max(4, 38 - Math.min(32, log.asset.length))
                      )}
                    </span>
                    <span
                      className="log-status"
                      style={{ color: log.statusColor || "#10b981" }}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}

                {displayedLogsCount < BOOT_LOGS.length && (
                  <div className="terminal-cursor-line">
                    <span className="log-timestamp">[....]</span>
                    <span className="log-type">loading</span>
                    <span className="terminal-cursor-char">
                      {cursorBlink ? "█" : " "}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Big ASCII "MR" + Code Matrix Block */}
            <div className="terminal-right-pane">
              {/* ASCII Art Logo */}
              <div className="terminal-ascii-wrapper" aria-hidden="true">
                <pre className="terminal-ascii-art">
                  {ASCII_MR.map((line, i) => (
                    <div key={`ascii-${i}`} className="terminal-ascii-row">
                      <span className="ascii-gradient-text">{line}</span>
                    </div>
                  ))}
                </pre>
                <div className="terminal-sub-branding">
                  <span className="brand-primary">MANOJ</span>
                  <span className="brand-secondary">RAJ</span>
                  <span className="brand-dot">·</span>
                  <span className="brand-caption">DIGITAL ARCHITECT</span>
                </div>
              </div>

              {/* Live Code Matrix Box */}
              <div className="terminal-code-box">
                <div className="code-box-header">
                  <span className="code-box-file">architect.config.ts</span>
                  <span className="code-box-lang">TypeScript</span>
                </div>
                <pre className="code-box-content font-mono">
                  {CODE_LINES.slice(0, codeLineIndex).map((line, i) => (
                    <div key={`c-${i}`} className="code-row">
                      <span className="code-lineno">{String(i + 1).padStart(2, " ")}</span>
                      <span className="code-text">{line}</span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* System Spec Matrix */}
              <div className="terminal-matrix-hud">
                <div className="hud-metric">
                  <span className="hud-metric-label">KERNEL:</span>
                  <span className="hud-metric-val">NODE v24.13.1</span>
                </div>
                <div className="hud-metric">
                  <span className="hud-metric-label">3D ENGINE:</span>
                  <span className="hud-metric-val text-purple-400">R3F / THREE.JS</span>
                </div>
                <div className="hud-metric">
                  <span className="hud-metric-label">DEPLOYMENT:</span>
                  <span className="hud-metric-val text-cyan-400">DOCKER CONTAINER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Terminal Status Footer */}
          <div className="terminal-footer-bar">
            <div className="terminal-footer-left">
              <span className="footer-label">PROGRESS:</span>
              <span className="footer-bar font-mono">[{progressBar}]</span>
              <span className="footer-percent font-mono">{effectiveProgress}%</span>
            </div>
            <div className="terminal-footer-right">
              {effectiveProgress >= 100 ? (
                <span className="footer-status-done text-emerald-400">
                  ● SYSTEM READY — PRESS ANY KEY OR SCROLL
                </span>
              ) : (
                <span className="footer-status-loading text-amber-400">
                  ◐ MOUNTING HIGH-PERFORMANCE ASSETS...
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
