/* Weingut Steinhalde — Tiefenlineal und Formular.
   Kein Framework, keine externen Requests. */
(function () {
  'use strict';

  /* ── Navigation ────────────────────────────────────────────────────── */
  var t = document.querySelector('.navtoggle');
  var nav = document.querySelector('.nav');
  if (t && nav) {
    t.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ── Tiefenlineal ──────────────────────────────────────────────────
     Der Scrollfortschritt wird auf 0 bis 500 cm Profiltiefe abgebildet.
     Die Horizonte entsprechen der Keuper-Schichtenfolge im Remstal.    */
  var rail = document.querySelector('.rail');
  if (rail) {
    var TIEFE = 500;
    var HORIZONTE = [
      { bis:  35, name: 'Oberboden' },
      { bis:  90, name: 'Lösslehm' },
      { bis: 180, name: 'Knollenmergel' },
      { bis: 320, name: 'Stubensandstein' },
      { bis: 500, name: 'Gipskeuper' }
    ];

    var ticks = rail.querySelector('.rail-ticks');
    var read  = rail.querySelector('.rail-read');
    var depth = rail.querySelector('.rail-depth');
    var name  = rail.querySelector('.rail-name');
    var mark  = rail.querySelector('.rail-marker');

    /* Teilstriche: alle 25 cm ein kurzer, alle 100 cm ein langer */
    var html = '';
    for (var cm = 0; cm <= TIEFE; cm += 25) {
      var pct = (cm / TIEFE) * 100;
      html += '<i class="' + (cm % 100 === 0 ? 'maj' : 'min') + '" style="top:' + pct + '%"></i>';
    }
    ticks.innerHTML = html;

    var raf = null;
    var update = function () {
      raf = null;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var cm = Math.round(p * TIEFE);

      var h = HORIZONTE[HORIZONTE.length - 1];
      for (var i = 0; i < HORIZONTE.length; i++) {
        if (cm <= HORIZONTE[i].bis) { h = HORIZONTE[i]; break; }
      }

      depth.textContent = '− ' + cm + ' cm';
      name.textContent = h.name;
      var top = (8 + p * 84) + '%';
      read.style.top = top;
      mark.style.top = top;
    };

    var onScroll = function () { if (raf === null) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ── Verkostungsanfrage — Demo, versendet nichts ───────────────────── */
  var form = document.querySelector('form[data-demo]');
  if (form) {
    var done = form.querySelector('.done');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      form.querySelectorAll('[required]').forEach(function (el) {
        var wrap = el.closest('.f');
        var bad = !el.value.trim() ||
                  (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(el.value));
        wrap.classList.toggle('no', bad);
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { el.focus(); ok = false; }
      });

      if (!ok) return;

      if (done) {
        done.classList.add('on');
        done.setAttribute('tabindex', '-1');
        done.focus();
      }
      form.reset();
    });

    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', function () {
        var w = el.closest('.f');
        if (w) w.classList.remove('no');
      });
    });
  }

  /* ── Öffnungszeiten: geschlossene Tage kenntlich machen ────────────── */
  document.querySelectorAll('[data-hours] li[data-tag]').forEach(function (li) {
    var heute = new Date().getDay();
    if (Number(li.dataset.tag) === heute) {
      li.style.fontWeight = '500';
      li.insertAdjacentHTML('beforeend',
        '<span class="z" style="opacity:1;color:var(--rebe);margin-left:14px">heute</span>');
    }
  });
})();
