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
const htmlFiles = [
  path.join(root, 'index.html'),
  ...walk(showcaseRoot).filter((file) => file.endsWith('.html'))
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
if (count(hub, /<a\b[^>]*class=["'][^"']*\bwork\b/gi) !== selectedSlugs.length) {
  errors.push('Portfolio-Hub muss genau zehn sichtbare Projektkarten enthalten.');
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
