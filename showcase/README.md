# Schaustücke — fünf eigenständige Gestaltungswelten

Fünf Demo-Websites aus fünf Branchen. Sie teilen sich **nichts**: kein Framework,
keine gemeinsame CSS-Datei, keine wiederkehrenden Bausteine, keine gemeinsame
Farb- oder Schriftlogik. Jede Site hat ein eigenes Seitengerüst, das aus ihrem
Gegenstand kommt statt aus einer Vorlage.

| Site | Branche | Form | Schriften |
|---|---|---|---|
| [`haertl-praezision`](haertl-praezision/) | Zerspanung, Lohnfertigung | Technisches Zeichnungsblatt nach DIN 6771 | Archivo, Azeret Mono |
| [`hochofen-festival`](hochofen-festival/) | Musikfestival | Siebdruck-Plakat, Zweifarben-Überdruck | Anton, Barlow Semi Condensed |
| [`weingut-steinhalde`](weingut-steinhalde/) | Weinbau | Geologisches Bodenprofil | Vollkorn, Jost |
| [`brandt-ostermann`](brandt-ostermann/) | Wirtschaftskanzlei | Aktenregister und Schriftsatz | Spectral, Libre Franklin |
| [`blockwerk-boulder`](blockwerk-boulder/) | Boulderhalle | Routenboard und Sektorplan | Bricolage Grotesque, Hanken Grotesk |

## Was jede Site anders macht

**Härtl Präzisionstechnik** ist ein Zeichnungsblatt. Blattrahmen mit Zonenmarken
A–F und 1–4, Schriftfeld unten rechts als Kontaktbereich, das Bauteil als SVG mit
echten Maßketten, Form- und Lagetoleranz und Bezugsdreieck. Der Maschinenpark
steht als Datentabelle, nicht als Kachelraster. Beim Laden konstruiert sich die
Zeichnung einmal selbst.

**HOCHOFEN Festival** ist eine Plakatwand. Leuchtorange und Ultramarin liegen im
Multiply-Überdruck übereinander, die Orangeplatte fährt beim Laden in den Passer.
Das Line-up ist echter Plakatsatz: die Schriftgröße folgt der Position im Billing.
Der Laufplan ist ein Zeitraster und markiert den gerade laufenden Slot.

**Weingut Steinhalde** ist ein Bodenprofil. Man scrollt durch die
Keuper-Schichtenfolge des Remstals; links läuft ein Tiefenlineal in Zentimetern
mit und benennt den Horizont, in dem man gerade liest. Die Weine stehen als
Analysetafel mit Alkohol, Restzucker und Säure.

**Brandt Ostermann** ist eine Registratur. Navigiert wird über Registerreiter in
den Farben eines Ordnerregisters; der Reiter des sichtbaren Abschnitts zieht aus
dem Register heraus. Inhalte sind gesetzt wie ein Schriftsatz: Marginalspalte mit
Paragraf und Randziffern, Verfahren mit Aktenzeichen.

**BLOCKWERK** ist ein Routenboard. Der Sektorplan der Halle liegt als SVG im
ersten Viewport; das Board darunter lässt sich nach Griffkartenfarbe filtern, und
wer über einen Sektor fährt, sieht die zugehörigen Zeilen aufleuchten. Öffnungs­status
und Auslastung berechnen sich aus Wochentag und Uhrzeit.

## Technisch

- **Statisch.** Reines HTML, CSS und JavaScript ohne Build-Schritt. Ordner
  hochladen genügt.
- **Keine externen Anfragen.** Schriften liegen als woff2 im jeweiligen
  `assets/fonts/` und werden über eine lokale `fonts.css` eingebunden. Kein
  Google-Fonts-CDN, kein Analytics, keine Einbettungen, keine Cookies.
- **Zugänglich.** Ein `h1` je Seite, `lang="de"`, Sprunglink, sichtbarer
  Fokusring, beschriftete SVG-Grafiken, `prefers-reduced-motion` respektiert.
  Textkontraste erfüllen WCAG AA.
- **Responsiv.** Alle 30 Seiten bei 1440 px und 390 px ohne Querlauf geprüft.
- **Deutsche Typografie.** Halbgeviertstrich statt Geviertstrich, Silbentrennung
  für Komposita, Tabellenziffern bei Messwerten.

## Rechtliches und Inhalte

Alle fünf Unternehmen sind **erfunden**. Firmennamen, Personen, Adressen,
Telefonnummern, Preise, Aktenzeichen und Referenzen sind Demonstrationsmaterial.
Jede Seite trägt im Fuß eine Demo-Kennzeichnung.

Impressum und Datenschutzerklärung sind **Musterfassungen ohne Rechtswirkung**
und als solche auf jeder Seite gekennzeichnet. Sie enthalten die branchen­spezifischen
Pflichtangaben als Platzhalter — etwa Berufsrecht nach BRAO und
DL-InfoV bei der Kanzlei, Weinbezeichnungsrecht und Jugendschutz beim Weingut.
Vor einer Veröffentlichung müssen sie vollständig ersetzt und rechtlich geprüft
werden.

## Anpassen

Jede Site liegt vollständig in ihrem eigenen Ordner:

```
showcase/<site>/
├── index.html              Startseite
├── *.html                  Unterseiten, Impressum, Datenschutz
└── assets/
    ├── <name>.css          gesamtes Stylesheet, oben der Richtungsvertrag
    ├── <name>.js           Interaktion, ohne Abhängigkeiten
    ├── favicon.svg
    └── fonts/              woff2 plus fonts.css (SIL OFL 1.1)
```

Am Kopf jedes Stylesheets steht der **Richtungsvertrag**: welche Idee die Seite
trägt, welche Kategorie-Vorlage sie ablehnt, welche Farben und Schriften die Welt
ausmachen und woraus das erste Viewport besteht. Wer die Site umbaut, sollte
diesen Block zuerst lesen — und danach anpassen.

Farben und Maße stehen durchgängig als CSS-Variablen im `:root`-Block.

## Prüfen

Die Sites sind gegen das [Impeccable](https://impeccable.style)-Regelwerk geprüft
(Anti-Muster-Detektor, 60 Regeln). Erneut ausführen:

```bash
node .github/skills/impeccable/scripts/detector/detect-antipatterns.mjs showcase
```

Drei Befunde sind mit Begründung im Code stillgelegt (`impeccable-disable-line`),
weil die beanstandete Form in der jeweiligen Welt das Gegenteil einer Verlegenheit
ist: das Millimeterraster des Zeichenblatts, die Trennregeln der Plakattafel und
die farbige Kante des Registerreiters.
