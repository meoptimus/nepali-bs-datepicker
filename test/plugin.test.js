'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { setup, same } = require('./helpers');

const isDate = (d) => Object.prototype.toString.call(d) === '[object Date]';

function picker(opts, html) {
	const env = setup(html || '<input id="d">');
	const $input = env.$('#d').npdatepicker(opts || {});
	return Object.assign(env, { $input, dp: $input.data('npdatepicker') });
}

function dayCell($, dp, n) {
	return dp.picker.find('td.day').not('.old').not('.new').filter(function () {
		return $(this).text() === String(n);
	});
}

test('registers without clobbering bootstrap-datepicker', () => {
	const { $ } = setup();
	assert.strictEqual(typeof $.fn.npdatepicker, 'function');
	assert.strictEqual($.fn.datepicker, undefined);
});

test('setDate / getDate / getBsDate with the default yyyy-mm-dd format', () => {
	const { $input, dp } = picker({ language: 'en' });
	$input.npdatepicker('setDate', '2083-07-14');
	assert.strictEqual($input.val(), '2083-07-14');
	same(dp.getBsDate(), { year: 2083, month: 7, day: 14 });
	const d = $input.npdatepicker('getDate');
	assert.ok(isDate(d));
	same([d.getFullYear(), d.getMonth() + 1, d.getDate()], [2026, 10, 30]);
});

test('setDate accepts an AD Date object', () => {
	const { $input } = picker({ language: 'en' });
	$input.npdatepicker('setDate', new Date(2026, 3, 14));
	assert.strictEqual($input.val(), '2083-01-01');
});

test('format option: tokens d dd D DD m mm M MM yy yyyy', () => {
	const { $input } = picker({ language: 'en', format: 'DD, d MM yyyy (dd/mm/yy, D M)' });
	$input.npdatepicker('setDate', new Date(2026, 9, 31));
	assert.strictEqual($input.val(), 'Saturday, 15 Kartik 2083 (15/07/83, Sat Kar)');
});

test('parses dates typed in a custom format, including month names', () => {
	const { $input, dp } = picker({ language: 'en', format: 'dd/mm/yyyy' });
	$input.val('05/03/2082');
	dp.update();
	same(dp.getBsDate(), { year: 2082, month: 3, day: 5 });

	const p2 = picker({ language: 'en', format: 'd MM yyyy' });
	p2.$input.val('9 Mangsir 2081');
	p2.dp.update();
	same(p2.dp.getBsDate(), { year: 2081, month: 8, day: 9 });
});

test('assumeNearbyYear expands two-digit BS years', () => {
	const { $input, dp } = picker({ language: 'en', format: 'dd/mm/yy', assumeNearbyYear: true });
	$input.val('01/01/80');
	dp.update();
	assert.strictEqual(dp.getBsDate().year, 2080);
});

test('unicodeDigits: true writes Devanagari to the input', () => {
	const { $input, dp } = picker({ language: 'np', format: 'yyyy-mm-dd', unicodeDigits: true });
	$input.val('२०८३-०७-१४');
	dp.update();
	same(dp.getBsDate(), { year: 2083, month: 7, day: 14 });
	dp.setValue();
	assert.strictEqual($input.val(), '२०८३-०७-१४');
	assert.strictEqual(dp.getFormattedDate('d MM yyyy'), '१४ कार्तिक २०८३');
});

test('unicodeDigits default (picker): Devanagari in the picker, Latin in the input', () => {
	const { $input, dp } = picker({ language: 'np' });
	$input.npdatepicker('setDate', '2083-07-14');
	assert.strictEqual($input.val(), '2083-07-14');
	assert.strictEqual(dp.picker.find('td.day.active').text(), '१४');
	assert.strictEqual(dp.picker.find('.datepicker-days .datepicker-switch').text(), 'कार्तिक २०८३');
});

test('clamps day to the BS month length when parsing', () => {
	const { $input, dp } = picker({ language: 'en' });
	$input.val('2083-07-35');
	dp.update();
	same(dp.getBsDate(), { year: 2083, month: 7, day: 30 });
});

test('startDate / endDate (BS strings) restrict selection', () => {
	const { $input, dp } = picker({ language: 'en', startDate: '2083-01-01', endDate: '2083-12-30' });
	$input.npdatepicker('setDate', '2082-12-01');
	assert.strictEqual(dp.getBsDate(), null);
	$input.npdatepicker('setDate', '2083-05-10');
	same(dp.getBsDate(), { year: 2083, month: 5, day: 10 });
});

test('renders the days view of a BS month correctly, also west of UTC', () => {
	for (const tz of ['Asia/Kathmandu', 'UTC', 'America/Los_Angeles']) {
		process.env.TZ = tz;
		const { dp } = picker({ language: 'en', defaultViewDate: { year: 2080, month: 0, day: 1 } });
		const days = dp.picker.find('.datepicker-days tbody td.day');
		assert.strictEqual(days.length, 42, tz);
		const current = days.not('.old').not('.new');
		assert.strictEqual(current.length, 31, tz + ': Baisakh 2080 has 31 days');
		assert.strictEqual(current.first().text(), '1');
		// 1 Baisakh 2080 is Friday 2023-04-14, so 5 Chaitra cells (Sun-Thu) come first
		assert.strictEqual(days.index(current.first()), 5, tz);
		assert.strictEqual(dp.picker.find('.datepicker-days .datepicker-switch').text(), 'Baisakh 2080');
	}
	delete process.env.TZ;
});

test('weekStart shifts the grid', () => {
	const { dp } = picker({ language: 'en', weekStart: 1, defaultViewDate: { year: 2080, month: 0 } });
	assert.strictEqual(dp.picker.find('.datepicker-days thead th.dow').first().text(), 'Mo');
	const days = dp.picker.find('.datepicker-days tbody td.day');
	assert.strictEqual(days.index(days.not('.old').not('.new').first()), 4);
});

test('clicking a day selects it and fires changeDate with bsDate', () => {
	const { $, $input, dp } = picker({ language: 'en', defaultViewDate: { year: 2083, month: 6 } });
	let ev;
	$input.on('changeDate', (e) => { ev = e; });
	dp.show();
	dayCell($, dp, 14).trigger('click');
	assert.strictEqual($input.val(), '2083-07-14');
	same(ev.bsDate, { year: 2083, month: 7, day: 14 });
	assert.ok(isDate(ev.date));
	assert.strictEqual(ev.format(), '2083-07-14');
	assert.strictEqual(ev.format('d MM yyyy'), '14 Kartik 2083');
});

test('typing a date fires changeDate', () => {
	const { $input, dp } = picker({ language: 'en' });
	let fired = 0;
	$input.on('changeDate', () => { fired++; });
	$input.val('2083-07-14');
	dp.update();
	assert.strictEqual(fired, 1);
});

test('moveMonth clamps 32 Asar to 31 Shrawan', () => {
	const { $input, dp } = picker({ language: 'en' });
	$input.npdatepicker('setDate', '2083-03-32');
	dp.setUTCDate(dp.moveMonth(dp.getUTCDate(), 1));
	same(dp.getBsDate(), { year: 2083, month: 4, day: 31 });
});

test('prev/next arrows move by BS month, year and decade', () => {
	const { dp } = picker({ language: 'en', defaultViewDate: { year: 2083, month: 11 } });
	dp.show();
	dp.picker.find('.datepicker-days .next').trigger('click');
	assert.strictEqual(dp.picker.find('.datepicker-days .datepicker-switch').text(), 'Baisakh 2084');
	dp.setViewMode(1);
	dp.picker.find('.datepicker-months .prev').trigger('click');
	assert.strictEqual(dp.picker.find('.datepicker-months .datepicker-switch').text(), '2083');
	dp.setViewMode(3);
	dp.picker.find('.datepicker-decades .prev').trigger('click');
	assert.strictEqual(dp.picker.find('.datepicker-decades .datepicker-switch').text(), '1900-1990');
});

test('arrows are disabled at the edges of the range', () => {
	const { dp } = picker({ language: 'en', startDate: '2083-04-01', endDate: '2083-04-31', defaultViewDate: { year: 2083, month: 3 } });
	dp.show();
	assert.ok(dp.picker.find('.datepicker-days .prev').hasClass('disabled'));
	assert.ok(dp.picker.find('.datepicker-days .next').hasClass('disabled'));
});

test('multidate keeps distinct dates and toggles duplicates', () => {
	const { $, dp, $input } = picker({ language: 'en', multidate: true, autoclose: false, defaultViewDate: { year: 2083, month: 6 } });
	dp.show();
	dayCell($, dp, 1).trigger('click');
	dayCell($, dp, 2).trigger('click');
	assert.strictEqual($input.val(), '2083-07-01,2083-07-02');
	dayCell($, dp, 1).trigger('click');
	assert.strictEqual($input.val(), '2083-07-02');
});

test('date range picker (.input-daterange)', () => {
	const env = setup('<div class="input-daterange" id="r"><input id="a"><input id="b"></div>');
	env.$('#r').npdatepicker({ language: 'en' });
	env.$('#a').npdatepicker('setDate', '2083-07-10');
	env.$('#b').npdatepicker('setDate', '2083-07-05');
	assert.strictEqual(env.$('#a').val(), '2083-07-05', 'start moves back to keep the range ordered');
	assert.ok(env.$('#r').data('npdatepicker'));
});

test('destroy and the deprecated remove alias work standalone', () => {
	const { $input } = picker({ language: 'en' });
	$input.npdatepicker('remove');
	assert.strictEqual($input.data('npdatepicker'), undefined);
});

test('years view shows BS years and selects by data-year', () => {
	const { dp } = picker({ language: 'np', startView: 2, minViewMode: 2, defaultViewDate: { year: 2083 } });
	dp.show();
	const spans = dp.picker.find('.datepicker-years span.year');
	assert.strictEqual(spans.filter('[data-year="2083"]').text(), '२०८३');
	spans.filter('[data-year="2085"]').trigger('click');
	same(dp.getBsDate(), { year: 2085, month: 1, day: 1 });
});

test('minViewMode months selects the clicked BS month', () => {
	const { dp } = picker({ language: 'en', startView: 1, minViewMode: 1, defaultViewDate: { year: 2083 } });
	dp.show();
	dp.picker.find('.datepicker-months span.month').eq(4).trigger('click');
	same(dp.getBsDate(), { year: 2083, month: 5, day: 1 });
});

test('the start month itself stays selectable in the months view', () => {
	const { dp } = picker({ language: 'en', startDate: '2083-04-15', startView: 1, defaultViewDate: { year: 2083 } });
	const months = dp.picker.find('.datepicker-months span.month');
	assert.ok(months.eq(2).hasClass('disabled'));
	assert.ok(!months.eq(3).hasClass('disabled'));
});

test('datesDisabled and daysOfWeekDisabled', () => {
	const { $, dp } = picker({ language: 'en', datesDisabled: ['2083-07-12'], daysOfWeekDisabled: [6], defaultViewDate: { year: 2083, month: 6 } });
	assert.ok(dayCell($, dp, 12).hasClass('disabled-date'), 'listed date');
	assert.ok(dayCell($, dp, 8).hasClass('disabled'), '8 Kartik 2083 is a Saturday');
	assert.ok(!dayCell($, dp, 14).hasClass('disabled'), '14 Kartik 2083 is a Friday');
});

test('beforeShowDay gets the local AD date and the BS date', () => {
	const seen = [];
	picker({ language: 'en', defaultViewDate: { year: 2083, month: 6 }, beforeShowDay: (d, bs) => { seen.push([d, bs]); } });
	const hit = seen.find(([, bs]) => bs.year === 2083 && bs.month === 7 && bs.day === 14);
	assert.ok(hit);
	same([hit[0].getFullYear(), hit[0].getMonth(), hit[0].getDate()], [2026, 9, 30]);
});

test('tooltips from beforeShowDay are escaped', () => {
	const { dp } = picker({ language: 'en', beforeShowDay: () => ({ tooltip: '"><img src=x onerror=alert(1)>' }) });
	assert.strictEqual(dp.picker.find('img').length, 0);
});

test('pickerClass and the npdatepicker class are added for CSS scoping', () => {
	const { dp } = picker({ language: 'en', pickerClass: 'my-extra', theme: 'dark' });
	assert.ok(dp.picker.hasClass('datepicker'));
	assert.ok(dp.picker.hasClass('npdatepicker'));
	assert.ok(dp.picker.hasClass('my-extra'));
	assert.ok(dp.picker.hasClass('npdatepicker-theme-dark'));
	dp.setTheme('nepal');
	assert.ok(dp.picker.hasClass('npdatepicker-theme-nepal'));
	assert.ok(!dp.picker.hasClass('npdatepicker-theme-dark'));
	dp.setTheme('');
	assert.ok(!/npdatepicker-theme-/.test(dp.picker.attr('class')));
});

test('data-api uses its own namespace', () => {
	const { $ } = setup('<input data-provide="npdatepicker" id="x"><input data-provide="datepicker" id="y">');
	$('#x').trigger('focus');
	$('#y').trigger('focus');
	assert.ok($('#x').data('npdatepicker'));
	assert.strictEqual($('#y').data('npdatepicker'), undefined);
});

test('data attributes configure options', () => {
	const env = setup('<input id="d" data-date-format="dd/mm/yyyy" data-date-language="en">');
	const $input = env.$('#d').npdatepicker();
	$input.npdatepicker('setDate', '14/07/2083');
	assert.strictEqual($input.val(), '14/07/2083');
});

test('unicodeDigits: false shows Latin digits even in Nepali', () => {
	const { $input, dp } = picker({ language: 'np', unicodeDigits: false, startView: 1 });
	$input.npdatepicker('setDate', '2083-07-14');
	assert.strictEqual($input.val(), '2083-07-14');
	assert.strictEqual(dp.picker.find('td.day.active').text(), '14');
	assert.strictEqual(dp.picker.find('.datepicker-days .datepicker-switch').text(), 'कार्तिक 2083');
	assert.strictEqual(dp.picker.find('.datepicker-months .datepicker-switch').text(), '2083');
	assert.strictEqual(dp.picker.find('.datepicker-years span.year[data-year="2083"]').text(), '2083');
	// typing Devanagari still works
	$input.val('२०८३-०७-१०');
	dp.update();
	same(dp.getBsDate(), { year: 2083, month: 7, day: 10 });
});

test('setUnicodeDigits switches digits at runtime', () => {
	const { $input, dp } = picker({ language: 'np' });
	$input.npdatepicker('setDate', '2083-07-14');
	$input.npdatepicker('setUnicodeDigits', true);
	assert.strictEqual($input.val(), '२०८३-०७-१४');
	$input.npdatepicker('setUnicodeDigits', false);
	assert.strictEqual($input.val(), '2083-07-14');
	assert.strictEqual(dp.picker.find('td.day.active').text(), '14');
});

test('multidate keeps the picker open unless autoclose is set', () => {
	const a = picker({ language: 'en', multidate: 3 });
	assert.strictEqual(a.dp.o.autoclose, false);
	const b = picker({ language: 'en', multidate: 3, autoclose: true });
	assert.strictEqual(b.dp.o.autoclose, true);
	const c = picker({ language: 'en' });
	assert.strictEqual(c.dp.o.autoclose, true);
});
