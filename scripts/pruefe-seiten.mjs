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
 *   node scripts/pruefe-seiten.mjs [--fehlseite <404.html>] <basis-url> <seite> [<seite> ...]
 *
 * Beispiel:
 *   node scripts/pruefe-seiten.mjs http://127.0.0.1:8099/mika-ux/nereus-tiefsee/ \
 *     index.html fahrzeug.html fahrten.html impressum.html datenschutz.html
 *
 * Mit --fehlseite wird GitHub Pages nachgestellt: Jede Adresse, die der
 * Server nicht kennt, erhält den Inhalt der angegebenen 404-Datei unter der
 * angefragten Adresse. So lässt sich prüfen, ob die Fehlerseite auch tief
 * unterhalb der Pages-Basis Stylesheet, Skript und Rücklinks findet:
 *   node scripts/pruefe-seiten.mjs --fehlseite 404.html \
 *     http://127.0.0.1:8099/10-Demo_Websites/ showcase/gibt-es-nicht/
 *
 * Zielgrößen: gemeldet werden Ziele unter 44 px Höhe (WCAG 2.5.5 / DESIGN.md)
 * oder unter 24 px Breite; Inline-Links im Fließtext sind ausgenommen.
 */
import fs from 'node:fs';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright fehlt. Einmalig installieren:\n  npm install playwright\n' +
    'Der Browser ist in dieser Umgebung bereits vorhanden; setze nötigenfalls\n' +
    '  PLAYWRIGHT_CHROMIUM=/opt/pw-browsers/chromium');
  process.exit(1);
}

const argumente = process.argv.slice(2);
let fehlseite = null;
const fehlseiteIndex = argumente.indexOf('--fehlseite');
if (fehlseiteIndex !== -1) {
  const datei = argumente[fehlseiteIndex + 1];
  if (!datei || !fs.existsSync(datei)) {
    console.error('--fehlseite braucht den Pfad zu einer vorhandenen 404-Datei.');
    process.exit(1);
  }
  fehlseite = fs.readFileSync(datei, 'utf8');
  argumente.splice(fehlseiteIndex, 2);
}

const [basis, ...seiten] = argumente;

if (!basis || seiten.length === 0) {
  console.error('Aufruf: node scripts/pruefe-seiten.mjs [--fehlseite <404.html>] <basis-url> <seite> [...]');
  process.exit(1);
}

// Ohne abschließenden Schrägstrich würde new URL() das letzte Segment der
// Basis verwerfen und stillschweigend das Elternverzeichnis prüfen.
const basisUrl = basis.endsWith('/') ? basis : `${basis}/`;

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

    const ziel = new URL(seite, basisUrl).href;
    // Bei --fehlseite ist das 404 des Dokuments selbst erwartet; alles, was die
    // Fehlerseite danach nachlädt, muss aber gefunden werden.
    const erwartet404 = (r) => fehlseite !== null && r.status() === 404 && r.url() === ziel;

    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      if (fehlseite !== null && m.location()?.url === ziel && /status of 404/.test(m.text())) return;
      fehler.push(`Konsole: ${m.text()}`);
    });
    page.on('pageerror', (e) => fehler.push(`Skriptfehler: ${e.message}`));
    page.on('requestfailed', (r) => fehler.push(`Anfrage fehlgeschlagen: ${r.url()}`));
    page.on('response', (r) => { if (r.status() >= 400 && !erwartet404(r)) fehler.push(`HTTP ${r.status()}: ${r.url()}`); });

    if (fehlseite !== null) {
      await page.route('**/*', async (route) => {
        if (route.request().resourceType() !== 'document') return route.continue();
        const antwort = await route.fetch();
        if (antwort.status() !== 404) return route.fulfill({ response: antwort });
        return route.fulfill({ status: 404, contentType: 'text/html; charset=utf-8', body: fehlseite });
      });
    }

    await page.goto(ziel, { waitUntil: 'networkidle' });
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
        if (r.height < 44 || r.width < 24) {
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
