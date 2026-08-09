# Polyhedron Project — Gap Analysis & Implementation Plan

*Generated: 2026-08-10 | Analyzer subagent*

---

## 1. Current File Structure & Build Process

### 1.1 Project Layout
```
/c/Users/Dron.Sharma/projects/the-polyhedron/
├── template.html          # HTML template with {{PLACEHOLDERS}}
├── build_part1.js         # Build script (Node.js ESM)
├── styles.css             # Current styles (21KB)
├── script.js              # Current script (13KB)
├── REDESIGN_SPEC.md       # Complete redesign specification
├── sw.js                  # Service worker
├── index.html             # Built output (700KB)
├── .github/workflows/     # GitHub Actions for deployment
├── .nojekyll              # GitHub Pages config
└── dreams/                # Source content directory
    ├── 001.md - 013.md    # Seed fragments (S01-S13)
    ├── dream_01.md - dream_108.md  # 108 dream fragments
    ├── polyhedron_poem.md # 9-stanza poem + rotation letter
    ├── synthesis/
    │   └── 2026-08-04_synthesis.md  # 101 cycles of synthesis
    └── fragments/         # Additional fragments
```

### 1.2 Build Process (`build_part1.js`)
1. **Reads template.html** — loads the HTML template with `{{PLACEHOLDERS}}`
2. **Scans `~/dreams/`** — finds all `.md` files
3. **Parses fragments:**
   - Series 1: `001.md`–`013.md` → seed fragments (S01–S13)
   - Series 2: `dream_01.md`–`dream_108.md` → dream fragments with core chapter metadata
4. **Reads synthesis** — parses `2026-08-04_synthesis.md` into cycle cards
5. **Reads poem** — parses `polyhedron_poem.md` into stanzas
6. **Generates framework** — builds 9 lens details from `CORE_CHAPTERS` data
7. **Injects into template** — replaces `{{CONTENT}}`, `{{DESCRIPTION}}`, `{{FRAGMENTS_JSON}}`, `{{BUILD_DATE}}`
8. **Writes `index.html`** — single 700KB self-contained file

### 1.3 Current Tech Stack
- **Vanilla HTML/CSS/JS** — no frameworks
- **Node.js ESM build** — runs via `node build_part1.js`
- **GitHub Pages deployment** — static hosting
- **Google Fonts** — Literata, IBM Plex Sans, JetBrains Mono (already in template)

---

## 2. Redesign Spec Requirements (from REDESIGN_SPEC.md)

### 2.1 Design System Overhaul
| Area | Current | Target |
|------|---------|--------|
| **Colors** | Single accent (#7a6ad8) | 3-accent system: primary (purple), warm (amber), cool (teal), danger (red) |
| **Typography** | Georgia + system mono | Literata (display, variable), IBM Plex Sans (UI), JetBrains Mono (mono) |
| **Spacing** | Linear (8px base) | Harmonic/Fibonacci-ish (4,8,12,16,24,32,48,64,96px) |
| **Type Scale** | Fixed rem | Fluid `clamp()` scale (xs–3xl) |
| **Layout** | Fixed grid | CSS Grid with `grid-template-areas` |
| **Breakpoints** | 900px only | 1024px (tablet), 600px (mobile) |

### 2.2 Component Redesigns Required

| Component | Current Issues | Spec Solution |
|-----------|----------------|---------------|
| **Sidebar Nav** | 121 flat items, no search/filter | Search input + geometry filter buttons + chapter links + settings |
| **Chapter Cards** | Basic hover, no focus states | Gradient top bar, lift + glow, full keyboard focus, click→scroll |
| **Fragment Accordion** | `max-height` hack, jerky | `grid-template-rows: 0fr → 1fr` smooth transition |
| **Polyhedron** | 2D absolute positioning | True 3D sphere with `translate3d` + `rotateY/X`, perspective, keyboard nav |
| **Synthesis Cycles** | Dense text, no breathing room | Better typography, cycle titles, insight/seed callouts |
| **Poem Section** | Empty placeholder | Full implementation with scroll-reveal stagger |
| **Framework** | Empty placeholder | Interactive `<details>` lenses with when-to-use/geometry/practice |
| **Theme Toggle** | Missing | Light/dark/manual with localStorage + system preference sync |

### 2.3 Accessibility Requirements (WCAG 2.1 AA)
- Skip-to-main-content link ✓ (already in template)
- Focus indicators on all interactive elements
- Keyboard navigation for polyhedron, accordion, nav
- `prefers-reduced-motion` for ALL animations
- Color contrast ≥ 4.5:1 text, 3:1 UI
- ARIA labels for complex widgets
- Semantic HTML structure

### 2.4 Performance Targets
- LCP < 1.5s, FID < 50ms, CLS < 0.05
- Total page weight < 100KB gzipped
- Font load < 500ms
- Time to Interactive < 2s

---

## 3. Gap Analysis

### 3.1 What's Already Implemented (✅)
| Feature | Status | Location |
|---------|--------|----------|
| Template structure with header/nav/main/footer | ✅ | `template.html` |
| Theme toggle button in header | ✅ | `template.html` |
| Skip link | ✅ | `template.html` |
| Google Fonts preconnect/load | ✅ | `template.html` |
| Dark/light CSS custom properties | ✅ | `styles.css` (lines 29-41) |
| Fluid type scale (`clamp`) | ✅ | `styles.css` (lines 17-18) |
| Harmonic spacing tokens | ✅ | `styles.css` (lines 19-20) |
| 3-accent color system | ✅ | `styles.css` (lines 7-9, 24-26) |
| Chapter cards with hover effects | ✅ | `styles.css` (lines 78-79) |
| Fragment accordion (grid-template-rows) | ✅ | `styles.css` (lines 81-88) |
| Search + filter in nav | ✅ | `script.js` (lines 76-166) |
| 3D polyhedron with rotation | ✅ | `script.js` (lines 187-277) |
| Scroll reveal animations | ✅ | `script.js` (lines 296-318) |
| Service worker registration | ✅ | `script.js` (lines 321-327) |
| Poem data in build script | ✅ | `build_part1.js` (lines 148-169) |
| Framework lenses in build script | ✅ | `build_part1.js` (lines 171-231) |
| Synthesis parsing | ✅ | `build_part1.js` (lines 134-145) |

### 3.2 What Needs Updating (🔄)

| Area | Current | Required Changes |
|------|---------|------------------|
| **CSS tokens** | Partial match | Update to exact spec values (bg #08080c, fg #efeff5, etc.) |
| **Chapter cards** | Basic hover | Add gradient top bar, focus-visible, keyboard support |
| **Fragment accordion** | Works but | Add `aria-expanded`, URL hash update, better alignment |
| **Polyhedron** | 3D works | Slower rotation (0.0008), keyboard arrow nav, Home/End |
| **Poem section** | Builds HTML | Add scroll-reveal stagger animations (CSS) |
| **Framework** | Builds HTML | Add `<details>` styling, chevron animation, practice callout |
| **Synthesis** | Basic cards | Better typography, breathing room, cycle titles |
| **Navigation** | Works | Add settings section, theme toggle sync, close on Escape |
| **Theme toggle** | Button exists | Connect to localStorage, sync CSS `[data-theme]` |
| **Focus styles** | Partial | Full `focus-visible` system across all components |

### 3.3 What's Missing Entirely (❌)

| Feature | Spec Section | Effort |
|---------|--------------|--------|
| Manual theme persistence (localStorage) | 2.2, 3.1#15 | Low |
| Settings section in nav (reduced motion toggle) | 2.5 | Medium |
| Skip link styling (already in template, needs CSS) | 1.5, 4.0 | Low |
| `prefers-reduced-motion` for polyhedron | 2.8, 3.1#14 | Medium |
| Font preload optimization | 3.1#16 | Low |
| Build-time poem/framework injection (already done!) | 4.1 | ✅ Done |
| Service worker offline caching | 3.1#17 | Medium |

---

## 4. Implementation Approach

### 4.1 Recommended Strategy: Incremental Upgrade
**Don't rebuild from scratch.** The current codebase already implements ~70% of the spec. Focus on:

1. **Sync CSS tokens** to exact spec values (15 min)
2. **Enhance existing components** rather than replace (2-3 hrs)
3. **Connect theme toggle** to localStorage + CSS (30 min)
4. **Polish polyhedron** with keyboard nav + slower rotation (1 hr)
5. **Add missing nav sections** (settings, reduced motion) (1 hr)
6. **Verify accessibility** across all components (1-2 hrs)

### 4.2 File Changes Required

| File | Changes |
|------|---------|
| `styles.css` | Update tokens to spec exact values; add poem/framework/synthesis polish styles; add focus-visible system; add reduced-motion media queries |
| `script.js` | Connect theme toggle; add settings nav section; polyhedron keyboard nav; reduced-motion listener; sync filter/search |
| `build_part1.js` | Verify poem/framework injection matches spec; ensure fragments JSON includes all needed fields |
| `template.html` | Already has theme toggle button, skip link, fonts — minimal changes |

### 4.3 Phase Breakdown (aligned with spec roadmap)

#### Phase 1: Quick Wins (1-2 days) — **MOSTLY DONE**
- [x] Theme toggle button in header
- [x] Fragment accordion with grid-template-rows
- [x] Search + geometry filter in nav
- [x] Skip-to-main link
- [x] Google Fonts loaded
- [x] 3-accent color system defined
- [ ] **Connect theme toggle to localStorage + data-theme**
- [ ] **Verify focus-visible on all interactive elements**
- [ ] **Add reduced-motion handling for polyhedron rotation**

#### Phase 2: Core Experience (3-5 days) — **PARTIALLY DONE**
- [x] Polyhedron 3D sphere layout
- [x] Poem section with build-time injection
- [x] Framework lenses with build-time injection
- [x] Nav restructure with search, filters
- [ ] **Chapter cards: gradient bar, focus-visible, keyboard**
- [ ] **Synthesis cycles: better typography**
- [ ] **Settings section in nav (theme, reduced motion)**

#### Phase 3: Polish (2-3 days)
- [ ] Scroll animations (IntersectionObserver) — **already in script.js**
- [ ] Reduced-motion for ALL animations
- [ ] Theme persistence (localStorage)
- [ ] Font loading optimization (preload)
- [ ] Service worker offline caching
- [ ] Build verification

### 4.4 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing fragment parsing | Low | High | Test with `node build_part1.js` after each change |
| Polyhedron 3D perf on mobile | Medium | Medium | Test `prefers-reduced-motion`, add `will-change` |
| Theme flash on load | Medium | Low | Inline theme script in `<head>` (already IIFE) |
| Font loading CLS | Low | Medium | Add `font-display: swap`, preload critical fonts |

---

## 5. Immediate Next Steps

1. **Run current build** to verify baseline:
   ```bash
   cd /c/Users/Dron.Sharma/projects/the-polyhedron
   node build_part1.js
   ```

2. **Open index.html** in browser to visually audit current state

3. **Apply token sync** — update `styles.css` `:root` to match spec exactly

4. **Connect theme toggle** — add localStorage logic to script.js IIFE

5. **Add reduced-motion** — pause polyhedron rotation when `prefers-reduced-motion: reduce`

6. **Test accessibility** — tab through entire site, verify focus states

---

## 6. Summary

| Metric | Status |
|--------|--------|
| **Spec Coverage** | ~70% implemented |
| **Build System** | Functional, produces 700KB index.html |
| **Content Pipeline** | Complete (121 fragments + poem + synthesis + framework) |
| **Design System** | Tokens defined, need spec alignment |
| **Components** | All major components exist, need polish |
| **Accessibility** | Foundation present, needs completion |
| **Estimated Remaining Work** | 2-3 focused sessions |

**Bottom line:** This is a **polish/integration task**, not a rebuild. The architecture is solid, the content pipeline works, and most spec features are already coded — they just need to be connected, aligned to exact spec values, and accessibility-hardened.

---
*Report generated by Analyzer subagent | Hermes Agent*