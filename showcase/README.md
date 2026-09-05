# Schaustücke — zehn eigenständige Gestaltungswelten

Zehn Demo-Websites aus zehn Branchen. Sie teilen weder Framework noch
Komponenten, Raster, Farb- oder Bewegungslogik. Jede Site hat sechs vollständige
Seiten und ein Seitengerüst, das aus ihrem Gegenstand statt aus einer Vorlage
entsteht.

| # | Site | Branche | Form | Schriften | Sammlung |
|---:|---|---|---|---|---|
| 01 | [`haertl-praezision`](haertl-praezision/) | Zerspanung | Technisches Zeichnungsblatt | Archivo, Azeret Mono | A |
| 02 | [`hochofen-festival`](hochofen-festival/) | Musikfestival | Zweifarbiger Siebdruck | Anton, Barlow Semi Condensed | A |
| 03 | [`weingut-steinhalde`](weingut-steinhalde/) | Weinbau | Geologisches Bodenprofil | Vollkorn, Jost | A |
| 04 | [`brandt-ostermann`](brandt-ostermann/) | Wirtschaftsrecht | Aktenregister und Schriftsatz | Spectral, Libre Franklin | A |
| 05 | [`blockwerk-boulder`](blockwerk-boulder/) | Bouldern | Routenboard und Sektorplan | Bricolage Grotesque, Hanken Grotesk | A |
| 06 | [`kantine-klee`](kantine-klee/) | Gastronomie | Analoges Küchenjournal | Georgia, Arial Narrow | B |
| 07 | [`nachhall-radio`](nachhall-radio/) | Kultur / Audio | Tunerfront und Kassettenarchiv | Antonio, Commissioner | B |
| 08 | [`krawumm-labor`](krawumm-labor/) | Bildung | Interaktives Experimentierheft | Bowlby One SC, Atkinson Hyperlegible | B |
| 09 | [`nordhafen-verkehr`](nordhafen-verkehr/) | Mobilität | Kommunales Leitsystem | Chivo, Azeret Mono | B |
| 10 | [`fokus40-augenatelier`](fokus40-augenatelier/) | Optometrie | Sehprobentafel und Linsenwerkbank | Archivo, Jost | B |

## Die zehn Richtungen

**Härtl Präzisionstechnik** ist ein Zeichnungsblatt mit Zonenmarken, Maßketten,
Toleranzen und einem Schriftfeld als Kontaktbereich. Maschinen stehen in einer
Datentabelle statt in einem Kartenraster.

**HOCHOFEN Festival** ist eine Plakatwand. Leuchtorange und Ultramarin liegen im
Siebdruck-Überdruck übereinander; Line-up und Laufplan funktionieren als
Plakatsatz und Zeitraster.

**Weingut Steinhalde** führt durch ein geologisches Bodenprofil. Tiefenlineal,
Keuper-Schichten und eine Analysetafel ersetzen die übliche Weingut-Bildstrecke.

**Brandt Ostermann** ist eine Registratur mit farbigen Registerreitern,
Marginalspalte, Randziffern und echten Aktenzeichen.

**BLOCKWERK** ist ein Routenboard. Sektorplan, Griffkartenfilter, Schraubplan und
lokal berechnete Auslastung machen die Halle bedienbar.

**Kantine Klee** ist ein täglich beklebtes Küchenjournal: abstrahierter Teller,
Tageszettel, Saisonkarte und Kassenbon-Logik. Ein Ernährungsfilter und eine
unverbindliche Reservierungsdemo sind vollständig tastaturbedienbar.

**NACHHALL RADIO** ist ein physisches Empfangsgerät. Frequenzregler und Presets
stimmen vier fiktive Sender ab; Wochenprogramm und Kassettendeck erschließen ein
stummes, beschriftetes Audioarchiv.

**KRAWUMM! Labor** liegt als aufgeschlagenes Experimentierheft auf dem Tisch.
Magnetfeld, additive Farbmischung und Klangwelle reagieren als echte kleine
Versuche auf Eingaben.

**Nordhafen Stadtverkehr** ist bereits das öffentliche Leitsystem. Fahrtplaner,
Liniennetz, Abfahrtstafel, Haltestellenfilter und Betriebsmeldungen greifen
ineinander.

**Fokus40 Augenatelier** verbindet Sehprobentafel und Werkbank. Fokusregler,
A/B-Linsenvergleich sowie große Schrift und hoher Kontrast erklären Gestaltung,
ohne einen medizinischen Test vorzutäuschen.

## Technische Leitplanken

- Reines HTML, CSS und JavaScript ohne Build-Schritt
- Sechs Seiten pro Site, insgesamt 60 HTML-Dokumente
- Eigene Stylesheets, Scripts, Favicons und Gestaltungsverträge pro Site
- Lokale WOFF2- oder bewusst gewählte Systemschriften; keine Font-CDNs
- Keine Tracker, Cookies, eingebetteten Karten oder Laufzeit-Drittanfragen
- Ein `h1`, ein semantisches `main`, Skip-Link und sichtbarer Fokus je Seite
- `prefers-reduced-motion`, verständliche Live-Status und beschriftete Controls
- Responsive Kompositionen ohne horizontalen Querlauf bei 390 und 1440 Pixeln

## Mika UX Library

Für die fünf Schaustücke der Sammlung B wurde keine Vorlage aus der Mika UX Library
übernommen. Deshalb tragen ihre Karten bewusst kein Mika-UX-Badge. Sobald eine
konkrete Library-Vorlage verwendet wird, müssen Karte und Dokumentation ihre
Quelle sichtbar und screenreader-lesbar ausweisen.

## Rechtliches und Inhalte

Alle Unternehmen, Personen, Adressen, Preise, Fahrplandaten, Sendungen und
medizinisch wirkenden Beispiele sind erfunden. Jede Seite trägt eine sichtbare
Demo-Kennzeichnung.

Impressum und Datenschutzerklärung sind Musterfassungen ohne Rechtswirkung. Sie
müssen vor jeder realen Veröffentlichung vollständig ersetzt und fachlich
geprüft werden. Fokus40 stellt keine Diagnose; Nordhafens Zeiten werden nur aus
der Gerätezeit berechnet; Nachhall spielt kein Audio ab.

## Ordnerstruktur

```text
showcase/<site>/
├── index.html
├── *.html
├── DESIGN.md
└── assets/
    ├── <name>.css
    ├── <name>.js
    ├── favicon.svg
    └── fonts/
```

Der Richtungsvertrag am Kopf des Stylesheets beziehungsweise in `DESIGN.md`
beschreibt These, eigene Welt, Ablauf, ersten Viewport und formale Regeln. Wer
eine Site umbaut, sollte diesen Vertrag zuerst anpassen.

## Prüfen

Der statische Validator prüft HTML-Struktur, Sprungziele, interne Links und
Assets sowie die genaue Auswahl der zehn Schaustücke. Er liest das Pages-Verzeichnis, wie es
`.github/workflows/deploy-pages.yml` zusammenstellt (`index.html`, `404.html`,
`impressum.html`, `datenschutz.html`, `portfolio-assets/`, `demos/`,
`stimmzettel/`, `showcase/`, `mika-ux/`, ohne Markdown-Dateien; für
`greencart/`, `aurorametrics/` und `lumen-atelier/` genügt lokal je eine
Platzhalter-`index.html`):

```bash
node scripts/validate-static-showcase.mjs ./pages-dist
```

Auf dem Quellverzeichnis selbst meldet er die drei Framework-Ziele als fehlend,
weil deren Builds erst im Workflow entstehen.

Der mitgelieferte Impeccable-Detektor prüft wiederkehrende generische
UI-Antimuster:

```bash
node .github/skills/impeccable/scripts/detector/detect-antipatterns.mjs showcase
```

Seltene Ausnahmen sind direkt im CSS mit einer Begründung dokumentiert, wenn das
erkannte Muster tatsächlich zur Gegenstandswelt gehört — etwa Messraster,
Registerkante oder Gehäusenaht.
