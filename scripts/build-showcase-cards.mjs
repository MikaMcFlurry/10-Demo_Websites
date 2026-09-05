/**
 * Erzeugt je Website einen maschinenlesbaren Steckbrief (showcase.json)
 * aus ihrer Karte auf der Startseite und dem Inhalt ihres Ordners. Die
 * Startseite bleibt die einzige Quelle für Nummer, Branche, Form, Text und
 * MXL-Herkunft — das Script schreibt sie nur in eine Form, die andere
 * Programme lesen können.
 *
 * Aufruf:
 *   node scripts/build-showcase-cards.mjs          schreibt alle Steckbriefe
 *   node scripts/build-showcase-cards.mjs --check  prüft nur, ob sie aktuell sind
 *
 * Ohne Abhängigkeiten; liest ausschließlich index.html, showcase/ und mika-ux/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

const SCHEMA = 'mika.showcase-card.v1';
const LIVE_BASE = 'https://mikamcflurry.github.io/10-Demo_Websites/';
const FOLDERS = ['showcase', 'mika-ux'];

const COLLECTIONS = {
  'collection--a': { collection: 'A', origin: 'Sammlung A' },
  'collection--b': { collection: 'B', origin: 'Sammlung B' },
  'collection--mika': { collection: 'C', origin: 'Mika UX Library' }
};

// Anmerkungen, die nicht auf der Karte stehen, aber zum Steckbrief gehören.
const NOTES = {
  'schwarzwerk-presswerk': 'Basiert auf MXL-147, einem dokumentierten, noch unvalidierten Analysefall.'
};

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ', shy: '' };

function text(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
      if (entity[0] === '#') {
        const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
        return String.fromCodePoint(code);
      }
      return entity in ENTITIES ? ENTITIES[entity] : match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function field(card, expression, label, slug) {
  const match = card.match(expression);
  if (!match) throw new Error(`Karte ${slug}: ${label} nicht gefunden.`);
  return match;
}

const hub = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cards = new Map();

for (const section of hub.matchAll(/<section\b[^>]*class="([^"]*\bcollection\b[^"]*)"[\s\S]*?<\/section>/g)) {
  const key = section[1].split(/\s+/).find((name) => name in COLLECTIONS);
  if (!key) throw new Error(`Sammlung ohne bekannte Klasse: ${section[1]}`);
  const { collection, origin } = COLLECTIONS[key];

  // Karten sind Links mit der Klasse „work“ — unabhängig von weiteren
  // Klassen und der Reihenfolge der Attribute (wie in validate-static-showcase.mjs).
  for (const open of section[0].matchAll(/<a\b([^>]*)>/g)) {
    const attrs = open[1];
    if (!/\bclass="[^"]*\bwork\b[^"]*"/.test(attrs)) continue;
    const href = attrs.match(/\bhref="(showcase|mika-ux)\/([a-z0-9-]+)\/"/);
    if (!href) continue;
    const end = section[0].indexOf('</a>', open.index);
    const card = section[0].slice(open.index, end + 4);
    const [, folder, slug] = href;
    const meta = field(card, /<p class="work__meta"><span>(\d{2}) \/ ([^<]+)<\/span><span>([^<]+)<\/span><\/p>/, 'work__meta', slug);
    const title = field(card, /<h3 class="work__title">([\s\S]*?)<\/h3>/, 'work__title', slug);
    const description = field(card, /<p class="work__description">([\s\S]*?)<\/p>/, 'work__description', slug);
    const ids = card.match(/<span class="work__source-ids">([\s\S]*?)<\/span>/);
    const inputs = ids ? [...ids[1].matchAll(/MXL-\d{3}/g)].map((m) => m[0]) : [];

    if (cards.has(slug)) throw new Error(`Karte ${slug} kommt mehrfach vor.`);
    cards.set(slug, {
      folder,
      number: meta[1],
      industry: text(meta[2]),
      form: text(meta[3]),
      title: text(title[1]),
      description: text(description[1]),
      collection,
      origin,
      inputs
    });
  }
}

const errors = [];
const written = [];
let stale = 0;

const order = [...cards.values()].map((c) => c.number);
const numbers = [...order].sort();
if (numbers.some((n, i) => Number(n) !== i + 1)) {
  errors.push(`Hub-Nummern sind nicht lückenlos: ${numbers.join(', ')}`);
}
// Besucher sehen die Karten in Dokumentreihenfolge — sie muss der Nummernfolge entsprechen.
if (order.join() !== numbers.join()) {
  errors.push(`Hub-Karten stehen nicht in Nummernfolge: ${order.join(', ')}`);
}

for (const folder of FOLDERS) {
  const dir = path.join(root, folder);
  const slugs = fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'index.html')))
    .map((entry) => entry.name)
    .sort();

  for (const slug of slugs) {
    const card = cards.get(slug);
    if (!card) { errors.push(`${folder}/${slug}: keine Karte auf der Startseite.`); continue; }
    if (card.folder !== folder) { errors.push(`${folder}/${slug}: Karte verweist auf ${card.folder}/.`); continue; }

    const sitePath = `${folder}/${slug}`;
    const pages = fs.readdirSync(path.join(dir, slug)).filter((name) => name.endsWith('.html')).sort();

    const steckbrief = {
      schema: SCHEMA,
      slug,
      title: card.title,
      number: card.number,
      collection: card.collection,
      industry: card.industry,
      form: card.form,
      description: card.description,
      origin: card.origin,
      library_inputs: card.inputs,
      mode: card.inputs.length === 0 ? null : card.inputs.length === 1 ? 'PURE' : 'MIXED',
      pages,
      path: sitePath,
      live_url: `${LIVE_BASE}${sitePath}/`,
      status: 'published',
      notes: NOTES[slug] ?? null
    };

    const target = path.join(dir, slug, 'showcase.json');
    const json = `${JSON.stringify(steckbrief, null, 2)}\n`;
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;

    if (current === json) continue;
    if (check) {
      stale += 1;
      console.error(`${sitePath}/showcase.json ${current === null ? 'fehlt' : 'ist veraltet'}.`);
    } else {
      fs.writeFileSync(target, json);
      written.push(sitePath);
    }
  }
}

for (const [slug, card] of cards) {
  if (!fs.existsSync(path.join(root, card.folder, slug, 'index.html'))) {
    errors.push(`Karte ${card.folder}/${slug} zeigt auf einen Ordner ohne index.html.`);
  }
}

if (errors.length > 0) {
  console.error(`Steckbriefe nicht erzeugt, ${errors.length} Befund(e):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (check) {
  if (stale > 0) {
    console.error(`${stale} Steckbrief(e) nicht aktuell — node scripts/build-showcase-cards.mjs ausführen.`);
    process.exit(1);
  }
  console.log(`${cards.size} Steckbriefe aktuell.`);
} else {
  console.log(`${cards.size} Karten gelesen, ${written.length} Steckbrief(e) geschrieben.`);
}
