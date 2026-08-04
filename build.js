#!/usr/bin/env node
/**
 * Build script for The Polyhedron
 * Reads fragments from source directory and generates index.html
 * Usage: node build.js [--source=~/dreams] [--output=./index.html]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const SOURCE_DIR = process.argv.find(a => a.startsWith('--source='))?.split('=')[1] || path.join(process.env.HOME || process.env.USERPROFILE, 'dreams');
const OUTPUT_FILE = process.argv.find(a => a.startsWith('--output='))?.split('=')[1] || path.join(__dirname, 'index.html');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');

console.log(`Building The Polyhedron...`);
console.log(`Source: ${SOURCE_DIR}`);
console.log(`Output: ${OUTPUT_FILE}`);

// Read template
let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

// Read all fragment files
function readFragments() {
  const fragments = [];
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(f => f.match(/^dream_\d+\.md$/))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0]);
      const nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });

  for (const file of files) {
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
    const match = content.match(/^# dream[s]?\s*[—-]\s*(.+)/m);
    const title = match ? match[1].trim() : file.replace('.md', '');
    const number = file.match(/\d+/)[0].padStart(2, '0');
    const glyph = getGlyph(number);
    
    fragments.push({
      id: `frag-${number}`,
      number,
      title,
      glyph,
      content: content.replace(/^# dream[s]?\s*[—-]\s*.+\n/, '').trim()
    });
  }
  return fragments;
}

function getGlyph(num) {
  const glyphs = {
    '01': '🚪', '02': '🫙', '03': '🚪', '04': '🎨', '05': '📚',
    '06': '📋', '07': '♾️', '08': '👧', '09': '🍦'
  };
  return glyphs[num] || '📄';
}

// Generate fragments HTML
function generateFragmentsHTML(fragments) {
  return fragments.map(f => `
    <section class="fragment" id="${f.id}">
      <header class="fragment-header">
        <span class="fragment-number">${f.number}</span>
        <span class="fragment-glyph">${f.glyph}</span>
        <h2 class="fragment-title">${escapeHtml(f.title)}</h2>
      </header>
      <div class="fragment-body">
        ${markdownToHtml(f.content)}
      </div>
    </section>
  `).join('\n');
}

// Generate polyhedron facets JS
function generateFacetsJS(fragments) {
  const facetsData = fragments.map(f => 
    `{id:'${f.id}',glyph:'${f.glyph}',title:'${escapeJs(f.title)}',essence:'${getEssence(f.title)}'}`
  ).join(',\n      ');
  
  return `const facetsData=[${facetsData}];`;
}

function getEssence(title) {
  const essences = {
    'The Blue Door': 'Threshold as feeling, not place',
    'Through the Blue Door': 'Silence as portable substance',
    'The Corridor of Almost': 'Archive of unlived lives',
    'The Color of a Question': 'Questions as architecture',
    'The Library of Unfinished Sentences': 'Living organisms with agency',
    'The Taxonomy of Silence': 'Qualia as observable species',
    'The Möbius Strip of Return': 'Trauma as twist, not break',
    'The Child with the Indigo Jar': 'Witness as navigator',
    'The Kitchen (March 2012)': 'Originating moment'
  };
  return essences[title] || 'Dream fragment';
}

// Simple markdown to HTML (handles basics)
function markdownToHtml(md) {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[SEED-WORTHY\]/g, '<span class="seed"><strong>[SEED-WORTHY]</strong>')
    .replace(/\[INSIGHT\]/g, '<p class="insight"><strong>[INSIGHT]</strong>')
    .replace(/\n\n/g, '</p>\n<p>')
    .replace(/^<p>(.*?)<\/p>$/gm, (m, c) => c.startsWith('<') ? m : `<p>${c}</p>`)
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[23]>.*?<\/h[23]>)/g, '$1')
    .replace(/(<\/h[23]>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/gs, '$1')
    .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gs, '$1')
    .replace(/<p>(<ol>.*?<\/ol>)<\/p>/gs, '$1');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
}

function escapeJs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// Read synthesis
function readSynthesis() {
  const synthesisPath = path.join(SOURCE_DIR, 'synthesis', '2026-08-04_synthesis.md');
  if (!fs.existsSync(synthesisPath)) return '';
  
  const content = fs.readFileSync(synthesisPath, 'utf-8');
  // Extract cycles 91+
  const cycles = content.split(/## Cycle \d+/).slice(1).map(c => {
    const lines = c.trim().split('\n');
    const title = lines[0].replace(/^\(Current\)\s*—\s*/, '').trim();
    const body = lines.slice(1).join('\n');
    return { title: `Cycle ${title}`, body };
  });
  
  return cycles.map(c => `
    <div class="cycle">
      <div class="cycle-title">${escapeHtml(c.title)}</div>
      ${markdownToHtml(c.body)}
    </div>
  `).join('\n');
}

// Main build
try {
  const fragments = readFragments();
  console.log(`Found ${fragments.length} fragments`);
  
  const fragmentsHTML = generateFragmentsHTML(fragments);
  const facetsJS = generateFacetsJS(fragments);
  const synthesisHTML = readSynthesis();
  
  // Replace placeholders in template
  let html = template
    .replace('{{FRAGMENTS_HTML}}', fragmentsHTML)
    .replace('{{FACETS_JS}}', facetsJS)
    .replace('{{SYNTHESIS_HTML}}', synthesisHTML)
    .replace('{{BUILD_DATE}}', new Date().toISOString().split('T')[0]);
  
  fs.writeFileSync(OUTPUT_FILE, html);
  console.log(`✅ Built ${OUTPUT_FILE}`);
  
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}