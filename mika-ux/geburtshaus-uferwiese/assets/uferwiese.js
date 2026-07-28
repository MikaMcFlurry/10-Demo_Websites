/*
  Geburtshaus Uferwiese — Terminrechner

  Rechnet nach der Naegele-Regel und nichts sonst. Alles läuft im Browser;
  es wird nichts übertragen und nichts gespeichert. Ohne JavaScript bleibt
  die Rechenregel als Text stehen, sodass sie auch von Hand nachvollziehbar
  ist.
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

  /* ── Terminrechner ───────────────────────────────────────────────── */

  const rechner = document.querySelector('[data-rechner]');
  if (!rechner) return;

  const TAG = 86400000;
  const TRAGZEIT = 280;          // Tage ab erstem Tag der letzten Regelblutung

  const erster = rechner.querySelector('#erster-tag');
  const zyklus = rechner.querySelector('#zyklus');
  const spur = rechner.querySelector('[data-spur]');
  const zeiger = rechner.querySelector('[data-zeiger]');
  const wochen = [...spur.querySelectorAll('i')];

  const aus = {
    datum: rechner.querySelector('[data-datum]'),
    ssw: rechner.querySelector('[data-ssw]'),
    trimester: rechner.querySelector('[data-trimester]'),
    rest: rechner.querySelector('[data-rest]'),
    lage: rechner.querySelector('[data-lage]'),
    stand: rechner.querySelector('[data-stand]')
  };

  const langesDatum = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  /* Auf Mitternacht normalisieren, sonst verrutschen Tagesdifferenzen. */
  const tag = (wert) => {
    const d = new Date(wert);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  function leer(text) {
    aus.datum.textContent = '—';
    aus.ssw.textContent = '—';
    aus.trimester.textContent = '—';
    aus.rest.textContent = '—';
    aus.lage.textContent = text;
    zeiger.style.left = '0%';
    wochen.forEach((w) => w.removeAttribute('data-vorbei'));
    aus.stand.textContent = text;
  }

  function rechne() {
    if (!erster.value) {
      leer('Tragen Sie den ersten Tag der letzten Regelblutung ein.');
      return;
    }

    const heute = tag(Date.now());
    const start = tag(erster.value);

    if (Number.isNaN(start.getTime())) {
      leer('Das Datum konnte nicht gelesen werden.');
      return;
    }

    if (start > heute) {
      leer('Der erste Tag liegt in der Zukunft. Bitte prüfen Sie die Eingabe.');
      return;
    }

    /* Naegele mit Zykluskorrektur: Ein längerer Zyklus verschiebt den
       Eisprung und damit den Termin um dieselbe Anzahl Tage nach hinten. */
    const laenge = Math.min(45, Math.max(20, Number(zyklus.value) || 28));
    const termin = new Date(start.getTime() + (TRAGZEIT + (laenge - 28)) * TAG);

    const tage = Math.floor((heute - start) / TAG);
    const restTage = Math.round((termin - heute) / TAG);

    if (tage > 320) {
      leer('Die Angabe liegt mehr als 45 Wochen zurück — dafür ist dieser Rechner nicht gedacht.');
      return;
    }

    const woche = Math.floor(tage / 7);
    const restTagImZyklus = tage % 7;
    const anteil = Math.min(1, Math.max(0, tage / 280));

    aus.datum.textContent = langesDatum.format(termin);
    aus.ssw.textContent = `${woche + 1}. Woche (${woche}+${restTagImZyklus})`;
    aus.trimester.textContent = woche < 13 ? 'erstes' : woche < 27 ? 'zweites' : 'drittes';
    aus.rest.textContent = restTage > 0
      ? `noch ${restTage} Tage`
      : restTage === 0 ? 'heute' : `${Math.abs(restTage)} Tage darüber`;

    aus.lage.textContent = woche < 12
      ? 'Zum Erstgespräch kommen die meisten zwischen der 8. und der 12. Woche.'
      : woche < 25
        ? 'In dieser Zeit sehen wir uns alle vier Wochen.'
        : woche < 37
          ? 'Ab der 32. Woche alle zwei Wochen, ab der 36. jede Woche.'
          : 'Ab jetzt sind wir rund um die Uhr erreichbar.';

    zeiger.style.left = `${(anteil * 100).toFixed(2)}%`;
    wochen.forEach((w, i) => w.toggleAttribute('data-vorbei', i < woche));

    aus.stand.textContent =
      `Errechneter Termin ${langesDatum.format(termin)}. Aktuell ${woche}+${restTagImZyklus}, ${aus.rest.textContent}.`;
  }

  erster.addEventListener('input', rechne);
  zyklus.addEventListener('input', rechne);

  /* Vorbelegung, damit der Rechner beim ersten Blick etwas zeigt: ein
     Zeitpunkt in der 24. Woche, gerechnet vom heutigen Tag. */
  if (!erster.value) {
    const beispiel = new Date(Date.now() - 24 * 7 * TAG);
    erster.value = beispiel.toISOString().slice(0, 10);
  }

  erster.max = new Date().toISOString().slice(0, 10);
  rechne();
})();
