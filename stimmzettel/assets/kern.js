/* ═══════════════════════════════════════════════════════════════════════════
   Kern: Datenquelle, Zustand, Wertung, Paarung.
   Kein Framework, keine externen Anfragen zur Laufzeit.

   Der Nutzer verteilt seine 100 Sterne nicht von Hand – er erzeugt sie durch
   Entscheidungen. Jedes Duell ist ein Paarvergleich, aus dem eine Elo-Wertung
   entsteht; die 100 bestbewerteten Fakten sind seine Sterne. Das ist gegenüber
   direktem Sternevergeben stabiler, weil eine Entscheidung zwischen zwei
   konkreten Sätzen leichter fällt als eine absolute Bewertung.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var SCHLUESSEL = 'stimmzettel.v1';
  var STERNE_GESAMT = 100;
  var START_WERTUNG = 1500;
  var K = 32;

  /* ── Zustand ──────────────────────────────────────────────────────────── */

  function leererZustand() {
    return {
      wertung: {},        // faktId -> Elo
      begegnungen: {},    // faktId -> Anzahl gezeigter Duelle
      paare: {},          // "a|b" -> true, damit sich Paarungen nicht wiederholen
      entscheidungen: 0,  // gezählte Duelle mit Ergebnis
      uebersprungen: {},  // faktId -> true, "kenne ich nicht"
      gesichert: false,   // Konto angelegt (in dieser Demo nur lokal vermerkt)
      begonnen: null,
    };
  }

  var zustand = leererZustand();

  function laden() {
    try {
      var roh = global.localStorage.getItem(SCHLUESSEL);
      if (!roh) return;
      var z = JSON.parse(roh);
      if (z && typeof z === 'object') {
        Object.keys(leererZustand()).forEach(function (k) {
          if (z[k] !== undefined) zustand[k] = z[k];
        });
      }
    } catch (e) { /* privater Modus oder beschädigt: mit leerem Zustand weiter */ }
  }

  function sichern() {
    try { global.localStorage.setItem(SCHLUESSEL, JSON.stringify(zustand)); }
    catch (e) { /* Speicher nicht verfügbar – die Sitzung funktioniert trotzdem */ }
  }

  function zuruecksetzen() {
    zustand = leererZustand();
    try { global.localStorage.removeItem(SCHLUESSEL); } catch (e) {}
  }

  /* ── Datenquelle ──────────────────────────────────────────────────────
     Erst die echte Schnittstelle am selben Origin versuchen (funktioniert,
     wenn die Seite hinter einem Rewrite auf die Nexus-API liegt), sonst den
     mitgelieferten Datensatz nehmen. Beides sind dieselben echten Daten. */

  var daten = null;

  function ausApi() {
    return fetch('/api/tags', { headers: { accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) {
        var tags = (j.tags || []).slice(0, 12);
        return Promise.all(tags.map(function (t) {
          return fetch('/api/facts?tag_id=' + t.id + '&limit=40')
            .then(function (r) { return r.ok ? r.json() : { facts: [] }; })
            .then(function (d) {
              return (d.facts || [])
                .filter(function (f) {
                  var a = (f.fact_content || '').trim();
                  return a.length >= 55 && a.length <= 185 && /^[A-ZÄÖÜ]/.test(a);
                })
                .map(function (f) {
                  return {
                    id: f.id,
                    satz: (f.fact_content || '').trim(),
                    zitat: f.verbatim_quote.trim(),
                    audio: (f.audio_clip_url || '').replace('demokratieamküchentisch.de', 'xn--demokratieamkchentisch-4lc.de'),
                    stimmen: f.vote_count || 0,
                    felder: [t.raw_tag],
                    quelle: {
                      podcast: (f.episode && f.episode.podcast_title) || '',
                      episode: (f.episode && f.episode.title) || '',
                      url: (f.episode && f.episode.episode_url) || '',
                    },
                  };
                });
            });
        })).then(function (listen) {
          var alle = [];
          var gesehen = {};
          listen.forEach(function (l) {
            l.forEach(function (f) { if (!gesehen[f.id]) { gesehen[f.id] = 1; alle.push(f); } });
          });
          if (alle.length < 60) throw new Error('zu wenige Fakten');
          return { stand: 'live', quelle: 'api', felder: [], fakten: alle };
        });
      });
  }

  function ausDatei() {
    return fetch('daten/fakten.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { j.quelle = 'datei'; return j; });
  }

  function holen() {
    if (daten) return Promise.resolve(daten);
    /* Im statischen Portfolio ist der lokale Auszug die primäre Quelle. So
       entsteht auf GitHub Pages kein absichtlich provozierter API-404. Eine
       separat betriebene Fassung außerhalb von /stimmzettel/ kann weiterhin
       die gleich-originige API verwenden und fällt bei Bedarf lokal zurück. */
    var statischesPortfolio = global.location &&
      /\/stimmzettel(?:\/|$)/.test(global.location.pathname);
    var quelle = statischesPortfolio
      ? ausDatei()
      : ausApi().catch(function () { return ausDatei(); });

    return quelle
      .then(function (j) {
        daten = j;
        daten.nach = {};
        daten.fakten.forEach(function (f) { daten.nach[f.id] = f; });
        if (!daten.felder || !daten.felder.length) {
          daten.felder = Object.keys(daten.fakten.reduce(function (a, f) { a[f.felder[0]] = 1; return a; }, {})).sort();
        }
        return daten;
      });
  }

  /* ── Wertung ──────────────────────────────────────────────────────────── */

  function wertungVon(id) {
    return zustand.wertung[id] === undefined ? START_WERTUNG : zustand.wertung[id];
  }

  function erwartung(a, b) {
    return 1 / (1 + Math.pow(10, (b - a) / 400));
  }

  /* Ergebnis: 1 = a gewinnt, 0 = b gewinnt, 0.5 = unentschieden */
  function verrechnen(idA, idB, ergebnisA) {
    var a = wertungVon(idA), b = wertungVon(idB);
    var eA = erwartung(a, b);
    zustand.wertung[idA] = Math.round(a + K * (ergebnisA - eA));
    zustand.wertung[idB] = Math.round(b + K * ((1 - ergebnisA) - (1 - eA)));
  }

  function entscheiden(idA, idB, sieger) {
    zustand.begegnungen[idA] = (zustand.begegnungen[idA] || 0) + 1;
    zustand.begegnungen[idB] = (zustand.begegnungen[idB] || 0) + 1;
    zustand.paare[paarSchluessel(idA, idB)] = 1;
    if (!zustand.begonnen) zustand.begonnen = Date.now();

    if (sieger === idA) verrechnen(idA, idB, 1);
    else if (sieger === idB) verrechnen(idA, idB, 0);
    else {
      /* „Beide unwichtig": beide verlieren gegen das Feld, keiner gegen den
         anderen. So sinken schwache Sätze, ohne dass ein Zufallssieger
         entsteht. */
      zustand.wertung[idA] = Math.round(wertungVon(idA) - K / 2);
      zustand.wertung[idB] = Math.round(wertungVon(idB) - K / 2);
    }

    zustand.entscheidungen += 1;
    sichern();
    return rangVon(sieger);
  }

  function ueberspringen(idA, idB) {
    zustand.uebersprungen[idA] = 1;
    zustand.uebersprungen[idB] = 1;
    zustand.paare[paarSchluessel(idA, idB)] = 1;
    sichern();
  }

  function paarSchluessel(a, b) { return a < b ? a + '|' + b : b + '|' + a; }

  /* ── Die eigenen 100 Sterne ───────────────────────────────────────────
     Sterne sind kein separater Vorgang: Es sind die 100 bestbewerteten
     Fakten aus den eigenen Duellen. Ein Fakt zählt erst, wenn er mindestens
     einmal angetreten ist und über dem Startwert liegt. */

  function sterne() {
    var ids = Object.keys(zustand.wertung).filter(function (id) {
      return zustand.wertung[id] > START_WERTUNG && !zustand.uebersprungen[id];
    });
    ids.sort(function (a, b) { return zustand.wertung[b] - zustand.wertung[a]; });
    return ids.slice(0, STERNE_GESAMT);
  }

  function hatStern(id) { return sterne().indexOf(id) !== -1; }

  function rangVon(id) {
    var s = sterne();
    var i = s.indexOf(id);
    return i === -1 ? null : i + 1;
  }

  function verbraucht() { return sterne().length; }
  function uebrig() { return STERNE_GESAMT - verbraucht(); }

  /* ── Paarung ──────────────────────────────────────────────────────────
     Zwei Ziele: möglichst aussagekräftige Vergleiche (ähnlich bewertete
     Sätze) und Abwechslung zwischen den Politikfeldern, damit nicht zehnmal
     hintereinander Klima kommt. */

  function naechstesPaar(letztesFeld) {
    var alle = daten.fakten.filter(function (f) { return !zustand.uebersprungen[f.id]; });
    if (alle.length < 2) return null;

    function seltenheit(f) { return (zustand.begegnungen[f.id] || 0); }

    // A: aus den am seltensten gezeigten Sätzen, bevorzugt aus einem anderen Feld
    var sortiert = alle.slice().sort(function (x, y) { return seltenheit(x) - seltenheit(y); });
    var vorrat = sortiert.slice(0, Math.max(30, Math.ceil(sortiert.length * 0.25)));
    var anderesFeld = vorrat.filter(function (f) { return f.felder[0] !== letztesFeld; });
    var topf = anderesFeld.length >= 4 ? anderesFeld : vorrat;
    var a = topf[Math.floor(Math.random() * topf.length)];

    // B: ähnlich bewertet, noch nicht gegen A angetreten, möglichst gleiches Feld
    var wA = wertungVon(a.id);
    var kandidaten = alle.filter(function (f) {
      return f.id !== a.id && !zustand.paare[paarSchluessel(a.id, f.id)];
    });
    if (!kandidaten.length) return null;

    kandidaten.sort(function (x, y) {
      var dx = Math.abs(wertungVon(x.id) - wA) + seltenheit(x) * 12;
      var dy = Math.abs(wertungVon(y.id) - wA) + seltenheit(y) * 12;
      return dx - dy;
    });
    var eng = kandidaten.slice(0, 12);
    var b = eng[Math.floor(Math.random() * eng.length)];

    return [a, b];
  }

  /* ── Übertragung an die Plattform ─────────────────────────────────────
     Diese Demo sendet nichts. Im Echtbetrieb würden die eigenen Sterne über
     POST /api/votes/{fact_id} übertragen – genau 100 Aufrufe, passend zum
     Lebenszeit-Budget der bestehenden Plattform. */

  function uebertragungsplan() {
    return sterne().map(function (id, i) {
      return { platz: i + 1, fact_id: id, methode: 'POST', pfad: '/api/votes/' + id };
    });
  }

  laden();

  global.SZ = {
    STERNE_GESAMT: STERNE_GESAMT,
    holen: holen,
    daten: function () { return daten; },
    zustand: function () { return zustand; },
    entscheiden: entscheiden,
    ueberspringen: ueberspringen,
    naechstesPaar: naechstesPaar,
    sterne: sterne,
    hatStern: hatStern,
    rangVon: rangVon,
    wertungVon: wertungVon,
    verbraucht: verbraucht,
    uebrig: uebrig,
    entscheidungen: function () { return zustand.entscheidungen; },
    gesichert: function (v) { if (v !== undefined) { zustand.gesichert = v; sichern(); } return zustand.gesichert; },
    zuruecksetzen: zuruecksetzen,
    uebertragungsplan: uebertragungsplan,
    sternEntfernen: function (id) {
      zustand.wertung[id] = START_WERTUNG - 1;
      sichern();
    },
  };
})(window);
