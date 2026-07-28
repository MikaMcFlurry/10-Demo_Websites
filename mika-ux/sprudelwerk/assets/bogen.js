/*
  SPRUDELWERK — Interaktion
  Alles läuft ohne Netzwerk, ohne Speicher, ohne Tracker. Ohne JavaScript
  bleiben Navigation und Inhalte vollständig lesbar; nur Mischpult und
  Kistenrechner brauchen Skript und stehen deshalb hinter einem Fallback.
*/
(() => {
  'use strict';

  /* ── Menü auf schmalen Viewports ─────────────────────────────────── */
  const taste = document.querySelector('.menuetaste');
  const menue = document.getElementById('menue');

  if (taste && menue) {
    taste.addEventListener('click', () => {
      const offen = menue.hasAttribute('data-offen');
      menue.toggleAttribute('data-offen', !offen);
      taste.setAttribute('aria-expanded', String(!offen));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !menue.hasAttribute('data-offen')) return;
      menue.removeAttribute('data-offen');
      taste.setAttribute('aria-expanded', 'false');
      taste.focus();
    });
  }

  /* ── Mischpult ───────────────────────────────────────────────────── */

  /* Nur echte Paare sind benannt. Alles andere heißt ehrlich „Versuch“. */
  const PAARE = {
    '1+2': { name: 'Abendrot', note: 'Holunder trägt, Rhabarber schneidet gegen. Der Klassiker im Haus.' },
    '1+4': { name: 'Heuwiese', note: 'Holunder und Salbei, dazu Zitrone. Trocken, fast kräutrig.' },
    '2+5': { name: 'Kupferstich', note: 'Rhabarber und Sanddorn. Sehr sauer, sehr wach, nichts für nebenbei.' },
    '3+4': { name: 'Schulhof', note: 'Waldmeister mit Zitrone. Grün, laut, unbestreitbar Kindheit.' },
    '2+6': { name: 'Schattenmorelle', note: 'Rhabarber unter Kirsche und Schlehe. Dunkel und herb im Abgang.' },
    '3+6': { name: 'Dickicht', note: 'Waldmeister und Schlehe. Ein Wald im Glas, leicht bitter.' },
    '4+5': { name: 'Dünenlicht', note: 'Zitrone Salbei mit Sanddorn. Salzig-hell, unser Sommerpaar.' },
    '1+6': { name: 'Hollerdunkel', note: 'Holunder und Kirsche. Rund, dunkel, ohne Schärfe.' },
    '5+6': { name: 'Glutkern', note: 'Sanddorn trifft Schlehe. Sehr kräftig, gut mit Eis.' },
    '1+3': { name: 'Maigrün', note: 'Holunder und Waldmeister. Beide leise — zusammen erstaunlich klar.' },
    '2+4': { name: 'Rosengarten', note: 'Rhabarber und Salbei. Blumig, mit einem trockenen Ende.' },
    '2+3': { name: 'Beetnachbarn', note: 'Rhabarber und Waldmeister. Ungewöhnlich, funktioniert nur kalt.' },
    '3+5': { name: 'Nordhang', note: 'Waldmeister und Sanddorn. Kantig, aber sauber.' },
    '4+6': { name: 'Späte Ernte', note: 'Zitrone Salbei mit Kirsche Schlehe. Reif, dunkel, kaum süß.' },
    '1+5': { name: 'Bernstein', note: 'Holunder und Sanddorn. Warm im Ton, säurebetont.' }
  };

  const pult = document.querySelector('[data-mischpult]');

  if (pult) {
    const tasten = [...pult.querySelectorAll('.wahl button')];
    const probe = pult.querySelector('[data-probe]');
    const name = pult.querySelector('[data-name]');
    const note = pult.querySelector('[data-note]');
    const teile = pult.querySelector('[data-teile]');
    const bogenNr = pult.querySelector('[data-bogennr]');
    const stand = pult.querySelector('[data-stand]');

    const gewaehlt = () => tasten.filter((t) => t.getAttribute('aria-pressed') === 'true');

    function zeichne() {
      const aktiv = gewaehlt();

      // Bei weniger als zwei Sorten dürfen alle wieder gewählt werden.
      tasten.forEach((t) => {
        t.disabled = aktiv.length >= 2 && t.getAttribute('aria-pressed') !== 'true';
      });

      if (aktiv.length < 2) {
        probe.style.removeProperty('--probe');
        name.textContent = 'Zwei Sorten wählen';
        note.textContent = 'Das Mischpult zeigt nur Paare, die wir wirklich abgefüllt haben.';
        teile.textContent = '—';
        bogenNr.textContent = '—';
        stand.textContent = `${aktiv.length} von 2 Sorten gewählt.`;
        return;
      }

      const [a, b] = aktiv.map((t) => Number(t.dataset.nr)).sort((x, y) => x - y);
      const paar = PAARE[`${a}+${b}`] ?? {
        name: 'Versuch ohne Namen',
        note: 'Dieses Paar steht noch im Laborbuch. Getestet, aber nicht abgefüllt.'
      };

      probe.style.setProperty(
        '--probe',
        `linear-gradient(122deg, ${aktiv[0].dataset.farbe}, ${aktiv[1].dataset.farbe})`
      );
      name.textContent = paar.name;
      note.textContent = paar.note;
      teile.textContent = aktiv.map((t) => t.dataset.sorte).join(' + ');
      bogenNr.textContent = `B–${String(a)}${String(b)}`;
      stand.textContent = `${paar.name}. ${paar.note}`;
    }

    tasten.forEach((t) => {
      t.addEventListener('click', () => {
        const an = t.getAttribute('aria-pressed') === 'true';
        t.setAttribute('aria-pressed', String(!an));
        zeichne();
      });
    });

    pult.querySelector('[data-zuruecksetzen]')?.addEventListener('click', () => {
      tasten.forEach((t) => t.setAttribute('aria-pressed', 'false'));
      zeichne();
      tasten[0].focus();
    });

    pult.hidden = false;
    document.querySelector('[data-mischpult-fallback]')?.remove();
    zeichne();
  }

  /* ── Kistenrechner ───────────────────────────────────────────────── */

  const rechner = document.querySelector('[data-rechner]');

  if (rechner) {
    const PREIS_FLASCHE = 1.35;   // 0,33 l, netto Ware
    const PFAND_FLASCHE = 0.15;
    const PFAND_KISTE = 3.10;
    const FLASCHEN_JE_KISTE = 20;

    const kisten = rechner.querySelector('#kisten');
    const anzeige = rechner.querySelector('[data-kisten-anzeige]');
    const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

    const felder = {
      flaschen: rechner.querySelector('[data-flaschen]'),
      ware: rechner.querySelector('[data-ware]'),
      pfand: rechner.querySelector('[data-pfand]'),
      gesamt: rechner.querySelector('[data-gesamt]')
    };

    function rechne() {
      const n = Math.max(1, Math.min(40, Number(kisten.value) || 1));
      const flaschen = n * FLASCHEN_JE_KISTE;
      const ware = flaschen * PREIS_FLASCHE;
      const pfand = flaschen * PFAND_FLASCHE + n * PFAND_KISTE;

      anzeige.textContent = n === 1 ? '1 Kiste' : `${n} Kisten`;
      felder.flaschen.textContent = `${flaschen} Flaschen à 0,33 l`;
      felder.ware.textContent = euro.format(ware);
      felder.pfand.textContent = euro.format(pfand);
      felder.gesamt.textContent = euro.format(ware + pfand);
    }

    kisten.addEventListener('input', rechne);
    rechne();
  }
})();
