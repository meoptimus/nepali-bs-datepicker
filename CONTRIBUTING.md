# Contributing

Thanks for helping! Bug reports, calendar corrections and pull requests are all welcome.

## Setup

```bash
npm install
npm test        # validates the calendar table and runs the unit tests
npm run build   # regenerates dist/
```

Edit `src/` only; `dist/` is generated. Please include `dist/` changes in release commits only.

## Updating the Bikram Sambat calendar

The month lengths live in the `BS_CALENDAR.years` table at the top of `src/nepali-datepicker.js`,
one row per year:

```js
2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
```

- **Correcting a year:** edit its row. Every later date shifts accordingly, which is expected.
- **Adding a year:** append a row after the last year. Years must be contiguous.
- **Adding years before 1970:** add the rows and change `epoch` to the AD date of 1 Baisakh of the new
  first year.

In the pull request, link the source of the data (the official Panchanga published by the Nepal
Panchanga Nirnayak Samiti, or another authoritative calendar), then run `npm test`. The checker fails on
malformed rows and warns about years that are not 365 or 366 days long.

## Themes

Each theme is `src/themes/<name>.css` and contains only CSS custom properties; `src/themes/_template.css` holds
the shared rules and `npm run build` combines them. Copy an existing theme to start a new one, then check it on
`docs/index.html`.

## Browser checks

Serve the repository (any static server), open `docs/index.html` and paste `test/browser-check.js` into the
console. It resolves to a summary of 72 checks covering every demo, theme and digit mode.

## Code style

- Match the surrounding code: tabs, ES5 syntax (no build step for the plugin itself), jQuery idioms.
- Keep the DOM structure and CSS class names identical to bootstrap-datepicker so its stylesheets keep working.
- Add or update a test in `test/` for every bug fix or feature.

## Reporting bugs

Please include the plugin version, jQuery version, browser, your timezone, the options you passed, and the
BS/AD dates involved.
