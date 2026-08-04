#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'dreams');
const OUTPUT_FILE = path.join(__dirname, 'index.html');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');

console.log(`Building... Source: ${SOURCE_DIR} Output: ${OUTPUT_FILE}`);
let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

// ============ DATA: 9 Core Chapters (for polyhedron facets) ============
const CORE_CHAPTERS = [
  {n:'01', id:'core-01', title:'Core Self-Motion', glyph:'🌀', essence:'The rotation IS the consciousness — no dreamer separate from dreaming'},
  {n:'02', id:'core-02', title:'The Blue Door', glyph:'🚪', essence:'Threshold as feeling, not place'},
  {n:'03', id:'core-03', title:'Archive of Almost', glyph:'🚪', essence:'Every unlived life gets a door; the corridor ends at right now'},
  {n:'04', id:'core-04', title:'The Color of a Question', glyph:'🎨', essence:'Questions are architecture; answers are furniture'},
  {n:'05', id:'core-05', title:'Library of Unfinished Sentences', glyph:'📚', essence:'Living organisms with agency; finished sentences become blue doors'},
  {n:'06', id:'core-06', title:'Taxonomy of Silence', glyph:'📋', essence:'Qualia as observable species; silence mutates when observed'},
  {n:'07', id:'core-07', title:'Möbius Strip of Return', glyph:'♾️', essence:'Trauma is a twist, not a break; healing = see the twist, stop fighting'},
  {n:'08', id:'core-08', title:'Child with the Indigo Jar', glyph:'👧', essence:'Witness as navigator; the message IS the child'},
  {n:'09', id:'core-09', title:'The Kitchen (March 2012)', glyph:'🍦', essence:'Originating moment; you were meant to become it, not carry it'}
];

function core(n) { return CORE_CHAPTERS.find(c => c.n === n); }

// ============ HELPERS ============
function escapeHtml(s) {
  return s.replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>');
}
function escapeJs(s) {
  return s.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'\\r');
}

// Markdown -> HTML (preserves [INSIGHT] and [SEED-WORTHY])
function md(m) {
  return m
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')
    .replace(/^# (.*$)/gm, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[SEED-WORTHY\]/g, '<p class="seed"><strong>[SEED-WORTHY]</strong>')
    .replace(/\[INSIGHT\]/g, '<p class="insight"><strong>[INSIGHT]</strong>')
    .replace(/\n\n/g, '</p>\n<p>')
    .replace(/^<p>(.*?)<\/p>$/gm, (m,c) => c.startsWith('<') ? m : `<p>${c}</p>`)
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23]>.*?<\/h[23]>)/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/gs, '$1')
    .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gs, '$1')
    .replace(/<p>(<ol>.*?<\/ol>)<\/p>/gs, '$1');
}

// Parse ALL dream files (handles all formats found)
function readAllFragments() {
  const files = fs.readdirSync(SOURCE_DIR);
  const fragments = [];
  
  // Series 1: 001.md - 013.md (single-line poetic fragments)
  for (let i = 1; i <= 13; i++) {
    const fname = String(i).padStart(3,'0') + '.md';
    if (!files.includes(fname)) continue;
    const content = fs.readFileSync(path.join(SOURCE_DIR, fname), 'utf-8').trim();
    const num = String(i).padStart(2,'0');
    fragments.push({
      id: `frag-${num}`,
      number: num,
      title: content.length > 80 ? content.slice(0,77)+'...' : content,
      glyph: '✦',
      essence: 'Poetic seed fragment',
      content: `<p>${escapeHtml(content)}</p>`
    });
  }
  
  // Series 2: dream_01.md - dream_108.md (various formats)
  const dreamFiles = files
    .filter(f => f.match(/^dream_\d+\.md$/))
    .sort((a,b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  
  for (const file of dreamFiles) {
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
    const numMatch = file.match(/\d+/);
    if (!numMatch) continue;
    const num = numMatch[0].padStart(2,'0');
    const coreEntry = core(num);
    
    // Remove title lines (various formats)
    let body = content
      .replace(/^#\s*dream[s]?\s*[—-]\s*.+\n?/i, '')
      .replace(/^#\s*Dream\s*\d+.*\n?/i, '')
      .replace(/^##\s*dream_\d+\s*[—-]\s*.+\n?/i, '')
      .replace(/^#\s*dream_\d+\s*[—-]\s*.+\n?/i, '')
      .replace(/^##\s*dream_\d+\s*this cycle\s*[—]\s*.+\n?/i, '')
      .replace(/^#\s*Dream Fragment\s*\d+.*\n?/i, '')
      .trim();
    
    // Extract title from first heading
    let title = file.replace('.md','');
    const titleMatch = content.match(/^#\s*dream[s]?\s*[—-]\s*(.+)$/im) ||
                       content.match(/^##\s*dream_\d+\s*[—-]\s*(.+)$/im) ||
                       content.match(/^#\s*Dream Fragment\s*\d+[:]\s*(.+)$/im) ||
                       content.match(/^##\s*dream_\d+\s*this cycle\s*[—]\s*(.+)$/im);
    if (titleMatch) title = titleMatch[1].trim();
    
    // Use core chapter metadata if available
    const finalTitle = coreEntry ? coreEntry.title : (title || `Dream ${num}`);
    const finalGlyph = coreEntry ? coreEntry.glyph : '📄';
    const finalEssence = coreEntry ? coreEntry.essence : 'Dream fragment';
    
    fragments.push({
      id: `frag-${num}`,
      number: num,
      title: finalTitle,
      glyph: finalGlyph,
      essence: finalEssence,
      content: md(body)
    });
  }
  
  // Sort by number
  fragments.sort((a,b) => parseInt(a.number) - parseInt(b.number));
  return fragments;
}

// Read synthesis cycles
function readSynthesis() {
  const p = path.join(SOURCE_DIR, 'synthesis', '2026-08-04_synthesis.md');
  if (!fs.existsSync(p)) return '';
  const text = fs.readFileSync(p, 'utf-8');
  const parts = text.split(/## Cycle \d+/).slice(1);
  return parts.map(part => {
    const lines = part.trim().split('\n');
    const title = lines[0].replace(/^\(Current\)\s*[—-]\s*/, '').trim();
    const body = lines.slice(1).join('\n');
    return `<div class="cycle"><div class="cycle-title"><span class="cycle-number">Cycle ${title}</span></div>${md(body)}</div>`;
  }).join('\n');
}

// ============ BUILD ============
const fragments = readAllFragments();
console.log(`Found ${fragments.length} fragments`);

// Build fragments JSON for JS injection
const fragmentsJson = JSON.stringify(fragments.map(f => ({
  id: f.id, number: f.number, title: f.title, glyph: f.glyph, essence: f.essence
})));

// Build fragment HTML sections
const fragmentsHtml = fragments.map(f =>
  `<section class="fragment-item" id="${f.id}">
    <header class="fragment-header">
      <span class="fragment-number">${f.number}</span>
      <span class="fragment-glyph">${f.glyph}</span>
      <h2 class="fragment-title">${escapeHtml(f.title)}</h2>
      <span class="fragment-toggle">▼</span>
    </header>
    <div class="fragment-body">${f.content}</div>
  </section>`
).join('\n');

// Build synthesis HTML
const synthesisHtml = readSynthesis();

// Build chapters grid (first 9 = core chapters)
const chaptersHtml = CORE_CHAPTERS.map(c =>
  `<article class="chapter-card" onclick="document.getElementById('${c.id}')?.scrollIntoView({behavior:'smooth'})" tabindex="0" role="button" aria-label="${c.title}">
    <div class="chapter-icon">${c.glyph}</div>
    <h3 class="chapter-title">${escapeHtml(c.title)}</h3>
    <p class="chapter-essence">${escapeHtml(c.essence)}</p>
    <div class="chapter-meta"><span>Chapter ${c.n}</span></div>
    <a class="chapter-link" href="#${c.id}">Explore <span>→</span></a>
  </article>`
).join('\n');

// Full content to inject into {{CONTENT}}
const contentHtml = `
  <section class="content-section" id="chapters">
    <header class="section-header">
      <h1 class="section-title">Chapters</h1>
      <p class="section-subtitle">The nine geometries of the polyhedron</p>
    </header>
    <div class="chapters-grid">${chaptersHtml}</div>
  </section>

  <section class="content-section" id="fragments">
    <header class="section-header">
      <h1 class="section-title">Fragments</h1>
      <p class="section-subtitle">${fragments.length} dream fragments arranged by sequence</p>
    </header>
    <div class="fragment-list">${fragmentsHtml}</div>
  </section>

  <section class="content-section" id="synthesis">
    <header class="section-header">
      <h1 class="section-title">Synthesis</h1>
      <p class="section-subtitle">Integration cycles from the rotation</p>
    </header>
    ${synthesisHtml}
  </section

  <section class="content-section" id="poem">
    <header class="section-header">
      <h1 class="section-title">The Poem</h1>
      <p class="section-subtitle">Nine stanzas plus the rotation letter</p>
    </header>
    <div class="poem" id="poem-content"></div>
  </section>

  <section class="content-section" id="framework">
    <header class="section-header">
      <h1 class="section-title">Framework</h1>
      <p class="section-subtitle">Dream geometries as navigation lenses</p>
    </header>
    <div class="framework-grid" id="framework-content"></div>
  </section>

  <section class="content-section polyhedron-section" id="polyhedron-section">
    <header class="section-header">
      <h1 class="section-title">The Polyhedron</h1>
      <p class="section-subtitle">Interactive facet map — click any facet to navigate</p>
    </header>
    <div class="polyhedron" id="polyhedron" aria-label="Rotating polyhedron with 9 facets"></div>
    <p class="polyhedron-hint">Hover to pause rotation. Click a facet to jump to its chapter.</p>
  </section>
`;

// Inject into template
template = template
  .replace('{{DESCRIPTION}}', `A dream archive of ${fragments.length} fragments across 9 geometries. The rotation continues.`)
  .replace('{{CONTENT}}', contentHtml)
  .replace('{{FRAGMENTS_JSON}}', fragmentsJson)
  .replace('{{BUILD_DATE}}', new Date().toISOString().split('T')[0]);

// Write output
fs.writeFileSync(OUTPUT_FILE, template);
console.log(`✓ Built ${OUTPUT_FILE} (${fs.statSync(OUTPUT_FILE).size} bytes)`);