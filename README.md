# Demo-Websites

Ein kuratiertes Portfolio aus **zehn eigenständigen Vorzeige-Websites**. Die fünf
Schaustücke der ersten Kollektion und die fünf neuen Gegenwelten teilen weder
Template noch Komponenten, Raster, Farb- oder Bewegungslogik. Frühere Projekte
bleiben auf der GitHub-Pages-Startseite in einem aufklappbaren Archiv erreichbar.

## Aktuelle Auswahl

| # | Projekt | Branche | Gestalterische Form | Ursprung |
|---:|---|---|---|---|
| 01 | [`haertl-praezision`](showcase/haertl-praezision/) | Industrie | Technisches Zeichnungsblatt nach DIN-Logik | Claude Code |
| 02 | [`hochofen-festival`](showcase/hochofen-festival/) | Kultur | Zweifarben-Siebdruck-Plakat | Claude Code |
| 03 | [`weingut-steinhalde`](showcase/weingut-steinhalde/) | Weinbau | Geologisches Bodenprofil | Claude Code |
| 04 | [`brandt-ostermann`](showcase/brandt-ostermann/) | Recht | Aktenregister und Schriftsatz | Claude Code |
| 05 | [`blockwerk-boulder`](showcase/blockwerk-boulder/) | Sport | Routenboard und Sektorplan | Claude Code |
| 06 | [`kantine-klee`](showcase/kantine-klee/) | Gastronomie | Analoges Küchenjournal | Codex |
| 07 | [`nachhall-radio`](showcase/nachhall-radio/) | Audio / Kultur | Tunerfront und Kassettenarchiv | Codex |
| 08 | [`krawumm-labor`](showcase/krawumm-labor/) | Bildung | Interaktives Experimentierheft | Codex |
| 09 | [`nordhafen-verkehr`](showcase/nordhafen-verkehr/) | Mobilität | Kommunales Leitsystem | Codex |
| 10 | [`fokus40-augenatelier`](showcase/fokus40-augenatelier/) | Optometrie | Sehprobentafel und Linsenvergleich | Codex |
| 11 | [`sprudelwerk`](mika-ux/sprudelwerk/) | Getränke | Aufkleberbogen mit aufgeblasenen Bändern | Mika UX Library |
| 12 | [`vehring-orgelbau`](mika-ux/vehring-orgelbau/) | Handwerk | Schwarze Kathedrale mit Zinnprospekt | Mika UX Library |
| 13 | [`saatgutarchiv`](mika-ux/saatgutarchiv/) | Landwirtschaft | Bestandskatalog als öffentlicher Dienst | Mika UX Library |
| 14 | [`geburtshaus-uferwiese`](mika-ux/geburtshaus-uferwiese/) | Gesundheit | Geflüsterte Serif über Pastellhimmel | Mika UX Library |

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

Details stehen in [`mika-ux/README.md`](mika-ux/README.md). Die Herkunftsangabe
wird von `scripts/validate-static-showcase.mjs` gegen den Bestand unter
`mika-ux/` geprüft.

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

`.github/workflows/deploy-pages.yml` baut die drei Framework-Projekte, sammelt
den Portfolio-Hub, `showcase/`, `demos/` und `stimmzettel/` in einem
Pages-Artefakt und veröffentlicht es über GitHub Actions.

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
390, 768 und 1440 Pixel Breite geprüft.

## Rechtlicher Hinweis

Alle Marken, Personen, Adressen, Preise, Kennzahlen und Referenzen sind
Demonstrationsmaterial. Die enthaltenen Rechtstexte sind Muster ohne
Rechtswirkung und müssen vor einer realen Veröffentlichung vollständig ersetzt
und fachlich geprüft werden. Siehe [`LEGAL_TEMPLATE.md`](LEGAL_TEMPLATE.md).
