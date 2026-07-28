/* Duell-Seite: ein Blatt, zwei Vorschläge, eine Entscheidung. */
(function () {
  'use strict';

  var SICHERN_AB = 15;

  var blatt      = document.querySelector('[data-blatt]');
  var auftrag    = document.querySelector('[data-auftrag]');
  var nrFeld     = document.querySelector('[data-nr]');
  var echo       = document.querySelector('[data-echo]');
  var zaehlung   = document.querySelector('[data-zaehlung]');
  var sterneFeld = document.querySelector('[data-sterne]');
  var sicherung  = document.querySelector('[data-sicherung]');
  var flaechen   = Array.prototype.slice.call(document.querySelectorAll('.flaeche'));

  var aktuell = null;       // [faktA, faktB]
  var letztesFeld = null;
  var sperre = false;       // während der Übergangsbewegung keine zweite Eingabe

  /* ── Anzeige ──────────────────────────────────────────────────────────── */

  function textKuerzen(s, max) {
    if (!s || s.length <= max) return s || '';
    return s.slice(0, max - 1).replace(/[\s,;:–-]+$/, '') + '…';
  }

  function seiteFuellen(el, fakt) {
    var wahl = el.closest('.wahl');
    el.dataset.gewaehlt = 'nein';
    el.querySelector('[data-satz]').textContent = fakt.satz;

    var beleg = el.querySelector('[data-beleg]');
    beleg.textContent = fakt.zitat || '';
    beleg.hidden = !fakt.zitat;

    var q = el.querySelector('[data-quelle]');
    q.innerHTML = '';
    var b = document.createElement('b');
    b.textContent = fakt.quelle.podcast || 'Podcast';
    q.appendChild(b);
    q.appendChild(document.createTextNode(textKuerzen(fakt.quelle.episode, 64)));

    var link = wahl.querySelector('[data-episode]');
    if (fakt.quelle.url) {
      link.href = fakt.quelle.url;
      link.hidden = false;
    } else {
      link.hidden = true;
    }

    var hoerknopf = wahl.querySelector('[data-hoeren]');
    hoerknopf.hidden = !fakt.audio;
    hoerknopf.dataset.audio = fakt.audio || '';
    hoerknopf.setAttribute('aria-pressed', 'false');
    hoerknopf.setAttribute('aria-label', 'Originalausschnitt anhören, ' + (fakt.quelle.podcast || 'Podcast'));
    hoerknopf.style.setProperty('--fort', '0%');
  }

  function standAnzeigen() {
    var s = SZ.verbraucht();
    sterneFeld.textContent = '★ ' + s;
    nrFeld.textContent = 'Entscheidung ' + (SZ.entscheidungen() + 1);

    /* Zählstriche statt Fortschrittsbalken: je Strich eine Entscheidung,
       höchstens 40 Striche, dann läuft der Zähler weiter. */
    var n = Math.min(SZ.entscheidungen(), 40);
    var teile = [];
    for (var i = 0; i < 40; i++) teile.push('<i class="' + (i < n ? 'voll' : '') + '"></i>');
    teile.push('<span class="text">' + SZ.entscheidungen() + ' Entscheidungen · ' +
               SZ.uebrig() + ' Sterne frei</span>');
    zaehlung.innerHTML = teile.join('');

    if (SZ.entscheidungen() >= 3 && auftrag) auftrag.hidden = true;

    if (sicherung && !SZ.gesichert() && SZ.entscheidungen() >= SICHERN_AB && sicherung.hidden) {
      sicherung.hidden = false;
      var t = sicherung.querySelector('[data-sicher-titel]');
      if (t) t.textContent = 'Sie haben ' + SZ.entscheidungen() + ' Entscheidungen getroffen.';
    }
  }

  function naechstes() {
    var paar = SZ.naechstesPaar(letztesFeld);
    if (!paar) {
      blatt.querySelector('.paar').innerHTML =
        '<div class="leerbogen"><h2>Sie haben alles gesehen, was hier liegt.</h2>' +
        '<p>Jeder Satz aus diesem Datensatz ist mindestens einmal angetreten. ' +
        'Ihre Rangliste steht.</p>' +
        '<p><a class="knopf knopf--voll" href="mein-bogen.html">Mein Bogen ansehen</a></p></div>';
      document.querySelector('.ausweich').hidden = true;
      return;
    }
    aktuell = paar;
    letztesFeld = paar[0].felder[0];
    seiteFuellen(flaechen[0], paar[0]);
    seiteFuellen(flaechen[1], paar[1]);
    standAnzeigen();
  }

  /* ── Entscheidung ─────────────────────────────────────────────────────── */

  function weiter() {
    blatt.dataset.wechsel = 'raus';
    window.setTimeout(function () {
      naechstes();
      blatt.dataset.wechsel = 'rein';
      window.setTimeout(function () { blatt.dataset.wechsel = ''; sperre = false; }, 340);
    }, 210);
  }

  function rueckmeldung(fakt, platz) {
    if (!platz) {
      echo.innerHTML = 'Notiert. Dieser Satz liegt noch unter Ihren ersten hundert.';
    } else if (platz === 1) {
      echo.innerHTML = '<b>Neuer Spitzenreiter.</b> Dieser Satz steht jetzt auf ' +
                       '<span class="platz">Platz 1</span> Ihres Bogens.';
    } else {
      echo.innerHTML = 'Aufgenommen auf <span class="platz">Platz ' + platz + '</span> Ihres Bogens ' +
                       '<span style="color:var(--druck-3)">· ' + fakt.felder[0] + '</span>';
    }
    echo.classList.add('an');
  }

  function waehlen(index) {
    if (sperre || !aktuell) return;
    sperre = true;
    audioStoppen();

    var gewaehlt = aktuell[index];
    var anderer = aktuell[1 - index];
    flaechen[index].dataset.gewaehlt = 'ja';

    var platz = SZ.entscheiden(aktuell[0].id, aktuell[1].id, gewaehlt.id);
    rueckmeldung(gewaehlt, platz);
    standAnzeigen();
    void anderer;
    weiter();
  }

  flaechen.forEach(function (el, i) {
    el.addEventListener('click', function () { waehlen(i); });
  });

  document.querySelector('[data-keins]').addEventListener('click', function () {
    if (sperre || !aktuell) return;
    sperre = true;
    audioStoppen();
    SZ.entscheiden(aktuell[0].id, aktuell[1].id, null);
    echo.innerHTML = 'Beide abgewertet. Solche Sätze tauchen seltener wieder auf.';
    echo.classList.add('an');
    standAnzeigen();
    weiter();
  });

  document.querySelector('[data-unbekannt]').addEventListener('click', function () {
    if (sperre || !aktuell) return;
    sperre = true;
    audioStoppen();
    SZ.ueberspringen(aktuell[0].id, aktuell[1].id);
    echo.innerHTML = 'Übersprungen. Diese beiden bekommen Sie nicht noch einmal.';
    echo.classList.add('an');
    weiter();
  });

  /* ── Tastatur: 1 und 2 wählen, 0 überspringt ──────────────────────────── */

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (e.key === '1' || e.key === 'ArrowLeft') { e.preventDefault(); waehlen(0); }
    if (e.key === '2' || e.key === 'ArrowRight') { e.preventDefault(); waehlen(1); }
    if (e.key === '0') { e.preventDefault(); document.querySelector('[data-unbekannt]').click(); }
  });

  /* ── Hörclip ──────────────────────────────────────────────────────────
     Der Originalausschnitt ist das überzeugendste Material der Plattform und
     lag bisher hinter einem Tippen versteckt. Hier steht er neben dem Satz. */

  var klang = null;
  var laeuft = null;

  function audioStoppen() {
    if (klang) { klang.pause(); klang = null; }
    if (laeuft) {
      laeuft.setAttribute('aria-pressed', 'false');
      laeuft.style.setProperty('--fort', '0%');
      laeuft = null;
    }
  }

  document.querySelectorAll('[data-hoeren]').forEach(function (knopf) {
    knopf.addEventListener('click', function () {
      if (laeuft === knopf) { audioStoppen(); return; }
      audioStoppen();
      var url = knopf.dataset.audio;
      if (!url) return;

      klang = new Audio(url);
      laeuft = knopf;
      knopf.setAttribute('aria-pressed', 'true');

      klang.addEventListener('timeupdate', function () {
        if (!klang || !klang.duration) return;
        knopf.style.setProperty('--fort', Math.round((klang.currentTime / klang.duration) * 100) + '%');
      });
      klang.addEventListener('ended', audioStoppen);
      klang.addEventListener('error', function () {
        knopf.hidden = true;
        audioStoppen();
      });
      klang.play().catch(function () { knopf.hidden = true; audioStoppen(); });
    });
  });

  /* ── Konto sichern (Demo) ─────────────────────────────────────────────── */

  var form = document.querySelector('[data-konto]');
  if (form) {
    var feld = form.querySelector('input[type=email]');
    var fehler = form.querySelector('.fehler');
    var quittung = sicherung.querySelector('.quittung');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(feld.value.trim())) {
        fehler.textContent = 'Bitte eine vollständige E-Mail-Adresse eintragen.';
        feld.setAttribute('aria-invalid', 'true');
        feld.focus();
        return;
      }
      fehler.textContent = '';
      feld.removeAttribute('aria-invalid');
      SZ.gesichert(true);
      form.hidden = true;
      quittung.classList.add('an');
      quittung.setAttribute('tabindex', '-1');
      quittung.focus();
    });

    feld.addEventListener('input', function () {
      fehler.textContent = '';
      feld.removeAttribute('aria-invalid');
    });
  }

  /* ── Start ────────────────────────────────────────────────────────────── */

  SZ.holen().then(function () {
    naechstes();
  }).catch(function () {
    blatt.querySelector('.paar').innerHTML =
      '<div class="leerbogen"><h2>Die Sätze lassen sich gerade nicht laden.</h2>' +
      '<p>Bitte laden Sie die Seite neu. Wenn es weiterhin nicht klappt, liegt es an uns.</p></div>';
  });
})();
