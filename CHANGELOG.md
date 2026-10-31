# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [2.0.1] - 2026-10-31

### Fixed
- Calendar data for BS 2000–2100 now matches the published Nepali calendar (checked month by month
  against hamropatro.com). Years 2062, 2081, 2082, 2083, 2087 and 2097 had wrong month lengths; for
  2082 and 2083 every date after Asoj was off by one day (eg, 14 Kartik 2083 is 31 Oct 2026, not 15 Kartik).
- Calendar table extended to BS 2100.

### Added
- `npm run verify-calendar -- <year> [year…]` compares the table with hamropatro.com.

## [2.0.0] - 2026-10-31

First open-source release. A rewrite of the earlier in-house v1 picker.

### Added
- Built-in Bikram Sambat ↔ AD conversion (BS 1970–2099); no external date library needed.
- One editable month-length table, a `npm run check-calendar` validator, and a runtime API
  (`$.fn.npdatepicker.calendar.setYear / extend / toBS / toAD / daysInMonth / …`).
- `format` option for display and parsing: `d dd D DD m mm M MM yy yyyy`.
- `unicodeDigits` option and `setUnicodeDigits()`: Devanagari numerals in the calendar for the Nepali
  locale. The input value always uses 0-9; both digit styles are accepted when typing or pasting.
- `getBsDate()`, `getBsDates()` methods and `e.bsDate` / `e.bsDates` on events.
- Four themes — material, nepal, minimal, dark — generated from CSS custom properties; `theme` option
  and `setTheme()`; `pickerClass` option.
- Documentation site and live demos in `docs/`; CDN-ready package (jsDelivr, unpkg).
- `ne` locale alias, full Nepali weekday names.
- Date-range pickers, multidate, month/year/decade pickers and `datesDisabled` now work.

### Changed
- Based on bootstrap-datepicker 1.10.1 (was 1.9.0): `isInline` option, jQuery 4 compatibility,
  range-picker fix for empty inputs.
- Plugin data key, data-api (`data-provide="npdatepicker"`) and event namespace no longer collide
  with bootstrap-datepicker.
- Internally dates are real `Date` objects again, so `getDate()` and `setDate(Date)` behave like upstream.
- Default `format` is `yyyy-mm-dd`.

### Fixed
- Calendar grid started a week early for users west of UTC.
- `remove()` threw unless bootstrap-datepicker was also loaded.
- `.input-daterange` threw a `ReferenceError`.
- `multidate` / `toggleActive` never matched existing dates.
- `changeDate` did not fire when a date was typed.
- Start month was disabled in the months view; month pickers selected the wrong month.
- Prev/next arrows were wrong at range edges and did nothing in decade/century views.
- `beforeShowMonth` / `beforeShowYear` received meaningless dates.
- Implicit global variables leaked into `window`.
- Tooltips from `beforeShowDay` were inserted without HTML escaping.
