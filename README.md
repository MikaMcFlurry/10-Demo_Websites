# 10 Demo Business Websites (DE/EU-Ready)

A collection of 10 premium, minimal business website templates — static HTML/CSS/JS, ready for GitHub Pages deployment. Each demo includes German (default) and English versions, EU/DE legal placeholders, and mobile-first responsive design.

## Demos

| # | Slug | Business Type |
|---|------|---------------|
| 1 | `cafe-restaurant` | Café / Restaurant |
| 2 | `electrician` | Elektriker |
| 3 | `physiotherapy` | Physiotherapie |
| 4 | `barber-salon` | Friseur / Barbershop |
| 5 | `tax-advisor` | Steuerberater |
| 6 | `fitness-pt` | Fitnessstudio / Personal Training |
| 7 | `real-estate` | Immobilienmakler |
| 8 | `event-dj` | Event DJ / Hochzeit |
| 9 | `auto-repair` | KFZ Werkstatt |
| 10 | `coaching` | Coaching / Beratung |

## Deploy on GitHub Pages

1. **Fork or clone** this repository.
2. Go to **Settings → Pages** in your GitHub repo.
3. Under **Source**, select the branch (e.g. `main`) and folder (`/ (root)`).
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.
5. Each demo is accessible at `/demos/<slug>/` (German) or `/demos/<slug>/en.html` (English).

## Customize Copy & Branding

Each demo lives in `/demos/<slug>/` with this structure:

```
demos/<slug>/
├── index.html        # German version
├── en.html           # English version
└── assets/
    ├── styles.css    # All styles for this demo
    ├── app.js        # Minimal JS (menu, cookie banner, FAQ)
    └── logo.svg      # Simple inline SVG logo
```

### Quick Customization Steps

1. **Business name & copy**: Search and replace the placeholder business name in both `index.html` and `en.html`.
2. **Colors**: Open `assets/styles.css` and change the CSS custom properties at the top (`:root { --primary: ...; --accent: ...; }`).
3. **Logo**: Replace `assets/logo.svg` or edit the inline SVG.
4. **Images**: Replace the placeholder hero/gallery sections with real `<img>` tags pointing to your images.
5. **Contact**: Update the `mailto:` link and optional form action URL in the contact section.
6. **Legal**: Fill in the Impressum and Datenschutzerklärung with real legal text. See `LEGAL_TEMPLATE.md`.
7. **JSON-LD**: Update the structured data in the `<script type="application/ld+json">` block with real business details.
8. **SEO**: Update `<title>`, `<meta name="description">`, and Open Graph tags.

## Legal Notice

All legal sections (Impressum, Datenschutzerklärung, Cookie consent) contain **placeholders only**. They are **not** legally binding and **must be reviewed and customized** by a qualified legal professional before going live. See [LEGAL_TEMPLATE.md](LEGAL_TEMPLATE.md) for details.

## Technical Details

- **No external dependencies**: No CDNs, no remote fonts, no frameworks.
- **System fonts**: Uses the native font stack for maximum performance.
- **Mobile-first**: Responsive layouts using CSS Grid and Flexbox.
- **Accessible**: Semantic HTML, ARIA labels, focus states, skip-to-content links.
- **Fast**: Minimal JS — only for mobile menu toggle, cookie banner, and FAQ accordions.

## License

These templates are provided as starting points for client projects. Customize freely.
