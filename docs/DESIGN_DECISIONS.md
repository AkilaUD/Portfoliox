# Design Decision Log: The Engineering Ledger

Short research pass completed before implementation, per section 43 of the master brief.
References were studied for principles only. Nothing below is copied structurally or visually.

## Researched references

| Reference | What was learned | What will NOT be copied | How it becomes unique for Akila |
| --- | --- | --- | --- |
| Editorial CSS typography (text-wrap, clamp scales, optical sizing; Carmen Ansio, 2026) | A page reads as "set by someone" when headings are balanced, paragraphs use `text-wrap: pretty`, and the scale is fluid `clamp()` tokens. | Serif-revival display faces, drop caps, magazine ornament. | A grotesk display face with ledger-style hairline rules; the editorial feel comes from numbering, rows and marginal annotations rather than print ornament. |
| Restrained monochrome portfolios (oversized grotesk, mono slash-labels) | Mono slash-labels (`01 / LABEL`) plus one warm accent give structure without decoration. | Marquees, rotating role text, portrait photos, footer watermark words. | Slash-labels are used as *record identifiers* (TRACE 01, CASE FILE 02) tied to real CV content, not as ambient text. |
| Product-as-portfolio case studies (engineer sites that document their own build) | A portfolio earns credibility when it explains constraints and trade-offs. | Service/pricing pages, AI chatbots, theme customizers. | Case files answer the brief's seven case-study questions (system, domain, stack, contribution, problems, lifecycle stage, evidence) and nothing more. |
| GSAP + React guidance (`useGSAP`, `gsap.matchMedia`, 2026) | Scope ScrollTriggers to component context; branch on `(prefers-reduced-motion: reduce)` and skip pins entirely when reduced, because a pinned panel with no motion is dead scrolling. | Scroll-jacking, Lenis smooth scroll, liquid image reveals. | Only three pinned/scrubbed sequences exist, and each explains a process: career progression, loan lifecycle architecture, incident-to-release. |
| Awwwards-style interaction patterns (pinned horizontal rails, contextual cursors, section ground shifts) | A single colour-ground change mid-page is a strong chapter marker; contextual cursor labels help if they never obscure targets. | Full-screen preloaders, WebGL heroes, magnetic everything. | The page ground shifts once: the eFinancials case file turns to warm "ledger paper", making the production-system chapter feel like an archive. |

## Design decisions

**Typography.** Geist Variable for display and body; Geist Mono only for labels, metadata and identifiers. Display headings are large (up to ~9rem), tight tracking (-0.045em), mixed case, `text-wrap: balance`. Labels are 11–12px mono, uppercase, modest tracking (0.08em). Body copy is 16–18px, `text-wrap: pretty`, max ~62ch.

**Color.** Graphite `#0B0D0C` ground, charcoal `#141716` panels, paper `#F1EEE6` text and the one paper-ground chapter, soft gray `#A8AAA5` secondary text, line `#2B302D` hairlines, brass `#B88A42` for annotation ink and active states, signal green `#8AA66A` only for status markers. No gradients except a hairline fade on traces.

**Grid.** 12 columns, gutters of 1.5rem, page margins `clamp(1.25rem, 4vw, 4rem)`. Asymmetric composition: labels and record identifiers sit in the left 3 columns, content in columns 4–12. Sections are separated by numbered hairline rules, like ledger rows, with small deliberate offsets between chapters.

**Navigation.** Fixed, thin top rail: name on the left, four anchors on the right (Work, Systems, Trace, Contact), and a live section indicator (`§ 04 / TRACE`). Ctrl/Cmd+K opens an optional command palette. Everything is reachable without it.

**Motion.** One vocabulary with five states: idle (still), hover (2–4px shift, line extends), active (brass appears), transition (line connects to the next element), complete (small check marker).
- GSAP ScrollTrigger: career trace pin, FirstMicro diagram draw, eFinancials incident sequence.
- Motion (`motion/react`): command palette, contextual cursor, node focus states, copy confirmation, light entrances.
- CSS: focus rings, colour transitions, hover underlines.

**Project storytelling.** Three case files of decreasing weight: FirstMicro (architecture diagram, most expressive), eFinancials (ledger archive on paper ground), V-Deploy (small origin record). Each uses only CV facts.

**Mobile behavior.** Horizontal traces become vertical flows; hover becomes tap/focus; the custom cursor and pointer-reactive hero details are removed; decorative metadata is reduced; no pins below 768px except where content still reads naturally.

**Accessibility.** Semantic landmarks, one `h1`, ordered headings, skip link, visible brass focus rings, keyboard-operable diagram nodes (buttons), all hover-revealed content also visible on focus and present in the DOM. Reduced motion renders every diagram in its final drawn state and removes pins/scrubs.

**Performance.** No images or video. Self-hosted variable fonts (WOFF2, preloaded Latin subset). Animations use transform and opacity only. GSAP-driven sections are lazy-loaded below the fold. Target LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.

## Ember revision (owner request, Sep 2026)

The owner asked for more motion, stronger design craft, creative colour, their real portrait and LinkedIn data. This revision supersedes the Color, Motion and Performance decisions above, and deliberately reverses the earlier "no portrait / no WebGL / no Lenis / no marquee" choices.

**Sources of truth.** The CV plus the owner's public LinkedIn profile. From LinkedIn: the headline (C#, ASP.NET Core, Angular, Azure, SQL Server, FinTech & ERP) and the Scienter title progression (Associate Software Engineer, then Software Engineer). The promotion month is not shown until the owner confirms it. The Fiverr freelance entry is intentionally excluded.

**Color (Ember).** Warm near-black `#0A0807` ground, charcoal `#15100E`, cream `#F5ECDF` text, fog `#B8AB9C`, dim `#8F8377`, line `#2E2420`. Accents: ember `#FF6A2B`, flare `#F0457A`, gold `#FFB547`, plus a gold to ember to flare gradient used for emphasis words, progress, fills and the cursor. Paper chapter inks: ember-deep `#A8361A`, gold-deep `#7A5410`. Every text pair was checked at 4.5:1 or better, including the plum `#1C0E14` and ember-brown `#1A0C08` section grounds.

**Portrait.** The owner's real photo, cropped 4:5 on the face and flattened onto the charcoal frame colour (the source is a cutout) and shipped as AVIF/WebP (10–37 KB). It is the hero figure ("Fig. 00") and always renders as a real `<picture>`; the ledger artifact moved to the systems map rail.

**Motion vocabulary (expanded).**
- WebGL (ogl, lazy, ≥48rem, motion allowed, not Save-Data): an ember noise field behind the hero and a portrait shader with a gradient-map "heat lens" under the pointer, ripple, scroll-velocity RGB split and an entrance scan line. Pauses off-screen and on hidden tabs; DPR capped at 1.5.
- Intro: a 1.2 s counter and ember wipe, once per session, ≥48rem only; hero entrances wait for it.
- Lenis inertial scroll, synced with ScrollTrigger; disabled for reduced motion.
- SplitText kinetic headings: characters rise from word masks and cool from ember to cream.
- Page ground interpolates between graphite, plum (case files) and ember-brown (contact) through a registered `--ground` property; the eFinancials paper sheet widens into place as it enters.
- Velocity marquee of the CV stack, magnetic controls, CV figures that count up, an ember screen-blend cursor disc, gradient row fills and glowing tech nodes.

**Reduced motion.** No intro, WebGL, Lenis, kinetic text, marquee motion, counters or cursor disc; every diagram renders in its final state.

**Budget and legibility.** The WebGL field is damped across the lower strip of the hero, where the trace and metadata labels sit, so those labels stay at 4.5:1 or better. Kinetic headings split only when they come within one viewport of the fold and play from an IntersectionObserver instead of a ScrollTrigger. Choreographed sections share one ScrollTrigger refresh per frame, and the portrait shader compiles after the field is on screen. Lighthouse (local preview): mobile performance 89–94, desktop 93, accessibility, best practices and SEO 100, CLS 0.

## Owner-configured content

- LinkedIn: `https://www.linkedin.com/in/akilaudara96` (confirmed by owner).
- Phone: stored but hidden (`showPhone: false`).
- Availability: neutral conversation statement, no "open to work" claim.
- CV PDF: owner supplies `public/cv/Akila_Udara_CV.pdf`.
- Canonical domain: `SITE_URL` placeholder until a domain exists.
