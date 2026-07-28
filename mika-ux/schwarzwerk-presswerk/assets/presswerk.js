/*
  SCHWARZWERK — Interaktion

  Zwei Dinge, beide vollständig im Browser:

  1. Der Stationswechsel. Bewegung ist hier Navigation: Die Tafel fährt ein,
     und die Platte dreht sich nur, solange die gewählte Station selbst läuft.
     Ohne JavaScript stehen alle fünf Stationen untereinander als Text.
  2. Der Laufzeitrechner. Aus Format, Drehzahl und Spielzeit folgt, ob eine
     Seite so gepresst werden kann — und was es an Pegel kostet.
*/
(() => {
  'use strict';

  /* ── Menü ────────────────────────────────────────────────────────── */
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

  /* ── Stationswechsel ─────────────────────────────────────────────── */

  const werk = document.querySelector('[data-stationen]');

  if (werk) {
    const reiter = [...werk.querySelectorAll('.stationen__wahl button')];
    const tafeln = [...werk.querySelectorAll('.station')];
    const platte = document.querySelector('[data-platte]');
    const stand = werk.querySelector('[data-stationsstand]');

    function zeige(index, fokus) {
      reiter.forEach((r, i) => {
        r.setAttribute('aria-selected', String(i === index));
        r.tabIndex = i === index ? 0 : -1;
      });

      tafeln.forEach((t, i) => {
        t.hidden = i !== index;
        t.classList.toggle('station--laeuft', i === index);
      });

      /* Eine volle Umdrehung je Wechsel: die Bewegung markiert den Sprung
         durch die Fertigung und endet dort, wo sie begann — das Label
         bleibt lesbar, und es läuft nichts dauerhaft. */
      if (platte) platte.style.setProperty('--dreh', `${index * 360}deg`);

      stand.textContent = `Station ${index + 1} von ${reiter.length}: ${reiter[index].dataset.name}.`;
      if (fokus) reiter[index].focus();
    }

    reiter.forEach((r, i) => {
      r.addEventListener('click', () => zeige(i, false));

      /* Pfeiltasten wechseln die Station — die Reiter sind eine Tabliste. */
      r.addEventListener('keydown', (event) => {
        const schritt = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (!schritt) return;
        event.preventDefault();
        zeige((i + schritt + reiter.length) % reiter.length, true);
      });
    });

    werk.querySelector('.stationen__wahl').hidden = false;
    document.querySelector('[data-stationen-fallback]')?.remove();
    zeige(0, false);
  }

  /* ── Laufzeitrechner ─────────────────────────────────────────────── */

  const rechner = document.querySelector('[data-rechner]');

  if (rechner) {
    /*
      Grenzen je Format und Drehzahl in Minuten. „Komfortabel“ heißt: volle
      Rillenbreite, kein Pegelverzicht. „Machbar“ heißt: enger geschnitten,
      messbar leiser. Darüber schneidet niemand seriös.
    */
    const GRENZEN = {
      '12-33': { gut: 18, geht: 22, max: 26 },
      '12-45': { gut: 12, geht: 15, max: 18 },
      '10-33': { gut: 13, geht: 16, max: 19 },
      '10-45': { gut: 9,  geht: 11, max: 13 },
      '7-45':  { gut: 4.5, geht: 5.5, max: 7 },
      '7-33':  { gut: 6,  geht: 7.5, max: 9 }
    };

    const format = rechner.querySelector('#format');
    const minuten = rechner.querySelector('#minuten');
    const sekunden = rechner.querySelector('#sekunden');
    const drehzahlen = [...rechner.querySelectorAll('.knopfreihe button')];

    const befund = rechner.querySelector('[data-befund]');
    const aus = {
      stand: befund.querySelector('[data-stand]'),
      spielzeit: befund.querySelector('[data-spielzeit]'),
      grenze: befund.querySelector('[data-grenze]'),
      pegel: befund.querySelector('[data-pegel]'),
      rille: befund.querySelector('[data-rille]'),
      satz: befund.querySelector('[data-satz]'),
      live: befund.querySelector('[data-live]')
    };

    const nk = (w, s) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: s, maximumFractionDigits: s }).format(w);
    const mmss = (m) => `${Math.floor(m)}:${String(Math.round((m % 1) * 60)).padStart(2, '0')}`;

    function rechne() {
      const drehzahl = drehzahlen.find((b) => b.getAttribute('aria-pressed') === 'true').dataset.rpm;
      const schluessel = `${format.value}-${drehzahl}`;
      const g = GRENZEN[schluessel];

      const zeit = Math.max(0, Math.min(30, Number(minuten.value) || 0) + Math.min(59, Math.max(0, Number(sekunden.value) || 0)) / 60);

      /*
        Pegelabschätzung: Bis zur komfortablen Grenze bleibt die volle
        Schnittlautstärke. Danach muss die Rille enger laufen; als grobe
        Faustregel kostet jede Minute darüber etwa 1 dB.
      */
      const ueber = Math.max(0, zeit - g.gut);
      const pegel = -Math.min(6, ueber * 1);

      let lage = 'gut';
      let stand = 'Passt ohne Abstriche';
      let satz = 'Diese Seite lässt sich mit voller Rillenbreite und voller Lautstärke schneiden.';

      if (zeit > g.max) {
        lage = 'drueber';
        stand = 'Passt nicht';
        satz = `Über ${mmss(g.max)} schneiden wir nicht. Kürzen, die Drehzahl ändern oder auf zwei Seiten verteilen.`;
      } else if (zeit > g.geht) {
        lage = 'drueber';
        stand = 'Nur nach Rücksprache';
        satz = `Ab ${mmss(g.geht)} wird es eng. Wir schneiden das nur nach einem Gespräch über das Material — Bass und Breite kosten hier am meisten Platz.`;
      } else if (zeit > g.gut) {
        lage = 'knapp';
        stand = 'Geht, kostet Pegel';
        satz = `Über ${mmss(g.gut)} muss die Rille enger laufen. Die Platte wird leiser, und tiefe Frequenzen brauchen mehr Disziplin.`;
      }

      befund.dataset.lage = lage;
      aus.stand.textContent = stand;
      aus.spielzeit.textContent = mmss(zeit);
      aus.grenze.textContent = `${mmss(g.gut)} / ${mmss(g.max)}`;
      /* Über der harten Grenze gibt es keine Pegelreserve mehr zu nennen —
         dann wird nicht geschnitten, und eine Zahl wäre eine Scheinauskunft. */
      aus.pegel.textContent = zeit > g.max ? '—' : pegel < 0 ? `${nk(pegel, 1)} dB` : 'voll';
      aus.rille.style.width = `${Math.min(100, (zeit / g.max) * 100).toFixed(1)}%`;
      aus.satz.textContent = satz;

      aus.live.textContent = `${stand}. Spielzeit ${mmss(zeit)}, komfortable Grenze ${mmss(g.gut)}, harte Grenze ${mmss(g.max)}.`;
    }

    drehzahlen.forEach((b) => {
      b.addEventListener('click', () => {
        drehzahlen.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        rechne();
      });
    });

    format.addEventListener('change', rechne);
    minuten.addEventListener('input', rechne);
    sekunden.addEventListener('input', rechne);
    rechne();
  }
})();
