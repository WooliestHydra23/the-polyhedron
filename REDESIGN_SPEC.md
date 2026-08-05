# The Polyhedron — UI/UX Redesign Specification
## Executive Summary

**Site:** https://wooliesthydra23.github.io/the-polyhedron/
**Purpose:** Public-facing static dream archive — 121 fragments across 9 geometries, auto-regenerating from `/dreams` via GitHub Actions
**Stack:** Vanilla HTML/CSS/JS, single-file template, GitHub Pages deployment

---

## 1. CURRENT STATE AUDIT

### 1.1 Color Palette Analysis

**Current Dark Mode:**
| Token | Value | Assessment |
|-------|-------|------------|
| `--bg` | `#0a0a0f` | Near-black, good contrast base |
| `--bg-elevated` | `#11111a` | Subtle elevation, works |
| `--fg` | `#e8e8f0` | High contrast text, slightly cool |
| `--fg-muted` | `#8888a0` | Good muted state |
| `--accent` | `#7a6ad8` | **Primary brand purple** — distinctive but limited range |
| `--accent-glow` | `rgba(122,106,216,.4)` | Glow effect, works for hover |
| `--accent-strong` | `#9b8aff` | Light accent, good for hover |
| `--border` | `rgba(122,106,216,.2)` | Subtle, purple-tinted |
| `--border-strong` | `rgba(122,106,216,.4)` | Good for focus states |

**Issues:**
- Single accent color (`#7a6ad8`) creates monochromatic feel
- No semantic color tokens (success, warning, error, info)
- Light mode accent `#5a4ab8` lacks vibrancy on white
- Glow effects rely solely on purple — no warm/cool variation

### 1.2 Typography Analysis

**Current Stack:**
```css
--font-serif: Georgia, 'Times New Roman', serif;
--font-mono: 'SF Mono', 'Fira Code', monospace;
```

**Issues:**
- Georgia is a system font — inconsistent across platforms
- No variable font for weight flexibility
- Monospace stack lacks modern options (JetBrains Mono, IBM Plex Mono)
- No fluid type scale — fixed rem values
- Line height 1.75 is good but not responsive

### 1.3 Visual Hierarchy & Spacing

**Spacing Scale (current):**
```
--s1: .5rem   (8px)
--s2: 1rem    (16px)
--s3: 1.5rem  (24px)
--s4: 2rem    (32px)
--s5: 3rem    (48px)
--s6: 4rem    (64px)
```

**Issues:**
- Linear scale — lacks harmonic progression
- No smaller tokens for tight spaces (4px, 6px)
- Max-width 800px feels narrow for desktop
- Nav width 260px is rigid

### 1.4 Component-Level Issues

| Component | Current State | Problems |
|-----------|---------------|----------|
| **Sidebar Nav** | Fixed 260px, sticky | No search/filter, 121 items overwhelming |
| **Chapter Cards** | Grid, hover lift | No keyboard focus visible, click target unclear |
| **Fragment Items** | Accordion, max-height animation | `max-height: 2000px` hack, no smooth height |
| **Polyhedron** | 9 absolute-positioned facets | Facet titles clipped at small sizes, no 3D depth |
| **Synthesis Cycles** | Card list | Dense text, no visual breathing room |
| **Poem/Framework** | Empty placeholders | Not implemented |

### 1.5 Accessibility Gaps

- Missing `prefers-reduced-motion` for polyhedron rotation (partially done)
- Focus styles rely on `outline: none` with custom focus — incomplete
- No skip-to-main-content link
- ARIA labels on polyhedron facets but no live region for rotation state
- Color contrast: `--fg-muted` `#8888a0` on `--bg` `#0a0a0f` = 4.9:1 (passes AA for large text only)

### 1.6 Mobile/Responsive Issues

- Breakpoint at 900px only — no tablet intermediary
- Nav becomes fixed overlay but no swipe-to-close
- Polyhedron facets shrink to 150px — text unreadable
- Chapter cards stack but maintain hover effects (touch-unfriendly)

---

## 2. REDESIGN STRATEGY

### 2.1 Design Principles

1. **Atmosphere over UI** — The site *is* the dream, not a container for it
2. **Progressive disclosure** — 121 fragments need curation, not dumping
3. **Rotation as metaphor** — Every interaction should feel like a facet turning
4. **Accessibility as poetry** — Inclusive design enhances the dreamlike quality
5. **Performance as respect** — Fast loads = uninterrupted immersion

### 2.2 Updated Color System

**Dark Mode (Primary):**
```css
:root {
  /* Core neutrals — warmer, more atmospheric */
  --bg: #08080c;           /* Deeper, less blue */
  --bg-elevated: #0f0f14;  /* Subtle warmth */
  --bg-hover: #16161d;     /* For interactive states */
  --fg: #efeff5;           /* Softer white, less harsh */
  --fg-muted: #9a9ab8;     /* Better contrast ratio */
  --fg-subtle: #6b6b8a;    /* For tertiary text */
  
  /* Accent system — 3 hues for different emotional registers */
  --accent-primary: #8b7cf5;      /* Core dream purple */
  --accent-warm: #d4a574;         /* Gold/amber — kitchen, warmth, memory */
  --accent-cool: #5cc8d8;         /* Teal/cyan — silence, corridor, geometry */
  --accent-danger: #e86c6c;       /* For destructive actions only */
  
  /* Glow variants per accent */
  --glow-primary: rgba(139, 124, 245, 0.35);
  --glow-warm: rgba(212, 165, 116, 0.3);
  --glow-cool: rgba(92, 200, 216, 0.25);
  
  /* Semantic borders */
  --border: rgba(139, 124, 245, 0.15);
  --border-strong: rgba(139, 124, 245, 0.3);
  --border-focus: var(--accent-primary);
  
  /* Cards */
  --card: rgba(139, 124, 245, 0.04);
  --card-hover: rgba(139, 124, 245, 0.08);
  --card-strong: rgba(139, 124, 245, 0.12);
  
  /* Typography */
  --font-display: 'Literata', Georgia, serif;       /* Variable, expressive */
  --font-ui: 'IBM Plex Sans', system-ui, sans-serif; /* Clean, readable */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Fluid type scale */
  --text-xs: clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem);
  --text-sm: clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.05rem);
  --text-lg: clamp(1.15rem, 1.05rem + 0.5vw, 1.3rem);
  --text-xl: clamp(1.4rem, 1.2rem + 1vw, 1.75rem);
  --text-2xl: clamp(1.8rem, 1.5rem + 1.5vw, 2.5rem);
  --text-3xl: clamp(2.5rem, 2rem + 2.5vw, 3.5rem);
  
  /* Harmonic spacing (8px base * Fibonacci-ish) */
  --space-1: 4px;    /* 0.25rem */
  --space-2: 8px;    /* 0.5rem */
  --space-3: 12px;   /* 0.75rem */
  --space-4: 16px;   /* 1rem */
  --space-5: 24px;   /* 1.5rem */
  --space-6: 32px;   /* 2rem */
  --space-7: 48px;   /* 3rem */
  --space-8: 64px;   /* 4rem */
  --space-9: 96px;   /* 6rem */
  
  /* Layout */
  --max-width: 900px;      /* Wider for desktop reading */
  --nav-width: 280px;      /* Slightly wider for longer titles */
  --header-h: 64px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.2, 0.8, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.2, 0.8, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
  
  /* Z-index scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
}
```

**Light Mode (Refined):**
```css
@media (prefers-color-scheme: light) {
  :root {
    --bg: #fefefd;              /* Warm paper white */
    --bg-elevated: #ffffff;
    --bg-hover: #f5f4f0;
    --fg: #1a1a22;
    --fg-muted: #5a5a6e;
    --fg-subtle: #88889a;
    --accent-primary: #6d5df0;
    --accent-warm: #b8860b;
    --accent-cool: #0096a8;
    --glow-primary: rgba(109, 93, 240, 0.25);
    --glow-warm: rgba(184, 134, 11, 0.2);
    --glow-cool: rgba(0, 150, 168, 0.18);
    --border: rgba(109, 93, 240, 0.12);
    --border-strong: rgba(109, 93, 240, 0.22);
    --card: rgba(109, 93, 240, 0.03);
    --card-hover: rgba(109, 93, 240, 0.06);
    --card-strong: rgba(109, 93, 240, 0.1);
  }
}
```

**Manual Theme Toggle (add to header):**
```html
<button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light/dark">
  <svg class="icon-sun" aria-hidden="true">...</svg>
  <svg class="icon-moon" aria-hidden="true">...</svg>
</button>
```

```css
.theme-toggle {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  padding: var(--space-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}
.theme-toggle:hover {
  background: var(--card-hover);
  border-color: var(--border-strong);
}
[data-theme="light"] .icon-moon { display: block; }
[data-theme="light"] .icon-sun { display: none; }
[data-theme="dark"] .icon-sun { display: block; }
[data-theme="dark"] .icon-moon { display: none; }
```

### 2.3 Typography System

```css
/* Load variable fonts via preconnect */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

/* Base */
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-ui);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--fg);
  background: var(--bg);
}

/* Display/headings */
h1, h2, h3, .section-title {
  font-family: var(--font-display);
  font-weight: 300;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--accent-primary);
}

.section-title { font-size: var(--text-2xl); }
h2 { font-size: var(--text-xl); }
h3 { font-size: var(--text-lg); }

/* Mono for numbers/codes */
.fragment-number, .cycle-number, .nav-badge {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
}

/* Prose */
.fragment-body, .cycle, .lens-content {
  font-family: var(--font-ui);
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--fg);
}

/* Links */
a {
  color: var(--accent-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
a:hover { border-bottom-color: var(--accent-primary); }
a:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### 2.4 Layout Restructure

**New Grid System:**
```css
body {
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--nav-width) 1fr;
  grid-template-rows: var(--header-h) 1fr;
  grid-template-areas: 
    "header header"
    "nav main";
}

@media (max-width: 1024px) {
  body {
    grid-template-columns: 1fr;
    grid-template-rows: var(--header-h) auto 1fr;
    grid-template-areas:
      "header"
      "nav"
      "main";
  }
  nav { 
    position: fixed; 
    top: var(--header-h); 
    left: 0; right: 0; bottom: 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
    z-index: var(--z-sticky);
    transform: translateX(-100%);
    transition: transform var(--transition-base);
  }
  nav.open { transform: translateX(0); }
}

header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; }
```

### 2.5 Navigation Redesign

**Current Problems:** 121 items in flat list, no search, no grouping beyond "Chapters" vs "All"

**New Structure:**
```
Navigation
├── 🔮 The Polyhedron (logo/link to top)
├── 📖 Chapters (9 core geometries — always visible)
├── 🔍 Search Fragments (new — filter by title/keyword)
├── 📂 Browse by Geometry (new — filter by chapter)
├── 📜 The Poem
├── 📊 The Synthesis
├── 🧭 The Framework
└── ⚙️ Settings (theme, reduced motion)
```

**Search Implementation:**
```js
function buildNav() {
  // ... existing chapter links ...
  
  // Search input
  html += `
    <div class="nav-section">
      <div class="nav-title">Find</div>
      <div class="nav-search">
        <label for="fragmentSearch" class="visually-hidden">Search fragments</label>
        <input type="search" id="fragmentSearch" placeholder="Search 121 fragments..." 
               aria-describedby="searchHint" autocomplete="off">
        <span id="searchHint" class="visually-hidden">Type to filter fragments by title or content</span>
      </div>
    </div>
  `;
  
  // Geometry filter
  html += `
    <div class="nav-section">
      <div class="nav-title">Filter by Geometry</div>
      <ul class="nav-list geometry-filters">
        <li><button class="nav-link filter-btn active" data-filter="all" aria-pressed="true">All Geometries</button></li>
        ${CORE_CHAPTERS.map(c => `<li><button class="nav-link filter-btn" data-filter="${c.id}" aria-pressed="false">${c.glyph} ${c.title}</button></li>`).join('')}
      </ul>
    </div>
  `;
  
  // All fragments (filtered by search/geometry)
  html += `<div class="nav-section"><div class="nav-title">Fragments (<span id="fragmentCount">${fragmentsData.length}</span>)</div><ul class="nav-list" id="fragmentNavList"></ul></div>`;
  
  // More section
  html += `...`;
  
  nav.innerHTML = html;
  initSearchAndFilter();
}
```

```js
function initSearchAndFilter() {
  const searchInput = document.getElementById('fragmentSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const fragmentList = document.getElementById('fragmentNavList');
  let currentFilter = 'all';
  let searchTerm = '';
  
  function renderFragmentList() {
    const filtered = fragmentsData.filter(f => {
      const matchesFilter = currentFilter === 'all' || f.id.startsWith(currentFilter);
      const matchesSearch = !searchTerm || 
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.essence.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    
    fragmentList.innerHTML = filtered.map(f => 
      `<li><a class="nav-link fragment" href="#${f.id}" data-fragment-id="${f.id}">
         ${f.glyph} ${escapeHtml(f.title)} <span class="nav-badge">${f.number}</span>
       </a></li>`
    ).join('');
    
    document.getElementById('fragmentCount').textContent = filtered.length;
  }
  
  searchInput.addEventListener('input', debounce(() => {
    searchTerm = searchInput.value.trim();
    renderFragmentList();
  }, 150));
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.dataset.filter;
      renderFragmentList();
    });
  });
  
  renderFragmentList();
}
```

### 2.6 Chapter Cards Enhancement

```css
.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-5);
  margin-top: var(--space-6);
}

.chapter-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.chapter-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-warm));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.chapter-card:hover::before,
.chapter-card:focus-within::before {
  transform: scaleX(1);
}

.chapter-card:hover,
.chapter-card:focus-within {
  border-color: var(--accent-primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px var(--glow-primary);
}

.chapter-card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
}

.chapter-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
  filter: drop-shadow(0 0 16px var(--glow-primary));
  line-height: 1;
  transition: transform var(--transition-base);
}

.chapter-card:hover .chapter-icon {
  transform: scale(1.1) rotate(3deg);
}

.chapter-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--fg);
  margin-bottom: var(--space-3);
  line-height: 1.3;
}

.chapter-essence {
  color: var(--fg-muted);
  font-size: var(--text-sm);
  font-style: italic;
  margin-bottom: var(--space-5);
  line-height: 1.6;
}

.chapter-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--accent-primary);
  font-size: var(--text-sm);
  font-weight: 500;
}

.chapter-link::after {
  content: '→';
  transition: transform var(--transition-fast);
}

.chapter-card:hover .chapter-link::after {
  transform: translateX(4px);
}
```

### 2.7 Fragment Accordion — Smooth Height Animation

**Problem:** `max-height: 2000px` hack causes jerky animation

**Solution:** Use `grid-template-rows` transition (works for auto height)

```css
.fragment-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.fragment-item:hover {
  border-color: var(--border-strong);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.fragment-header {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4) var(--space-5);
  cursor: pointer;
  user-select: none;
}

.fragment-header:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: -2px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.fragment-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-base);
  overflow: hidden;
}

.fragment-body > div {
  min-height: 0;
  padding: 0 var(--space-5) var(--space-5);
  padding-left: calc(var(--space-4) + 3rem + var(--space-4)); /* align with title */
}

.fragment-item.expanded .fragment-body {
  grid-template-rows: 1fr;
}

.fragment-toggle {
  color: var(--fg-subtle);
  transition: transform var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.fragment-item.expanded .fragment-toggle {
  transform: rotate(180deg);
}
```

```js
function initFragments() {
  document.querySelectorAll('.fragment-header').forEach(header => {
    header.addEventListener('click', (e) => {
      // Don't toggle if clicking a link inside
      if (e.target.closest('a')) return;
      
      const item = header.closest('.fragment-item');
      const isExpanded = item.classList.toggle('expanded');
      header.setAttribute('aria-expanded', isExpanded);
      
      // Update URL hash without scroll
      if (isExpanded) {
        history.replaceState(null, '', `#${item.id}`);
      }
    });
    
    // Keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}
```

### 2.8 Polyhedron 3D Redesign

**Current Issues:**
- Facets positioned with 2D translate only
- Text clipped at small sizes
- No true 3D depth perception
- Click targets unclear

**New Approach:** CSS 3D transforms with proper perspective, faces as 3D polygons

```css
.polyhedron-section {
  position: relative;
  padding: var(--space-9) 0 var(--space-7);
  text-align: center;
}

.polyhedron {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 360px;
  max-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1200px;
  margin: 0 auto var(--space-6);
  max-width: 700px;
}

.facet {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--card), var(--bg-elevated));
  border: 1px solid var(--border);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  text-align: center;
  cursor: pointer;
  transition: transform var(--transition-slow), box-shadow var(--transition-base), border-color var(--transition-base), opacity var(--transition-base);
  transform-style: preserve-3d;
  opacity: 0;
  box-shadow: 
    0 4px 24px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

.facet.visible { opacity: 1; }

.facet:hover,
.facet:focus-visible {
  transform: translateZ(80px) scale(1.15) !important;
  border-color: var(--accent-primary);
  box-shadow: 
    0 32px 64px var(--glow-primary),
    0 0 0 1px var(--accent-primary),
    inset 0 1px 0 rgba(255,255,255,0.1);
  z-index: 10;
  outline: none;
}

.facet:focus-visible {
  outline: 3px solid var(--accent-primary);
  outline-offset: 4px;
}

.facet .glyph {
  font-size: 2.8rem;
  margin-bottom: var(--space-3);
  filter: drop-shadow(0 0 16px var(--glow-primary));
  line-height: 1;
  transition: transform var(--transition-base);
}

.facet:hover .glyph {
  transform: scale(1.2);
}

.facet .title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-primary);
  margin-bottom: var(--space-1);
  line-height: 1.2;
}

.facet .essence {
  font-size: var(--text-xs);
  color: var(--fg-muted);
  line-height: 1.4;
  max-width: 160px;
}

.polyhedron-hint {
  color: var(--fg-subtle);
  font-size: var(--text-sm);
  font-style: italic;
}
```

```js
// Proper 3D positioning on a sphere
const FACET_COUNT = 9;
const RADIUS = 280; // px from center

function initPolyhedron() {
  if (!poly) return;
  
  // Clear existing
  poly.innerHTML = '';
  
  facetsData.forEach((f, i) => {
    const el = document.createElement('div');
    el.className = 'facet';
    el.dataset.id = f.id;
    el.tabIndex = 0;
    el.setAttribute('role', 'listitem');
    el.setAttribute('aria-label', `${f.title} — ${f.essence}`);
    el.innerHTML = `
      <div class="glyph">${f.glyph}</div>
      <div class="title">${escapeHtml(f.title)}</div>
      <div class="essence">${escapeHtml(f.essence)}</div>
    `;
    
    // Click/keyboard navigation
    el.addEventListener('click', () => navigateToFragment(f.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToFragment(f.id);
      }
    });
    
    poly.appendChild(el);
    
    // Staggered entrance
    setTimeout(() => el.classList.add('visible'), i * 80);
  });
  
  // Initial 3D positions
  positionFacets();
  startRotation();
}

function positionFacets() {
  const facets = document.querySelectorAll('.facet');
  const angleStep = (Math.PI * 2) / FACET_COUNT;
  const tilt = Math.PI / 6; // 30 degree tilt for 3D feel
  
  facets.forEach((el, i) => {
    const theta = i * angleStep - Math.PI / 2; // Start at top
    const x = RADIUS * Math.cos(theta);
    const y = RADIUS * Math.sin(theta) * Math.sin(tilt);
    const z = RADIUS * Math.sin(theta) * Math.cos(tilt);
    
    // Rotation to face center
    const rotY = -theta + Math.PI / 2;
    const rotX = -tilt;
    
    el.style.transform = `
      translate3d(${x}px, ${y}px, ${z}px)
      rotateY(${rotY}rad)
      rotateX(${rotX}rad)
    `;
  });
}

let angle = 0;
let animId = null;

function startRotation() {
  function rotate() {
    angle += 0.0008; // Slower, more meditative
    const facets = document.querySelectorAll('.facet');
    
    facets.forEach((el, i) => {
      const theta = i * (Math.PI * 2 / FACET_COUNT) - Math.PI / 2 + angle;
      const x = RADIUS * Math.cos(theta);
      const y = RADIUS * Math.sin(theta) * Math.sin(Math.PI / 6);
      const z = RADIUS * Math.sin(theta) * Math.cos(Math.PI / 6);
      const rotY = -theta + Math.PI / 2;
      
      el.style.transform = `
        translate3d(${x}px, ${y}px, ${z}px)
        rotateY(${rotY}rad)
        rotateX(-${Math.PI / 6}rad)
      `;
    });
    
    animId = requestAnimationFrame(rotate);
  }
  rotate();
}

poly?.addEventListener('mouseenter', () => cancelAnimationFrame(animId));
poly?.addEventListener('mouseleave', startRotation);

// Keyboard navigation between facets
poly?.addEventListener('keydown', e => {
  const facets = Array.from(document.querySelectorAll('.facet'));
  const currentIndex = facets.findIndex(f => f === document.activeElement);
  if (currentIndex === -1) return;
  
  let nextIndex = currentIndex;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % facets.length;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + facets.length) % facets.length;
  } else if (e.key === 'Home') {
    nextIndex = 0;
  } else if (e.key === 'End') {
    nextIndex = facets.length - 1;
  }
  
  if (nextIndex !== currentIndex) {
    e.preventDefault();
    facets[nextIndex].focus();
  }
});
```

### 2.9 Synthesis Cycles — Better Reading Experience

```css
.cycle {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  margin-bottom: var(--space-5);
  transition: border-color var(--transition-fast);
}

.cycle:hover {
  border-color: var(--border-strong);
}

.cycle-title {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.cycle-number {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--accent-primary);
  background: var(--bg-elevated);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cycle-title h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 300;
  color: var(--fg);
  margin: 0;
}

.cycle > * + * {
  margin-top: var(--space-4);
}

.cycle p {
  margin: 0;
  line-height: 1.8;
}

.cycle .insight,
.cycle .seed {
  background: var(--bg-elevated);
  border-left: 3px solid var(--accent-primary);
  padding: var(--space-4) var(--space-5);
  margin: var(--space-5) 0;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.cycle .insight { border-left-color: var(--accent-cool); }
.cycle .seed { border-left-color: var(--accent-warm); }

.cycle .insight strong,
.cycle .seed strong {
  color: var(--accent-primary);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 2.10 Poem Section — Finally Implemented

```js
// Load poem from polyhedron_poem.md at build time, or embed directly
const POEM_STANZAS = [
  { title: 'I. THE BLUE DOOR', lines: ['Navy where color hasn\'t decided.', 'Peeling paint under palm — the threshold swallows what was exposed.', 'Not a place. A feeling.', 'The door closes inward.'] },
  { title: 'II. THE INDIGO JAR', lines: ['Silence that learned to glow.', 'Heavy. Warm-cold paradox.', 'Each drop pings like a spoon on glass at 3 PM in an empty kitchen.', 'The jar unscrews itself when you stop trying to open it.'] },
  // ... all 9 stanzas + rotation letter
];

function renderPoem() {
  const container = document.getElementById('poem-content');
  if (!container) return;
  
  container.innerHTML = POEM_STANZAS.map(stanza => `
    <div class="stanza">
      <div class="stanza-title">${escapeHtml(stanza.title)}</div>
      <div class="stanza-lines">${stanza.map(l => `<p>${escapeHtml(l)}</p>`).join('')}</div>
    </div>
  `).join('');
}
```

```css
.poem {
  font-family: var(--font-display);
  font-size: var(--text-base);
  line-height: 1.9;
  color: var(--fg);
  max-width: 60ch;
  margin: 0 auto;
}

.stanza {
  margin-bottom: var(--space-8);
  padding-left: var(--space-6);
  border-left: 2px solid transparent;
  border-image: linear-gradient(var(--accent-primary), var(--accent-warm)) 1;
  opacity: 0;
  transform: translateY(20px);
  animation: stanzaReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes stanzaReveal {
  to { opacity: 1; transform: translateY(0); }
}

.stanza:nth-child(1) { animation-delay: 0.1s; }
.stanza:nth-child(2) { animation-delay: 0.2s; }
/* ... */

.stanza-title {
  font-weight: 500;
  color: var(--accent-primary);
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stanza-lines p {
  margin: var(--space-2) 0;
  font-style: italic;
  color: var(--fg-muted);
}
```

### 2.11 Framework Section — Interactive Lenses

```js
const FRAMEWORK_LENSES = CORE_CHAPTERS.map(c => ({
  ...c,
  whenToUse: [...], // from dream-metaphysics-framework skill
  geometry: [...],
  practice: [...]
}));

function renderFramework() {
  const container = document.getElementById('framework-content');
  if (!container) return;
  
  container.innerHTML = FRAMEWORK_LENSES.map((lens, i) => `
    <details class="lens" style="--delay: ${i * 80}ms">
      <summary>
        <span class="lens-glyph">${lens.glyph}</span>
        <div>
          <h3 class="lens-title">${escapeHtml(lens.title)}</h3>
          <p class="lens-essence">${escapeHtml(lens.essence)}</p>
        </div>
        <span class="lens-chevron" aria-hidden="true">›</span>
      </summary>
      <div class="lens-content">
        <h4>When to use</h4>
        <p>${lens.whenToUse}</p>
        <h4>The geometry</h4>
        <p>${lens.geometry}</p>
        <div class="practice">${lens.practice}</div>
        <button class="btn btn-primary" onclick="navigateToFragment('${lens.id}')">
          Explore this geometry <span>→</span>
        </button>
      </div>
    </details>
  `).join('');
}
```

```css
.framework-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.lens {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  opacity: 0;
  transform: translateY(16px);
  animation: lensReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: var(--delay, 0);
}

@keyframes lensReveal {
  to { opacity: 1; transform: translateY(0); }
}

.lens:hover { border-color: var(--border-strong); }

.lens summary {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.lens summary::-webkit-details-marker { display: none; }

.lens summary::after {
  content: '';
  width: 24px;
  height: 24px;
  margin-left: auto;
  background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='6 9 12 15 18 9'></polyline></svg>") center/contain no-repeat;
  color: var(--accent-primary);
  transition: transform var(--transition-base);
  flex-shrink: 0;
}

.lens[open] summary::after {
  transform: rotate(180deg);
}

.lens-glyph {
  font-size: 2rem;
  filter: drop-shadow(0 0 12px var(--glow-primary));
  flex-shrink: 0;
}

.lens-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--fg);
  margin: 0;
}

.lens-essence {
  color: var(--fg-muted);
  font-size: var(--text-sm);
  font-style: italic;
  margin: var(--space-1) 0 0;
}

.lens-content {
  padding: 0 var(--space-6) var(--space-6);
  border-top: 1px solid var(--border);
  animation: lensContentReveal 0.3s ease-out;
}

@keyframes lensContentReveal {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 500px; }
}

.lens-content h4 {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-primary);
  margin: var(--space-5) 0 var(--space-3);
}

.lens-content p { margin: var(--space-3) 0; line-height: 1.7; }

.lens-content .practice {
  background: var(--bg-elevated);
  border-left: 2px solid var(--accent-warm);
  padding: var(--space-4) var(--space-5);
  margin: var(--space-5) 0;
  font-style: italic;
  font-size: var(--text-sm);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
```

---

## 3. PRIORITIZED IMPROVEMENT ROADMAP

### Phase 1: Quick Wins (1-2 days)
| Priority | Task | Impact |
|----------|------|--------|
| 1 | Add theme toggle (light/dark/manual) | High — user control |
| 2 | Fix fragment accordion with grid-template-rows | High — smooth UX |
| 3 | Implement search + geometry filter in nav | High — 121 fragments need discovery |
| 4 | Add skip-to-main link + focus-visible styles | High — accessibility |
| 5 | Load Google Fonts (Literata, IBM Plex Sans, JetBrains Mono) | Medium — typography upgrade |
| 6 | Update color tokens to 3-accent system | Medium — visual richness |

### Phase 2: Core Experience (3-5 days)
| Priority | Task | Impact |
|----------|------|--------|
| 7 | Redesign polyhedron with true 3D sphere layout | High — signature feature |
| 8 | Implement Poem section with scroll-reveal | High — content completion |
| 9 | Implement Framework lenses with details/summary | High — content completion |
| 10 | Restructure nav with search, filters, settings | High — IA overhaul |
| 11 | Chapter cards: better focus states, keyboard support | Medium — accessibility |
| 12 | Synthesis cycles: better typography, breathing room | Medium — readability |

### Phase 3: Polish & Performance (2-3 days)
| Priority | Task | Impact |
|----------|------|--------|
| 13 | Add IntersectionObserver scroll animations | Medium — delight |
| 14 | Implement reduced-motion for all animations | Medium — accessibility |
| 15 | Add theme persistence (localStorage) | Low — UX |
| 16 | Optimize font loading (preload, font-display) | Medium — performance |
| 17 | Add service worker for offline viewing | Low — resilience |
| 18 | Build-time poem/framework injection | Medium — maintainability |

### Phase 4: Advanced (Optional)
| Priority | Task | Impact |
|----------|------|--------|
| 19 | Fragment reading progress (localStorage) | Low — engagement |
| 20 | Shareable fragment URLs with highlight | Low — sharing |
| 21 | Ambient background (subtle canvas/WebGL) | Low — atmosphere |
| 22 | Fragment "resonance" — related fragments sidebar | Medium — discovery |

---

## 4. IMPLEMENTATION NOTES

### 4.1 Build Script Updates

The `build_part1.js` needs to:
1. Inject poem content from `polyhedron_poem.md`
2. Inject framework lenses from `dream-metaphysics-framework` skill
3. Pass `CORE_CHAPTERS` as both `facetsData` and chapter metadata
4. Generate search index JSON for client-side filtering

### 4.2 File Structure

```
/c/Users/Dron.Sharma/projects/the-polyhedron/
├── template.html          # Updated with new design system
├── build_part1.js         # Updated build script
├── styles.css             # Extracted CSS (optional, for caching)
├── script.js              # Extracted JS (optional, for caching)
├── polyhedron_poem.md     # Source for poem
├── .github/workflows/deploy.yml
└── .nojekyll
```

### 4.3 CSS Extraction (Recommended)

For better caching, split into:
- `styles.css` — all styles (cacheable, ~15KB gzipped)
- `script.js` — all JS (cacheable, ~8KB gzipped)
- `template.html` — minimal HTML with link/script tags

Build script concatenates at build time.

---

## 5. ACCESSIBILITY CHECKLIST (WCAG 2.1 AA)

- [ ] Color contrast ≥ 4.5:1 for text, 3:1 for UI components
- [ ] Focus indicators visible on all interactive elements
- [ ] Keyboard navigation for all features (polyhedron, accordion, nav)
- [ ] Skip-to-main-content link
- [ ] ARIA labels/descriptions for complex widgets
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] `prefers-color-scheme` + manual toggle
- [ ] Semantic HTML structure (h1-h6, landmarks, lists)
- [ ] Screen reader tested (NVDA, VoiceOver)
- [ ] Zoom to 200% without horizontal scrolling

---

## 6. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 1.5s |
| FID (First Input Delay) | < 50ms |
| CLS (Cumulative Layout Shift) | < 0.05 |
| Total page weight | < 100KB gzipped |
| Font load (FOIT/FOUT) | < 500ms |
| Time to Interactive | < 2s |

---

*Generated: 2026-08-05*  
*Framework: Hermes Agent · Model: Nemotron Ultra · Skill: OpenCode*  
*Site: https://wooliesthydra23.github.io/the-polyhedron/*