document.documentElement.classList.add('js');

(function () {
  'use strict';

  var stations = [
    { value: 883, name: 'FREIRAUM', copy: 'Offene Mikrofone, Feldaufnahmen und unfertige Ideen.', preset: 'A' },
    { value: 927, name: 'NACHHALL', copy: 'Kultur aus dem Revier – live, lokal und mit langen Pausen.', preset: 'B' },
    { value: 974, name: 'NACHTBUS', copy: 'Späte Gespräche, leise Platten und Stimmen von unterwegs.', preset: 'C' },
    { value: 1031, name: 'WERKSTATT', copy: 'Geräusche, Reparaturen und Musik aus offenen Ateliers.', preset: 'D' }
  ];

  function setupMenu() {
    var button = document.querySelector('.menu-button');
    var menu = document.querySelector('.rack-nav');
    if (!button || !menu) return;

    function setOpen(open) {
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Menü schließen' : 'Menü';
      menu.dataset.open = String(open);
    }

    setOpen(false);
    button.addEventListener('click', function () {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        button.focus();
      }
    });
  }

  function setupTuner() {
    var range = document.querySelector('[data-tuner]');
    var frequency = document.querySelector('[data-frequency]');
    var stationName = document.querySelector('[data-station-name]');
    var status = document.querySelector('[data-tuner-status]');
    var meter = document.querySelector('[data-signal]');
    var scale = document.querySelector('[data-scale]');
    var knob = document.querySelector('[data-knob]');
    var presets = Array.prototype.slice.call(document.querySelectorAll('[data-preset]'));
    if (!range || !frequency || !stationName || !status || !meter || !scale || !knob) return;

    function update() {
      var value = Number(range.value);
      var ratio = (value - Number(range.min)) / (Number(range.max) - Number(range.min));
      var nearest = stations.reduce(function (best, item) {
        return Math.abs(item.value - value) < Math.abs(best.value - value) ? item : best;
      }, stations[0]);
      var distance = Math.abs(nearest.value - value);
      var strength = Math.max(4, 100 - distance * 18);
      var locked = distance <= 3;

      frequency.textContent = (value / 10).toFixed(1);
      scale.style.setProperty('--needle', (ratio * 100).toFixed(2) + '%');
      knob.style.setProperty('--dial', (-125 + ratio * 250).toFixed(1) + 'deg');
      meter.value = strength;
      stationName.textContent = locked ? nearest.name : 'ZWISCHENRAUM';
      status.textContent = locked
        ? nearest.name + ' auf ' + (nearest.value / 10).toFixed(1) + ' MHz: ' + nearest.copy
        : 'Zwischen den Sendern: Rauschen. Drehen Sie weiter bis die Pegelanzeige steigt.';

      presets.forEach(function (button) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.preset) === nearest.value && locked));
      });
    }

    range.addEventListener('input', update);
    presets.forEach(function (button) {
      button.addEventListener('click', function () {
        range.value = button.dataset.preset;
        update();
        range.focus();
      });
    });
    update();
  }

  function setupProgram() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-program-day]'));
    var sheets = Array.prototype.slice.call(document.querySelectorAll('[data-schedule]'));
    var status = document.querySelector('[data-program-status]');
    if (!buttons.length || !sheets.length || !status) return;

    function select(day, announce) {
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.programDay === day));
      });
      sheets.forEach(function (sheet) {
        sheet.hidden = sheet.dataset.schedule !== day;
      });
      var active = sheets.find(function (sheet) { return sheet.dataset.schedule === day; });
      if (active && announce) {
        status.textContent = active.dataset.dayName + ' gewählt: ' + active.querySelectorAll('.schedule-row').length + ' Sendungen im Logbuch.';
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        select(button.dataset.programDay, true);
      });
    });
    select(buttons[0].dataset.programDay, false);
  }

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var rest = Math.floor(seconds % 60);
    return String(minutes).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
  }

  function setupArchive() {
    var deck = document.querySelector('[data-deck]');
    var tapes = Array.prototype.slice.call(document.querySelectorAll('[data-tape]'));
    var title = document.querySelector('[data-deck-title]');
    var meta = document.querySelector('[data-deck-meta]');
    var label = document.querySelector('[data-cassette-label]');
    var transcript = document.querySelector('[data-transcript]');
    var progress = document.querySelector('[data-tape-progress]');
    var status = document.querySelector('[data-archive-status]');
    var play = document.querySelector('[data-transport="play"]');
    var pause = document.querySelector('[data-transport="pause"]');
    var stop = document.querySelector('[data-transport="stop"]');
    if (!deck || !tapes.length || !title || !meta || !label || !transcript || !progress || !status || !play || !pause || !stop) return;

    var timer = null;
    var currentTitle = '';

    function halt(message) {
      if (timer) window.clearInterval(timer);
      timer = null;
      deck.classList.remove('is-running');
      play.setAttribute('aria-pressed', 'false');
      pause.setAttribute('aria-pressed', 'true');
      if (message) status.textContent = message;
    }

    function loadTape(button) {
      halt();
      tapes.forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      currentTitle = button.dataset.title;
      title.textContent = button.dataset.title;
      meta.textContent = button.dataset.date + ' · ' + button.dataset.category + ' · ' + button.dataset.duration;
      label.textContent = button.dataset.archive + ' / ' + button.dataset.title;
      transcript.textContent = button.dataset.transcript;
      progress.max = button.dataset.seconds;
      progress.value = 0;
      pause.setAttribute('aria-pressed', 'false');
      status.textContent = 'Band ' + button.dataset.archive + ' eingelegt. Position 00:00.';
    }

    tapes.forEach(function (button) {
      button.addEventListener('click', function () { loadTape(button); });
    });

    play.addEventListener('click', function () {
      if (timer) return;
      deck.classList.add('is-running');
      play.setAttribute('aria-pressed', 'true');
      pause.setAttribute('aria-pressed', 'false');
      status.textContent = currentTitle + ' läuft stumm als visuelle Archivvorschau.';
      timer = window.setInterval(function () {
        var next = Number(progress.value) + 1;
        if (next >= Number(progress.max)) {
          progress.value = progress.max;
          halt('Bandende erreicht: ' + formatTime(Number(progress.max)) + '.');
          return;
        }
        progress.value = next;
        status.textContent = currentTitle + ' · ' + formatTime(next) + ' / ' + formatTime(Number(progress.max)) + ' · kein Audio';
      }, 1000);
    });

    pause.addEventListener('click', function () {
      halt('Band pausiert bei ' + formatTime(Number(progress.value)) + '.');
    });

    stop.addEventListener('click', function () {
      halt();
      progress.value = 0;
      pause.setAttribute('aria-pressed', 'false');
      status.textContent = 'Band gestoppt und auf 00:00 zurückgesetzt.';
    });

    progress.addEventListener('input', function () {
      status.textContent = currentTitle + ' manuell auf ' + formatTime(Number(progress.value)) + ' gestellt.';
    });

    loadTape(tapes[0]);
  }

  setupMenu();
  setupTuner();
  setupProgram();
  setupArchive();
}());
