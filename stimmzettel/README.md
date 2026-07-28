# Der Stimmzettel

Gestalterische und funktionale Überarbeitung von
[demokratieamküchentisch.de](https://xn--demokratieamkchentisch-4lc.de/home)
(intern „Nexus"). Statische Seite ohne Build-Schritt, mit echten Daten aus der
bestehenden Schnittstelle.

**Die Kernänderung:** Der Nutzer verteilt seine 100 Sterne nicht mehr von Hand
über 9.691 Fakten. Er entscheidet immer nur zwischen **zwei** Sätzen. Aus diesen
Paarvergleichen entsteht per Elo-Wertung seine persönliche Rangliste — die
hundert bestbewerteten Sätze *sind* seine Sterne.

---

## Was an der bisherigen Seite nicht funktioniert

Die Analyse stützt sich auf das gerenderte Frontend, das React-Bundle und die
öffentliche FastAPI-Schnittstelle (`/openapi.json`, 39 Endpunkte).

**Die entscheidende Zahl:** Der bisher einzige veröffentlichte Cluster-Bericht
weist `voter_count: 4` und `total_vote_count: 130` aus. Vier Personen. Das Ziel
sind Millionen.

| # | Befund | Wirkung |
|---|---|---|
| 1 | Der Zweck steht nirgends. Die Seite nennt sich „faktenbasierte Wissensplattform". Dass hier ein Parteiprogramm entsteht, steht auf keiner Seite. | Ein Archiv lädt niemanden ein. Ein Auftrag schon. |
| 2 | Zwei Marken kämpfen: Domain „Demokratie am Küchentisch", Produkt „Nexus" (nach Hararis Buch). | Nach fünf Sekunden weiß niemand, wo er ist. |
| 3 | „— diese App ist noch nicht released — Du hast den Link per Zufall entdeckt". | Räumt jeden Grund zur Registrierung ab. |
| 4 | Registrierung mit E-Mail-Verifikation **vor** dem ersten Stern. | Investition vor Verständnis. |
| 5 | Der Kern-Mechanismus ist unsichtbar: kein Budgetzähler auf dem Abstimmungsscreen. | „100 Sterne" ist die ganze Idee — und eine FAQ-Fußnote. |
| 6 | 472 Fakten als flache Liste, ohne Reihenfolge oder Führung. | Bei 9.691 Fakten ist „such dir was aus" keine Aufgabe. |
| 7 | Angezeigt wird die KI-Zusammenfassung. Zitat und Hörclip liegen hinter „Tippe für Quelle". | Das einzige berührende Material ist versteckt. |
| 8 | Der Stern ist ein 20-px-Geist oben rechts. | Die Primäraktion des Produkts. |
| 9 | 5.309 maschinelle Tags: `künstlicheIntelligenz`, `ETF_Sparplan`, `GründerIn`. | Liest sich wie ein Datenbank-Dump. |
| 10 | Der Bestand passt nicht zum Versprechen. Top-Tags: Finanzbildung (671), KI (518), Startup (442), Bitcoin (217). | Ein Business-Podcast-Korpus, keine Demokratie-Plattform. |
| 11 | 18 FAQ-Einträge auf der Startseite. | Wer 18 Fragen braucht, hat das Produkt nicht erklärt. |
| 12 | Auf 1440 px läuft die App in einem 430-px-Telefonrahmen. | Sieht aus wie ein unfertiger Prototyp. |
| 13 | Kein sichtbares Ergebnis, nur ein PDF-Link. | Man sieht nie, dass die eigene Stimme wirkt. |
| 14 | Kein Grund wiederzukommen. | Kein Fortschritt, kein Anlass. |

Dazu zwei technische Punkte: `relevance_score` liegt bei allen Fakten zwischen 7
und 9 (Ø 8,0) und taugt nicht zum Sortieren. Und die Seite lädt **Fraunces und
DM Sans von Google** — beide auf der Impeccable-Liste der
Trainingsdaten-Standardschriften, dazu ein DSGVO-Problem durch das CDN.

---

## Was diese Fassung anders macht

| Bisher | Hier |
|---|---|
| Registrieren, dann abstimmen | Erste Entscheidung sofort, Konto erst nach 15 Duellen |
| 472 Fakten in einer Liste | Zwei Sätze, eine Frage, ein Kreuz |
| Sterne von Hand verteilen | Sterne entstehen aus Entscheidungen (Elo) |
| Budget unsichtbar | Zählstriche und Sternstand in jeder Kopfzeile |
| KI-Zusammenfassung vorne, Zitat versteckt | Aussage groß, Originalzitat als Beleg, Hörclip direkt daneben |
| Ergebnis als PDF-Link | Laufende Auszählung, eigene Stimmen gelb markiert |
| 18 FAQ-Einträge | Eine Warum-Seite, die den Auftrag in einem Satz nennt |
| Telefonrahmen auf dem Desktop | Volle Breite, zwei Spalten im Vergleich |
| Zweck unausgesprochen | Erster Satz der Seite: woraus ein Programm entsteht |

### Der eine wichtige Kniff

Ein Paarvergleich verlangt keine absolute Einschätzung. „Wie wichtig ist dieser
Satz von 1 bis 10?" kann niemand verlässlich beantworten. „Welcher von diesen
zweien ist Ihnen wichtiger?" schon. Aus vielen solchen Antworten lässt sich eine
Rangliste rechnen, die stabiler ist als direkt vergebene Sterne — dasselbe
Verfahren wie bei Schachranglisten.

Der Ausstieg ist ausdrücklich vorgesehen: „Beide unwichtig" wertet beide ab, ohne
einen Sieger zu erfinden; „Kenne ich beide nicht" nimmt das Paar heraus, ohne zu
werten. Eine erzwungene Entscheidung wäre ein schlechteres Signal als keine.

---

## Aufbau

```
stimmzettel/
├── index.html          Duell — Startseite und erste Entscheidung in einem
├── ergebnis.html       laufende Auszählung, in Stempelblau
├── mein-bogen.html     das eigene Programm, Streichen und Tausch
├── warum.html          Auftrag, Verfahren, Herkunft, KI-Offenlegung
├── impressum.html      Muster
├── datenschutz.html    Muster
├── vercel.json         Rewrite auf die Nexus-API, CSP, Cache-Regeln
├── daten/fakten.json   471 geprüfte Sätze aus der echten Schnittstelle
└── assets/
    ├── bogen.css       gesamtes Stylesheet, oben der Richtungsvertrag
    ├── kern.js         Datenquelle, Elo-Wertung, Paarung, Speicherung
    ├── blatt.js        Duell-Seite
    ├── tafel.js        Ergebnisseite
    ├── mein.js         Mein Bogen
    └── fonts/          Chivo, Chivo Mono, Petrona (SIL OFL 1.1)
```

Am Kopf von `bogen.css` steht der **Richtungsvertrag**: welche Idee die Seite
trägt, welche Kategorie-Vorlage sie ablehnt, woraus die Welt besteht und was im
ersten Viewport steht. Wer umbaut, sollte ihn zuerst lesen.

## Datenquelle

`kern.js` versucht zuerst `/api/tags` am eigenen Origin. Liegt die Seite hinter
dem Rewrite aus `vercel.json`, kommen die Daten **live** aus der bestehenden
Plattform. Sonst greift `daten/fakten.json` — derselbe Bestand, als Auszug.

> Ohne Rewrite meldet die Konsole beim Start einen 404 auf `/api/tags`. Das ist
> der vorgesehene Weg zum Rückfall, kein Defekt.

Die Schnittstelle sendet **keine** CORS-Header. Ein direkter Aufruf aus dem
Browser von einer fremden Domain scheitert deshalb — der Rewrite ist nicht
Bequemlichkeit, sondern Voraussetzung.

### Wie der Auszug entstanden ist

Aus 4.240 gesichteten Fakten der 21 politiknahen Themen blieben 471 übrig:

- vollständige Aussage zwischen 55 und 185 Zeichen, beginnt mit Großbuchstaben
- enthält mindestens einen politischen Begriff
- enthält keinen Begriff aus Anlageberatung, Ernährung oder Unternehmensaufbau
- keine inhaltlichen Dubletten
- ausgewogen über sieben Politikfelder, höchstens 70 je Feld

**Warum die Aussage und nicht das Zitat verglichen wird:** Viele der wörtlichen
Zitate sind Fragmente aus dem Gesprächsfluss („ab dem Zeitpunkt, wo wir dann
sesshaft wurden …"). Als Vergleichsgegenstand taugen sie nicht. Verglichen wird
deshalb die vollständige Aussage; das Zitat steht darunter als Beleg, wenn es für
sich stehen kann (bei 245 der 471 Sätze), dazu der Hörclip bei 470 von 471.

## Anbindung an die bestehende Plattform

Die Sterne bilden sich eins zu eins auf das vorhandene Stimm-Budget ab. Beim
Sichern würden genau so viele Aufrufe von `POST /api/votes/{fact_id}` erfolgen,
wie Sterne vergeben sind — höchstens 100, passend zum Lebenszeit-Budget der
Plattform. `SZ.uebertragungsplan()` liefert diese Liste. **Dieser Entwurf sendet
nichts**; Kontoanlage und Übertragung sind gezeigt, nicht ausgeführt.

## Betrieb

Rein statisch. Ordner hochladen genügt.

```bash
# lokal
python3 -m http.server 8080     # dann http://localhost:8080/stimmzettel/

# Vercel — der Rewrite in vercel.json verbindet /api mit der Nexus-Schnittstelle
vercel deploy --prod
```

## Geprüft

- Impeccable-Anti-Muster-Detektor: **ohne Befund**, auch ohne Hinweise
- 12 Seitenansichten bei 1440 und 390 px: kein Querlauf, keine JS-Fehler, keine
  fehlenden Ressourcen
- 107 interne Verweise aufgelöst
- Durchlauf über 25 Entscheidungen: Zählung, Bogen, Streichen und Ergebnis stimmen
- ein `h1` je Seite, `lang="de"`, Sprunglink, sichtbarer Fokusring, benannte
  Bedienelemente, Tastaturbedienung (`1`, `2`, `0`, Pfeiltasten)
- `prefers-reduced-motion` respektiert
- Schriften lokal, keine Cookies, kein Tracking, keine Anfragen an Dritte vor
  einem Klick

## Grenzen und Empfehlungen

1. **Der Bestand ist das eigentliche Problem.** Die häufigsten Themen der
   Plattform sind Finanzbildung, KI, Startup und Bitcoin. Für eine
   Demokratie-Plattform muss die Podcast-Auswahl kuratiert werden — sonst
   entscheidet der Zufall der Ingest-Pipeline über das Parteiprogramm.
2. **Die Extraktion hat Fehler.** Im Bestand finden sich Tippfehler wie
   „Die richsten 5 %". Vor der Veröffentlichung braucht es eine redaktionelle
   Durchsicht.
3. **Der Filter hier ist eine Notlösung.** Eine Wortliste ersetzt keine
   Redaktion. Sie ist offengelegt und angreifbar — das gehört so.
4. **Konto und Übertragung fehlen.** Beides existiert im Backend bereits
   (`/api/auth/register`, `/api/votes/{id}`) und muss angeschlossen werden.
5. **Rechtstexte sind Muster.** Die echten Betreiberdaten wurden bewusst nicht
   übernommen. Besonders zu prüfen: Abstimmungen über politische Aussagen können
   Daten nach Art. 9 DSGVO erzeugen.
