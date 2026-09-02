# Demo-Websites

Ein kuratiertes Portfolio aus **zehn eigenständigen Vorzeige-Websites**. Die fünf
Schaustücke der ersten Kollektion und die fünf neuen Gegenwelten teilen weder
Template noch Komponenten, Raster, Farb- oder Bewegungslogik. Frühere Projekte
bleiben auf der GitHub-Pages-Startseite in einem aufklappbaren Archiv erreichbar.

## Aktuelle Auswahl

| # | Projekt | Branche | Gestalterische Form | Sammlung |
|---:|---|---|---|---|
| 01 | [`haertl-praezision`](showcase/haertl-praezision/) | Industrie | Technisches Zeichnungsblatt nach DIN-Logik | A |
| 02 | [`hochofen-festival`](showcase/hochofen-festival/) | Kultur | Zweifarben-Siebdruck-Plakat | A |
| 03 | [`weingut-steinhalde`](showcase/weingut-steinhalde/) | Weinbau | Geologisches Bodenprofil | A |
| 04 | [`brandt-ostermann`](showcase/brandt-ostermann/) | Recht | Aktenregister und Schriftsatz | A |
| 05 | [`blockwerk-boulder`](showcase/blockwerk-boulder/) | Sport | Routenboard und Sektorplan | A |
| 06 | [`kantine-klee`](showcase/kantine-klee/) | Gastronomie | Analoges Küchenjournal | B |
| 07 | [`nachhall-radio`](showcase/nachhall-radio/) | Audio / Kultur | Tunerfront und Kassettenarchiv | B |
| 08 | [`krawumm-labor`](showcase/krawumm-labor/) | Bildung | Interaktives Experimentierheft | B |
| 09 | [`nordhafen-verkehr`](showcase/nordhafen-verkehr/) | Mobilität | Kommunales Leitsystem | B |
| 10 | [`fokus40-augenatelier`](showcase/fokus40-augenatelier/) | Optometrie | Sehprobentafel und Linsenvergleich | B |
| 11 | [`sprudelwerk`](mika-ux/sprudelwerk/) | Getränke | Aufkleberbogen mit aufgeblasenen Bändern | C |
| 12 | [`vehring-orgelbau`](mika-ux/vehring-orgelbau/) | Handwerk | Schwarze Kathedrale mit Zinnprospekt | C |
| 13 | [`saatgutarchiv`](mika-ux/saatgutarchiv/) | Landwirtschaft | Bestandskatalog als öffentlicher Dienst | C |
| 14 | [`geburtshaus-uferwiese`](mika-ux/geburtshaus-uferwiese/) | Gesundheit | Geflüsterte Serif über Pastellhimmel | C |
| 15 | [`nereus-tiefsee`](mika-ux/nereus-tiefsee/) | Forschung | Choreografierter Abstieg durch die Wassersäule | C |
| 16 | [`schwarzwerk-presswerk`](mika-ux/schwarzwerk-presswerk/) | Fertigung | Reines Schwarz, ein Rot, schmale Spalte | C |
| 17 | [`wolkenkamm`](mika-ux/wolkenkamm/) | Buntpapier | Gerechnetes Marmorierbad unter Plakattype | C |
| 18 | [`blank-oberflaechen`](mika-ux/blank-oberflaechen/) | Galvanik | Gerechnetes Chrom, harter Schnitt in weiße Galerie | C |

Details zu Konzept, Seitenumfang und Interaktionen stehen in
[`showcase/README.md`](showcase/README.md).

## Archiv

Die Hauptseite zeigt ausschließlich die zehn aktuellen Vorzeigeprojekte.
Folgende ältere Arbeiten liegen im nativen Archiv-Disclosure:

- `stimmzettel/` — Demokratie am Küchentisch
- `sites/greencart-nuxt/` — Nuxt 3
- `sites/aurorametrics-nextjs/` — Next.js
- `sites/lumen-atelier-astro/` — Astro
- `demos/` — zehn zweisprachige Branchenvorlagen

## Mika UX Library

Sammlung C auf der Startseite versammelt Websites, deren Gestaltung aus der
**Mika UX Library** abgeleitet ist — einem Bestand aus 121 kuratierten
Referenzen (`MXL-001`–`MXL-120`, `MXL-145`). Jede dieser Websites nennt auf
ihrer Karte die MXL-Nummern, aus denen sie entstanden ist: eine einzige Nummer
bedeutet eine reine Vorlage ohne Mischung, mehrere Nummern listen alle
Vorlagen, die das Ergebnis beeinflusst haben.

| # | Projekt | Branche | Gestalterische Form | Herkunft |
|---:|---|---|---|---|
| 11 | [`sprudelwerk`](mika-ux/sprudelwerk/) | Getränke | Aufkleberbogen | `MXL-051` |
| 12 | [`vehring-orgelbau`](mika-ux/vehring-orgelbau/) | Handwerk | Schwarze Kathedrale | `MXL-007` |
| 13 | [`saatgutarchiv`](mika-ux/saatgutarchiv/) | Landwirtschaft | Bestandskatalog als öffentlicher Dienst | `MXL-118` + `MXL-090` + `MXL-113` |
| 14 | [`geburtshaus-uferwiese`](mika-ux/geburtshaus-uferwiese/) | Gesundheit | Geflüsterte Serif über Pastellhimmel | `MXL-068` + `MXL-079` + `MXL-050` |
| 15 | [`nereus-tiefsee`](mika-ux/nereus-tiefsee/) | Forschung | Choreografierter Abstieg | `MXL-040` |
| 16 | [`schwarzwerk-presswerk`](mika-ux/schwarzwerk-presswerk/) | Fertigung | Reines Schwarz, ein Rot | `MXL-147` |
| 17 | [`wolkenkamm`](mika-ux/wolkenkamm/) | Buntpapier | Gerechnetes Marmorierbad | `MXL-022` + `MXL-040` |
| 18 | [`blank-oberflaechen`](mika-ux/blank-oberflaechen/) | Galvanik | Chrom auf Nacht, weiße Galerie | `MXL-045` |

Details stehen in [`mika-ux/README.md`](mika-ux/README.md). Die Herkunftsangabe
wird von `scripts/validate-static-showcase.mjs` gegen den Bestand unter
`mika-ux/` geprüft.

## Steckbriefe

Jede der 18 Websites trägt in ihrem Ordner einen maschinenlesbaren Steckbrief
`showcase.json` (Schema `mika.showcase-card.v1`):

| Feld | Inhalt |
|---|---|
| `slug`, `title`, `number`, `collection` | Ordnername, Kartentitel, Hub-Nummer `01`–`18`, Sammlung `A`/`B`/`C` |
| `industry`, `form`, `description` | Branche, gestalterische Form und Beschreibungstext der Hub-Karte |
| `origin` | `Claude Code`, `Codex` oder `Mika UX Library` |
| `library_inputs`, `mode` | MXL-Nummern der Karte; `PURE` bei genau einer, `MIXED` bei mehreren, `null` ohne |
| `pages`, `path`, `live_url` | HTML-Seiten des Ordners, Repository-Pfad und Adresse auf GitHub Pages |
| `status`, `notes` | `published`; Anmerkungen, etwa der Hinweis auf den unvalidierten Analysefall `MXL-147` |

Die Dateien werden nicht von Hand gepflegt, sondern mit
`node scripts/build-showcase-cards.mjs` aus der Startseite erzeugt (siehe
„Lokale Prüfung“). Sie werden mit den Projektordnern nach GitHub Pages
ausgeliefert und sind dort unter `<live_url>showcase.json` abrufbar.

## Technische Leitplanken

- Statische Multipage-Sites aus HTML, CSS und JavaScript
- Je Vorzeigeprojekt eigenes Stylesheet, eigenes Script und eigene Assets
- Lokale Schriften und Bilder; keine zur Laufzeit erforderlichen Drittanfragen
- Keine Tracker, Cookies oder eingebetteten Fremddienste
- Semantisches HTML, Skip-Links, sichtbare Fokuszustände und Reduced Motion
- Responsive Kompositionen für Mobilgerät, Tablet und Desktop
- Fiktive Firmen und Inhalte mit sichtbarer Demo-Kennzeichnung
- Muster-Impressum und Muster-Datenschutz ohne Rechtswirkung

## GitHub Pages

`.github/workflows/deploy-pages.yml` baut die drei Framework-Projekte (`npm ci`
aus den Lockfiles), sammelt den Portfolio-Hub samt Impressum und Datenschutz,
`showcase/`, `mika-ux/`, `demos/` und `stimmzettel/` in einem Pages-Artefakt,
lässt den Validator darüber laufen und veröffentlicht es über GitHub Actions.

Der Workflow läuft bei Push auf dem Portfolio-Branch und kann zusätzlich über
`workflow_dispatch` gestartet werden.

## Lokale Prüfung

Der im Repository enthaltene Impeccable-Detektor prüft typische generische
UI-Muster:

```bash
node .github/skills/impeccable/scripts/detector/detect-antipatterns.mjs showcase
```

Vor Veröffentlichung werden zusätzlich interne Links und Assets, HTML-Struktur,
Konsolenfehler, horizontales Overflow sowie die wichtigsten Interaktionen bei
390, 768 und 1440 Pixel Breite geprüft: `scripts/validate-static-showcase.mjs`
liest das Pages-Verzeichnis, `scripts/pruefe-seiten.mjs` die Seiten im Browser
(Aufruf siehe [`mika-ux/README.md`](mika-ux/README.md)).

Die Steckbriefe `showcase.json` in den Projektordnern werden aus der
Startseite erzeugt — nach jeder Änderung an einer Hub-Karte:

```bash
node scripts/build-showcase-cards.mjs          # schreibt alle Steckbriefe
node scripts/build-showcase-cards.mjs --check  # meldet veraltete Steckbriefe
```

## Rechtliches

Der Hub selbst hat ein echtes Impressum und eine echte Datenschutzerklärung:
[`impressum.html`](impressum.html) und [`datenschutz.html`](datenschutz.html),
im Hub-Design, ohne Fremdanfragen. Beide sind als Rechtstext-Entwurf
gekennzeichnet und vor Nutzung juristisch zu prüfen; offene Angaben
(Telefonnummer, USt-IdNr.) stehen sichtbar im Markerstift.

Alle Marken, Personen, Adressen, Preise, Kennzahlen und Referenzen der
Demo-Websites sind Demonstrationsmaterial. Deren Rechtstexte sind Muster ohne
Rechtswirkung und müssen vor einer realen Veröffentlichung vollständig ersetzt
und fachlich geprüft werden. Siehe [`LEGAL_TEMPLATE.md`](LEGAL_TEMPLATE.md).

## Bekannte Befunde (Browserprüfung 2026-09-02)

`scripts/pruefe-seiten.mjs` über alle 18 Projekt-Startseiten sowie Hub, Impressum,
Datenschutz und 404 bei 1440 px und 390 px. Behoben: kantine-klee,
haertl-praezision, cafe-restaurant. Offen bleiben zu kleine Klickziele
(unter 44 px Höhe) auf vier Startseiten:

| Site | Viewport | Elemente |
|---|---|---|
| `showcase/weingut-steinhalde` | Desktop + Mobil | Wortmarke „Steinhalde Kerne“ (35 px), Navigation „Profil/Weine/Lage/Besuch“ (26 px), „Verkostung“ (34 px), Menü-Taste (32 px) |
| `showcase/blockwerk-boulder` | Desktop + Mobil | Wortmarke (25 px), Navigation (32 px), Menü-Taste (33 px), Schwierigkeits-Filter „Gelb 3–4“ … „Rot 6A–6C“ (33 px) |
| `showcase/nordhafen-verkehr` | Desktop + Mobil | Fußzeilenlinks Impressum/Datenschutz (20 px) |
| `showcase/fokus40-augenatelier` | Desktop + Mobil | Fußzeilenlinks Impressum/Datenschutz (21 px) |

Die zehn älteren `demos/` zeigen zudem sichtbare Platzhalter wie `[E-MAIL]`
und `[TELEFON]`; sie sind Vorlagen, keine Vorzeigeprojekte.
