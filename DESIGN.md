# Portfolio Hub Design

## Scope

This document governs only the repository root portfolio index. Every showcase below `showcase/` is an intentionally independent visual world and must not inherit these rules.

## Direction

The hub behaves like a large-format exhibition index: ten works, shown as ten full-width plates rather than a dashboard of interchangeable cards. A visitor should understand the collection’s range before reading any description.

## Palette

- Carbon: `#11110f`
- Exhibition paper: `#f2efe6`
- Chalk: `#fffdf7`
- Acid marker: `#d7ff37`
- Cobalt: `#3f55ff`
- Vermilion: `#ff5538`

Large regions own one color. Acid is reserved for active links, the current collection marker, and small navigational cues.

## Typography

The hub uses locally available sans-serif system faces. Display text is dense, heavy, and tightly tracked; body text is neutral and highly legible. Project-specific typography appears only inside each project’s CSS preview specimen.

## Composition

- The first viewport is a poster: the number ten, the statement “Zehn Websites. Kein Template.”, and a concise collection ledger.
- Each collection has five alternating horizontal project plates.
- Every plate pairs project-specific copy with a CSS-authored specimen; dimensions and internal composition differ by project.
- The archive is a native `details` disclosure at the end, never a competing visible gallery.

## Behavior

Project plates move only on deliberate hover/focus, with content visible by default. Native disclosure and links remain fully usable without JavaScript. Motion is removed under `prefers-reduced-motion`.

## Responsive Rules

Below 800px, plates become a single reading column with the specimen following its title. Display sizes reduce without changing hierarchy. The archive becomes a plain one-column list, and all touch targets remain at least 44px.
