/*
  NEREUS — Interaktion

  Drei Dinge, alle im Browser, ohne Netzwerk und ohne Speicher:

  1. Der Abstieg. Beim normalen Scrollen wandert die Tiefenanzeige mit und die
     Wassersäule verdunkelt sich. Der Scroll wird nicht übernommen — kein
     Scroll-Jacking, keine gekaperten Tastenwege.
  2. Der Druckrechner. Aus einer Tiefe folgen Druck, Temperatur, Restlicht und
     die Frage, welches Fahrzeug noch hinunterkommt.
  3. Die Tonspur. Ein im Browser erzeugter Tiefton, ausdrücklich im Opt-in,
     ohne Audiodatei. Der Zustand steht als Text neben dem Symbol.

  Ohne JavaScript bleiben alle Kapitel, Zahlen und Tabellen vollständig
  lesbar; die Schiene zeigt dann statisch die erste Zone.
*/
(() => {
  'use strict';

  const sanft = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ── Meeresschnee ────────────────────────────────────────────────── */

  const schnee = document.querySelector('.schnee');

  if (schnee && sanft) {
    /* Wenige Teilchen, damit auch ein schwaches Gerät bei 30fps bleibt. */
    for (let i = 0; i < 26; i += 1) {
      const teil = document.createElement('i');
      teil.style.left = `${(i * 37 + 11) % 100}%`;
      teil.style.setProperty('--dauer', `${18 + (i % 7) * 4}s`);
      teil.style.animationDelay = `${-(i * 1.7) % 22}s`;
      teil.style.opacity = String(0.25 + (i % 4) * 0.18);
      schnee.append(teil);
    }
  }

  /* ── Der Abstieg ─────────────────────────────────────────────────── */

  const schiene = document.querySelector('[data-schiene]');

  if (schiene) {
    const szenen = [...document.querySelectorAll('.szene[data-tiefe]')];
    const wasser = document.querySelector('.wasser');
    const anzeige = schiene.querySelector('[data-tiefenwert]');
    const zeiger = schiene.querySelector('[data-zeiger]');
    const zone = schiene.querySelector('[data-zonenname]');
    const marken = [...schiene.querySelectorAll('.schiene__liste a')];
    const stand = schiene.querySelector('[data-stand]');

    const MAX = 6000;   // Einsatztiefe der NEREUS 4 in Metern
    const zahl = new Intl.NumberFormat('de-DE');

    let ziel = 0;
    let gezeigt = 0;
    let laeuft = false;

    /* Welche Szene gerade im Blick ist, bestimmt die Zieltiefe. */
    const beobachter = new IntersectionObserver((eintraege) => {
      for (const eintrag of eintraege) {
        if (!eintrag.isIntersecting) continue;

        const szene = eintrag.target;
        ziel = Number(szene.dataset.tiefe);
        zone.textContent = szene.dataset.zone;

        marken.forEach((m) => {
          const aktiv = m.getAttribute('href') === `#${szene.id}`;
          m.setAttribute('aria-current', String(aktiv));
        });

        stand.textContent = `${szene.dataset.zone}, ${zahl.format(ziel)} Meter Tiefe.`;
        starte();
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    szenen.forEach((s) => beobachter.observe(s));

    /* Die Anzeige zählt zur Zieltiefe hoch, statt zu springen. Unter
       Reduced Motion wird der Wert sofort gesetzt. */
    function schritt() {
      const abstand = ziel - gezeigt;

      if (!sanft || Math.abs(abstand) < 8) {
        gezeigt = ziel;
        laeuft = false;
      } else {
        gezeigt += abstand * 0.12;
        laeuft = true;
      }

      const anteil = Math.min(1, gezeigt / MAX);
      anzeige.textContent = zahl.format(Math.round(gezeigt));
      zeiger.style.top = `${(anteil * 100).toFixed(2)}%`;
      wasser.style.setProperty('--tiefe', anteil.toFixed(3));

      if (laeuft) requestAnimationFrame(schritt);
    }

    function starte() {
      if (laeuft) return;
      laeuft = true;
      requestAnimationFrame(schritt);
    }

    schiene.hidden = false;
    starte();
  }

  /* ── Tonspur: im Browser erzeugt, ausdrücklich im Opt-in ─────────── */

  const tonKnopf = document.querySelector('[data-ton]');

  if (tonKnopf && 'AudioContext' in window) {
    let ctx = null;
    let quelle = null;
    let filter = null;
    let lautstaerke = null;
    const text = tonKnopf.querySelector('[data-ton-text]');

    function baue() {
      ctx = new AudioContext();

      /* Ein tiefer Sinuston plus eine leise Quinte, durch ein Tiefpassfilter.
         Keine Datei, kein Netzwerk — der Ton entsteht hier. */
      quelle = ctx.createOscillator();
      quelle.type = 'sine';
      quelle.frequency.value = 58;

      const zweite = ctx.createOscillator();
      zweite.type = 'sine';
      zweite.frequency.value = 87;

      const leise = ctx.createGain();
      leise.gain.value = 0.35;
      zweite.connect(leise);

      filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;

      lautstaerke = ctx.createGain();
      lautstaerke.gain.value = 0;

      quelle.connect(filter);
      leise.connect(filter);
      filter.connect(lautstaerke);
      lautstaerke.connect(ctx.destination);

      quelle.start();
      zweite.start();
    }

    tonKnopf.addEventListener('click', async () => {
      const an = tonKnopf.getAttribute('aria-pressed') === 'true';

      if (!ctx) baue();
      if (ctx.state === 'suspended') await ctx.resume();

      const jetzt = ctx.currentTime;
      lautstaerke.gain.cancelScheduledValues(jetzt);
      lautstaerke.gain.setValueAtTime(lautstaerke.gain.value, jetzt);
      lautstaerke.gain.linearRampToValueAtTime(an ? 0 : 0.06, jetzt + 1.2);

      tonKnopf.setAttribute('aria-pressed', String(!an));
      text.textContent = an ? 'Ton aus' : 'Ton an';
    });

    /* Die Tiefe färbt den Ton: weiter unten wird er dumpfer. */
    const wasser = document.querySelector('.wasser');
    if (wasser && 'ResizeObserver' in window) {
      setInterval(() => {
        if (!filter || tonKnopf.getAttribute('aria-pressed') !== 'true') return;
        const tiefe = Number(getComputedStyle(wasser).getPropertyValue('--tiefe')) || 0;
        filter.frequency.setTargetAtTime(220 - tiefe * 130, ctx.currentTime, 0.8);
      }, 900);
    }

    tonKnopf.hidden = false;
  }

  /* ── Druckrechner ────────────────────────────────────────────────── */

  const rechner = document.querySelector('[data-rechner]');

  if (rechner) {
    const regler = rechner.querySelector('#tiefe');
    const zahl = new Intl.NumberFormat('de-DE');
    const nk = (w, s) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: s, maximumFractionDigits: s }).format(w);

    const aus = {
      tiefe: rechner.querySelector('[data-r-tiefe]'),
      druck: rechner.querySelector('[data-r-druck]'),
      temp: rechner.querySelector('[data-r-temp]'),
      licht: rechner.querySelector('[data-r-licht]'),
      zone: rechner.querySelector('[data-r-zone]'),
      stand: rechner.querySelector('[data-r-stand]')
    };

    const flotte = [...rechner.querySelectorAll('.flotte li')];

    function zone(d) {
      if (d < 200) return 'Epipelagial — Lichtzone';
      if (d < 1000) return 'Mesopelagial — Dämmerzone';
      if (d < 4000) return 'Bathypelagial — Mitternachtszone';
      if (d < 6000) return 'Abyssopelagial — Abyssal';
      return 'Hadal — Tiefseegraben';
    }

    function rechne() {
      const d = Number(regler.value);

      /* Seewasser: rund 1 bar je 9,9 m, plus 1 bar Luftdruck an der
         Oberfläche. Für Auslegungszwecke genau genug. */
      const druck = 1 + d / 9.9;

      /* Temperatur: sehr grobe Näherung eines mittleren Atlantikprofils. */
      const temp = d < 100 ? 18 - d * 0.03
        : d < 1000 ? 15 - (d - 100) * 0.0122
        : Math.max(1.5, 4 - (d - 1000) * 0.0004);

      /* Licht: das Wasser schluckt etwa je 75 m eine Zehnerpotenz. */
      const licht = Math.pow(10, -d / 75);

      aus.tiefe.textContent = `${zahl.format(d)} m`;
      aus.druck.textContent = `${nk(druck, 1)} bar`;
      aus.temp.textContent = `${nk(temp, 1)} °C`;
      aus.licht.textContent = licht < 1e-9 ? 'unter 10⁻⁹ %' : `${(licht * 100).toExponential(1).replace('.', ',')} %`;
      aus.zone.textContent = zone(d);

      flotte.forEach((li) => li.toggleAttribute('data-reicht', Number(li.dataset.max) >= d));

      const moeglich = flotte.filter((li) => Number(li.dataset.max) >= d).length;
      aus.stand.textContent =
        `${zahl.format(d)} Meter, ${nk(druck, 1)} bar, ${nk(temp, 1)} Grad. ${moeglich} von ${flotte.length} Fahrzeugen erreichen diese Tiefe.`;
    }

    regler.addEventListener('input', rechne);
    rechne();
  }
})();
