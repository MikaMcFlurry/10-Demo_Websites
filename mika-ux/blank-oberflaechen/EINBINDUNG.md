# EINBINDUNG — blank-oberflaechen

Übergabe an die koordinierende Sitzung. Diese Website fasst keine der vier
geteilten Dateien an; alles, was die Einbindung in die Startseite braucht,
steht hier.

- **Verzeichnis:** `mika-ux/blank-oberflaechen/`
- **Titel:** BLANK Oberflächentechnik — Galvanik in Solingen
- **Vorlage:** `MXL-045` „Hyper Tria — Chrome monolith gallery“ (genau eine)
- **Seiten:** `index.html`, `verfahren.html`, `betrieb.html`,
  `impressum.html`, `datenschutz.html`

---

## 0. Vorlagenwahl — Ergebnis der eigenen Prüfung (Briefing Abschnitt 3)

Die Vorsortierung des Briefings nannte `MXL-045` zuerst; die eigene Prüfung
der Primärquellen bestätigt sie. Geprüft am 28.07.2026:

1. **`styles.refero.design/style/6665a3dd-…`** (Analysequelle von MXL-045):
   bestätigt die Struktur vollständig — Chrom-3D-Wortmarke als „the system's
   most recognizable signature“ auf schwarzem Hero, harter Übergang in weiße
   Galerieflächen ohne Trenner, Aeonik mit leichten Schnitten und enger
   Spationierung, keine Illustrationen, kein Schmuck. Zwei Abweichungen der
   Refero-Forensik gegenüber der MXL-Spezifikation sind dokumentierenswert:
   Refero nennt als Akzent `#ee3a49` (MXL: `#ff342e`) und durchgehend
   Radius 0 (MXL: 8–16px / 999px). Gebaut wurde nach der MXL-Spezifikation,
   die laut Briefing der Vertrag ist.
2. **`hypertria.com`** (Quell-Website): liefert heute eine
   WordPress-Fassung, in der die Chrom-Wortmarke im statischen Abruf nicht
   mehr nachweisbar ist. Das ist dieselbe Grenze, die der Nachtrag zu
   `MXL-147` in `mika-ux/README.md` beschreibt — Laufzeit-Inhalte sind für
   statische Erhebung unsichtbar. Konsequenz für den Bau: Die gerechnete
   Chromfläche wurde als echte Laufzeitgrafik umgesetzt, nicht als Bild.
3. **`osmo.supply`** (MXL-059): Die Live-Site ist inzwischen dunkel und
   entspricht nicht mehr der hellen „Concrete/Lime“-Spezifikation.
   Dazu kollidiert das Feld „hell, warmes Papier“ (`#F7F5EF`) wörtlich mit
   `MXL-022`, an dem die parallele Sitzung arbeitet, und mit drei
   Bestandswebsites. Verworfen.
4. **`authkit.com`** (MXL-092): solide, aber dunkel (drei dunkle Websites im
   Bestand) und violett nahe am Signal von `nereus-tiefsee` (`#8d73ff`).
   Der Abstand müsste allein über das Material entstehen. Verworfen.
5. **Parallelbranch `claude/portfolio-ux-library-pkj4xy`** (geprüft per
   `git fetch` + `git show`): zum Prüfzeitpunkt keine neue Website, keine
   belegte Vorlage. Die Wahl von `MXL-045` kollidiert weder mit dem
   angekündigten Feld (hell, warmes Papier, Farbwellen) optisch noch
   inhaltlich: Chrom ist Reflexion und Environment-Mapping, keine Strömung.

`MXL-045` schließt zudem alle vier im Briefing benannten Lücken des
Portfolios gleichzeitig: Canvas/WebGL, generative gerechnete Grafik, harter
Weltenwechsel innerhalb einer Website (`theme: mixed`), Materialität.

**Abstand zu `schwarzwerk-presswerk`** (Signal `#FF002F` vs. `#ff342e`):
gehalten über Struktur und Typografie, wie das Briefing verlangt — dort
reines Schwarz, 975px-Spalte, runde Display-Schrift (Baloo 2); hier
Full-bleed-Szenen, breite weiße Galerie, expandierte Grotesk (Archivo),
und der Rotanteil der dunklen Welt existiert ausschließlich als
reflektierter Lichtstreifen in der Chromfläche.

## 1. Kartenblock für `index.html`

Einzufügen in Sammlung C, nach der Karte von `schwarzwerk-presswerk`
(Nummer 17 fortlaufend). Das Specimen dazu steht in Abschnitt 2.

```html
<a class="work" href="mika-ux/blank-oberflaechen/" aria-label="Blank Oberflächentechnik ansehen">
  <div class="work__copy">
    <p class="work__meta"><span>17 / Galvanik</span><span>Nacht, Chrom, Papier</span></p>
    <div class="work__body">
      <h3 class="work__title">Blank</h3>
      <p class="work__description">
        Eine Galvanik, deren Wortmarke als gerechnete Chromfläche im Browser
        entsteht — rohes WebGL, kein Bild. Danach schneidet die Seite hart in
        eine weiße Galerie, die den Schichtaufbau im wahren Maßstab zeigt.
      </p>
      <p class="work__source">
        <span class="work__source-kind">Eine Vorlage</span>
        <span class="work__source-ids">MXL-045</span>
      </p>
    </div>
    <p class="work__action">
      <span class="work__cta">Projekt öffnen</span>
      <span class="work__arrow" aria-hidden="true">
        <svg class="work__arrow-glyph" viewBox="0 0 24 24" focusable="false"><use href="#glyph-arrow"></use></svg>
        <svg class="work__arrow-glyph work__arrow-glyph--trail" viewBox="0 0 24 24" focusable="false"><use href="#glyph-arrow"></use></svg>
      </span>
    </p>
  </div>
  <div class="work__visual" aria-hidden="true">
    <div class="spec-chromschnitt">
      <span class="chromschnitt-wort">BLANK</span>
      <span class="chromschnitt-galerie">
        <i></i><i></i><i></i>
      </span>
    </div>
  </div>
</a>
```

## 2. CSS-Specimen für `portfolio-assets/portfolio.css`

Klassennamen sind eindeutig (`spec-chromschnitt`, `chromschnitt-*`).
Das Specimen zeigt beide Welten der Website: oben die Chrom-Wortmarke auf
Nacht (als CSS-Verlauf, wie der Poster-Fallback der Website selbst), unten
der harte Schnitt in die weiße Galerie mit drei Hairline-Exponaten.

```css
/* 17 — BLANK Oberflächentechnik: Chrom auf Nacht, harter Schnitt in Papier. */
.spec-chromschnitt {
  display: grid;
  grid-template-rows: 1.6fr 1fr;
  width: 100%;
  min-height: 100%;
}

.spec-chromschnitt .chromschnitt-wort {
  display: grid;
  place-items: center;
  background: #0a0b0a;
  padding: clamp(24px, 3vw, 48px);
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 900;
  font-size: clamp(2.6rem, 6vw, 5rem);
  letter-spacing: -0.04em;
  /* Poster-Chrom der Website: Verlauf als stehende Vertretung der
     gerechneten WebGL-Fläche. */
  background-image: linear-gradient(177deg,
    #2c2d2b 0%, #babcb4 20%, #fdfdfa 33%, #6f716b 46%,
    #191a18 55%, #8d8f88 68%, #dfe0da 82%, #3a3b38 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-color: #0a0b0a;
}

.spec-chromschnitt .chromschnitt-galerie {
  display: grid;
  align-content: space-evenly;
  gap: 0;
  background: #f4f1e9;
  padding: clamp(12px, 1.6vw, 24px) clamp(24px, 3vw, 48px);
}

.spec-chromschnitt .chromschnitt-galerie i {
  display: block;
  height: 1px;
  background: #d9d5c9;
  position: relative;
}

.spec-chromschnitt .chromschnitt-galerie i::after {
  content: "";
  position: absolute;
  left: 0;
  top: -3px;
  width: 22%;
  height: 5px;
  background: #11130f;
}

.spec-chromschnitt .chromschnitt-galerie i:last-child::after {
  background: #ff342e;
}
```

## 3. Absatz für `mika-ux/README.md`

Tabellenzeile für „Aktueller Stand“:

```markdown
| 17 | [`blank-oberflaechen`](blank-oberflaechen/) | Galvanik | Gerechnetes Chrom, harter Schnitt in weiße Galerie | Archivo, Fragment Mono | `MXL-045` |
```

Absatz (nach dem Abschnitt zu 16 — SCHWARZWERK):

```markdown
### 17 — BLANK Oberflächentechnik

`MXL-045` („Hyper Tria“, *Chrome monolith gallery*) verlangt massive
Chrom-Typografie auf dunkler Bühne und danach einen harten Wechsel — keinen
Übergang — in eine weiße, messerscharfe Galerie (`theme: mixed`).

Übersetzt in eine Galvanik in Solingen, wird das Chrom vom Stilmittel zum
Gegenstand: Die Wortmarke ist eine zur Laufzeit gerechnete Chromfläche aus
rohem WebGL ohne Abhängigkeit. Der Schriftzug wird in ein 2D-Canvas
gezeichnet, per separierbarem Box-Blur zu einem 16-Bit-Höhenfeld
weichgezeichnet; der Fragment-Shader liest daraus Normalen und spiegelt ein
prozedurales Studio-Environment aus Softbox-Bändern, Absorbern und einer
Horizontlinie. Das Signalrot existiert in der dunklen Welt ausschließlich
als reflektierter Lichtstreifen im Chrom. Der Zeiger dreht das Environment,
eine Taste hält die Bewegung an; `prefers-reduced-motion` ersetzt sie durch
genau ein stehendes Bild, und ohne WebGL bleibt ein CSS-Chromposter stehen —
Vertrag nach `MXL-040`/`MXL-045`.

Nach dem Schnitt ist die Seite eine weiße Galerie, geordnet als
Schichtaufbau von innen nach außen: Schleifen, Kupfer, Nickel, Chrom, dazu
die Solitäre Hartchrom und Chemisch Nickel. Der Querschnitt zeigt den
Aufbau wahlweise im wahren Maßstab — Chrom ist mit 0,3 µm die dünnste
Schicht des Systems, das nach ihm benannt ist. Der **Schichtzeitrechner**
rechnet die Hartchrom-Badzeit nach Faraday (M = 52 g/mol, z = 6,
ρ = 7,14 g/cm³, Stromausbeute 12–18 %) und nennt über 500 µm bewusst keine
Zahl mehr, weil dort nicht mehr aufgebaut wird. Die Betriebsseite erklärt
die REACH-Lage von Chrom(VI) ohne Beschönigung, nennt die Abwasserwerte
nach Anhang 40 AbwV und listet offen, was das Werk nicht macht.

Fünf Seiten: Oberfläche, Verfahren, Betrieb, Impressum, Datenschutz.
```

## 4. Zeilen für `README.md` (Wurzelverzeichnis)

Erste Tabelle (Aktuelle Vorzeigeprojekte):

```markdown
| 17 | [`blank-oberflaechen`](mika-ux/blank-oberflaechen/) | Galvanik | Gerechnetes Chrom, harter Schnitt in weiße Galerie | Mika UX Library |
```

Zweite Tabelle (Sammlung C / Herkunft):

```markdown
| 17 | [`blank-oberflaechen`](mika-ux/blank-oberflaechen/) | Galvanik | Chrom auf Nacht, weiße Galerie | `MXL-045` |
```

## 5. Genutzte Quellen

- `MXL-045` „Hyper Tria — Chrome monolith gallery“, Mika UX Library
  (Design-Spezifikation; einzige Vorlage).
- https://styles.refero.design/style/6665a3dd-606f-4fd1-80dd-a84e3b3a6226 —
  Analysequelle von MXL-045; Struktur-, Farb- und Typografie-Verifikation.
- https://hypertria.com — Quell-Website von MXL-045; Gegenprüfung, dokumentierte
  Grenze der statischen Erhebung (siehe Abschnitt 0).
- https://www.osmo.supply — Primärquelle MXL-059, geprüft und verworfen.
- https://authkit.com — Primärquelle MXL-092, geprüft und verworfen.
- Schriften: Archivo (variabel, `wdth`/`wght`) und Fragment Mono, Google
  Fonts, SIL Open Font License 1.1, lokal abgelegt unter `assets/fonts/`
  (`scripts/fetch-fonts.mjs`).
- Fachliche Näherungen (gerundet, im Fuß und Impressum als Näherung
  gekennzeichnet): Faradaysches Gesetz für Chromabscheidung; Schichtdicken
  und Härten nach DIN EN ISO 1456, 6158, 4527, 4516, 2178, 3497;
  Abwasser-Grenzwerte nach Anhang 40 AbwV.
- Keine Bilder, keine externen Bibliotheken, keine Laufzeitanfragen an
  Dritte. Die Chromfläche ist Programmcode (`assets/chrom.js`), kein Asset.

## 6. Prüfstand bei Übergabe

- `node scripts/validate-static-showcase.mjs <dist>`: grün bis auf den
  erwarteten Befund „keine Karte auf der Startseite“ für
  `blank-oberflaechen` (gemeldet als zwei Zeilen derselben Ursache:
  „7 Websites, 6 Karten“ und „keine Karte für blank-oberflaechen“;
  die Einbindung macht die koordinierende Sitzung).
- `node scripts/pruefe-seiten.mjs … index.html verfahren.html betrieb.html
  impressum.html datenschutz.html`: grün auf 1440 px und 390 px.
- Impeccable-Detektor (`scripts/detect.mjs`): 0 Befunde.
