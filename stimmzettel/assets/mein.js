/* Mein Bogen: das eigene Programm, entstanden aus den Duellen. */
(function () {
  'use strict';

  var inhalt   = document.querySelector('[data-inhalt]');
  var einltg   = document.querySelector('[data-einleitung]');
  var tausch   = document.querySelector('[data-tausch]');
  var sterneKopf = document.querySelector('[data-sterne]');

  function kuerzen(s, max) {
    if (!s || s.length <= max) return s || '';
    return s.slice(0, max - 1).replace(/[\s,;:–-]+$/, '') + '…';
  }

  function leer() {
    inhalt.innerHTML =
      '<div class="leerbogen">' +
      '<h2>Ihr Bogen ist noch leer.</h2>' +
      '<p>Er füllt sich von selbst, sobald Sie anfangen zu entscheiden. ' +
      'Nach zehn Duellen steht schon eine erste Rangfolge.</p>' +
      '<p><a class="knopf knopf--voll" href="index.html">Erste Entscheidung treffen</a></p>' +
      '</div>';
  }

  function textFuerZwischenablage(sterne, daten) {
    var zeilen = ['Mein Bogen – die Sätze, die ich für Deutschland am wichtigsten halte', ''];
    sterne.slice(0, 20).forEach(function (id, i) {
      var f = daten.nach[id];
      if (!f) return;
      zeilen.push((i + 1) + '. ' + f.satz);
      zeilen.push('   Quelle: ' + f.quelle.podcast + (f.quelle.url ? ' – ' + f.quelle.url : ''));
    });
    if (sterne.length > 20) zeilen.push('', '… und ' + (sterne.length - 20) + ' weitere.');
    zeilen.push('', 'Erstellt mit dem Stimmzettel von Demokratie am Küchentisch.');
    return zeilen.join('\n');
  }

  function zeichnen() {
    var daten = SZ.daten();
    var sterne = SZ.sterne();

    sterneKopf.textContent = '★ ' + sterne.length;

    if (!sterne.length) { leer(); return; }

    einltg.innerHTML =
      'Aus <b>' + SZ.entscheidungen() + '</b> Entscheidungen sind <b>' + sterne.length +
      '</b> von 100 Sternen geworden. Was Sie öfter gewählt haben, steht weiter oben. ' +
      'Streichen Sie, was Ihnen weniger wichtig geworden ist – der Stern wird sofort frei.';

    if (sterne.length >= SZ.STERNE_GESAMT) tausch.hidden = false;

    var kopf = document.createElement('div');
    kopf.className = 'zaehlung';
    var teile = [];
    for (var i = 0; i < 100; i++) teile.push('<i class="' + (i < sterne.length ? 'voll' : '') + '"></i>');
    teile.push('<span class="text">' + sterne.length + ' vergeben · ' + SZ.uebrig() + ' frei</span>');
    kopf.innerHTML = teile.join('');

    var liste = document.createElement('ol');
    liste.className = 'programm';

    sterne.forEach(function (id, i) {
      var f = daten.nach[id];
      if (!f) return;

      var li = document.createElement('li');

      var rang = document.createElement('span');
      rang.className = 'rang';
      rang.textContent = String(i + 1).padStart(2, '0');

      var mitte = document.createElement('div');
      var satz = document.createElement('p');
      satz.className = 'satz';
      satz.textContent = f.satz;
      var herkunft = document.createElement('p');
      herkunft.className = 'herkunft';
      herkunft.textContent = f.felder[0] + ' · ' + f.quelle.podcast +
        (f.quelle.episode ? ' · ' + kuerzen(f.quelle.episode, 46) : '');
      mitte.appendChild(satz);
      mitte.appendChild(herkunft);

      var weg = document.createElement('button');
      weg.type = 'button';
      weg.className = 'weg';
      weg.textContent = 'Streichen';
      weg.setAttribute('aria-label', 'Platz ' + (i + 1) + ' streichen und den Stern freigeben');
      weg.addEventListener('click', function () {
        SZ.sternEntfernen(id);
        zeichnen();
      });

      li.appendChild(rang);
      li.appendChild(mitte);
      li.appendChild(weg);
      liste.appendChild(li);
    });

    var fuss = document.createElement('div');
    fuss.style.marginTop = 'clamp(24px,3vw,40px)';
    fuss.innerHTML =
      '<a class="knopf knopf--voll" href="index.html">Weiter entscheiden</a>' +
      '<button class="knopf" type="button" data-teilen style="margin-left:10px">Bogen kopieren</button>' +
      '<a class="knopf" href="ergebnis.html" style="margin-left:10px">Mit dem Ergebnis vergleichen</a>' +
      '<p class="kopiert" role="status" hidden ' +
      'style="margin-top:14px;font:500 13px/1.5 var(--f-amt);color:var(--druck-2)"></p>';

    /* Was im Echtbetrieb passieren würde: genau diese Sterne gehen als
       Einzelstimmen an die bestehende Plattform. Wir zeigen den Plan, statt ihn
       zu behaupten. */
    var plan = document.createElement('details');
    plan.style.marginTop = 'clamp(22px,2.6vw,34px)';
    plan.innerHTML =
      '<summary style="cursor:pointer;font:500 13px/1.5 var(--f-amt);color:var(--druck-2)">' +
      'Was bei der Übertragung an die Plattform passieren würde</summary>' +
      '<p style="margin-top:12px;font-size:.94rem;color:var(--druck-2);max-width:66ch">' +
      'Ihre ' + sterne.length + ' Sterne würden als ebenso viele Einzelstimmen an die ' +
      'bestehende Schnittstelle gesendet – je ein Aufruf von <code>POST /api/votes/{id}</code>. ' +
      'Das entspricht genau dem Lebenszeit-Budget von 100 Stimmen, das die Plattform ' +
      'heute schon führt. Diese Demonstration sendet nichts.</p>';

    inhalt.innerHTML = '';
    inhalt.appendChild(kopf);
    inhalt.appendChild(liste);
    inhalt.appendChild(fuss);
    inhalt.appendChild(plan);

    var teilen = fuss.querySelector('[data-teilen]');
    var quittung = fuss.querySelector('.kopiert');
    teilen.addEventListener('click', function () {
      var text = textFuerZwischenablage(sterne, daten);
      var fertig = function (ok) {
        quittung.hidden = false;
        quittung.textContent = ok
          ? 'In die Zwischenablage kopiert – Sie können den Bogen jetzt einfügen und weitergeben.'
          : 'Kopieren hat nicht geklappt. Markieren Sie die Liste oben und kopieren Sie sie von Hand.';
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { fertig(true); }, function () { fertig(false); });
      } else {
        fertig(false);
      }
    });
  }

  SZ.holen().then(zeichnen).catch(function () {
    inhalt.innerHTML = '<p>Der Bogen lässt sich gerade nicht laden. Bitte laden Sie die Seite neu.</p>';
  });
})();
