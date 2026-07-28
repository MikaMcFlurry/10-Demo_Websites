/**
 * Lädt Google-Fonts-woff2-Dateien in ein lokales assets/fonts-Verzeichnis und
 * schreibt eine fonts.css mit relativen src-Pfaden. Zur Laufzeit entsteht damit
 * keine Anfrage an Dritt-Server.
 *
 * Aufruf:
 *   node scripts/fetch-fonts.mjs <zielordner> "<family spec>" ["<family spec>" ...]
 *
 * Family spec folgt der Google-Fonts-css2-Syntax, z. B.
 *   "Anybody:wght@400..900"
 *   "Figtree:ital,wght@0,400..700;1,400"
 */
import fs from 'node:fs';
import path from 'node:path';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const [targetDir, ...families] = process.argv.slice(2);
if (!targetDir || families.length === 0) {
  console.error('Aufruf: node scripts/fetch-fonts.mjs <zielordner> "<family spec>" [...]');
  process.exit(1);
}

const outDir = path.resolve(targetDir);
fs.mkdirSync(outDir, { recursive: true });

const query = families.map((family) => `family=${encodeURIComponent(family)}`).join('&');
const cssUrl = `https://fonts.googleapis.com/css2?${query}&display=swap`;

const response = await fetch(cssUrl, { headers: { 'User-Agent': UA } });
if (!response.ok) {
  console.error(`Google Fonts antwortete mit ${response.status} für ${cssUrl}`);
  process.exit(1);
}
const css = await response.text();

/** Baut einen sprechenden, kollisionsfreien Dateinamen aus dem @font-face-Block. */
function fileNameFor(block, subset, seen) {
  const value = (name) => block.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim() ?? '';
  const family = value('font-family').replace(/['"]/g, '').toLowerCase().replace(/\s+/g, '-');
  const style = value('font-style') || 'normal';
  const weight = (value('font-weight') || '400').replace(/\s+/g, '-');

  let name = `${family}-${style}-${weight}-${subset}.woff2`;
  let n = 2;
  while (seen.has(name)) name = `${family}-${style}-${weight}-${subset}-${n++}.woff2`;
  seen.add(name);
  return name;
}

// css2 setzt den Subset-Namen als Kommentar VOR den zugehörigen @font-face-Block.
const blocks = [];
for (const match of css.matchAll(/(?:\/\*\s*([a-z0-9\[\]-]+)\s*\*\/\s*)?(@font-face\s*\{[^}]*\})/gi)) {
  blocks.push({ subset: match[1] ?? 'subset', block: match[2] });
}

const seen = new Set();
const rewritten = [];

for (const { subset, block } of blocks) {
  const url = block.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
  if (!url) continue;

  const fileName = fileNameFor(block, subset, seen);
  const binary = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!binary.ok) {
    console.error(`Download fehlgeschlagen (${binary.status}): ${url}`);
    process.exit(1);
  }
  fs.writeFileSync(path.join(outDir, fileName), Buffer.from(await binary.arrayBuffer()));
  rewritten.push(block.replace(/url\(https:\/\/[^)]+\.woff2\)/, `url("${fileName}")`).trim());
  console.log(`  ${fileName}`);
}

const header = `/* Selbst gehostete Schriften – keine Anfrage an Dritt-Server (DSGVO).
   Quelle: Google Fonts, SIL Open Font License 1.1
   Erzeugt mit scripts/fetch-fonts.mjs */\n\n`;
fs.writeFileSync(path.join(outDir, 'fonts.css'), header + rewritten.join('\n\n') + '\n');
console.log(`${rewritten.length} Schnitte nach ${path.relative(process.cwd(), outDir)} geschrieben.`);
