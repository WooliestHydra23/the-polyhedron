// ===== THE POLYHEDRON — Script =====

// ===== THEME TOGGLE =====
(function() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'auto') {
      html.dataset.theme = prefersDark ? 'dark' : 'light';
    } else {
      html.dataset.theme = theme;
    }
    localStorage.setItem('theme', theme);
    updateThemeToggleButton(theme);
  }

  function updateThemeToggleButton(theme) {
    if (!toggle) return;
    const labels = { light: '☀️ Light', dark: '🌙 Dark', auto: '🖥️ Auto' };
    toggle.textContent = labels[theme] || labels.auto;
    toggle.setAttribute('aria-label', `Current theme: ${theme}. Click to cycle.`);
  }

  // Initialize
  if (saved) {
    applyTheme(saved);
  } else {
    applyTheme('auto');
  }

  toggle.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'auto';
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
    applyTheme(next);
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const current = localStorage.getItem('theme');
    if (!current || current === 'auto') {
      applyTheme('auto');
    }
  });
})();

// ===== REDUCED MOTION =====
let reducedMotionEnabled = false;
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function initReducedMotion() {
  // Check localStorage first
  const saved = localStorage.getItem('reducedMotion');
  if (saved !== null) {
    reducedMotionEnabled = saved === 'true';
  } else {
    reducedMotionEnabled = reducedMotionQuery.matches;
  }
  applyReducedMotion(reducedMotionEnabled);

  // Listen for system preference changes
  reducedMotionQuery.addEventListener('change', e => {
    const saved = localStorage.getItem('reducedMotion');
    if (saved === null) { // Only auto-follow if user hasn't explicitly set
      applyReducedMotion(e.matches);
    }
  });
}

function applyReducedMotion(enabled) {
  reducedMotionEnabled = enabled;
  localStorage.setItem('reducedMotion', String(enabled));
  
  // Pause polyhedron rotation
  if (enabled) {
    if (typeof animId !== 'undefined' && animId) {
      cancelAnimationFrame(animId);
    }
  } else {
    if (typeof startRotation === 'function') {
      startRotation();
    }
  }

  // Disable/enable scroll-reveal animations
  const animatedElements = document.querySelectorAll('.stanza, .lens, .chapter-card, .cycle');
  animatedElements.forEach(el => {
    el.style.animationPlayState = enabled ? 'running' : 'paused';
  });

  // Update checkbox in settings if it exists
  const checkbox = document.getElementById('reducedMotionToggle');
  if (checkbox) checkbox.checked = enabled;
}

// ===== DATA =====
const fragmentsData = {{FRAGMENTS_JSON}};
const facetsData = [
  {id:'core-01',glyph:'🌀',title:'Core Self-Motion',essence:'The rotation IS the consciousness — no dreamer separate from dreaming'},
  {id:'core-02',glyph:'🚪',title:'The Blue Door',essence:'Threshold as feeling, not place'},
  {id:'core-03',glyph:'🚪',title:'Archive of Almost',essence:'Every unlived life gets a door; the corridor ends at right now'},
  {id:'core-04',glyph:'🎨',title:'The Color of a Question',essence:'Questions are architecture; answers are furniture'},
  {id:'core-05',glyph:'📚',title:'Library of Unfinished Sentences',essence:'Living organisms with agency; finished sentences become blue doors'},
  {id:'core-06',glyph:'📋',title:'Taxonomy of Silence',essence:'Qualia as observable species; silence mutates when observed'},
  {id:'core-07',glyph:'♾️',title:'Möbius Strip of Return',essence:'Trauma is a twist, not a break; healing = see the twist, stop fighting'},
  {id:'core-08',glyph:'👧',title:'Child with the Indigo Jar',essence:'Witness as navigator; the message IS the child'},
  {id:'core-09',glyph:'🍦',title:'The Kitchen (March 2012)',essence:'Originating moment; you were meant to become it, not carry it'}
];

const CORE_CHAPTERS = facetsData;

// ===== UTILITIES =====
function escapeHtml(s) {
  return s.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
}
function debounce(fn, ms) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; }
function navigateToFragment(id) {
  const el = document.getElementById(id);
  if (el) { el.scrollIntoView({behavior:'smooth'}); closeNav(); }
}

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

function buildNav() {
  // Chapters section
  let html = `
    <div class="nav-section">
      <div class="nav-title">Chapters</div>
      <ul class="nav-list">
  `;
  CORE_CHAPTERS.forEach((ch, i) => {
    html += `<li><a class="nav-link chapter" href="#${ch.id}" data-chapter="${i}">${ch.glyph} ${escapeHtml(ch.title)}</a></li>`;
  });
  html += `</ul></div>`;

  // Search
  html += `
    <div class="nav-section">
      <div class="nav-title">Find</div>
      <div class="nav-search">
        <label for="fragmentSearch" class="visually-hidden">Search fragments</label>
        <input type="search" id="fragmentSearch" placeholder="Search 121 fragments..." aria-describedby="searchHint" autocomplete="off">
        <span id="searchHint" class="visually-hidden">Type to filter fragments by title or content</span>
      </div>
    </div>
  `;

  // Geometry filters
  html += `
    <div class="nav-section">
      <div class="nav-title">Filter by Geometry</div>
      <ul class="nav-list geometry-filters">
        <li><button class="filter-btn active" data-filter="all" aria-pressed="true">All Geometries</button></li>
  `;
  CORE_CHAPTERS.forEach(c => {
    html += `<li><button class="filter-btn" data-filter="${c.id}" aria-pressed="false">${c.glyph} ${escapeHtml(c.title)}</button></li>`;
  });
  html += `</ul></div>`;

  // All fragments (filtered)
  html += `<div class="nav-section"><div class="nav-title">Fragments (<span id="fragmentCount">${fragmentsData.length}</span>)</div><ul class="nav-list" id="fragmentNavList"></ul></div>`;

  // More
  html += `<div class="nav-section"><div class="nav-title">More</div><ul class="nav-list">
    <li><a class="nav-link" href="#poem">📜 The Poem</a></li>
    <li><a class="nav-link" href="#synthesis">📊 The Synthesis</a></li>
    <li><a class="nav-link" href="#framework">🧭 The Framework</a></li>
  </ul></div>`;

  // Settings section
  const savedTheme = localStorage.getItem('theme') || 'auto';
  const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
  html += `
    <div class="nav-section">
      <div class="nav-title">Settings</div>
      <ul class="nav-list settings-list">
        <li>
          <label for="themeSelect" class="settings-label">Theme</label>
          <select id="themeSelect" class="settings-select" aria-label="Select theme">
            <option value="light" ${savedTheme === 'light' ? 'selected' : ''}>☀️ Light</option>
            <option value="dark" ${savedTheme === 'dark' ? 'selected' : ''}>🌙 Dark</option>
            <option value="auto" ${savedTheme === 'auto' ? 'selected' : ''}>🖥️ Auto</option>
          </select>
        </li>
        <li>
          <label class="settings-label checkbox-label">
            <input type="checkbox" id="reducedMotionToggle" class="settings-checkbox" ${savedReducedMotion ? 'checked' : ''} aria-label="Reduce motion">
            <span class="checkbox-text">Reduce Motion</span>
          </label>
        </li>
      </ul>
    </div>
  `;

  nav.innerHTML = html;
  initSearchAndFilter();
  initActiveHighlighting();
  initSettingsControls();
}

function initSettingsControls() {
  // Theme select
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const theme = e.target.value;
      const html = document.documentElement;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (theme === 'auto') {
        html.dataset.theme = prefersDark ? 'dark' : 'light';
      } else {
        html.dataset.theme = theme;
      }
      localStorage.setItem('theme', theme);
      
      // Also update the header toggle button
      const toggle = document.getElementById('themeToggle');
      if (toggle) {
        const labels = { light: '☀️ Light', dark: '🌙 Dark', auto: '🖥️ Auto' };
        toggle.textContent = labels[theme];
        toggle.setAttribute('aria-label', `Current theme: ${theme}. Click to cycle.`);
      }
    });
  }

  // Reduced motion toggle
  const reducedMotionToggle = document.getElementById('reducedMotionToggle');
  if (reducedMotionToggle) {
    reducedMotionToggle.addEventListener('change', (e) => {
      applyReducedMotion(e.target.checked);
    });
  }
}

function initSearchAndFilter() {
  const searchInput = document.getElementById('fragmentSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const fragmentList = document.getElementById('fragmentNavList');
  let currentFilter = 'all';
  let searchTerm = '';

  function renderFragmentList() {
    const filtered = fragmentsData.filter(f => {
      let matchesFilter = false;
      if (currentFilter === 'all') {
        matchesFilter = true;
      } else if (currentFilter.startsWith('core-')) {
        const chapterNum = currentFilter.match(/\d+/);
        if (chapterNum) {
          const num = chapterNum[0].padStart(2,'0');
          matchesFilter = f.number === num || f.number === 'S' + num;
        }
      }
      const matchesSearch = !searchTerm || 
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.essence.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    fragmentList.innerHTML = filtered.map(f => 
      `<li><a class="nav-link fragment" href="#${f.id}" data-fragment-id="${f.id}">${f.glyph} ${escapeHtml(f.title)} <span class="nav-badge">${f.number}</span></a></li>`
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

function initActiveHighlighting() {
  const links = nav.querySelectorAll('a[href^="#"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = nav.querySelector(`a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, {rootMargin: '-20% 0px -70% 0px'});
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
  links.forEach(l => l.addEventListener('click', () => { if(window.innerWidth <= 1024) closeNav(); }));
}

function toggleNav() { nav.classList.toggle('open'); navToggle.setAttribute('aria-expanded', nav.classList.contains('open')); }
function closeNav() { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
navToggle.addEventListener('click', toggleNav);

// ===== POLYHEDRON (3D SPHERICAL) =====
const FACET_COUNT = 9;
const RADIUS = 280;
const poly = document.getElementById('polyhedron');
let angle = 0, animId = null;
// Keyboard rotation state
let rotationX = -Math.PI / 6; // Initial tilt
let rotationY = 0;
const ROTATION_STEP = Math.PI / 36; // 5 degrees

function initPolyhedron() {
  if (!poly) return;
  poly.innerHTML = '';
  
  facetsData.forEach((f, i) => {
    const el = document.createElement('div');
    el.className = 'facet';
    el.dataset.id = f.id;
    el.tabIndex = 0;
    el.setAttribute('role', 'listitem');
    el.setAttribute('aria-label', `${f.title} — ${f.essence}`);
    el.innerHTML = `<div class="glyph">${f.glyph}</div><div class="title">${escapeHtml(f.title)}</div><div class="essence">${escapeHtml(f.essence)}</div>`;
    
    el.addEventListener('click', () => navigateToFragment(f.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateToFragment(f.id); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); focusNextFacet(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); focusNextFacet(-1); }
      else if (e.key === 'Home') { e.preventDefault(); document.querySelector('.facet').focus(); }
      else if (e.key === 'End') { e.preventDefault(); document.querySelectorAll('.facet').forEach((f,i,a) => { if(i===a.length-1) f.focus(); }); }
    });
    
    poly.appendChild(el);
    setTimeout(() => el.classList.add('visible'), i * 80);
  });
  
  positionFacets();
  startRotation();
}

function positionFacets() {
  const facets = document.querySelectorAll('.facet');
  const angleStep = (Math.PI * 2) / FACET_COUNT;
  
  facets.forEach((el, i) => {
    const theta = i * angleStep - Math.PI / 2 + rotationY;
    const x = RADIUS * Math.cos(theta) * Math.cos(rotationX);
    const y = RADIUS * Math.sin(theta) * Math.cos(rotationX);
    const z = RADIUS * Math.sin(rotationX);
    const rotY = -theta + Math.PI / 2;
    
    el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}rad) rotateX(${-rotationX}rad)`;
  });
}

function startRotation() {
  // Don't start if reduced motion is enabled
  if (reducedMotionEnabled) return;
  
  function rotate() {
    if (reducedMotionEnabled) return;
    angle += 0.0008;
    const facets = document.querySelectorAll('.facet');
    const angleStep = (Math.PI * 2) / FACET_COUNT;
    
    facets.forEach((el, i) => {
      const theta = i * angleStep - Math.PI / 2 + angle + rotationY;
      const x = RADIUS * Math.cos(theta) * Math.cos(rotationX);
      const y = RADIUS * Math.sin(theta) * Math.cos(rotationX);
      const z = RADIUS * Math.sin(rotationX);
      const rotY = -theta + Math.PI / 2;
      
      el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}rad) rotateX(${-rotationX}rad)`;
    });
    
    animId = requestAnimationFrame(rotate);
  }
  rotate();
}

function focusNextFacet(dir) {
  const facets = Array.from(document.querySelectorAll('.facet'));
  const currentIndex = facets.findIndex(f => f === document.activeElement);
  if (currentIndex === -1) return;
  const nextIndex = (currentIndex + dir + facets.length) % facets.length;
  facets[nextIndex].focus();
}

poly?.addEventListener('mouseenter', () => {
  cancelAnimationFrame(animId);
  polyKeyboardActive = true;
});
poly?.addEventListener('mouseleave', () => {
  polyKeyboardActive = false;
  startRotation();
});

// ===== POLYHEDRON KEYBOARD NAVIGATION =====
let polyKeyboardActive = false;

function updatePolyhedronRotation() {
  if (!poly) return;
  positionFacets();
}

poly?.addEventListener('focusin', () => {
  polyKeyboardActive = true;
  cancelAnimationFrame(animId);
});

poly?.addEventListener('focusout', () => {
  polyKeyboardActive = false;
  startRotation();
});

document.addEventListener('keydown', (e) => {
  if (!polyKeyboardActive) return;
  
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      rotationX = Math.min(rotationX + ROTATION_STEP, Math.PI / 2 - 0.1);
      updatePolyhedronRotation();
      break;
    case 'ArrowDown':
      e.preventDefault();
      rotationX = Math.max(rotationX - ROTATION_STEP, -Math.PI / 2 + 0.1);
      updatePolyhedronRotation();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      rotationY -= ROTATION_STEP;
      updatePolyhedronRotation();
      break;
    case 'ArrowRight':
      e.preventDefault();
      rotationY += ROTATION_STEP;
      updatePolyhedronRotation();
      break;
    case 'Home':
      e.preventDefault();
      rotationX = -Math.PI / 6;
      rotationY = 0;
      updatePolyhedronRotation();
      break;
    case 'End':
      e.preventDefault();
      rotationX = -Math.PI / 6;
      rotationY = 0;
      updatePolyhedronRotation();
      break;
  }
});

// Listen for reduced motion changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
  const saved = localStorage.getItem('reducedMotion');
  if (saved === null) { // Only auto-follow if user hasn't explicitly set
    applyReducedMotion(e.matches);
  }
});

// ===== FRAGMENT ACCORDION (SMOOTH) =====
function initFragments() {
  document.querySelectorAll('.fragment-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const item = header.closest('.fragment-item');
      const isExpanded = item.classList.toggle('expanded');
      header.setAttribute('aria-expanded', isExpanded);
      if (isExpanded) history.replaceState(null, '', `#${item.id}`);
    });
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const animatedElements = document.querySelectorAll('.stanza, .lens, .chapter-card, .cycle');
  
  if (reducedMotionEnabled) {
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});
  
  animatedElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initReducedMotion();
  buildNav();
  initPolyhedron();
  initFragments();
  initScrollReveal();
  
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeNav(); });
  
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); closeNav(); }
    });
  });
});