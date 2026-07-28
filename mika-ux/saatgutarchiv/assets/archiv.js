/*
  Saatgutarchiv Zollernalb — Filterung des Bestandskatalogs

  Der vollständige Katalog steht im HTML. Dieses Skript blendet nur aus, was
  nicht zur Auswahl passt — ohne JavaScript bleiben alle Datensätze lesbar.
  Es wird nichts übertragen, nichts gespeichert und nichts nachgeladen.
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

  /* ── Bestandsfilter ──────────────────────────────────────────────── */

  const katalog = document.querySelector('[data-katalog]');
  if (!katalog) return;

  const saetze = [...katalog.querySelectorAll('.satz')];
  const suche = document.querySelector('#suche');
  const artwahl = document.querySelector('#art');
  const chips = [...document.querySelectorAll('.filter .chip[data-status], .filter .chip[data-nachbau-filter]')];
  const zurueck = document.querySelector('[data-zuruecksetzen]');
  const zahl = document.querySelector('[data-zahl]');
  const leer = document.querySelector('[data-leer]');
  const gesamt = saetze.length;

  /* Suchfeld normalisieren: Umlaute und Schärfe sollen nicht am Treffer
     hindern, wenn jemand „Kuerbis“ oder „Grosselfingen“ tippt. */
  const falte = (wert) => wert
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  /* Der Suchtext jedes Satzes wird einmal gebildet, nicht bei jedem Tastendruck. */
  const index = new Map(saetze.map((satz) => [satz, falte(satz.textContent || '')]));

  function filtere() {
    const wort = falte(suche.value);
    const art = artwahl.value;
    const status = chips.filter((c) => c.dataset.status && c.getAttribute('aria-pressed') === 'true')
      .map((c) => c.dataset.status);
    const nurNachbau = chips.some((c) => c.dataset.nachbauFilter !== undefined && c.getAttribute('aria-pressed') === 'true');

    let sichtbar = 0;

    for (const satz of saetze) {
      const passt =
        (!wort || index.get(satz).includes(wort)) &&
        (!art || satz.dataset.art === art) &&
        (status.length === 0 || status.includes(satz.dataset.status)) &&
        (!nurNachbau || satz.hasAttribute('data-nachbau'));

      satz.closest('li').hidden = !passt;
      if (passt) sichtbar += 1;
    }

    zahl.textContent = sichtbar === gesamt
      ? `${gesamt} von ${gesamt} Akzessionen`
      : `${sichtbar} von ${gesamt} Akzessionen`;

    leer.toggleAttribute('data-sichtbar', sichtbar === 0);
    katalog.hidden = sichtbar === 0;
  }

  suche.addEventListener('input', filtere);
  artwahl.addEventListener('change', filtere);

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
      filtere();
    });
  });

  function setzeZurueck() {
    suche.value = '';
    artwahl.value = '';
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    filtere();
  }

  zurueck.addEventListener('click', setzeZurueck);

  /* Die Leiste ist im Markup ausgeblendet und erscheint erst jetzt — ohne
     Skript soll niemand eine Bedienung sehen, die nichts tut. */
  document.querySelector('.filter').hidden = false;
  document.querySelector('[data-filter-fallback]')?.remove();
  document.querySelector('[data-leer-zuruecksetzen]')?.addEventListener('click', () => {
    setzeZurueck();
    suche.focus();
  });

  filtere();
})();
