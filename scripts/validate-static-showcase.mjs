import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const errors = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function count(source, expression) {
  return Array.from(source.matchAll(expression)).length;
}

function localTarget(file, rawTarget) {
  const withoutFragment = rawTarget.split('#')[0].split('?')[0];
  if (!withoutFragment) return null;
  if (/^(?:[a-z]+:|\/\/)/i.test(withoutFragment)) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    decoded = withoutFragment;
  }

  const absolute = path.resolve(path.dirname(file), decoded);
  if (decoded.endsWith('/') || (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory())) {
    return path.join(absolute, 'index.html');
  }
  return absolute;
}

function fragmentTarget(file, rawTarget) {
  const [rawPath, rawFragment] = rawTarget.split('#', 2);
  if (!rawFragment || /^(?:[a-z]+:|\/\/)/i.test(rawPath)) return null;

  let fragment;
  try {
    fragment = decodeURIComponent(rawFragment);
  } catch {
    fragment = rawFragment;
  }

  const target = localTarget(file, rawPath || path.basename(file)) ?? file;
  return { target, fragment };
}

const showcaseRoot = path.join(root, 'showcase');
const mikaRoot = path.join(root, 'mika-ux');
const htmlFiles = [
  path.join(root, 'index.html'),
  ...walk(showcaseRoot).filter((file) => file.endsWith('.html')),
  ...(fs.existsSync(mikaRoot) ? walk(mikaRoot).filter((file) => file.endsWith('.html')) : [])
];

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, 'utf8');

  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) {
    errors.push(`${relative}: <html> benötigt ein lang-Attribut.`);
  }
  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) {
    errors.push(`${relative}: Viewport-Meta fehlt.`);
  }
  if (count(html, /<h1\b/gi) !== 1) {
    errors.push(`${relative}: erwartet genau ein h1.`);
  }
  if (count(html, /<main\b/gi) !== 1) {
    errors.push(`${relative}: erwartet genau ein semantisches <main>.`);
  }

  const skip = html.match(/<a\b[^>]*class=["'][^"']*\bskip(?:-link)?\b[^"']*["'][^>]*href=["']#([^"']+)["']/i)
    ?? html.match(/<a\b[^>]*href=["']#([^"']+)["'][^>]*class=["'][^"']*\bskip(?:-link)?\b/i);
  if (!skip) {
    errors.push(`${relative}: Skip-Link fehlt.`);
  } else {
    const id = skip[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`\\bid=["']${id}["']`, 'i').test(html)) {
      errors.push(`${relative}: Skip-Link-Ziel #${skip[1]} fehlt.`);
    }
  }

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const target = localTarget(file, match[1]);
    if (target && !fs.existsSync(target)) {
      errors.push(`${relative}: lokales Ziel fehlt: ${match[1]}`);
    }

    if (match[0].toLowerCase().startsWith('href=')) {
      const fragment = fragmentTarget(file, match[1]);
      if (fragment && fs.existsSync(fragment.target) && fragment.target.endsWith('.html')) {
        const targetHtml = fs.readFileSync(fragment.target, 'utf8');
        const escaped = fragment.fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`\\bid=["']${escaped}["']`, 'i').test(targetHtml)) {
          errors.push(`${relative}: Fragmentziel fehlt: ${match[1]}`);
        }
      }
    }
  }
}

const selectedSlugs = [
  'haertl-praezision',
  'hochofen-festival',
  'weingut-steinhalde',
  'brandt-ostermann',
  'blockwerk-boulder',
  'kantine-klee',
  'nachhall-radio',
  'krawumm-labor',
  'nordhafen-verkehr',
  'fokus40-augenatelier'
];

for (const slug of selectedSlugs) {
  const target = path.join(showcaseRoot, slug, 'index.html');
  if (!fs.existsSync(target)) errors.push(`Ausgewähltes Showcase fehlt: ${slug}`);
}

const hub = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Jedes Showcase der Zehner-Auswahl braucht genau eine Karte auf dem Hub.
for (const slug of selectedSlugs) {
  if (count(hub, new RegExp(`class=["'][^"']*\\bwork\\b[^"']*["'][^>]*href=["']showcase/${slug}/`, 'gi'))
    + count(hub, new RegExp(`href=["']showcase/${slug}/["'][^>]*class=["'][^"']*\\bwork\\b`, 'gi')) !== 1) {
    errors.push(`Portfolio-Hub braucht genau eine Projektkarte für showcase/${slug}.`);
  }
}

// Sammlung C: jede Website unter mika-ux/ braucht eine Karte samt
// nachvollziehbarer MXL-Herkunft — sonst ist die Ableitung nicht belegt.
const mikaSlugs = fs.existsSync(mikaRoot)
  ? fs.readdirSync(mikaRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(mikaRoot, entry.name, 'index.html')))
      .map((entry) => entry.name)
      .sort()
  : [];

const mikaSection = hub.match(/<section\b[^>]*class=["'][^"']*\bcollection--mika\b[^"']*["'][\s\S]*?<\/section>/i)?.[0];

if (mikaSlugs.length > 0) {
  if (!mikaSection) {
    errors.push('Portfolio-Hub benötigt eine Sammlung „Mika UX Library“ (collection--mika).');
  } else {
    const cards = [...mikaSection.matchAll(/<a\b[^>]*class=["'][^"']*\bwork\b[^"']*["'][\s\S]*?<\/a>/gi)].map((m) => m[0]);

    if (cards.length !== mikaSlugs.length) {
      errors.push(`Sammlung Mika UX: ${mikaSlugs.length} Websites unter mika-ux/, aber ${cards.length} Karten.`);
    }

    for (const slug of mikaSlugs) {
      const card = cards.find((c) => new RegExp(`href=["']mika-ux/${slug}/["']`, 'i').test(c));
      if (!card) {
        errors.push(`Sammlung Mika UX: keine Karte für mika-ux/${slug}.`);
        continue;
      }

      const ids = card.match(/<span\b[^>]*class=["'][^"']*\bwork__source-ids\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1];
      const found = ids ? [...ids.matchAll(/MXL-\d{3}/g)].map((m) => m[0]) : [];

      if (found.length === 0) {
        errors.push(`Sammlung Mika UX: mika-ux/${slug} nennt keine MXL-Nummer.`);
      }

      // Die Karte behauptet „eine Vorlage“ oder „mehrere Vorlagen“ — das muss
      // zur Anzahl der genannten Nummern passen.
      const claimsSingle = /work__source-kind[^>]*>\s*Eine Vorlage/i.test(card);
      if (claimsSingle && found.length !== 1) {
        errors.push(`Sammlung Mika UX: mika-ux/${slug} ist als reine Vorlage ausgezeichnet, nennt aber ${found.length} Nummern.`);
      }
      if (!claimsSingle && found.length < 2) {
        errors.push(`Sammlung Mika UX: mika-ux/${slug} ist als Mischung ausgezeichnet, nennt aber ${found.length} Nummer(n).`);
      }
    }
  }
}

if (!/<details\b[^>]*data-archive/i.test(hub)) {
  errors.push('Portfolio-Hub benötigt ein natives, aufklappbares Archiv.');
}

if (errors.length > 0) {
  console.error(`Static showcase validation failed with ${errors.length} finding(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages and ${selectedSlugs.length} selected showcases.`);
