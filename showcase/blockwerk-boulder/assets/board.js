/* BLOCKWERK — Öffnungsstatus, Gradfilter, Sektorplan.
   Kein Framework, keine externen Requests. */
(function () {
  'use strict';

  /* Öffnungszeiten je Wochentag, 0 = Sonntag */
  var ZEITEN = {
    0: [9, 22], 1: [9, 23], 2: [9, 23], 3: [9, 23],
    4: [9, 23], 5: [9, 24], 6: [9, 23]
  };
  var TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  /* ── Navigation ────────────────────────────────────────────────────── */
  var taste = document.querySelector('.menuetaste');
  var menue = document.querySelector('.menue');
  if (taste && menue) {
    taste.addEventListener('click', function () {
      var auf = menue.classList.toggle('auf');
      taste.setAttribute('aria-expanded', auf ? 'true' : 'false');
    });
  }

  /* ── Öffnungsstatus ────────────────────────────────────────────────── */
  var jetzt = new Date();
  var tag = jetzt.getDay();
  var stunde = jetzt.getHours() + jetzt.getMinutes() / 60;
  var heute = ZEITEN[tag];
  var offen = stunde >= heute[0] && stunde < heute[1];

  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.classList.add(offen ? 'offen' : 'zu');
    var txt = el.querySelector('.status-text');
    if (!txt) return;
    if (offen) {
      txt.textContent = 'Jetzt offen bis ' + (heute[1] === 24 ? '24' : heute[1]) + ':00';
    } else {
      var naechster = stunde < heute[0] ? tag : (tag + 1) % 7;
      txt.textContent = 'Geschlossen · ' +
        (naechster === tag ? 'heute' : TAGE[naechster]) + ' ab ' + ZEITEN[naechster][0] + ':00';
    }
  });

  /* Heutigen Tag in der Zeitenliste hervorheben */
  document.querySelectorAll('.zeiten li[data-tag]').forEach(function (li) {
    if (Number(li.dataset.tag) === tag) li.classList.add('heute');
  });

  /* ── Auslastung ────────────────────────────────────────────────────
     Modellwert aus Wochentag und Uhrzeit — in einer echten Halle käme er
     aus dem Zutrittssystem. Hier klar als Beispiel gekennzeichnet.      */
  var last = document.querySelector('[data-last]');
  if (last) {
    var wert = 12;
    if (offen) {
      var abstand = Math.abs(stunde - 19);          /* Spitze gegen 19 Uhr */
      wert = Math.round(Math.max(8, 92 - abstand * 13));
      if (tag === 0 || tag === 6) wert = Math.round(wert * 0.78);
    }
    var balken = last.querySelector('.last-bar span');
    var zahl = last.querySelector('[data-last-wert]');
    if (balken) {
      balken.style.width = wert + '%';
      balken.style.background = wert > 78 ? 'var(--g4)' : wert > 52 ? 'var(--g1)' : 'var(--g2)';
    }
    if (zahl) {
      zahl.textContent = offen
        ? (wert > 78 ? 'Voll' : wert > 52 ? 'Gut besucht' : 'Entspannt')
        : 'Geschlossen';
    }
    last.setAttribute('aria-label', 'Auslastung ' + wert + ' Prozent');
  }

  /* ── Gradfilter für das Routenboard ────────────────────────────────── */
  var filter = document.querySelector('[data-filter]');
  var board = document.querySelector('[data-board]');
  if (filter && board) {
    var zeilen = Array.prototype.slice.call(board.querySelectorAll('tbody tr'));
    var zaehler = document.querySelector('[data-treffer]');
    var leerzeile = board.querySelector('[data-leer]');
    var aktiv = new Set();

    var anwenden = function () {
      var n = 0;
      zeilen.forEach(function (tr) {
        if (tr.hasAttribute('data-leer')) return;
        var passt = aktiv.size === 0 || aktiv.has(tr.dataset.grad);
        tr.hidden = !passt;
        if (passt) n++;
      });
      if (leerzeile) leerzeile.hidden = n !== 0;
      if (zaehler) {
        zaehler.textContent = aktiv.size === 0
          ? zeilen.length - (leerzeile ? 1 : 0) + ' Routen im Board'
          : n + (n === 1 ? ' Route' : ' Routen') + ' in der Auswahl';
      }
    };

    filter.querySelectorAll('button[data-grad]').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.dataset.grad;
        if (aktiv.has(g)) { aktiv.delete(g); b.setAttribute('aria-pressed', 'false'); }
        else { aktiv.add(g); b.setAttribute('aria-pressed', 'true'); }
        anwenden();
      });
    });

    var zuruck = filter.querySelector('[data-alle]');
    if (zuruck) {
      zuruck.addEventListener('click', function () {
        aktiv.clear();
        filter.querySelectorAll('button[data-grad]').forEach(function (b) {
          b.setAttribute('aria-pressed', 'false');
        });
        anwenden();
      });
    }

    anwenden();
  }

  /* ── Sektorplan: Sektor und Boardzeilen zeigen aufeinander ─────────── */
  var plan = document.querySelector('[data-plan]');
  if (plan && board) {
    plan.querySelectorAll('[data-sektor]').forEach(function (form) {
      var name = form.dataset.sektor;

      var an = function (ein) {
        form.style.opacity = ein ? '1' : '';
        board.querySelectorAll('tbody tr').forEach(function (tr) {
          if (tr.dataset.sektor === name) {
            tr.style.background = ein ? 'var(--grund-3)' : '';
          }
        });
      };

      form.addEventListener('mouseenter', function () { an(true); });
      form.addEventListener('mouseleave', function () { an(false); });
      form.addEventListener('focus', function () { an(true); });
      form.addEventListener('blur', function () { an(false); });
    });
  }
})();
