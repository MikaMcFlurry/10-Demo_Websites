# Briefing — zweite außergewöhnliche Website für Sammlung C

Auftrag an ein Modell mit einem einzigen Ziel: **nicht die nächste Website,
sondern eine der besten des Portfolios.** Eine Site, keine Serie. Sie darf
länger dauern und mehr können als alles, was bisher dort steht.

Dieses Briefing empfiehlt drei Vorlagen und **verlangt ausdrücklich, dass du
die Auswahl selbst nachprüfst** — siehe Abschnitt 3. Die Empfehlung ist eine
begründete Vorsortierung, kein Urteil.

Es liegt auf deinem Branch unter `mika-ux/BRIEFING-FABLE-2.md`. Wenn du es
gerade liest, bist du am richtigen Ort.

---

## 0. Zuerst: Lage und Abgrenzung

Repository: `MikaMcFlurry/10-Demo_Websites`.
**Dein Branch: `claude/portfolio-fable-zwei`** — er ist bereits angelegt und
gepusht. Wechsle darauf, bevor du irgendetwas änderst:

```bash
git fetch origin claude/portfolio-fable-zwei
git checkout claude/portfolio-fable-zwei
```

**Es läuft parallel eine zweite Sitzung** auf dem Branch
`claude/portfolio-ux-library-pkj4xy`. Sie baut eine eigene Website und fasst
dabei diese vier gemeinsamen Dateien an:

- `index.html`
- `portfolio-assets/portfolio.css`
- `mika-ux/README.md`
- `README.md`

**Du fasst diese vier Dateien nicht an.** Keine Karte auf der Startseite, kein
Specimen, keine Tabellenzeile. Die Einbindung beider Websites in die
Startseite macht die koordinierende Sitzung hinterher in einem Zug — so gibt
es einen trivialen Konflikt statt vieler. Alles, was du brauchst, um die
Einbindung vorzubereiten, legst du stattdessen in deiner eigenen
`mika-ux/<dein-slug>/EINBINDUNG.md` ab (Abschnitt 8).

Dein Arbeitsbereich ist **ausschließlich** `mika-ux/<dein-slug>/` — ein neues
Verzeichnis, das es noch nicht gibt.

Auf deinem Branch läuft **keine CI**; der Pages-Workflow ist auf andere
Branches beschränkt. Die lokalen Prüfungen aus Abschnitt 9 sind damit das
einzige Gate. Nimm sie ernst.

## 1. Was das Portfolio hat und was ihm fehlt

Sechzehn Websites, davon sechs in „Sammlung C — Ableitungen aus der Mika UX
Library". Lies `mika-ux/README.md`, dort steht zu jeder, welche Vorlage was
beigetragen hat. Kurzfassung:

| Website | Welt |
|---|---|
| `sprudelwerk` | hell, verspielt, aufgeblasene Sticker |
| `vehring-orgelbau` | dunkel, monumental, Zinnprospekt |
| `saatgutarchiv` | hell, systematisch, Datenkatalog |
| `geburtshaus-uferwiese` | hell, leise, Pastellhimmel |
| `nereus-tiefsee` | dunkel, Scroll-Narrativ mit Kapiteln |
| `schwarzwerk-presswerk` | reines Schwarz, ein Rot, schmale Spalte |

Was in **allen sechzehn** fehlt:

- **Canvas oder WebGL** — kein einziges Mal. Alles ist CSS plus etwas
  Vanilla-JS. Sauber, aber nie technisch überraschend.
- **Generative, gerechnete Grafik.**
- **Ein harter Weltenwechsel** innerhalb einer Website.
- **Materialität** — Chrom, Glas, Reflexion, Tiefe durch Transluzenz.

Die parallele Sitzung besetzt voraussichtlich „hell, warmes Papier, kinetische
Typografie über einer gerechneten Farbwellenfläche" (`MXL-022`). **Geh dem aus
dem Weg.** Prüfe vor dem Festlegen, was dort tatsächlich entstanden ist:

```bash
git fetch origin claude/portfolio-ux-library-pkj4xy
git log --oneline origin/claude/portfolio-ux-library-pkj4xy -8
git show origin/claude/portfolio-ux-library-pkj4xy:mika-ux/README.md | head -60
```

Wenn dort dieselbe Vorlage liegt, die du nehmen willst: nimm eine andere.

## 2. Drei Kandidaten

Alle drei haben Distinctiveness 100/100 und sind bisher unbenutzt. Ich habe
sie vorsortiert; die Reihenfolge ist meine Einschätzung, nicht deine Vorgabe.

### Erstens — `MXL-045` „Hyper Tria — Chrome monolith gallery"

*Experimental & Motion · theme mixed · spacious · Quelle
`styles.refero.design/style/6665a3dd-606f-4fd1-80dd-a84e3b3a6226`*

> „Massive Chrome-3D-Typografie eröffnet einen harten Wechsel in eine weiße,
> messerscharfe Projektgalerie."

Warum sie oben steht:

- **Sie ist zwei Welten in einer Website.** Chrom-Dunkel öffnet, dann ein
  harter Schnitt in eine weiße, präzise Galerie. Diese Struktur — ein
  bewusster Bruch statt eines Übergangs — hat keine der sechzehn Websites.
- **Chrom ist eine gerechnete Fläche**, aber eine völlig andere als flüssige
  Farbwellen: Reflexion und Environment-Mapping statt Strömung. Selbst wenn
  die parallele Sitzung Canvas einsetzt, kollidiert das optisch nicht.
- **`theme: mixed`** ist in Sammlung C unbelegt — alles dort ist entweder
  durchgehend hell oder durchgehend dunkel.
- Signal `#ff342e`. Achtung: `schwarzwerk-presswerk` nutzt `#FF002F`. Die
  Zahlen liegen nah beieinander, die Welten nicht — schmale schwarze Spalte
  mit runder Display-Schrift gegen Full-bleed-Chrom und weiße Galerie. Halte
  den Abstand über Struktur und Typografie, nicht über den Farbwert.
- Display: Aeonik oder eine metrisch ähnliche Alternative. Container:
  Full-bleed-Szenen, statische Inhalte in einem 1200–1320px-Sicherheitsraster.
  Abschnittsrhythmus 96–160px. Radius 8–16px, 999px für kompakte Aktionen.
- Die Vorlage bringt denselben Komponentenvertrag mit wie `MXL-040`:
  *Interactive scene*, *Progress cue*, *Sound control* — siehe Abschnitt 4.

### Zweitens — `MXL-059` „Osmo — Developer museum"

*Playful & Chromatic · theme light · comfortable · Quelle `osmo.supply`*

> „Concrete-Gray, 150px-Type, radioactive Lime und aufgefächerte Projektkarten
> vermeiden den üblichen SaaS-Look."

Canvas `#F7F5EF`, Surface `#FFFFFF`, Ink `#11130F`, Muted `#72776D`, Signal
`#a1ff62`. Display: Haffer XH oder metrisch ähnlich.

Stärke: die **aufgefächerten Karten** sind eine räumliche Idee, die sich als
echte Interaktion bauen lässt, und „Museum statt SaaS" ist ein klarer,
tragfähiger Gegenentwurf. Schwäche: hell und warmes Papier ist genau das
Feld, in dem die parallele Sitzung arbeitet — und drei der sechs bestehenden
Websites stehen ebenfalls dort. Nimm sie nur, wenn du die Auffächerung zu
etwas machst, das ohne sie nicht funktioniert.

### Drittens — `MXL-092` „AuthKit — Frosted glass cathedral"

*Product UI & Interfaces · theme dark · comfortable · Quelle `authkit.com`*

> „Lichtdurchflutete Glassurfaces, Blueprint-Hairlines und genau ein
> Violet-CTA bilden eine auth-zentrierte Bühne."

Stärke: **Tiefe durch Transluzenz** ist material, nicht dekorativ, und fehlt
dem Portfolio vollständig. Schwäche: dunkel — davon gibt es bereits drei, und
`nereus-tiefsee` nutzt bereits ein Violett (`#8d73ff`) als Signal. Der Abstand
müsste vollständig über das Material entstehen.

## 3. Deine eigene Prüfung — der eigentliche Auftrag dieses Abschnitts

Bevor du dich festlegst, sieh dir die **Primärquellen** an, nicht nur ihre
Beschreibungen:

- `styles.refero.design` — die Analysequelle vieler Einträge. Dort steht die
  Tokenisierung im Original.
- Die jeweilige Quell-Website selbst (`osmo.supply`, `authkit.com`, bei
  `MXL-045` die auf Refero verlinkte Quelle).
- `awwwards.com` und `cssdesignawards.com` für den aktuellen Stand.
- `dribbble.com` — mit Vorbehalt: dort stehen Standbilder, keine Produktion.
  Was auf Dribbble funktioniert, funktioniert im Browser oft nicht.

**Warum das nicht optional ist.** In diesem Repository steht ein Eintrag,
`MXL-147`, der per CSS-/DOM-Forensik aus `themonolithproject.net` erhoben
wurde und im Provenance-Block „0 Canvas" vermerkt. Die Quelle ist
tatsächlich eine kinematische WebGL-Reise mit Three.js, React Three Fiber und
GSAP — Awwwards Site of the Day, Teilnote Animation 9,00/10. Der Canvas wird
erst zur Laufzeit eingehängt und war für die Forensik unsichtbar. Die daraus
gebaute Website (`schwarzwerk-presswerk`) setzt die dokumentierten Tokens
korrekt um und verfehlt trotzdem, was die Quelle ausmacht. Der ganze Vorgang
steht in `mika-ux/README.md` unter dem Nachtrag zu `MXL-147`. **Lies ihn.**

Das Ergebnis deiner Prüfung gehört in `mika-ux/README.md` — aber weil du diese
Datei nicht anfassen darfst (Abschnitt 0), schreibst du es in deine
`EINBINDUNG.md` (Abschnitt 8), damit es von dort übernommen werden kann.

Mischen ist erlaubt. Bei mehreren Vorlagen müssen später **alle** MXL-Nummern
auf der Startseiten-Karte stehen; nenne sie in der Reihenfolge ihres Gewichts.

## 4. Interaktionsvertrag

Wenn deine Website eine Szene, einen Canvas oder eine Choreografie hat, gilt
der Vertrag aus `MXL-040`, den `MXL-045` in denselben Worten mitbringt:

- Canvas oder Video bleibt **Hintergrund oder Beweis**, nie die einzige
  Navigation.
- **Ladezustand, Fallback-Poster und Skip-Aktion** sind Pflicht.
- Fortschritt oder Position **dauerhaft erkennbar**, mit einem stillen,
  textbasierten Pfad für Tastatur und Screenreader.
- Ton, falls vorhanden: standardmäßig stumm oder ausdrückliches Opt-in,
  Zustand als **Text plus Symbol**, nie nur als Farbe.
- **Kein Scroll-Jacking** ohne Tastatur-, Touch- und Reduced-Motion-Pfad.
- Eine primäre Bewegungslogik pro Szene. Verständlich auch bei 30 fps und
  langsamer Verbindung.
- `prefers-reduced-motion` **ersetzt** 3D, Parallax und Autoplay durch harte,
  verständliche Zustandswechsel — es entfernt sie nicht ersatzlos.

## 5. Werkzeug: `impeccable`

Das Repository enthält unter `.github/skills/impeccable/` die Skill
**impeccable v4.0.2** — Playbooks, Craft-Floor, Detektor,
Live-Browser-Iteration. Sie ist für genau diese Aufgabe gebaut.

1. `node .github/skills/impeccable/scripts/context.mjs` einmal ausführen.
2. `reference/new-work.md` laden — es geht um eine neue visuelle Welt.
3. Erst unmittelbar vor dem Schreiben von UI-Code `reference/craft-floor.md`
   laden. Dort stehen Qualitätsuntergrenze und absolute Verbote.
4. Modus **Experience**: Die Besucherin ist im Werk selbst; das Artefakt
   führt ab dem ersten Viewport, das Interface tritt zurück.
5. Detektor unter `scripts/detector/` und Live-Skripte unter `scripts/live/`
   sind zum Iterieren da. Nutze sie, statt zu raten.

`DESIGN.md` im Wurzelverzeichnis gilt **nur** für die Portfolio-Startseite.
Jede Website unter `mika-ux/` ist eine eigenständige Welt und erbt nichts.

## 6. Technische Leitplanken — nicht verhandelbar

- **Statisch.** HTML, CSS, JavaScript. Kein Build, kein Framework, kein
  Bundler. Die Website muss aus dem Verzeichnis heraus funktionieren.
- **Keine Laufzeitanfrage an Dritte.** Kein CDN, keine externen Schriften,
  keine Tracker. Brauchst du eine Bibliothek — etwa Three.js —, lege sie mit
  Lizenzhinweis lokal ab und lade sie relativ. Prüfe zuerst, ob rohes WebGL
  oder ein 2D-Canvas ohne Abhängigkeit reicht: eine gerechnete Fläche ohne
  Abhängigkeit ist die bessere Antwort.
- **Schriften lokal:** `node scripts/fetch-fonts.mjs <zielordner> "<family spec>"`
  lädt woff2 von Google Fonts und schreibt eine `fonts.css` mit relativen
  Pfaden. Familiennamen mit Leerzeichen schreiben, nicht mit `+`. Nicht
  gebrauchte Subsets löschen.
- **Eigenes Stylesheet, eigenes Skript, eigene Assets.** Nichts aus einer
  anderen Website importieren.
- **Zugänglichkeit:** ein `main`-Landmark, semantische `nav`, Skip-Link,
  sichtbare Fokuszustände, logische Überschriftenfolge, Touch-Ziele ab 44 px,
  WCAG AA, `prefers-reduced-motion` respektiert. Hover nie als einzige
  Informationsquelle.
- **Desktop und Mobil.** Eine abgespeckte Mobilfassung ist erlaubt, wenn
  Desktop dafür wirklich beeindruckt — aber die gestalterische Idee muss den
  Breakpoint überleben. Bloßes Verkleinern zählt nicht.
- **Deutsch**, `lang="de"`, fiktive Firma und Inhalte, sichtbare
  Demo-Kennzeichnung im Fuß, dazu `impressum.html` und `datenschutz.html` als
  Muster ohne Rechtswirkung. Die bestehenden Websites unter `mika-ux/` sind
  die Vorlage für Tonfall und Umfang; `LEGAL_TEMPLATE.md` nennt die
  Pflichtangaben.
- **Seitenzahl frei.** Fünf sind der Bestand; weniger ist erlaubt, wenn das
  Konzept dadurch stärker wird.

## 7. Ein Hinweis zum Ton

Die bestehenden Websites erfinden keine Werbesprache. Sie nennen Zahlen, die
stimmen könnten, benennen Grenzen, und sagen, was sie nicht können — das
Geburtshaus veröffentlicht seine Verlegungsrate, das Presswerk sagt, ab wann
es nicht mehr schneidet, das Saatgutarchiv zeigt die gesperrten Akzessionen.
Halte das. Eine beeindruckende Oberfläche über leerem Text fällt in dieser
Sammlung sofort auf.

## 8. `EINBINDUNG.md` — deine Übergabe

Lege `mika-ux/<dein-slug>/EINBINDUNG.md` an. Sie enthält alles, was für die
Einbindung in die Startseite gebraucht wird, damit die koordinierende Sitzung
nichts nachrecherchieren muss:

1. **Kartenblock** für `index.html`, fertig formuliert, im Format der
   bestehenden Karten — inklusive:
   ```html
   <p class="work__source">
     <span class="work__source-kind">Eine Vorlage</span>
     <span class="work__source-ids">MXL-045</span>
   </p>
   ```
   `Eine Vorlage` bei genau einer Nummer, `Zwei Vorlagen` / `Drei Vorlagen`
   bei mehreren. Ein Validator prüft, dass Auszeichnung und Anzahl
   zusammenpassen.
2. **CSS-Specimen** als fertiger Block für `portfolio-assets/portfolio.css`,
   nach dem Muster der bestehenden `.spec-*`-Blöcke, mit eindeutigen
   Klassennamen.
3. **Absatz für `mika-ux/README.md`**: welche Vorlage was beigetragen hat und
   warum diese Kombination, plus die Zeile für die Bestandstabelle.
4. **Zeilen für `README.md`** im Wurzelverzeichnis (beide Tabellen).
5. **Alle genutzten Quellen** mit Adresse — MXL-Nummern und alles Externe.

## 9. Prüfung vor dem Abschluss

Beides muss grün sein:

```bash
# Struktur, Verweise, Herkunftsangabe.
# Ein dist-Verzeichnis bauen: index.html, portfolio-assets/, demos/,
# stimmzettel/, showcase/, mika-ux/ hineinkopieren und für greencart/,
# aurorametrics/ und lumen-atelier/ je eine Platzhalter-index.html anlegen.
node scripts/validate-static-showcase.mjs <dist-verzeichnis>

# Browserprüfung je Seite auf 1440px und 390px
npm install playwright          # Chromium liegt unter /opt/pw-browsers/chromium
python3 -m http.server 8099 --bind 127.0.0.1 &
node scripts/pruefe-seiten.mjs http://127.0.0.1:8099/mika-ux/<slug>/ \
  index.html <weitere> impressum.html datenschutz.html
```

Zusätzlich mit eigenen Augen: Screenshots auf beiden Viewports, mit und ohne
`prefers-reduced-motion`, Tastaturweg von oben nach unten, und — falls Canvas
im Spiel ist — das Verhalten bei gedrosselter CPU.

Der Validator wird deine Website **noch nicht** kennen, solange keine Karte auf
der Startseite steht. Das ist erwartet und kein Fehler: Er prüft nur, dass
jede Website unter `mika-ux/` eine Karte hat. Bis zur Einbindung wird er
deshalb genau einen Befund für dein Verzeichnis melden. Alles andere muss
grün sein.

## 10. Commits

Auf `claude/portfolio-fable-zwei`, in nachvollziehbaren Schritten, Nachrichten
auf Deutsch im Stil der bestehenden Historie (`git log` ansehen: was war das
Problem, was die Entscheidung, was der Befund aus der Prüfung). Fuß:

```
Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
```

**Keinen Pull Request öffnen.** Nicht auf einen anderen Branch pushen.

## 11. Der Maßstab

Die sechzehn bestehenden Websites sind handwerklich sauber und inhaltlich
ehrlich. Keine ist atemberaubend. Genau dort liegt die Latte: Was du baust,
soll die Sammlung anführen — und dabei jede Leitplanke aus Abschnitt 6 halten.

Beeindruckend heißt nicht laut. Es heißt: jemand sieht die erste
Bildschirmseite und will wissen, wie das gemacht ist.

## 12. Bericht am Ende

- Welche Vorlage(n) du nach **eigener Prüfung** genommen hast und warum —
  ausdrücklich auch dann, wenn du von der Vorsortierung abgewichen bist.
- Was die Website ist und welche Technik die gerechnete Fläche trägt.
- Verhalten unter Reduced Motion und auf Mobil.
- Alle externen Quellen.
- Ergebnisse beider Prüfläufe.
- Was du **nicht** geschafft hast. Offen benennen.
