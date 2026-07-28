/* Härtl Präzisionstechnik — Blattlogik.
   Kein Framework, keine externen Requests. */
(function () {
  'use strict';

  /* ── Zonenmarken auf den Blattrahmen setzen (DIN 6771) ─────────────── */
  document.querySelectorAll('.zones').forEach(function (z) {
    var cols = 'ABCDEFGH'.slice(0, 6).split('');
    var rows = ['1', '2', '3', '4'];
    var html = '';
    cols.forEach(function (c, i) {
      html += '<span class="zx" style="left:' + ((i + 0.5) / cols.length * 100) + '%">' + c + '</span>';
    });
    rows.forEach(function (r, i) {
      html += '<span class="zy" style="top:' + ((i + 0.5) / rows.length * 100) + '%">' + r + '</span>';
    });
    z.innerHTML = html;
  });

  /* ── Navigation ────────────────────────────────────────────────────── */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ── Konstruktion der Hero-Zeichnung ───────────────────────────────
     Jede Maßlinie bekommt ihre echte Pfadlänge, damit der Strich sauber
     einläuft statt zu springen.                                         */
  var svg = document.querySelector('.hero-draw svg');
  if (svg) {
    svg.querySelectorAll('.draw-line').forEach(function (el) {
      var len = 400;
      try { len = Math.ceil(el.getTotalLength()) + 2; } catch (e) { /* Fallback oben */ }
      el.style.setProperty('--len', len);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { svg.classList.add('is-ready'); });
    });
  }

  /* ── Dateifeld: Zeichnung anhängen ─────────────────────────────────── */
  var drop = document.querySelector('.drop');
  if (drop) {
    var input = drop.querySelector('input[type=file]');
    var label = drop.querySelector('.drop-label');
    var base = label ? label.textContent : '';

    var show = function (files) {
      if (!label) return;
      if (!files || !files.length) { label.textContent = base; return; }
      var names = [].slice.call(files).map(function (f) { return f.name; });
      label.textContent = names.length === 1
        ? names[0]
        : names.length + ' Dateien: ' + names.join(', ');
    };

    input.addEventListener('change', function () { show(input.files); });

    ['dragenter', 'dragover'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('hot'); });
    });
    ['dragleave', 'drop'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('hot'); });
    });
    drop.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files.length) {
        try { input.files = e.dataTransfer.files; } catch (err) { /* ältere Browser */ }
        show(e.dataTransfer.files);
      }
    });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });
  }

  /* ── Anfrageformular: Demo, versendet nichts ───────────────────────── */
  var form = document.querySelector('form[data-demo]');
  if (form) {
    var sent = form.querySelector('.sent');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      form.querySelectorAll('[required]').forEach(function (el) {
        var field = el.closest('.field');
        var bad = !el.value.trim() || (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(el.value));
        field.classList.toggle('err', bad);
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { el.focus(); ok = false; }
      });

      if (!ok) return;

      var btn = form.querySelector('button[type=submit]');
      var text = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Wird geprüft …';

      window.setTimeout(function () {
        btn.disabled = false;
        btn.textContent = text;
        if (sent) {
          sent.classList.add('on');
          sent.setAttribute('tabindex', '-1');
          sent.focus();
        }
        form.reset();
        if (drop) {
          var l = drop.querySelector('.drop-label');
          if (l) l.textContent = 'Zeichnung anhängen — STEP, DXF, IGES oder PDF';
        }
      }, 700);
    });

    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var f = el.closest('.field');
        if (f) f.classList.remove('err');
      });
    });
  }
})();
