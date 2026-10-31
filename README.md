# Nepali Datepicker

A Bikram Sambat (BS / Nepali calendar) datepicker for jQuery.

It is a port of [bootstrap-datepicker](https://github.com/uxsolutions/bootstrap-datepicker) v1.10.1 that keeps
the same markup, options, methods and events — so the **official bootstrap-datepicker stylesheets work
unchanged** — while every view (days, months, years, decades) is in Bikram Sambat.

- Self-contained: one JavaScript file, only depends on jQuery (1.12 – 4.x)
- Built-in BS ↔ AD conversion for BS 1970 – 2100, with an easy-to-update month table
- Full `format` support (`d dd D DD m mm M MM yy yyyy`) for display and parsing
- Nepali (Devanagari) and English locales; १ २ ३ numerals in the calendar while input values stay 0-9
- Four themes (material, nepal, minimal, dark) built on CSS custom properties
- Date ranges, multiple dates, month/year pickers, disabled dates, keyboard navigation
- Works in every timezone

## Install

### CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@meoptimus/nepali-bs-datepicker@2.0.2/dist/css/bootstrap-datepicker3.standalone.min.css">
<!-- optional themes -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@meoptimus/nepali-bs-datepicker@2.0.2/dist/css/nepali-datepicker-themes.min.css">

<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@meoptimus/nepali-bs-datepicker@2.0.2/dist/js/nepali-datepicker.min.js"></script>
```

The same paths work on unpkg (`https://unpkg.com/@meoptimus/nepali-bs-datepicker@2.0.2/...`).

A complete page using only CDN files: [docs/cdn-example.html](docs/cdn-example.html)
([live](https://meoptimus.github.io/nepali-bs-datepicker/docs/cdn-example.html)).

### npm

```bash
npm install @meoptimus/nepali-bs-datepicker jquery
```

### Download

Copy `dist/js/nepali-datepicker.min.js` and a stylesheet from `dist/css/`. Use `bootstrap-datepicker3*.css` with
Bootstrap 3+, `bootstrap-datepicker*.css` with Bootstrap 2, and the `.standalone` variants when Bootstrap itself is not
on the page. They are the unmodified upstream 1.10.1 stylesheets.

## Themes

```js
$('#dob').npdatepicker({ theme: 'nepal' });      // material | nepal | minimal | dark
$('#dob').npdatepicker('setTheme', 'dark');
```

Load `dist/css/nepali-datepicker-themes.css` (all) or `dist/css/themes/<name>.css` after the base stylesheet. Themes
are CSS custom properties, so `.npdatepicker-theme-nepal { --npdp-accent: #0b6e4f; }` re-colours one, and a new
theme is a single file in `src/themes/`.

## Usage

```html
<input id="dob">
<script>
  $('#dob').npdatepicker();                                   // Nepali UI, value as 2083-07-15
  $('#dob').npdatepicker({ language: 'en', format: 'd MM yyyy' }); // "15 Kartik 2083"
</script>
```

Without JavaScript, add `data-provide="npdatepicker"` (or `npdatepicker-inline` on a `div`) and configure with
`data-date-*` attributes:

```html
<input data-provide="npdatepicker" data-date-format="dd/mm/yyyy" data-date-today-btn="linked">
```

Component and range markup are the same as bootstrap-datepicker:

```html
<div class="input-group date">
  <input type="text" class="form-control">
  <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
</div>

<div class="input-group input-daterange">
  <input type="text" class="form-control"> <span class="input-group-addon">to</span>
  <input type="text" class="form-control">
</div>
```

Open `docs/index.html` for live demos of every feature and `docs/documentation.html` for the full reference.

## Dates: BS strings in, AD `Date` objects out

| Where | BS string (in `format`) | `Date` object |
|---|---|---|
| Input value, `setDate('2083-07-15')`, `startDate`, `endDate`, `datesDisabled`, `defaultViewDate` | yes | — |
| `setDate(date)`, `startDate`, `endDate`, `defaultViewDate` | — | interpreted as an **AD** date |
| `getDate()`, `getDates()`, `e.date`, `e.dates`, `beforeShowDay(date)` | — | the **AD** date |
| `getBsDate()`, `getBsDates()`, `e.bsDate`, `e.bsDates`, 2nd arg of `beforeShowDay` | `{year, month, day}` (month 1–12) | — |

`defaultViewDate` also accepts `{year, month, day}` in BS, with a **0-based** month as in bootstrap-datepicker.
Strings may use Latin (`2083`) or Devanagari (`२०८३`) digits.

## Options

All [bootstrap-datepicker options](https://bootstrap-datepicker.readthedocs.io/en/stable/options.html) are
supported. Differences and additions:

| Option | Default | Notes |
|---|---|---|
| `format` | `'yyyy-mm-dd'` | BS tokens: `d`, `dd` day; `D`, `DD` weekday; `m`, `mm` month number; `M`, `MM` month name; `yy`, `yyyy` year. A `{toDisplay, toValue}` object also works. |
| `language` | `'np'` | `'np'` (alias `'ne'`) or `'en'`. Add your own in `$.fn.npdatepicker.dates`. |
| `unicodeDigits` | `true` | Show Devanagari numerals (१ २ ३) in the calendar for the `np` locale; `false` shows 0-9. The input value always uses 0-9. |
| `theme` | `''` | `'material'`, `'nepal'`, `'minimal'`, `'dark'` or your own; needs the themes stylesheet. |
| `pickerClass` | `''` | Extra class(es) for the picker element. |
| `autoclose` | `true` | (upstream: `false`) |
| `todayHighlight` | `true` | (upstream: `false`) |
| `startDate` / `endDate` | calendar limits | Clamped to the range the calendar data covers. |
| `assumeNearbyYear` | `false` | Two-digit years are completed relative to the current **BS** year. |
| `calendarWeeks` | `false` | Week numbers are ISO weeks of the AD date. |

## Methods and events

Same as bootstrap-datepicker (`show`, `hide`, `update`, `destroy`, `setDate`, `setDates`, `getDate`,
`setStartDate`, `setDatesDisabled`, …) plus `getBsDate`, `getBsDates`, `setTheme` and `setUnicodeDigits`. Call them as
`$(el).npdatepicker('method', args…)`.

Events (`show`, `hide`, `changeDate`, `clearDate`, `changeMonth`, `changeYear`, `changeDecade`,
`changeCentury`, `changeViewMode`) carry `e.date`, `e.dates`, `e.bsDate`, `e.bsDates` and `e.format([ix], [format])`.

```js
$('#dob').npdatepicker().on('changeDate', function (e) {
  console.log(e.format());          // "2083-07-15"
  console.log(e.bsDate);            // {year: 2083, month: 7, day: 15}
  console.log(e.date);              // Sat Oct 31 2026 00:00 (AD, local time)
});
```

## Converting dates without the picker

```js
var cal = $.fn.npdatepicker.calendar;
cal.toBS(new Date(2026, 9, 31));  // {year: 2083, month: 7, day: 15}
cal.toAD(2083, 7, 15);            // Date: 2026-10-31 (local midnight)
cal.today();                      // today in BS
cal.daysInMonth(2083, 3);         // 32
cal.isValid(2083, 4, 32);         // false
cal.range();                      // {minYear: 1970, maxYear: 2100}
$.fn.npdatepicker.DPGlobal.formatDate(utcDate, 'd MM yyyy', 'np');
```

## Keeping the calendar up to date

BS month lengths are set each year by the Nepal Panchanga Nirnayak Samiti, so the data needs occasional
updates. All of it lives in one table at the top of `src/nepali-datepicker.js`:

```js
years: {
    // Year: [Bai, Jes, Asa, Shr, Bha, Ash, Kar, Man, Pou, Mag, Fal, Cha]
    2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    ...
}
```

1. Change or append the row for the year (years must stay contiguous).
2. Run `npm test` — it validates the table and checks conversions.
3. Run `npm run verify-calendar -- <year>` to compare the row with hamropatro.com (optional, needs internet).
4. Run `npm run build` and open a pull request (see [CONTRIBUTING.md](CONTRIBUTING.md)).

Rows 2000–2100 were checked month by month against hamropatro.com in Kartik 2083 (October 2026).

You can also patch the data at runtime, before creating pickers, without waiting for a release:

```js
$.fn.npdatepicker.calendar.setYear(2100, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]); // append
$.fn.npdatepicker.calendar.extend({ 2083: [/* corrected */], 2100: [/* new */] });
```

Years far in the future are projections and may change when the official calendar is published.

## Using alongside bootstrap-datepicker

This plugin registers `$.fn.npdatepicker`, stores its instance under `data('npdatepicker')` and listens to
`data-provide="npdatepicker"`, so it can run on the same page as `$.fn.datepicker`. Both share the
`.datepicker` CSS classes, which is what keeps the stylesheets compatible.

## Development

```bash
npm install
npm test          # calendar validation + unit tests (jsdom)
npm run build     # writes dist/ (JS, minified JS, themes)
```

For real-browser checks, serve the repo, open `docs/index.html` and run `test/browser-check.js` in the console;
it drives every demo (72 checks).

## License

Apache License 2.0. This project is derived from bootstrap-datepicker (Apache-2.0); see [NOTICE](NOTICE).
