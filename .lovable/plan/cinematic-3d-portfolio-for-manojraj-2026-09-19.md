# Cinematic 3D Portfolio for ManojRaj

## Direction
Build a single, immersive scrolling portfolio at `/` with an almost-black cinematic environment, editorial typography, restrained violet/indigo light, metallic surfaces, and a custom software-engineering 3D language. The experience will remain content-first and accessible, with reduced complexity on smaller devices and reduced-motion preferences.

## Experience
- Create a 100vh opening scene with a responsive 3D “digital core” showing the flow from code to API to database to product, plus mouse parallax and scroll-driven camera movement.
- Add the short MR loading reveal, minimal navigation, fullscreen mobile menu, magnetic actions, custom desktop cursor, and smooth section navigation.
- Build the opposing technology marquees, editorial About section, scroll-activated Experience timeline, reactive 3D skills constellation, and sticky cinematic project cases.
- Add tailored visual treatments for VizhaBook, Bharani ERP, Thaina, SkillPulse, and LockRAG without unsupported claims or fabricated metrics.
- Build the “From Idea to Production,” engineering stack, GitHub/code, and dramatic contact sections.

## Technical Approach
- Use React Three Fiber and Drei for procedural 3D scenes; no external model is needed because the core, constellation, and abstract project visuals are intentionally generated geometry.
- Use GSAP ScrollTrigger for scroll choreography and Motion for interface transitions, menus, and reveals.
- Keep portfolio content in typed data modules and split the page into focused section/scene components.
- Use semantic design tokens in the global stylesheet, local font loading in the root document, and route-level metadata.
- Add responsive DPR, demand-aware animation, lazy section rendering, reduced-motion behavior, touch-safe interactions, keyboard focus states, and semantic landmarks.

## Verification
- Check the build signal and runtime console.
- Verify desktop and mobile layouts in the browser, including the 3D scene, sticky projects, navigation, and lack of horizontal overflow.
- Confirm all public links and copy use only verified or user-provided facts.
