/* Ergebnisseite: die laufende Auszählung.
   Gezeigt wird der Stimmenstand der bestehenden Plattform, überlagert mit den
   eigenen Sternen. Beides wird getrennt ausgewiesen – nichts wird vermischt. */
(function () {
  'use strict';

  var tafel   = document.querySelector('[data-tafel]');
  var filter  = document.querySelector('[data-filter]');
  var stand   = document.querySelector('[data-datenstand]');
  var feldWahl = null;

  function setzeZahl(wahl, wert) {
    var el = document.querySelector('[' + wahl + ']');
    if (el) el.textContent = wert;
  }

  function kuerzen(s, max) {
    if (!s || s.length <= max) return s || '';
    return s.slice(0, max - 1).replace(/[\s,;:–-]+$/, '') + '…';
  }

  function zeichnen() {
    var daten = SZ.daten();
    var meine = SZ.sterne();
    var meinRang = {};
    meine.forEach(function (id, i) { meinRang[id] = i + 1; });

    var liste = daten.fakten.filter(function (f) {
      return !feldWahl || f.felder.indexOf(feldWahl) !== -1;
    });

    /* Sortierung: erst die Plattformstimmen, dann die eigene Wertung.
       So bleibt sichtbar, was die Allgemeinheit sagt, und die eigene
       Entscheidung hebt sich davon ab, statt sie zu überschreiben. */
    liste.sort(function (a, b) {
      if (b.stimmen !== a.stimmen) return b.stimmen - a.stimmen;
      var ra = meinRang[a.id] || 999, rb = meinRang[b.id] || 999;
      if (ra !== rb) return ra - rb;
      return SZ.wertungVon(b.id) - SZ.wertungVon(a.id);
    });

    /* Ehrlich trennen: Was bereits Stimmen hat, ist eine Rangliste. Was keine
       hat, ist keine – und genau das ist das stärkste Argument mitzumachen. */
    var gewaehlt = liste.filter(function (f) { return f.stimmen > 0; }).slice(0, 100);
    var offen = liste.filter(function (f) { return f.stimmen === 0; });
    var hoechst = Math.max(1, gewaehlt.length ? gewaehlt[0].stimmen : 1);

    tafel.innerHTML = '';

    if (!gewaehlt.length) {
      tafel.innerHTML = '<li><p class="satz">In diesem Feld hat noch niemand abgestimmt.</p></li>';
    }

    gewaehlt.forEach(function (f, i) {
      tafel.appendChild(zeile(f, i + 1, meinRang, hoechst, false));
    });

    /* Die eigenen Sterne, für die es noch keine Plattformstimme gibt */
    var eigeneOhne = offen.filter(function (f) { return meinRang[f.id]; })
                          .sort(function (a, b) { return meinRang[a.id] - meinRang[b.id]; });

    var rest = document.querySelector('[data-rest]');
    if (rest) {
      var anz = offen.length;
      var teile = ['<span class="kopfzeile">Noch ohne eine einzige Stimme</span><div class="restinhalt">'];
      teile.push('<p><b>' + anz + ' Sätze</b> in dieser Auswahl haben bisher niemanden gefunden, ' +
                 'der sie für wichtig hält. Bei den meisten wäre Ihre Stimme die erste.</p>');
      if (eigeneOhne.length) {
        teile.push('<p style="margin-top:14px">Darunter <b>' + eigeneOhne.length +
                   '</b> aus Ihrem eigenen Bogen:</p><ol class="erste">');
        eigeneOhne.slice(0, 5).forEach(function (f) {
          teile.push('<li><span class="rangzahl">Ihr Platz ' + meinRang[f.id] + '</span>' +
                     '<span class="satzchen">' + f.satz.replace(/[<>&]/g, '') + '</span></li>');
        });
        teile.push('</ol>');
      }
      teile.push('<p style="margin-top:18px"><a class="knopf" href="index.html">Weiter entscheiden</a></p></div>');
      rest.innerHTML = teile.join('');
      rest.hidden = false;
    }
  }

  function zeile(f, platzNr, meinRang, hoechst) {
    var li = document.createElement('li');
    if (meinRang[f.id]) li.dataset.meins = 'ja';

    var platz = document.createElement('span');
    platz.className = 'platz';
    platz.textContent = String(platzNr).padStart(2, '0');

    var mitte = document.createElement('div');
    var satz = document.createElement('p');
    satz.className = 'satz';
    satz.textContent = f.satz;

    var herkunft = document.createElement('p');
    herkunft.className = 'herkunft';
    var marke = document.createElement('span');
    marke.className = 'feldmarke';
    marke.textContent = f.felder[0];
    herkunft.appendChild(marke);
    var q = document.createElement('span');
    q.textContent = f.quelle.podcast + (f.quelle.episode ? ' · ' + kuerzen(f.quelle.episode, 52) : '');
    herkunft.appendChild(q);
    if (f.quelle.url) {
      var a = document.createElement('a');
      a.href = f.quelle.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Episode öffnen →';
      herkunft.appendChild(a);
    }
    if (meinRang[f.id]) {
      var eigen = document.createElement('span');
      eigen.style.color = 'var(--gelb)';
      eigen.textContent = 'Ihr Platz ' + meinRang[f.id];
      herkunft.appendChild(eigen);
    }

    mitte.appendChild(satz);
    mitte.appendChild(herkunft);

    var wert = document.createElement('div');
    wert.className = 'wert';
    var b = document.createElement('b');
    b.textContent = f.stimmen === 1 ? '1 Stimme' : f.stimmen + ' Stimmen';
    var balken = document.createElement('span');
    balken.className = 'balken';
    var i2 = document.createElement('i');
    i2.style.width = Math.max(3, Math.round((f.stimmen / hoechst) * 100)) + '%';
    balken.appendChild(i2);
    wert.appendChild(b);
    wert.appendChild(balken);

    li.appendChild(platz);
    li.appendChild(mitte);
    li.appendChild(wert);
    return li;
  }

  function filterBauen(felder) {
    filter.innerHTML = '';
    var eintraege = [{ wert: null, text: 'Alle Felder' }].concat(
      felder.map(function (f) { return { wert: f, text: f }; })
    );
    eintraege.forEach(function (e) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(e.wert === feldWahl));
      var s = document.createElement('span');
      s.textContent = e.text;
      b.appendChild(s);
      b.addEventListener('click', function () {
        feldWahl = e.wert;
        filter.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        zeichnen();
      });
      filter.appendChild(b);
    });
  }

  SZ.holen().then(function (daten) {
    setzeZahl('data-anz-saetze', daten.fakten.length);
    setzeZahl('data-anz-sterne', SZ.verbraucht());
    setzeZahl('data-anz-duelle', SZ.entscheidungen());
    document.querySelector('[data-sterne]').textContent = '★ ' + SZ.verbraucht();
    if (stand) {
      stand.textContent = daten.quelle === 'api'
        ? 'Live von der Nexus-Schnittstelle geladen.'
        : 'Auszug vom ' + (daten.stand || '–') + '. ' + (daten.auswahl || '');
    }
    filterBauen(daten.felder || []);
    zeichnen();
  }).catch(function () {
    tafel.innerHTML = '<li><p class="satz">Die Auszählung lässt sich gerade nicht laden.</p></li>';
  });
})();
