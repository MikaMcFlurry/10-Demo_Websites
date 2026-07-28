/**
 * Browserprüfung einer Demo-Website: Konsolenfehler, fehlende Ressourcen,
 * horizontaler Überlauf und zu kleine Zielgrößen — je Seite auf Desktop und
 * Mobil. Ergänzt validate-static-showcase.mjs, das nur den Quelltext liest.
 *
 * Voraussetzungen: Playwright (`npm install playwright`) und ein laufender
 * Webserver über dem Projektverzeichnis, etwa
 *   python3 -m http.server 8099 --bind 127.0.0.1
 *
 * Aufruf:
 *   node scripts/pruefe-seiten.mjs <basis-url> <seite> [<seite> ...]
 *
 * Beispiel:
 *   node scripts/pruefe-seiten.mjs http://127.0.0.1:8099/mika-ux/nereus-tiefsee/ \
 *     index.html fahrzeug.html fahrten.html impressum.html datenschutz.html
 */
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright fehlt. Einmalig installieren:\n  npm install playwright\n' +
    'Der Browser ist in dieser Umgebung bereits vorhanden; setze nötigenfalls\n' +
    '  PLAYWRIGHT_CHROMIUM=/opt/pw-browsers/chromium');
  process.exit(1);
}

const [basis, ...seiten] = process.argv.slice(2);

if (!basis || seiten.length === 0) {
  console.error('Aufruf: node scripts/pruefe-seiten.mjs <basis-url> <seite> [...]');
  process.exit(1);
}

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobil', { width: 390, height: 844 }]
];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? undefined
});

let befunde = 0;

for (const seite of seiten) {
  for (const [label, viewport] of VIEWPORTS) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const fehler = [];

    page.on('console', (m) => { if (m.type() === 'error') fehler.push(`Konsole: ${m.text()}`); });
    page.on('pageerror', (e) => fehler.push(`Skriptfehler: ${e.message}`));
    page.on('requestfailed', (r) => fehler.push(`Anfrage fehlgeschlagen: ${r.url()}`));
    page.on('response', (r) => { if (r.status() >= 400) fehler.push(`HTTP ${r.status()}: ${r.url()}`); });

    await page.goto(new URL(seite, basis).href, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const ueberlauf = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);

    const kleineZiele = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('a, button, input, select, [role="button"], [role="tab"]')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        // Inline-Links im Fließtext sind von der Zielgrößenregel ausgenommen.
        if (el.tagName === 'A' && el.parentElement?.closest('p, li, address, td, th')) continue;
        if (r.height < 40 || r.width < 24) {
          out.push(`${el.tagName}.${el.className || '-'} ${Math.round(r.width)}×${Math.round(r.height)} „${(el.textContent || '').trim().slice(0, 24)}“`);
        }
      }
      return out.slice(0, 6);
    });

    const schlecht = [...fehler];
    if (ueberlauf > 1) schlecht.push(`horizontaler Überlauf: ${ueberlauf}px`);
    if (kleineZiele.length) schlecht.push(`zu kleine Ziele: ${kleineZiele.join(' | ')}`);

    if (schlecht.length) {
      befunde += 1;
      console.log(`\n✗ ${seite} [${label}]`);
      for (const z of schlecht) console.log(`   ${z}`);
    } else {
      console.log(`✓ ${seite} [${label}]`);
    }

    await page.close();
  }
}

await browser.close();

if (befunde > 0) {
  console.log(`\n${befunde} Seite/Viewport-Kombinationen mit Befund.`);
  process.exit(1);
}

console.log('\nAlles sauber.');
