# BLANK Oberflächentechnik — Gestaltungssystem

Gilt nur für `mika-ux/blank-oberflaechen/`. Nichts hiervon erbt vom
Portfolio-Hub oder von anderen Websites der Sammlung.

## Vorlage

`MXL-045` „Hyper Tria — Chrome monolith gallery“ (Refero-Analyse von
hypertria.com). Der Vertrag: massive Chrom-Typografie auf Nacht-Canvas
eröffnet, dann ein harter Schnitt — kein Übergang — in eine weiße,
messerscharfe Galerie. `theme: mixed` ist die Struktur, nicht ein Farbmodus.

## Die zwei Welten

| Rolle | Wert | Verwendung |
|---|---|---|
| Nacht-Canvas | `#0A0B0A` | Eröffnungsszene und Fuß — die dunkle Klammer |
| Papier-Canvas | `#F4F1E9` | Galerie und alle Unterseiten — die helle Halle |
| Tinte | `#11130F` | Text auf Papier |
| Licht | `#F4F1E9` | Text auf Nacht |
| Gedeckt (Papier) | `#5f5d54` | Sekundärtext, warm getönt, nie neutralgrau |
| Gedeckt (Nacht) | `#8b8d86` | Sekundärtext auf dunkler Fläche |
| Signal | `#ff342e` | Streng rationiert: Fokus, eine Hauptaktion je Seite, der rote Reflexstreifen im Chrom |

Das Signal existiert in der Chromfläche **nur als reflektierter
Lichtstreifen** — nie als Fläche im dunklen Teil. Auf Papier trägt es
Fokusring, aktive Navigationsmarke und genau eine Aktion.

Abstand zu `schwarzwerk-presswerk` (Signal `#FF002F`): dort reines Schwarz,
975px-Spalte, runde Display-Schrift; hier Full-bleed-Szenen, breite Galerie,
expandierte Grotesk. Der Abstand liegt in Struktur und Typografie.

## Typografie

- **Display:** Archivo (variabel, `wdth` 62–125, `wght` 100–900) als
  metrisch verwandte Aeonik-Alternative. Galerie-Titel expandiert
  (`font-stretch` ≥ 115 %), eng gespurt (Untergrenze −0.04em).
- **Body/UI:** Archivo 400/500 in Normalbreite, 15–18px, Zeilenhöhe 1.5–1.7.
- **Mono:** Fragment Mono 400 ausschließlich für Messwerte, Normen,
  Positionsangaben und technische Labels — nie als Kostüm.

## Raster und Rhythmus

- Szenen full-bleed; statischer Inhalt in einem 1260px-Sicherheitsraster.
- Abschnittsrhythmus 96–160px; Basisschritt 8px.
- Radius 10px für Panels und Medien, 999px für kompakte Aktionen. Sonst nichts.
- 1px-Hairlines mit niedrigem Kontrast strukturieren die Galerie;
  Tiefe entsteht aus Flächenwerten, nicht aus Schatten.

## Die gerechnete Fläche

Der Chrom der Wortmarke ist rohes WebGL ohne Abhängigkeit: ein Höhenfeld aus
dem gerenderten Schriftzug, Normalen aus dem Gradienten, Reflexion eines
prozeduralen Studio-Environments (Softbox-Bänder, ein roter Streifen).
Vertrag nach MXL-040/045: Canvas ist Hintergrund und Beweis, nie Navigation;
Poster-Fallback (CSS-Chromverlauf) ist zugleich Ladezustand; Skip-Aktion in
die Galerie; Zustand der Fläche steht als Text daneben. Es gibt eine
Bewegungslogik: die Rotation des Environments (Zeiger plus langsame Drift),
anhaltbar per Taste. `prefers-reduced-motion` ersetzt sie durch genau ein
stehendes Bild — das Material bleibt, die Bewegung nicht.

## Bewegung

Eine autorisierte Bewegung je Welt: im Dunkel die Environment-Drift, im
Hellen der Maßstabswechsel des Schichtaufbaus (exponentielles Ease-out).
Keine Scroll-Entrances, kein Parallax, kein Scroll-Jacking.

## Ton der Inhalte

Zahlen, die stimmen könnten; Grenzen, die benannt werden. Die Seite sagt, was
sie nicht macht (Aluminium, Kunststoffgalvanik, Eilaufträge), nennt die
Abwasserwerte und erklärt die REACH-Lage von Chrom(VI) ohne Beschönigung.
