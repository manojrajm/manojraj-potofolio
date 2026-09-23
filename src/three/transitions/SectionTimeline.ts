import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SectionTimelineCallbacks {
  onEnterSection: (sectionName: string, progress: number) => void;
  onUpdateProgress: (sectionName: string, progress: number) => void;
}

/**
 * initSectionTimelines:
 * Centralized GSAP ScrollTrigger timeline manager orchestrating
 * smooth character transitions across all portfolio sections.
 */
export function initSectionTimelines(callbacks: SectionTimelineCallbacks): () => void {
  const sections = ["top", "about", "experience", "skills", "projects", "contact"];
  const triggers: ScrollTrigger[] = [];

  sections.forEach((secId) => {
    const el = document.getElementById(secId);
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      onEnter: () => callbacks.onEnterSection(secId, 0),
      onEnterBack: () => callbacks.onEnterSection(secId, 1),
      onUpdate: (self) => callbacks.onUpdateProgress(secId, self.progress),
    });

    triggers.push(trigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
  };
}
