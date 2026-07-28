# Briefing — eine außergewöhnliche Website für Sammlung C

Auftrag an ein Modell mit einem einzigen Ziel: **nicht die nächste Website,
sondern die beste des Portfolios.** Eine Site, keine Serie. Sie darf länger
dauern und mehr können als alles, was bisher hier steht.

Dieses Briefing ist eine Empfehlung, keine Fessel. Prüfe die Quellen selbst
nach und ändere die Auswahl, wenn du Besseres findest — dokumentiere die
Änderung dann in `mika-ux/README.md` und auf der Hub-Karte.

---

## 1. Was im Portfolio fehlt

Sechzehn Websites, davon sechs in Sammlung C. Die Bestandsaufnahme:

| Dimension | Stand |
|---|---|
| Dunkel / monumental | belegt (Vehring, Nereus, Schwarzwerk) |
| Hell / systematisch | belegt (Saatgutarchiv) |
| Hell / verspielt | belegt (Sprudelwerk) |
| Hell / leise | belegt (Uferwiese) |
| Scroll-Narrativ mit Kapiteln | belegt (Nereus) |
| **Canvas oder WebGL** | **in allen 16 Websites: nicht ein einziges Mal** |
| **Kinetische Typografie** | **nirgends** |
| **Generative, gerechnete Grafik** | **nirgends** |
| **Hell + technisch ambitioniert** | **nirgends** |

Die drei letzten Zeilen sind die Lücke. Alles bisherige ist CSS plus etwas
Vanilla-JS — sauber, aber nie technisch überraschend.

## 2. Empfohlene Vorlage: `MXL-022`

**Martin Laxenaire — „Kinetic print poster“**, Distinctiveness 100/100,
Quelle `martin-laxenaire.fr`, Analysequelle `styles.refero.design`.

> „419px Monument Extended kollidiert mit flüssigen Farbwellen und winziger
> Schweizer Utility-Typografie.“

Warum diese und keine andere:

- **Sie verlangt genau das, was fehlt.** „Flüssige Farbwellen“ hinter
  monumentaler Type ist eine gerechnete Fläche — Canvas oder WebGL, nicht
  CSS. Das ist die erste Website des Portfolios, die etwas rechnet.
- **Sie steht maximal quer zum Bestand.** Warmes Papier `#F7F5EF`, blasses
  Rosa `#f9d9f7` als Signal — beides ist in Sammlung C unbelegt, und der
  Kontrast zu den drei dunklen Nachbarn ist der größte, den die Library
  hergibt.
- **Sie ist typografisch, nicht dekorativ.** Die Vorlage sagt ausdrücklich:
  typografische Komposition zuerst, Bilder und UI danach. Das schützt vor
  einer hübschen Fläche ohne Inhalt.
- **Sie ist selten richtig umgesetzt.** Kinetische Typografie ist auf
  Awwwards und Dribbble allgegenwärtig — und geht fast nie in Produktion.
  Eine Version, die tatsächlich zugänglich, tastaturbedienbar und unter
  `prefers-reduced-motion` sinnvoll ist, ist der eigentliche Unterschied.

### Tokens aus MXL-022

| Token | Wert | Rolle |
|---|---:|---|
| Canvas | `#F7F5EF` | warmer Seitenhintergrund |
| Surface | `#FFFFFF` | Karten, Panels |
| Ink | `#11130F` | Text, Linien |
| Muted | `#72776D` | Sekundärtext |
| Signal | `#f9d9f7` | rationierter Akzent |

Display: Monument Extended oder eine metrisch ähnliche Alternative,
`clamp(52px, 9vw, 132px)`, Zeilenhöhe 0.90–1.00. Body 15–18px. Mono für
Marginalien, Kicker, Jahrgänge. Höchstens zwei Hauptfamilien plus eine Mono.
Raster: 12 Spalten mit bewussten Überlagerungen und Randnotizen, Container
1200–1320px mit kontrollierten Full-bleed-Ausbrüchen, Abschnittsrhythmus
80–120px. Radius 8–16px, 999px für kompakte Aktionen. Bildwechsel 350–600ms,
Textinteraktionen 160–220ms.

## 3. Der Interaktionsvertrag: `MXL-040`

`MXL-022` beschreibt eine Welt, aber keine Choreografie. Die kommt aus
`MXL-040` („The Monolith Project“, Interactive sci-fi artifact, 100/100) und
ist der härteste Teil des Auftrags:

- Canvas bleibt **Hintergrund oder Beweis**, nie die einzige Navigation.
- **Ladezustand, Fallback-Poster und Skip-Aktion** sind Pflicht.
- Fortschritt oder Position ist **dauerhaft erkennbar**, mit einem stillen,
  textbasierten Pfad für Tastatur und Screenreader.
- Ton, falls vorhanden: standardmäßig stumm oder ausdrückliches Opt-in,
  Zustand als **Text plus Symbol**, nie nur als Farbe.
- **Kein Scroll-Jacking** ohne Tastatur-, Touch- und Reduced-Motion-Pfad.
- Eine primäre Bewegungslogik pro Szene. Interaktionen müssen bei 30 fps und
  langsamer Verbindung verständlich bleiben.
- `prefers-reduced-motion` ersetzt 3D, Parallax und Autoplay durch harte,
  verständliche Zustandswechsel — nicht durch Stillstand ohne Ersatz.

### Wichtiger Nachtrag zu dieser Quelle

`MXL-040` und `MXL-147` beschreiben **dieselbe** Website. `MXL-147` wurde per
CSS-/DOM-Forensik erhoben und vermerkt „0 Canvas“ — der React-Three-Fiber-
Canvas wird erst zur Laufzeit eingehängt und war unsichtbar. Die tatsächliche
Quelle ist eine kinematische WebGL-Reise (Three.js, R3F, GSAP), die von
handgezeichneten 2D-Skizzen in beleuchtete 3D-Szenen übergeht, mit
Shader-Übergängen, GPU-Partikeln, Masken-Reveals und Ton. Awwwards Site of the
Day am 26.11.2025, Teilnote Animation und Übergänge 9,00/10.

**Konsequenz für dich:** Nimm aus `MXL-040` die Ambition und den
Zugänglichkeitsvertrag, nicht die Ästhetik — die kommt aus `MXL-022`. Und
nimm dir die Freiheit, die `MXL-147` fehlt.

## 4. Optionale dritte Vorlage

Wenn du eine dritte Stimme brauchst, ist `MXL-038` („The Symphony of Vines“,
100/100, Signal `#c6a66b`) der beste Kandidat: kapitelbasierte Reise mit
starkem narrativem Timing. **Vorsicht:** `mika-ux/nereus-tiefsee/` ist bereits
ein dunkles Kapitel-Scroll-Narrativ. Nimm von `MXL-038` die Dramaturgie, nicht
die Dunkelheit — sonst entsteht eine zweite Nereus.

## 5. Vor dem ersten Code: `impeccable`

Dieses Repository enthält unter `.github/skills/impeccable/` die vollständige
Skill **impeccable v4.0.2** — Playbooks, Craft-Floor, Detektor und
Live-Browser-Iteration. Sie ist für genau diesen Auftrag gebaut.

Verbindliche Reihenfolge:

1. `node .github/skills/impeccable/scripts/context.mjs` einmal ausführen. Sie
   lädt `PRODUCT.md`, `DESIGN.md` und den passenden Surface-Brief.
2. `reference/new-work.md` laden — es geht um eine neue visuelle Welt.
3. Erst unmittelbar vor dem Schreiben von UI-Code `reference/craft-floor.md`
   laden. Dort stehen die Qualitätsuntergrenze und die absoluten Verbote.
4. Modus: **Experience**. Die Besucherin ist im Werk selbst; das Artefakt
   führt ab dem ersten Viewport, das Interface tritt zurück.
5. Der Detektor unter `scripts/detector/` und die Live-Browser-Skripte unter
   `scripts/live/` sind zum Iterieren da. Nutze sie, statt zu raten.

`DESIGN.md` im Wurzelverzeichnis gilt **nur** für die Portfolio-Startseite.
Jede Website unter `mika-ux/` ist eine bewusst eigenständige Welt und erbt
davon nichts.

## 6. Eigene Nachrecherche — ausdrücklich erwünscht

Prüfe die Auswahl nach, bevor du baust. Sinnvolle Quellen:

- **`styles.refero.design`** — Analysequelle vieler MXL-Einträge, u. a. der
  hier empfohlenen `MXL-022`. Dort steht die Tokenisierung im Original.
- **`martin-laxenaire.fr`** — die Primärquelle von `MXL-022`. Sieh sie dir an,
  bevor du ihre Beschreibung glaubst. Genau dieser Schritt fehlte bei
  `MXL-147`, und das Ergebnis war eine korrekte Umsetzung der falschen Sache.
- **`themonolithproject.net`** — die Primärquelle von `MXL-040`/`MXL-147`, für
  das Ambitionsniveau.
- **awwwards.com**, **cssdesignawards.com**, **dribbble.com** — für den
  aktuellen Stand. Achtung: Dribbble zeigt Standbilder, keine Produktion;
  was dort funktioniert, funktioniert im Browser oft nicht.
- Die vollständige Mika UX Library liegt **nicht** im Repository. Die für
  diesen Auftrag relevanten Auszüge stehen oben; weitere Einträge kann Mika
  auf Zuruf liefern.

Wenn deine Recherche eine bessere Kombination ergibt: nimm sie und begründe
sie. Ein anderer Weg zu einem besseren Ergebnis ist kein Verstoß gegen dieses
Briefing, sondern sein Zweck.

## 7. Technische Leitplanken — nicht verhandelbar

Diese gelten für jede Website unter `mika-ux/` und sind der Grund, warum das
Portfolio ohne Build und ohne Fremdanfragen läuft.

- **Statisch.** HTML, CSS, JavaScript. Kein Build, kein Framework, kein
  Bundler. Die Website muss aus dem Verzeichnis heraus funktionieren.
- **Keine Laufzeitanfrage an Dritte.** Kein CDN, keine externen Schriften,
  keine Tracker, keine eingebetteten Fremddienste. Wenn du eine Bibliothek
  brauchst — etwa Three.js —, lege sie mit Lizenzhinweis lokal ab und lade
  sie relativ. Prüfe vorher, ob rohes WebGL oder ein 2D-Canvas reicht: eine
  gerechnete Fläche ohne Abhängigkeit ist die bessere Antwort.
- **Schriften lokal.** `node scripts/fetch-fonts.mjs <zielordner> "<family spec>"`
  lädt woff2 von Google Fonts und schreibt eine `fonts.css` mit relativen
  Pfaden. Nicht gebrauchte Subsets löschen.
- **Eigenes Stylesheet, eigenes Skript, eigene Assets** je Website. Nichts
  aus einer anderen Website importieren.
- **Zugänglichkeit:** ein `main`-Landmark, semantische `nav`, Skip-Link,
  sichtbare Fokuszustände, logische Überschriftenfolge, Touch-Ziele ab 44 px,
  WCAG AA für Text und Zustände, `prefers-reduced-motion` respektiert.
  Hover darf nie die einzige Informationsquelle sein.
- **Desktop und Mobil.** Eine abgespeckte Mobilfassung ist erlaubt, wenn
  Desktop dafür wirklich beeindruckt — aber die gestalterische Idee muss den
  Breakpoint überleben. Bloßes Verkleinern zählt nicht.
- **Fiktive Inhalte** mit sichtbarer Demo-Kennzeichnung im Fuß, dazu
  `impressum.html` und `datenschutz.html` als Muster ohne Rechtswirkung. Die
  bestehenden Websites unter `mika-ux/` sind die Vorlage für Tonfall und
  Umfang; `LEGAL_TEMPLATE.md` nennt die Pflichtangaben.
- **Sprache:** durchgehend Deutsch, `lang="de"`.
- **Seitenzahl:** frei. Fünf Seiten sind der Bestand, weniger ist erlaubt,
  wenn das Konzept dadurch stärker wird.

## 8. Einbindung in die Startseite

Die neue Website bekommt eine Karte in `index.html`, in der Sektion
`collection--mika`, nach der letzten bestehenden Karte und **innerhalb** des
schließenden `</section>`. Struktur exakt wie bei den bestehenden Karten,
einschließlich:

```html
<p class="work__source">
  <span class="work__source-kind">Eine Vorlage</span>
  <span class="work__source-ids">MXL-022</span>
</p>
```

`Eine Vorlage` bei genau einer MXL-Nummer, `Drei Vorlagen` (o. ä.) bei
mehreren — der Validator prüft, dass Auszeichnung und Anzahl zusammenpassen.
Dazu ein CSS-Specimen in `portfolio-assets/portfolio.css`, das die Welt der
Website andeutet; die bestehenden `.spec-*`-Blöcke sind das Muster.

Ledger im Kopf (`<b>06</b> Mika UX`) und die Zählung im Sammlungskopf
(`Sammlung C / 11–16`, `Sechs <i>Ableitungen</i>`) hochzählen.

**Die Startseite darf sonst nicht verändert werden.** Der Aufmacher mit der
großen `10` und der Zeile „Zehn Websites. Kein Template.“ bleibt unangetastet —
er wird an anderer Stelle überarbeitet.

## 9. Prüfung vor dem Abschluss

Beides muss grün sein:

```bash
# 1. Struktur, Verweise, Herkunftsangabe
#    (die drei Framework-Projekte als Platzhalter anlegen oder pages-dist bauen)
node scripts/validate-static-showcase.mjs <dist-verzeichnis>

# 2. Browserprüfung je Seite auf 1440px und 390px
python3 -m http.server 8099 --bind 127.0.0.1 &
node scripts/pruefe-seiten.mjs http://127.0.0.1:8099/mika-ux/<slug>/ \
  index.html <weitere> impressum.html datenschutz.html
```

Zusätzlich mit eigenen Augen prüfen: Screenshots auf beiden Viewports, mit und
ohne `prefers-reduced-motion`, Tastaturweg von oben nach unten, und — falls
Canvas im Spiel ist — das Verhalten bei gedrosselter CPU.

## 10. Dokumentation und Übergabe

- `mika-ux/README.md`: Zeile in der Bestandstabelle, dazu ein Abschnitt, der
  benennt, **welche Vorlage was beigetragen hat** und warum diese Kombination.
  Die bestehenden Abschnitte sind das Muster.
- `README.md` im Wurzelverzeichnis: beide Tabellen ergänzen.
- Im Fuß der Website die verwendeten MXL-Nummern nennen, wie bei den anderen.
- Wenn du externe Quellen genutzt hast, die über die Library hinausgehen:
  in `mika-ux/README.md` mit Adresse nennen. Nachvollziehbarkeit der Herkunft
  ist die Grundregel dieser Sammlung — sie gilt auch für dich.

Arbeite auf dem Branch `claude/portfolio-ux-library-pkj4xy`. Committe in
nachvollziehbaren Schritten und pushe, wenn die Website fertig und geprüft
ist — nicht alles am Ende in einem Wurf.

## 11. Der eigentliche Maßstab

Die sechzehn bestehenden Websites sind handwerklich sauber und inhaltlich
ehrlich. Keine von ihnen ist atemberaubend. Genau dort liegt die Latte: Was du
baust, soll nicht dazwischenpassen, sondern die Sammlung anführen — und dabei
jede einzelne Leitplanke aus Abschnitt 7 halten.

Beeindruckend heißt hier nicht laut. Es heißt: jemand sieht die erste
Bildschirmseite und will wissen, wie das gemacht ist.
