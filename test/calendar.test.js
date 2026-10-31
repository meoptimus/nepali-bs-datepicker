'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { setup, same } = require('./helpers');

const { $ } = setup();
const cal = $.fn.npdatepicker.calendar;

function ad(date) {
	return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

test('known BS <-> AD pairs', () => {
	const pairs = [
		[[1970, 1, 1], '1913-04-13'],
		[[2000, 1, 1], '1943-04-14'],
		[[2080, 1, 1], '2023-04-14'],
		[[2081, 1, 1], '2024-04-13'],
		[[2082, 1, 1], '2025-04-14'],
		[[2083, 1, 1], '2026-04-14'],
		[[2083, 7, 14], '2026-10-31'],
		[[2082, 7, 3], '2025-10-20'], // Laxmi Puja 2082
		[[2082, 1, 31], '2025-05-14']
	];
	for (const [bs, expected] of pairs) {
		assert.strictEqual(ad(cal.toAD(...bs)), expected, bs.join('-'));
		const [y, m, d] = expected.split('-').map(Number);
		same(cal.toBS(new Date(y, m - 1, d)), { year: bs[0], month: bs[1], day: bs[2] });
	}
});

test('round-trips every day in the table', () => {
	const { minYear, maxYear } = cal.range();
	// Walk UTC days: some zones skipped local days (eg, Pacific/Kiritimati in 1994)
	let date = cal._toUTC(minYear, 1, 1);
	for (let y = minYear; y <= maxYear; y++)
		for (let m = 1; m <= 12; m++)
			for (let d = 1; d <= cal.daysInMonth(y, m); d++) {
				same(cal._fromUTC(date), { year: y, month: m, day: d });
				assert.strictEqual(cal._toUTC(y, m, d).getTime(), date.getTime());
				date = new Date(date.getTime() + 864e5);
			}
	assert.strictEqual(cal._fromUTC(date), null, 'day after the table ends is out of range');
});

test('rejects invalid BS dates', () => {
	assert.strictEqual(cal.toAD(2083, 1, 32), null);
	assert.strictEqual(cal.toAD(2083, 13, 1), null);
	assert.strictEqual(cal.toAD(1969, 12, 30), null);
	assert.strictEqual(cal.isValid(2083, 3, 32), true);
	assert.strictEqual(cal.isValid(2083, 4, 32), false);
});

test('setYear appends and replaces years, and validates input', () => {
	const { $ } = setup();
	const c = $.fn.npdatepicker.calendar;
	const next = c.range().maxYear + 1;
	c.setYear(next, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]);
	assert.strictEqual(c.range().maxYear, next);
	assert.ok(c.toAD(next, 12, 30));
	assert.throws(() => c.setYear(next + 5, [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]), /append/);
	assert.throws(() => c.setYear(2083, [31, 31]), /12 months/);
	assert.throws(() => c.setYear(2083, [40, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30]), /invalid length/);
	// replacing a year shifts every later date
	const before = ad(c.toAD(2084, 1, 1));
	c.setYear(2083, [32, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30]);
	assert.notStrictEqual(ad(c.toAD(2084, 1, 1)), before);
});

test('extend applies several years in order', () => {
	const { $ } = setup();
	const c = $.fn.npdatepicker.calendar;
	const n = c.range().maxYear;
	c.extend({
		[n + 2]: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
		[n + 1]: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]
	});
	assert.strictEqual(c.range().maxYear, n + 2);
});
