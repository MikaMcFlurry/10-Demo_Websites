/*
  VEHRING Orgelbau — Interaktion

  Zwei Werkzeuge, beide vollständig im Browser, ohne Netzwerk und ohne
  Speicher: der Registerzug (welche Register klingen, was sie an Wind kosten)
  und der Mensurrechner (welche Länge eine Pfeife für einen Ton braucht).
  Ohne JavaScript bleiben Disposition und Verfahren als Text lesbar.
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

  /* ── Registerzug ─────────────────────────────────────────────────── */

  const pult = document.querySelector('[data-pult]');

  if (pult) {
    /* Leistung des Gebläses in Kubikmetern je Minute. Alle Register
       zusammen brauchen mehr — genau das soll die Tafel zeigen. */
    const GEBLAESE = 42;

    const zuege = [...pult.querySelectorAll('.zug')];
    const prospekt = document.querySelector('.prospekt[data-prospekt]');
    const pfeifen = prospekt ? [...prospekt.querySelectorAll('.pfeife')] : [];

    /* Die Register tragen dieselben data-Namen wie die Anzeigefelder — die
       Tafel muss deshalb in ihrem eigenen Teilbaum suchen, sonst schreibt
       sie ihre Werte in den erstbesten Registerknopf. */
    const tafel = pult.querySelector('.windtafel');

    const feld = {
      anzahl: tafel.querySelector('[data-anzahl]'),
      pfeifen: tafel.querySelector('[data-pfeifen]'),
      wind: tafel.querySelector('[data-wind]'),
      balg: tafel.querySelector('[data-balg]'),
      liste: tafel.querySelector('[data-liste]'),
      lage: tafel.querySelector('[data-lage]'),
      stand: tafel.querySelector('[data-stand]')
    };

    const zahl = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });

    function zeichne() {
      const aktiv = zuege.filter((z) => z.getAttribute('aria-pressed') === 'true');

      const pfeifenZahl = aktiv.reduce((s, z) => s + Number(z.dataset.pfeifen), 0);
      const wind = aktiv.reduce((s, z) => s + Number(z.dataset.wind), 0);
      const anteil = Math.min(1, wind / GEBLAESE);

      feld.anzahl.textContent = `${aktiv.length} / ${zuege.length}`;
      feld.pfeifen.textContent = zahl.format(pfeifenZahl);
      feld.wind.textContent = `${zahl.format(wind)} m³/min`;
      feld.balg.style.width = `${(anteil * 100).toFixed(1)}%`;

      if (wind > GEBLAESE) {
        feld.lage.textContent = `Über der Gebläseleistung von ${GEBLAESE} m³/min. Im Bestand wird deshalb selten alles zugleich gezogen.`;
      } else if (anteil > .8) {
        feld.lage.textContent = 'Der Balg arbeitet an der Grenze. Der Wind wird bei vollen Akkorden hörbar weich.';
      } else if (aktiv.length === 0) {
        feld.lage.textContent = 'Kein Register gezogen. Die Tasten bewegen nur Luft.';
      } else {
        feld.lage.textContent = 'Der Wind steht ruhig.';
      }

      feld.liste.replaceChildren(...(aktiv.length
        ? aktiv.map((z) => {
            const li = document.createElement('li');
            li.textContent = `${z.dataset.werk} · ${z.dataset.name} ${z.dataset.fuss}`;
            return li;
          })
        : [Object.assign(document.createElement('li'), { textContent: 'Noch nichts gezogen.' })]));

      /* Nur Prinzipale stehen im Prospekt. Eine Pfeife leuchtet, wenn ein
         gezogenes Prospektregister ihre Fußtonlage bedient. */
      const lagen = new Set(aktiv.filter((z) => z.dataset.prospektlage).map((z) => z.dataset.prospektlage));
      pfeifen.forEach((p) => p.toggleAttribute('data-klingt', lagen.has(p.dataset.lage)));

      feld.stand.textContent =
        `${aktiv.length} Register gezogen, ${zahl.format(pfeifenZahl)} Pfeifen, ${zahl.format(wind)} Kubikmeter Wind je Minute.`;
    }

    zuege.forEach((z) => {
      z.addEventListener('click', () => {
        z.setAttribute('aria-pressed', String(z.getAttribute('aria-pressed') !== 'true'));
        zeichne();
      });
    });

    pult.querySelector('[data-alle]')?.addEventListener('click', () => {
      zuege.forEach((z) => z.setAttribute('aria-pressed', 'true'));
      zeichne();
    });

    pult.querySelector('[data-keine]')?.addEventListener('click', () => {
      zuege.forEach((z) => z.setAttribute('aria-pressed', 'false'));
      zeichne();
    });

    zeichne();
  }

  /* ── Mensurrechner ───────────────────────────────────────────────── */

  const mensur = document.querySelector('[data-mensur]');

  if (mensur) {
    const SCHALL = 343;          // m/s bei 20 °C

    /* Klingende Höhe der Taste C in der jeweiligen Oktave, bei 8′-Lage. */
    const TASTEN = [
      { name: 'C',  hz: 65.406,   klang: 1 },
      { name: 'c',  hz: 130.813,  klang: 2 },
      { name: 'c¹', hz: 261.626,  klang: 3 },
      { name: 'c²', hz: 523.251,  klang: 4 },
      { name: 'c³', hz: 1046.502, klang: 5 }
    ];

    /* Oktavbezeichnungen, Index 0 = Kontra-C. */
    const OKTAVEN = ['C¹', 'C', 'c', 'c¹', 'c²', 'c³', 'c⁴', 'c⁵'];

    const wahl = mensur.querySelector('#taste');
    const lagen = [...mensur.querySelectorAll('.fusslage button')];
    const balken = mensur.querySelector('[data-pfeife]');

    const aus = {
      ton: mensur.querySelector('[data-ton]'),
      hz: mensur.querySelector('[data-hz]'),
      laenge: mensur.querySelector('[data-laenge]'),
      korrektur: mensur.querySelector('[data-korrektur]'),
      stand: mensur.querySelector('[data-mensur-stand]')
    };

    const nk = (wert, stellen) =>
      new Intl.NumberFormat('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen }).format(wert);

    function rechne() {
      const taste = TASTEN[Number(wahl.value)];
      const lage = lagen.find((b) => b.getAttribute('aria-pressed') === 'true');
      const faktor = Number(lage.dataset.faktor);   // 16′ = 0.5, 8′ = 1, 4′ = 2, 2′ = 4

      const hz = taste.hz * faktor;

      /* Offene Labialpfeife: die halbe Wellenlänge steht in der Pfeife. */
      const theorie = SCHALL / (2 * hz);

      /* Mündungskorrektur: die Pfeife klingt tiefer, als ihre Länge vermuten
         lässt. Bei einer Mensur um 1:12 fällt rund ein Zehntel weg. */
      const gebaut = theorie * 0.9;

      const oktave = OKTAVEN[taste.klang + Math.round(Math.log2(faktor))] ?? '—';

      aus.ton.textContent = oktave;
      aus.hz.textContent = `${nk(hz, 1)} Hz`;
      aus.laenge.textContent = theorie >= 1 ? `${nk(theorie, 2)} m` : `${nk(theorie * 100, 1)} cm`;
      aus.korrektur.textContent = gebaut >= 1 ? `${nk(gebaut, 2)} m` : `${nk(gebaut * 100, 1)} cm`;

      /* Maßstab: 16′-C (rund 5,2 m theoretisch) füllt die Bühne. */
      balken.style.height = `${Math.max(4, Math.min(100, (theorie / 5.25) * 100))}%`;

      aus.stand.textContent =
        `${oktave}, ${nk(hz, 1)} Hertz, theoretische Länge ${nk(theorie, 2)} Meter, gebaute Länge ${nk(gebaut, 2)} Meter.`;
    }

    lagen.forEach((b) => {
      b.addEventListener('click', () => {
        lagen.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        rechne();
      });
    });

    wahl.addEventListener('change', rechne);
    rechne();
  }
})();
