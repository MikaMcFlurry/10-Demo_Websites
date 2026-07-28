# Sammlung C — Ableitungen aus der Mika UX Library

Websites, deren Gestaltung aus der **Mika UX Library** abgeleitet ist: einem
Bestand aus 121 kuratierten Referenzen (`MXL-001` bis `MXL-120` sowie `MXL-145`).
Jede Referenz ist ein Vertrag über Farbrollen, Typografie, Raster, Form,
Bewegung, Responsive-Verhalten und Zugänglichkeit — nicht über Inhalt, Marke
oder Komposition der Quelle.

## Herkunftsangabe

Jede Website nennt auf der Portfolio-Startseite die MXL-Nummern, aus denen sie
entstanden ist. Die Angabe unterscheidet zwei Fälle:

| Auszeichnung | Bedeutung |
|---|---|
| **Eine Vorlage** | Genau eine MXL-Nummer. Es wurde nichts gemischt. |
| **Mehrere Vorlagen** | Alle Nummern, die das Ergebnis beeinflusst haben, in der Reihenfolge ihres Gewichts. |

`scripts/validate-static-showcase.mjs` prüft diese Angabe: Jede Website unter
`mika-ux/` braucht genau eine Karte auf dem Hub, jede Karte mindestens eine
MXL-Nummer, und die Auszeichnung muss zur Anzahl der genannten Nummern passen.

## Aktueller Stand

| # | Site | Branche | Form | Schriften | Herkunft |
|---:|---|---|---|---|---|
| 11 | [`sprudelwerk`](sprudelwerk/) | Getränke | Aufkleberbogen mit aufgeblasenen Bändern | Anybody, Figtree | `MXL-051` |
| 12 | [`vehring-orgelbau`](vehring-orgelbau/) | Handwerk | Schwarze Kathedrale mit Zinnprospekt | Unbounded, Instrument Sans, Spline Sans Mono | `MXL-007` |

### 11 — SPRUDELWERK

`MXL-051` („Slush“, *Inflatable sticker universe*) verlangt riesige aufgeblasene
Ribbons, crushed display type und ein konsistentes Rainbow-Sticker-System auf
warmem Canvas mit rationiertem Blau als Signal.

Übersetzt in eine Limonadenmanufaktur: Die sechs Sorten sind gestanzte Sticker
mit weißem Rand auf einem perforierten Bogen. Das Aufgeblasene entsteht aus drei
CSS-Lagen — Spekularstreifen oben, Schattenbogen unten, abgedunkelter Falz als
Unterseite — ohne ein einziges Bild, Canvas oder 3D. Die Width-Achse der
Variable-Font *Anybody* liefert den „crushed“ Schnitt der Display-Typografie.

Sechs Seiten: Bogen, Sorten (mit Mischpult für die fünfzehn abgefüllten Paare),
Manufaktur, Kiosk (mit Kistenrechner für Ware und Pfand), Impressum,
Datenschutz. Mischpult und Rechner laufen ausschließlich im Browser und haben
einen Fallback ohne JavaScript.

### 12 — VEHRING Orgelbau

`MXL-007` („Datalands“, *Black cathedral*) verlangt eine monumentale Wortmarke,
Mono-Metadaten und weiche Kapselkontrollen auf einem zweistufigen Schwarzsystem,
mit einem einzigen, streng rationierten Akzent.

Übersetzt in eine Orgelbauwerkstatt: Die Seite ist ein Kirchenraum nach
Einbruch der Dunkelheit. Der Prospekt aus 25 Zinnpfeifen ist kein Bild —
jede Pfeife ist ein Element mit Zylinderverlauf über die Breite, Spekularstrich
und Labium; Höhe und Breite kommen aus `--h` und `--w`. Das Rosa der Referenz
erscheint nur an vier Stellen: Fokus, aktive Seite, eine Hauptaktion und die
Pfeifen, die gerade klingen.

Sechs Seiten. Der **Registerzug** auf `disposition.html` schaltet 24 Register
und rechnet Pfeifenzahl und Windbedarf mit: Volles Werk verlangt 45,6 m³/min,
das Gebläse liefert 42 — die Tafel sagt das auch. Gezogene Prospektregister
lassen die zugehörigen Pfeifen im Prospekt aufleuchten. Der **Mensurrechner**
auf `verfahren.html` rechnet aus Taste und Fußtonlage die klingende Frequenz
und die Länge der offenen Labialpfeife (halbe Wellenlänge bei 20 °C) samt
Mündungskorrektur.

## Technische Leitplanken

Es gelten dieselben Regeln wie für `showcase/`:

- Statische Multipage-Sites aus HTML, CSS und JavaScript, ohne Build
- Je Website eigenes Stylesheet, eigenes Script, eigene Assets
- Lokale Schriften (`scripts/fetch-fonts.mjs`), keine Laufzeitanfragen an Dritte
- Keine Tracker, Cookies oder eingebetteten Fremddienste
- Semantisches HTML, Skip-Link, sichtbare Fokuszustände, `prefers-reduced-motion`
- Desktop und Mobil geprüft; Touch-Ziele mindestens 44 px
- Fiktive Firmen und Inhalte mit sichtbarer Demo-Kennzeichnung
- Muster-Impressum und Muster-Datenschutz ohne Rechtswirkung
