/* HOCHOFEN Festival — Plakatlogik. Kein Framework, keine externen Requests. */
(function () {
  'use strict';

  /* Der Druckvorgang: die Orangeplatte fährt einmal in den Passer. */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('printed'); });
  });

  /* Navigation */
  var toggle = document.querySelector('.toggle');
  var menu = document.querySelector('.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Laufplan: der aktuell laufende Slot wird hervorgehoben, sobald das
     Festival läuft. Außerhalb des Zeitraums bleibt die Tabelle neutral. */
  var sheet = document.querySelector('[data-runsheet]');
  if (sheet) {
    var now = new Date();
    sheet.querySelectorAll('.slot[data-von][data-bis]').forEach(function (el) {
      var von = new Date(el.dataset.von);
      var bis = new Date(el.dataset.bis);
      if (now >= von && now < bis) {
        el.classList.add('hit');
        el.insertAdjacentHTML('beforeend', '<small>läuft gerade</small>');
      }
    });
  }

  /* Anmeldung — Demo, versendet nichts */
  var form = document.querySelector('form[data-demo]');
  if (form) {
    var mail = form.querySelector('input[type=email]');
    var err = form.querySelector('.err');
    var ok = document.querySelector('.notice');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(mail.value.trim());

      if (!valid) {
        err.textContent = 'Bitte eine vollständige E-Mail-Adresse eintragen.';
        mail.setAttribute('aria-invalid', 'true');
        mail.focus();
        return;
      }

      err.textContent = '';
      mail.removeAttribute('aria-invalid');
      if (ok) {
        ok.classList.add('on');
        ok.setAttribute('tabindex', '-1');
        ok.focus();
      }
      form.reset();
    });

    mail.addEventListener('input', function () {
      err.textContent = '';
      mail.removeAttribute('aria-invalid');
    });
  }
})();
