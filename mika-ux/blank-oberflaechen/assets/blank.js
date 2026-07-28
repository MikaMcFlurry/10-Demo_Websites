/* BLANK Oberflächentechnik — Seitenskript.
 * Menü, Maßstabswechsel des Schichtaufbaus, Schichtzeitrechner.
 * Alles läuft ausschließlich im Browser; ohne JavaScript bleiben Inhalte
 * lesbar und die Bedienelemente verborgen, statt eine Funktion vorzutäuschen. */
(() => {
  'use strict';

  /* ---------- Menü ---------- */

  const taste = document.querySelector('.menuetaste');
  const menue = document.getElementById('menue');
  if (taste && menue) {
    taste.addEventListener('click', () => {
      const offen = menue.classList.toggle('offen');
      taste.setAttribute('aria-expanded', String(offen));
    });
    document.addEventListener('keydown', (ereignis) => {
      if (ereignis.key === 'Escape' && menue.classList.contains('offen')) {
        menue.classList.remove('offen');
        taste.setAttribute('aria-expanded', 'false');
        taste.focus();
      }
    });
  }

  /* ---------- Schichtaufbau: wahrer und lesbarer Maßstab ----------
   * Dekorativer Aufbau: 15 µm Kupfer, 20 µm Nickel, 0,3 µm Chrom.
   * Der Grundwerkstoff belegt fest 30 % der Leiste; die drei Schichten
   * teilen sich die übrigen 70 % — wahr nach µm oder lesbar zu je einem
   * Drittel. Der wahre Maßstab ist die Aussage: Chrom ist die dünnste
   * Schicht des Systems, das nach ihm benannt ist. */

  const aufbau = document.querySelector('[data-aufbau]');
  if (aufbau) {
    const schalter = aufbau.querySelector('[data-aufbau-schalter]');
    const ansage = aufbau.querySelector('[data-aufbau-ansage]');
    const schichten = {
      kupfer: { el: aufbau.querySelector('[data-schicht="kupfer"]'), um: 15 },
      nickel: { el: aufbau.querySelector('[data-schicht="nickel"]'), um: 20 },
      chrom: { el: aufbau.querySelector('[data-schicht="chrom"]'), um: 0.3 },
    };
    const summe = 15 + 20 + 0.3;
    const frei = 70;

    function setze(modus) {
      for (const name of Object.keys(schichten)) {
        const s = schichten[name];
        if (!s.el) continue;
        const anteil = modus === 'wahr' ? (s.um / summe) * frei : frei / 3;
        s.el.style.flexBasis = anteil + '%';
      }
      aufbau.dataset.modus = modus;
      if (schalter) {
        schalter.setAttribute('aria-pressed', String(modus === 'wahr'));
        schalter.textContent = modus === 'wahr'
          ? 'Maßstab: wahr — auf lesbar umschalten'
          : 'Maßstab: lesbar — auf wahr umschalten';
      }
      if (ansage) {
        ansage.textContent = modus === 'wahr'
          ? 'Wahrer Maßstab: Chrom ist mit 0,3 µm weniger als ein Hundertstel des Aufbaus.'
          : 'Lesbarer Maßstab: alle drei Schichten gleich breit dargestellt.';
      }
    }

    if (schalter) {
      schalter.hidden = false;
      schalter.addEventListener('click', () => {
        setze(aufbau.dataset.modus === 'wahr' ? 'lesbar' : 'wahr');
      });
    }
    setze('wahr');
  }

  /* ---------- Schichtzeitrechner (Hartchrom) ----------
   * Faradaysches Gesetz für Chrom aus Chrom(VI): M = 52 g/mol, z = 6,
   * ρ = 7,14 g/cm³. Abscheiderate in µm/h = 4,529 · i [A/dm²] · η.
   * Die Stromausbeute von Chromelektrolyten liegt nur bei 12–18 % —
   * deshalb dauert Hartchrom so lange, wie es dauert. */

  const rechner = document.querySelector('[data-rechner]');
  if (rechner) {
    const dickeEl = rechner.querySelector('#ziel-dicke');
    const stromEl = rechner.querySelector('#stromdichte');
    const etaEl = rechner.querySelector('#ausbeute');
    const rateAus = rechner.querySelector('[data-rate]');
    const zeitAus = rechner.querySelector('[data-zeit]');
    const hinweis = rechner.querySelector('[data-hinweis]');

    function zahl(el, min, max) {
      const wert = parseFloat(String(el.value).replace(',', '.'));
      if (!Number.isFinite(wert)) return null;
      return Math.min(max, Math.max(min, wert));
    }

    function formatZeit(stunden) {
      const h = Math.floor(stunden);
      const min = Math.round((stunden - h) * 60);
      if (min === 60) return (h + 1) + ' h 00 min';
      return h + ' h ' + String(min).padStart(2, '0') + ' min';
    }

    function rechne() {
      const dickeRoh = parseFloat(String(dickeEl.value).replace(',', '.'));
      const strom = zahl(stromEl, 30, 60);
      const eta = zahl(etaEl, 12, 18);

      if (!Number.isFinite(dickeRoh) || strom === null || eta === null) {
        rateAus.textContent = '–';
        zeitAus.textContent = '–';
        hinweis.textContent = 'Bitte alle drei Felder ausfüllen. Stromdichte 30–60 A/dm², Ausbeute 12–18 %.';
        hinweis.classList.remove('ist-grenze');
        return;
      }

      const rate = 4.529 * strom * (eta / 100);
      rateAus.innerHTML = rate.toFixed(1).replace('.', ',') + ' <small>µm/h</small>';

      if (dickeRoh > 500) {
        zeitAus.textContent = '—';
        hinweis.textContent = 'Über 500 µm je Seite bauen wir nicht auf. Ab dieser Dicke wird '
          + 'die Schicht spannungsreich und der Verzug unkalkulierbar — dafür nennen wir '
          + 'bewusst keine Badzeit. Für starken Verschleißaufbau: thermisches Spritzen anfragen.';
        hinweis.classList.add('ist-grenze');
        return;
      }
      if (dickeRoh < 20) {
        zeitAus.textContent = formatZeit(dickeRoh / rate);
        hinweis.textContent = 'Unter 20 µm ist Hartchrom selten die richtige Antwort: '
          + 'Für Korrosionsschutz und Maßhaltigkeit unter 20 µm prüfen Sie Chemisch Nickel — '
          + 'es trägt konturtreu auch in Bohrungen auf.';
        hinweis.classList.remove('ist-grenze');
        return;
      }

      const zeit = dickeRoh / rate;
      zeitAus.textContent = formatZeit(zeit);
      if (dickeRoh > 60) {
        hinweis.textContent = 'Ab etwa 60 µm beschichten wir mit Aufmaß und schleifen auf '
          + 'Endmaß — die Badzeit oben ist reine Expositionszeit, Vor- und Nacharbeit '
          + 'kommen dazu.';
      } else {
        hinweis.textContent = 'Reine Expositionszeit im Bad. Vorbehandlung, Kontaktierung '
          + 'und Prüfung kommen dazu; Richtwert für die Werksdurchlaufzeit: fünf Arbeitstage.';
      }
      hinweis.classList.remove('ist-grenze');
    }

    for (const feld of [dickeEl, stromEl, etaEl]) {
      feld.addEventListener('input', rechne);
    }
    rechner.hidden = false;
    rechne();
  }
})();
