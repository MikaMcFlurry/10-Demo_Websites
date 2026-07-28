/* Brandt Ostermann — Registerlogik und Anfrageformular.
   Kein Framework, keine externen Requests. */
(function () {
  'use strict';

  /* ── Register: der Reiter des sichtbaren Abschnitts zieht heraus ────── */
  var reiter = Array.prototype.slice.call(document.querySelectorAll('.reiter a[href^="#"]'));
  if (reiter.length && 'IntersectionObserver' in window) {
    var ziele = reiter
      .map(function (a) {
        var el = document.getElementById(a.getAttribute('href').slice(1));
        return el ? { a: a, el: el } : null;
      })
      .filter(Boolean);

    if (ziele.length) {
      var sichtbar = new Map();

      var beobachter = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) {
          sichtbar.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        });

        var besterWert = 0;
        var bestes = null;
        sichtbar.forEach(function (wert, el) {
          if (wert > besterWert) { besterWert = wert; bestes = el; }
        });

        ziele.forEach(function (z) {
          z.a.classList.toggle('on', z.el === bestes && besterWert > 0);
        });
      }, { threshold: [0, .18, .4, .7, 1], rootMargin: '-15% 0px -45% 0px' });

      ziele.forEach(function (z) { beobachter.observe(z.el); });
    }
  }

  /* ── Anfrage: Demo, versendet nichts ───────────────────────────────── */
  var form = document.querySelector('form[data-demo]');
  if (form) {
    var quittung = form.querySelector('.quittung');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      form.querySelectorAll('input[required], textarea[required], select[required]').forEach(function (el) {
        var gruppe = el.closest('.feldgruppe') || el.closest('.pruef');
        var falsch = el.type === 'checkbox'
          ? !el.checked
          : (!el.value.trim() || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(el.value)));

        if (gruppe) gruppe.classList.toggle('falsch', falsch);
        el.setAttribute('aria-invalid', falsch ? 'true' : 'false');
        if (falsch && ok) { el.focus(); ok = false; }
      });

      if (!ok) return;

      if (quittung) {
        quittung.classList.add('an');
        quittung.setAttribute('tabindex', '-1');
        quittung.focus();
      }
      form.reset();
    });

    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      var raus = function () {
        var g = el.closest('.feldgruppe') || el.closest('.pruef');
        if (g) g.classList.remove('falsch');
      };
      el.addEventListener('input', raus);
      el.addEventListener('change', raus);
    });
  }
})();
