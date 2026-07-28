document.documentElement.classList.add('js');

(function () {
  'use strict';

  var ink = '#121212';
  var ember = '#EF724F';
  var mint = '#ACE2DF';
  var canary = '#F6D44A';
  var cobalt = '#2B55B8';
  var paper = '#F6E0DB';
  var white = '#FFFDF8';

  function setupMenu() {
    var button = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.lab-nav');
    if (!button || !menu) return;

    function setOpen(open) {
      button.setAttribute('aria-expanded', String(open));
      menu.dataset.open = String(open);
      button.textContent = open ? 'Heft schließen' : 'Heft öffnen';
    }

    setOpen(false);
    button.addEventListener('click', function () {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        button.focus();
      }
    });
  }

  function prepareCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(280, Math.round(rect.width));
    var height = Math.max(220, Math.round(rect.height));
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    var context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    return { context: context, width: width, height: height };
  }

  function observeCanvas(canvas, draw) {
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { draw(); }).observe(canvas);
    } else {
      window.addEventListener('resize', draw);
    }
  }

  function setupMagnet() {
    var canvas = document.querySelector('[data-magnet-canvas]');
    var slider = document.querySelector('[data-magnet-control]');
    var status = document.querySelector('[data-magnet-status]');
    if (!canvas || !slider || !status) return;

    function draw() {
      var surface = prepareCanvas(canvas);
      var ctx = surface.context;
      var width = surface.width;
      var height = surface.height;
      var value = Number(slider.value);
      var centerX = width * 0.18 + (value / 100) * width * 0.64;
      var centerY = height * 0.54;
      var magnetWidth = Math.min(158, width * 0.32);
      var magnetHeight = Math.min(62, height * 0.22);
      var northX = centerX - magnetWidth * 0.43;
      var southX = centerX + magnetWidth * 0.43;

      ctx.clearRect(0, 0, width, height);

      function fieldAngle(x, y) {
        var nx = x - northX;
        var ny = y - centerY;
        var sx = x - southX;
        var sy = y - centerY;
        var nr = Math.max(130, Math.pow(nx * nx + ny * ny, 1.5));
        var sr = Math.max(130, Math.pow(sx * sx + sy * sy, 1.5));
        var bx = nx / nr - sx / sr;
        var by = ny / nr - sy / sr;
        return Math.atan2(by, bx);
      }

      ctx.strokeStyle = 'rgba(18,18,18,0.48)';
      ctx.lineWidth = 2;
      for (var row = 34; row < height - 20; row += 28) {
        for (var column = 24; column < width - 16; column += 31) {
          if (
            Math.abs(column - centerX) < magnetWidth * 0.62 &&
            Math.abs(row - centerY) < magnetHeight
          ) continue;

          var angle = fieldAngle(column, row);
          var length = 8;
          ctx.beginPath();
          ctx.moveTo(
            column - Math.cos(angle) * length,
            row - Math.sin(angle) * length
          );
          ctx.lineTo(
            column + Math.cos(angle) * length,
            row + Math.sin(angle) * length
          );
          ctx.stroke();
        }
      }

      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      for (var loop = 1; loop <= 4; loop += 1) {
        var lift = 30 + loop * Math.min(25, height * 0.07);
        ctx.beginPath();
        ctx.moveTo(northX, centerY - magnetHeight * 0.35);
        ctx.bezierCurveTo(
          northX - lift * 0.65,
          centerY - lift,
          southX + lift * 0.65,
          centerY - lift,
          southX,
          centerY - magnetHeight * 0.35
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(northX, centerY + magnetHeight * 0.35);
        ctx.bezierCurveTo(
          northX - lift * 0.65,
          centerY + lift,
          southX + lift * 0.65,
          centerY + lift,
          southX,
          centerY + magnetHeight * 0.35
        );
        ctx.stroke();
      }

      ctx.fillStyle = ember;
      ctx.fillRect(centerX - magnetWidth / 2, centerY - magnetHeight / 2, magnetWidth / 2, magnetHeight);
      ctx.fillStyle = cobalt;
      ctx.fillRect(centerX, centerY - magnetHeight / 2, magnetWidth / 2, magnetHeight);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 4;
      ctx.strokeRect(centerX - magnetWidth / 2, centerY - magnetHeight / 2, magnetWidth, magnetHeight);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - magnetHeight / 2);
      ctx.lineTo(centerX, centerY + magnetHeight / 2);
      ctx.stroke();

      ctx.fillStyle = ink;
      ctx.font = '700 20px "Atkinson Hyperlegible", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', centerX - magnetWidth / 4, centerY);
      ctx.fillStyle = white;
      ctx.fillText('S', centerX + magnetWidth / 4, centerY);

      var position;
      if (value < 34) position = 'links';
      else if (value > 66) position = 'rechts';
      else position = 'in der Mitte';
      status.textContent = 'Magnet ' + position + ': Die Eisenlinien richten sich neu zwischen Nord- und Südpol aus.';
    }

    slider.addEventListener('input', draw);
    draw();
    observeCanvas(canvas, draw);
  }

  function setupFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var discs = Array.prototype.slice.call(document.querySelectorAll('[data-light-disc]'));
    var status = document.querySelector('[data-filter-status]');
    if (!buttons.length || !discs.length || !status) return;

    var messages = {
      '': 'Alles aus: Ohne Licht bleibt die Mischfläche schwarz.',
      ember: 'Glut allein: Die Fläche leuchtet rot-orange.',
      mint: 'Minze allein: Die Fläche leuchtet grünlich.',
      cobalt: 'Kobalt allein: Die Fläche leuchtet blau.',
      'ember+mint': 'Glut plus Minze: In der Überlagerung entsteht Gelb.',
      'cobalt+ember': 'Glut plus Kobalt: In der Überlagerung entsteht Magenta.',
      'cobalt+mint': 'Minze plus Kobalt: In der Überlagerung entsteht Cyan.',
      'cobalt+ember+mint': 'Alle drei Lichtfarben: Die Mitte nähert sich Weiß.'
    };

    function update() {
      var active = [];
      buttons.forEach(function (button) {
        var name = button.dataset.filterButton;
        var on = button.getAttribute('aria-pressed') === 'true';
        if (on) active.push(name);
        var disc = discs.find(function (item) {
          return item.dataset.lightDisc === name;
        });
        if (disc) disc.classList.toggle('is-on', on);
      });
      active.sort();
      status.textContent = messages[active.join('+')] || 'Die Lichtfarben überlagern sich.';
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var pressed = button.getAttribute('aria-pressed') === 'true';
        button.setAttribute('aria-pressed', String(!pressed));
        update();
      });
    });

    update();
  }

  function setupSound() {
    var canvas = document.querySelector('[data-sound-canvas]');
    var slider = document.querySelector('[data-sound-control]');
    var status = document.querySelector('[data-sound-status]');
    if (!canvas || !slider || !status) return;

    function draw() {
      var surface = prepareCanvas(canvas);
      var ctx = surface.context;
      var width = surface.width;
      var height = surface.height;
      var value = Number(slider.value);

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(18,18,18,0.22)';
      ctx.lineWidth = 1.5;
      for (var x = 30; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 22);
        ctx.lineTo(x, height - 22);
        ctx.stroke();
      }
      for (var y = 35; y < height; y += 46) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(width - 20, y);
        ctx.stroke();
      }

      ctx.strokeStyle = ink;
      ctx.lineWidth = 5;
      ctx.beginPath();
      var amplitude = Math.min(78, height * 0.28);
      for (var point = 0; point <= width; point += 3) {
        var waveY = height / 2 + Math.sin((point / width) * Math.PI * 2 * value) * amplitude;
        if (point === 0) ctx.moveTo(point, waveY);
        else ctx.lineTo(point, waveY);
      }
      ctx.stroke();

      ctx.fillStyle = ink;
      ctx.font = '700 15px "Atkinson Hyperlegible", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(value + '×', 16, 24);

      var range;
      if (value <= 3) range = 'langsame Schwingung – ein tiefer Ton wäre zu erwarten';
      else if (value <= 8) range = 'mittlere Schwingung – der gedachte Ton steigt';
      else range = 'schnelle Schwingung – ein hoher Ton wäre zu erwarten';
      status.textContent = value + ' Wellen im Fenster: ' + range + '. Die Demo bleibt absichtlich stumm.';
    }

    slider.addEventListener('input', draw);
    draw();
    observeCanvas(canvas, draw);
  }

  function setupToday() {
    var today = new Date().getDay();
    document.querySelectorAll('[data-day]').forEach(function (row) {
      if (Number(row.dataset.day) !== today) return;
      row.classList.add('is-today');
      row.setAttribute('aria-current', 'date');
      var heading = row.querySelector('th');
      if (heading) {
        var label = document.createElement('span');
        label.className = 'today-label';
        label.textContent = 'Heute';
        heading.appendChild(label);
      }
    });
  }

  function fieldMessage(field) {
    if (field.validity.valueMissing) return 'Bitte dieses Feld ausfüllen.';
    if (field.validity.typeMismatch) return 'Bitte eine gültige E-Mail-Adresse eingeben.';
    if (field.validity.tooShort) return 'Bitte etwas ausführlicher antworten.';
    return 'Bitte die Eingabe prüfen.';
  }

  function setupForms() {
    document.querySelectorAll('[data-demo-form]').forEach(function (form) {
      var summary = form.querySelector('[data-form-summary]');
      var success = form.querySelector('[data-form-success]');
      var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));

      function clearField(field) {
        field.removeAttribute('aria-invalid');
        var errorId = field.getAttribute('aria-describedby');
        if (!errorId) return;
        errorId.split(/\s+/).forEach(function (id) {
          var error = document.getElementById(id);
          if (error && error.classList.contains('field-error')) error.textContent = '';
        });
      }

      fields.forEach(function (field) {
        field.addEventListener('input', function () {
          clearField(field);
          if (summary) summary.hidden = true;
          if (success) success.hidden = true;
        });
        field.addEventListener('change', function () { clearField(field); });
      });

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var invalid = [];

        fields.forEach(function (field) {
          clearField(field);
          if (field.checkValidity()) return;
          invalid.push(field);
          field.setAttribute('aria-invalid', 'true');
          var errorId = field.getAttribute('aria-describedby');
          if (!errorId) return;
          errorId.split(/\s+/).forEach(function (id) {
            var error = document.getElementById(id);
            if (error && error.classList.contains('field-error')) {
              error.textContent = fieldMessage(field);
            }
          });
        });

        if (invalid.length) {
          if (success) success.hidden = true;
          if (summary) {
            summary.hidden = false;
            summary.textContent = invalid.length === 1
              ? 'Ein Feld braucht noch Ihre Aufmerksamkeit.'
              : invalid.length + ' Felder brauchen noch Ihre Aufmerksamkeit.';
            summary.focus();
          } else {
            invalid[0].focus();
          }
          return;
        }

        if (summary) summary.hidden = true;
        if (success) {
          success.hidden = false;
          success.textContent = 'Versuchsnotiz vollständig. Dies ist eine Portfolio-Demo; es wurden keine Daten gesendet.';
          success.focus();
        }
      });
    });
  }

  setupMenu();
  setupMagnet();
  setupFilters();
  setupSound();
  setupToday();
  setupForms();
}());
