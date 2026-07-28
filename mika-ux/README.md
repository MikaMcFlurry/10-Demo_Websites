# Sammlung C — Ableitungen aus der Mika UX Library

Websites, deren Gestaltung aus der **Mika UX Library** abgeleitet ist: einem
Bestand kuratierter Referenzen (`MXL-001` bis `MXL-120`, `MXL-145` sowie später
nachgelieferte Einträge wie `MXL-147`).
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

`scripts/pruefe-seiten.mjs` prüft zusätzlich im Browser: Konsolenfehler,
fehlende Ressourcen, horizontaler Überlauf und Zielgrößen unter 44 px — je
Seite auf 1440 px und 390 px.

**Zur Belastbarkeit der Vorlagen.** Einträge mit `method: curated` beschreiben
die gestalterische Idee einer Quelle. Einträge mit `method: css-dom` sind aus
Stylesheet und DOM erhoben und liefern präzisere Tokens, können aber alles
übersehen, was erst zur Laufzeit entsteht — siehe den Nachtrag zu `MXL-147`
weiter unten. Wo beide Methoden dieselbe Quelle beschreiben, ergänzen sie
einander: die eine liefert die Erfahrung, die andere die Zahlen.

## Aktueller Stand

| # | Site | Branche | Form | Schriften | Herkunft |
|---:|---|---|---|---|---|
| 11 | [`sprudelwerk`](sprudelwerk/) | Getränke | Aufkleberbogen mit aufgeblasenen Bändern | Anybody, Figtree | `MXL-051` |
| 12 | [`vehring-orgelbau`](vehring-orgelbau/) | Handwerk | Schwarze Kathedrale mit Zinnprospekt | Unbounded, Instrument Sans, Spline Sans Mono | `MXL-007` |
| 13 | [`saatgutarchiv`](saatgutarchiv/) | Landwirtschaft | Bestandskatalog als öffentlicher Dienst | Public Sans, IBM Plex Mono | `MXL-118` + `MXL-090` + `MXL-113` |
| 14 | [`geburtshaus-uferwiese`](geburtshaus-uferwiese/) | Gesundheit | Geflüsterte Serif über Pastellhimmel | Cormorant Garamond, Karla | `MXL-068` + `MXL-079` + `MXL-050` |
| 15 | [`nereus-tiefsee`](nereus-tiefsee/) | Forschung | Choreografierter Abstieg durch die Wassersäule | Space Grotesk, Space Mono | `MXL-040` |
| 16 | [`schwarzwerk-presswerk`](schwarzwerk-presswerk/) | Fertigung | Reines Schwarz, ein Rot, schmale Spalte | Baloo 2, Inter Tight | `MXL-147` |
| 17 | [`wolkenkamm`](wolkenkamm/) | Buntpapier | Gerechnetes Marmorierbad unter Plakattype | Lexend Exa, Familjen Grotesk, Fragment Mono | `MXL-022` + `MXL-040` |

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

### 13 — Saatgutarchiv Zollernalb

Die erste Mischung der Sammlung. Drei Vorlagen mit je einer klar getrennten
Aufgabe — sie lassen sich überhaupt nur mischen, weil alle drei dieselbe warme
Papierfläche teilen (`#F7F5EF` / `#FFFFFF` / `#11130F` / `#72776D`).

| Vorlage | Beitrag |
|---|---|
| `MXL-118` GOV.UK Design System — *Accessible public-service system* | Die Dienstarchitektur: dauerhaft sichtbare Suche, Filter und Ergebniszahl, ausformulierter Leerzustand, an jedem Datensatz Herkunft, Nutzungshinweis und Stand. Blau (`#1d70b8`) ist Interaktions- und Fokusfarbe. |
| `MXL-090` Ventriloc — *Warm-paper data observatory* | Die Datenkarte: monospaced Werte, asymmetrische Radien (`16px 16px 16px 3px`) und genau ein orangefarbener Ember (`#ff6a2b`) als Zustandssignal. |
| `MXL-113` Fonts In Use — *Applied typography archive* | Das Katalogrückgrat: kompakte Dichte, stabile Taxonomie, Schwarz auf warmem Papier als eigentliche Aussage. |

Übersetzt in eine Erhaltungsinitiative für regionale Sorten: 24 Akzessionen mit
Keimfähigkeit, Bestand, letztem Nachbau und Herkunft. Der Ember erscheint
ausschließlich für „Nachbau fällig“ — unter 70 % Keimfähigkeit oder fünf Jahre
seit dem letzten Nachbau; das trifft derzeit elf der 24 Akzessionen. Der Status
(Abgabe möglich / nur Vermehrung / gesperrt) folgt der Abgabeordnung.

Sechs Seiten: Archiv, Bestand (Filter nach Volltext, Art, Status und
Nachbaubedarf), Abgabe, Vermehrung, Impressum, Datenschutz. Der Katalog steht
vollständig im HTML; das Skript blendet nur aus. Ohne JavaScript bleiben alle
24 Datensätze lesbar, und die Filterleiste bleibt verborgen, statt eine
Bedienung vorzutäuschen, die nichts tut.

### 14 — Geburtshaus Uferwiese

Die zweite Mischung. Wieder drei Vorlagen mit getrennten Aufgaben, wieder auf
gemeinsamer warmer Grundfläche.

| Vorlage | Beitrag |
|---|---|
| `MXL-068` Handhold — *Whispered serif parchment* | Die Stimme: leichte Serif in 300, Hairlines, keine Farbe, viel Weißraum. Alles Ruhige kommt von hier. |
| `MXL-079` Beautiful — *Warm Sunday kitchen* | Die Wärme: Elfenbein statt Weiß, schwarze Hairlines, genau ein rationiertes Korall (`#fa7864`). Häuslich statt klinisch. |
| `MXL-050` Geniestudio — *Pastel sky design canvas* | Der Himmel: eine einzige große Pastellfläche mit 32px-Radien und schwarzen, klaren Aktionen darauf. Sonst nirgends. |

Übersetzt in ein hebammengeführtes Geburtshaus. Der **Terminrechner** rechnet
nach der Naegele-Regel mit Zykluskorrektur (280 Tage ab erstem Tag der letzten
Regelblutung, plus Abweichung der Zykluslänge von 28), zeigt die aktuelle
Schwangerschaftswoche in der Form `24+3` und die Lage auf einem
Vierzig-Wochen-Bogen mit drei Trimesterbändern und einem Korallzeiger.

Der Ton ist bewusst zurückhaltend: Die Seite nennt die Verlegungsrate, sagt
beim Termin, dass nur etwa vier von hundert Kindern an ihm zur Welt kommen, und
weist an jeder gesundheitsbezogenen Stelle darauf hin, dass sie keine Beratung
ersetzt. Die Eingaben des Rechners sind Gesundheitsdaten nach Art. 9 DSGVO —
deshalb hat er keinen Absenden-Knopf und verarbeitet ausschließlich im Browser.

Fünf Seiten: Das Haus, Begleitung, Termin, Impressum, Datenschutz.

### 15 — NEREUS Tiefseeforschung

`MXL-040` („The Monolith Project“, *Interactive sci-fi artifact*) verlangt eine
choreografierte Szene mit stabilem Interaktionsanker, dauerhaft sichtbarem
Fortschritt, einer Tonsteuerung im Opt-in, einem stillen Textpfad für Tastatur
und Screenreader — und ausdrücklich **kein Scroll-Jacking**.

Übersetzt in einen Tauchgang: Die Seite ist die Wassersäule. Gescrollt wird
ganz normal; ein IntersectionObserver liest, welche Zone im Blick ist, und die
Szene reagiert darauf, statt den Scroll zu übernehmen.

- **Der Anker** ist die Tiefenschiene links: Tiefe in Metern, Zonenname und
  fünf Sprungziele, immer sichtbar. Unter 1101px wird sie zur waagerechten
  Leiste; der Inhalt bleibt derselbe.
- **Die Kulisse** ist eine feste Fläche, deren Farbe über `--tiefe` von der
  Lichtzone bis ins Abyssal wandert. Sie trägt nie Information — jede Zone
  steht zusätzlich als Text und als Zahlenzeile.
- **Der Ton** wird im Browser erzeugt: zwei Sinusgeneratoren durch ein
  Tiefpassfilter, keine Audiodatei, keine Netzwerkanfrage. Standardmäßig aus,
  nur per Klick anschaltbar, Zustand als Text neben dem Symbol. Mit
  wachsender Tiefe wird der Ton dumpfer.
- **Reduced Motion** entfernt Meeresschnee, Farbüberblendung und weiches
  Scrollen; die Tiefenanzeige springt dann hart auf ihren Wert.

Der **Druckrechner** auf `fahrzeug.html` rechnet für 0 bis 11.000 Meter
Umgebungsdruck (rund 1 bar je 9,9 m Seewasser), eine Näherung der Temperatur
und die Lichtabnahme (etwa eine Zehnerpotenz je 75 m) — und zeigt, welches der
fünf Fahrzeuge die eingestellte Tiefe noch erreicht. Auf 8.200 Metern ist das
nur noch der Lander.

Fünf Seiten: Abstieg, Fahrzeuge, Fahrtenbuch, Impressum, Datenschutz.

### 16 — SCHWARZWERK Presswerk

`MXL-147` („The Monolith Project“, *Choreographed interactive experience*) ist
der einzige Eintrag der Sammlung, der per CSS-/DOM-Forensik erhoben wurde
(Methode `css-dom`, Confidence 94) und deshalb ungewöhnlich konkrete Werte
mitbringt. Genau die tragen diese Seite, unverändert übernommen:

| Token | Wert | Verwendung hier |
|---|---|---|
| Canvas | `#000000` | die Fläche — reines Schwarz, nicht fast-schwarz |
| Surface | `#383A3E` | Panels und Datenblöcke |
| Ink | `#FFFFFF` | Text |
| Signal | `#FF002F` | genau ein Rot: aktive Station, Hauptaktion, Fokus |
| Support | `#FFF6DF`, `#FFEBBC` | Label und Messwerte |
| Display | Baloo 2 | jede Überschrift, nie der Fließtext |
| Container | 975px | die schmale Spalte, auch der Umbruchpunkt |
| Radius | 0 · .25rem · 4px | sonst nichts |
| Schatten | `0 4px 74px #7e2d2d87` | die einzige Tiefe der Seite |

Übersetzt in ein Presswerk für Schallplatten: Schwarz ist die Platte, Creme das
Label, Rot der Aufdruck. Die Vorlage verlangt **Bewegung als strukturelles
Navigationsmittel** — hier dreht sich die Platte deshalb nicht dauerhaft,
sondern macht bei jedem Stationswechsel genau eine Umdrehung und steht danach
wieder still. Das markiert den Sprung durch die Fertigung, hält das Label
lesbar und braucht keine Pause-Steuerung, weil nichts dauerhaft läuft.

> **Nachtrag zur Vorlage — Grenze der CSS-/DOM-Forensik.**
> Die Quelle von `MXL-147` ist [themonolithproject.net](https://themonolithproject.net/):
> eine kinematische WebGL-Reise mit Three.js, React Three Fiber und GSAP, die
> von handgezeichneten 2D-Skizzen in vollständig beleuchtete 3D-Szenen
> übergeht — mit Shader-Übergängen, GPU-Partikeln, Masken-Reveals, Ton und
> Kapiteldramaturgie. Sie wurde am 26. November 2025 Awwwards Site of the Day;
> die Teilnote für Animation und Übergänge liegt bei 9,00 von 10.
>
> Die Erhebung von `MXL-147` erfolgte per `css-dom` und vermerkt selbst
> „0 Bilder · 1 Videos · 0 Canvas“. Der Canvas wird von React Three Fiber erst
> zur Laufzeit eingehängt und war für die Forensik deshalb unsichtbar. Die
> Spezifikation beschreibt damit zuverlässig die **Chrome** der Quelle —
> Farbrollen, Schrift, Spaltenbreite, Radien, Schatten — aber nicht ihre
> **Erfahrung**.
>
> SCHWARZWERK setzt die dokumentierten Tokens korrekt um. Es setzt jedoch
> nicht um, was die Quelle eigentlich ausmacht, weil das in `MXL-147` nicht
> steht. Wer die Erfahrung sucht, findet sie in der kuratierten Schwester-
> spezifikation `MXL-040` derselben Quelle — dort steht sie ausdrücklich
> („Jede Berührung verändert eine illustrierte WebGL-Welt“) — und in
> `mika-ux/nereus-tiefsee/`, das genau darauf gebaut ist.

Der **Laufzeitrechner** beantwortet die häufigste Frage an ein Presswerk: Passt
diese Seite? Aus Format (12″/10″/7″), Drehzahl (33⅓/45) und Spielzeit folgen die
komfortable und die harte Grenze sowie die Pegelreserve — über der harten Grenze
nennt er bewusst keine Zahl mehr, weil dann nicht geschnitten wird.

Fünf Seiten: Werk, Laufzeit, Auflage, Impressum, Datenschutz.

### 17 — WOLKENKAMM Werkstatt für Marmorpapier

Die dritte Mischung — und die erste Website des Portfolios, die etwas
rechnet. Zwei Vorlagen mit strikt getrennten Aufgaben:

| Vorlage | Beitrag |
|---|---|
| `MXL-022` Martin Laxenaire — *Kinetic print poster* | Die Welt: warmes Papier `#F7F5EF`, monumentale Display-Type über einer wirklich gerechneten Fläche, winzige Mono-Marginalien, streng rationiertes Rosa, Plakatplatte mit Papierrand. Typografische Komposition zuerst, UI danach. |
| `MXL-040` The Monolith Project — *Interactive sci-fi artifact* | Der Interaktionsvertrag: Canvas bleibt Hintergrund oder Beweis, nie die einzige Navigation; Fallback-Poster aus CSS ohne JavaScript; stiller Textpfad über Statusregionen und Werkstattzettel; kein Scroll-Jacking; `prefers-reduced-motion` ersetzt die Schöpf-Choreografie durch den fertigen Bogen. Schafft das Gerät die Choreografie nicht (etwa Software-Rendering oder gedrosselte CPU), erkennt die Seite das und schaltet hart auf den fertigen Bogen. |

Warum diese Kombination: `MXL-022` beschreibt eine Welt, aber keine
Choreografie — und kinetische Typografie geht fast nie zugänglich in
Produktion. `MXL-040` ist genau der fehlende Vertrag; seine Ästhetik bleibt
draußen, die kommt vollständig aus `MXL-022`.

Übersetzt in eine Werkstatt für Marmorpapier in Aschaffenburg — anderthalb
Jahrhunderte Stadt des Buntpapiers, bis die letzte Fabrik 1972 schloss. Die
These der Website: Kein Bogen zweimal. Die erste Bildschirmseite ist ein
tatsächlich gerechnetes Marmorierbad; jeder Aufruf schöpft einen nummerierten
Bogen, den es kein zweites Mal gibt. Verweigert wird das Kategorie-Übliche —
Foto-Hero, Claim, zwei Knöpfe.

**Das Marmorieren ist echt gerechnet, ohne Abhängigkeit.** Tropfen, Kamm-,
Wirbel- und Wellenzüge sind exakt invertierbare Abbildungen der Badebene
(Verdrängungsmodell). Gerendert wird rückwärts: Für jedes Pixel werden die
Arbeitsschritte in umgekehrter Reihenfolge zurückgerechnet, bis ein Tropfen
trifft — per WebGL-Fragment-Shader, mit identischer Mathematik als
2D-Canvas-Fallback. Der Werkstattzettel des Bades ist zugleich das Protokoll
der Rechnung: Jeder notierte Handgriff ist ein Term der Abbildung, und
„Zurück“ nimmt ihn wieder heraus.

Fünf Seiten: Werkstatt, Marmorierbad (Farben streuen, Kämme ziehen,
Werkstattzettel mit Zurücknehmen, Bogen-Abnahme als PNG, Badrechner),
Musterbuch (sechs Klassiker von Steinmarmor bis Bukett mit generierter
Schrittfolge), Impressum, Datenschutz. Alles läuft ausschließlich im
Browser; der abgenommene Bogen verlässt das Gerät nicht.

> **Anmerkung zur Belastbarkeit der Musterbögen.** Die Kacheln des
> Musterbuchs rechnen mit festgehaltener Saat. Überlagerte Schneckenzüge
> sind keine Isometrie — je nach Saat können sie das schmale Kachelfenster
> fast vollständig in unbetropftes Bad abbilden (gemessen: 41 bis 100 %
> Grundanteil). Die Saat der Schnecken-Kachel ist deshalb numerisch und mit
> eigenen Augen geprüft; auf Plakat und Wanne ist das Rezept in jeder Saat
> gesund.

**Zur Entstehung.** Diese Website ist der Fable-5-Test des Portfolios: Auswahl
der Vorlagen, Konzept, Marmorierverfahren, Shader, Seiten und Texte stammen
aus einer Fable-Sitzung, nicht aus dem Hauptmodell. Der Kern entstand in einer
ersten Sitzung, die vorzeitig endete; Fehlerbehebung, Musterseiten und
Einbindung in die Startseite kamen aus einer zweiten Fable-Sitzung ohne den
Kontext der ersten. Das Hauptmodell hat den Zwischenstand gesichert, das
Briefing gestellt und am Ende gegengeprüft — gebaut hat es die Seite nicht.

Externe Quellen über die Library hinaus:

- **A. Jaffer, „Mathematical Marbling“** —
  [people.csail.mit.edu/jaffer/Marbling/](https://people.csail.mit.edu/jaffer/Marbling/):
  Quelle des Marmorierverfahrens (Verdrängungsmodell und invertierbare
  Züge); dazu S. Lu, A. Jaffer, X. Jin, H. Zhao, X. Mao: „Mathematical
  Marbling“, *IEEE Computer Graphics and Applications* 32(6), 2012.
- **martin-laxenaire.fr** — Primärquelle von `MXL-022`.
- **themonolithproject.net** — Primärquelle von `MXL-040`.
- **styles.refero.design** — Analysequelle von `MXL-022`.
- **fonts.google.com** — Lexend Exa, Familjen Grotesk und Fragment Mono,
  per `scripts/fetch-fonts.mjs` lokal abgelegt (SIL OFL 1.1); zur Laufzeit
  wird nichts geladen.

Musternamen und Handgriffe (Gel-Git, Nonpareille, Schneckenmarmor, Bukett)
folgen der Literatur zum Buchbinderhandwerk und sind vereinfacht; die
Rezeptwerte des Badrechners sind vereinfachte Literaturwerte.

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
