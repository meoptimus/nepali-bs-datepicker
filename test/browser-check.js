/* In-browser feature check for docs/index.html.
 * Open the demo page, then paste this file into the devtools console (or run
 * it via automation). It drives every demo and resolves to a list of
 * {name, ok, detail}. It needs real layout and CSS, which jsdom lacks. */
(async function () {
	'use strict';
	var $ = window.jQuery, results = [];
	var cal = $.fn.npdatepicker.calendar;
	var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms || 30); }); };
	function check(name, ok, detail) { results.push({ name: name, ok: !!ok, detail: detail === undefined ? '' : String(detail) }); }
	function dp(sel) { return $(sel).data('npdatepicker'); }
	function visiblePicker() { return $('.datepicker-dropdown:visible'); }
	function cell($picker, n) {
		return $picker.find('.datepicker-days td.day').not('.old, .new').filter(function () {
			return $(this).text() === String(n);
		});
	}
	function digits(s) { return String(s).replace(/[०-९]/g, function (c) { return c.charCodeAt(0) - 0x966; }); }
	function closeAll() { $(document).trigger('mousedown'); }
	var today = cal.today();
	function pad(n) { return (n < 10 ? '0' : '') + n; }

	try {
		// Basic input
		$('#d-basic').trigger('focus'); await wait();
		var $p = visiblePicker();
		check('basic: opens on focus', $p.length === 1);
		var inRect = $('#d-basic')[0].getBoundingClientRect(), pRect = $p[0].getBoundingClientRect();
		// Like bootstrap-datepicker, it opens above the input when there is room there
		var below = pRect.top >= inRect.bottom - 1, above = pRect.bottom <= inRect.top + 1;
		check('basic: dropdown placed next to the input', (below || above) && Math.abs(pRect.left - inRect.left) < 30, (below ? 'below' : above ? 'above' : 'overlapping') + ' ' + pRect.top + '/' + inRect.top);
		check('basic: today highlighted', $p.find('td.today').length === 1 && digits($p.find('td.today').text()) === String(today.day));
		check('basic: title is current BS month in Nepali', $p.find('.datepicker-days .datepicker-switch').text().indexOf('२०८') !== -1, $p.find('.datepicker-days .datepicker-switch').text());
		cell($p, '१०').trigger('click'); await wait();
		check('basic: click selects and writes yyyy-mm-dd', $('#d-basic').val() === today.year + '-' + pad(today.month) + '-10', $('#d-basic').val());
		check('basic: autoclose', visiblePicker().length === 0);
		check('basic: changeDate output shows AD date', /AD \w{3} \w{3} \d+ \d{4}/.test($('#o-basic').text()), $('#o-basic').text());

		// Typing + forceParse
		$('#d-basic').val('2083-1-5').trigger('focus'); dp('#d-basic').update(); await wait();
		dp('#d-basic').hide();
		check('basic: typed date is normalised on close', $('#d-basic').val() === '2083-01-05', $('#d-basic').val());

		// English + format
		$('#d-english').trigger('focus'); await wait();
		$p = visiblePicker();
		check('english: month title in English', /^(Baisakh|Jestha|Asar|Shrawan|Bhadra|Ashwin|Kartik|Mangsir|Poush|Magh|Falgun|Chaitra) \d{4}$/.test($p.find('.datepicker-days .datepicker-switch').text()), $p.find('.datepicker-days .datepicker-switch').text());
		cell($p, 1).trigger('click'); await wait();
		check('english: DD, d MM yyyy format', /^\w+day, 1 \w+ \d{4}$/.test($('#d-english').val()), $('#d-english').val());

		// Latin digits in the calendar; the input is always Latin
		$('#d-digits').trigger('focus'); await wait();
		$p = visiblePicker();
		check('unicodeDigits false: calendar in Latin digits', /^\d+$/.test($p.find('td.today').text()), $p.find('td.today').text());
		cell($p, 2).trigger('click'); await wait();
		check('unicodeDigits false: input in Latin digits', /^\d{4}-\d{2}-02$/.test($('#d-digits').val()), $('#d-digits').val());
		$('#d-digits').val('२०८३-०७-१०'); dp('#d-digits').update(); dp('#d-digits').setValue();
		check('typed Devanagari is converted to Latin in the input', $('#d-digits').val() === '2083-07-10', $('#d-digits').val());

		// Component
		$('#d-component .input-group-addon').trigger('click'); await wait();
		$p = visiblePicker();
		check('component: add-on opens picker', $p.length === 1);
		check('component: Today and Clear buttons visible', $p.find('tfoot .today:visible').length && $p.find('tfoot .clear:visible').length);
		$p.find('.datepicker-days tfoot .today').trigger('click'); await wait();
		check('component: Today (linked) selects today', $('#d-component input').val() === today.year + '-' + pad(today.month) + '-' + pad(today.day), $('#d-component input').val());
		$('#d-component .input-group-addon').trigger('click'); await wait();
		visiblePicker().find('.datepicker-days tfoot .clear').trigger('click'); await wait();
		check('component: Clear empties the input', $('#d-component input').val() === '');
		closeAll();

		// Inline
		var $inline = $('#d-inline .datepicker-inline');
		check('inline: rendered and visible', $inline.is(':visible'));
		cell($inline, 7).trigger('click'); await wait();
		check('inline: click reports bsDate', JSON.parse($('#o-inline').text() || '{}').day === 7, $('#o-inline').text());

		// Data API
		var $da = $('[data-provide="npdatepicker"]');
		$da.trigger('focus'); await wait();
		check('data-api: instance created on focus', !!$da.data('npdatepicker'));
		$p = visiblePicker();
		check('data-api: Today button from data attribute', $p.find('tfoot .today:visible').length === 1);
		cell($p, 3).trigger('click'); await wait();
		check('data-api: dd/mm/yyyy format from data attribute', /^03\/\d{2}\/\d{4}$/.test($da.val()), $da.val());
		closeAll();

		// Range
		var $from = $('#d-range input').eq(0), $to = $('#d-range input').eq(1);
		$from.npdatepicker('setDate', '2083-07-10');
		$to.npdatepicker('setDate', '2083-07-20');
		$from.trigger('focus'); await wait();
		$p = visiblePicker();
		check('range: in-between days marked .range', $p.find('td.range').length === 9, $p.find('td.range').length);
		check('range: start/end marked', $p.find('td.range-start').length === 1 && $p.find('td.range-end').length === 1);
		closeAll();
		$to.npdatepicker('setDate', '2083-07-05'); await wait();
		check('range: earlier end pulls start back', $from.val() === '2083-07-05', $from.val());

		// Multidate
		$('#d-multi').trigger('focus'); await wait();
		$p = visiblePicker();
		[1, 2, 3, 4].forEach(function (n) { cell(visiblePicker(), n).trigger('click'); });
		await wait();
		var parts = $('#d-multi').val().split(', ');
		check('multidate: limited to 3, oldest dropped', parts.length === 3 && /-02$/.test(parts[0]) && /-04$/.test(parts[2]), $('#d-multi').val());
		cell(visiblePicker(), 3).trigger('click'); await wait();
		check('multidate: clicking a selected date removes it', $('#d-multi').val().split(', ').length === 2, $('#d-multi').val());
		closeAll();

		// Month picker
		$('#d-month').trigger('focus'); await wait();
		$p = visiblePicker();
		check('month picker: opens in months view', $p.find('.datepicker-months').is(':visible') && !$p.find('.datepicker-days').is(':visible'));
		$p.find('.datepicker-months span.month').eq(3).trigger('click'); await wait();
		check('month picker: picks the clicked month', /^साउन 20[0-9]{2}$/.test($('#d-month').val()), $('#d-month').val());

		// Year picker
		$('#d-year').trigger('focus'); await wait();
		$p = visiblePicker();
		check('year picker: opens in years view', $p.find('.datepicker-years').is(':visible'));
		$p.find('.datepicker-years span.year[data-year="2085"]').trigger('click'); await wait();
		check('year picker: picks the clicked year', $('#d-year').val() === '2085', $('#d-year').val());

		// Start / end limits
		var $lim = $('#d-limits');
		$lim.npdatepicker('setDate', '2083-04-10');
		$lim.trigger('focus'); await wait();
		$p = visiblePicker();
		check('limits: prev arrow disabled at start month', $p.find('.datepicker-days .prev').hasClass('disabled'));
		$lim.npdatepicker('setDate', '2083-03-10');
		check('limits: out-of-range date rejected', $lim.npdatepicker('getBsDate') === null || $lim.npdatepicker('getBsDate') === undefined, $lim.val());
		$lim.npdatepicker('setDate', '2084-03-31');
		$lim.npdatepicker('show'); await wait();
		check('limits: next arrow disabled at end month', visiblePicker().find('.datepicker-days .next').hasClass('disabled'));
		closeAll();

		// Disabled / highlighted
		var $dis = $('#d-disabled');
		$dis.npdatepicker('setDate', '2083-07-01');
		$dis.trigger('focus'); await wait();
		$p = visiblePicker();
		var sats = $p.find('.datepicker-days tbody tr').map(function () { return $(this).children('td.day').last()[0]; });
		check('disabled: every Saturday disabled', sats.length && sats.filter(function () { return !$(this).hasClass('disabled'); }).length === 0);
		var fris = $p.find('.datepicker-days tbody tr').map(function () { return $(this).children('td.day').eq(5)[0]; });
		check('disabled: Fridays highlighted', fris.filter('.highlighted').length === fris.length);
		check('disabled: listed dates disabled', cell($p, 20).hasClass('disabled-date') && cell($p, 21).hasClass('disabled-date'));
		cell($p, 20).trigger('click'); await wait();
		check('disabled: clicking a disabled day does nothing', $dis.val() === '2083-07-01', $dis.val());
		closeAll();

		// beforeShowDay holidays
		var $hol = $('#d-holidays .datepicker-inline');
		var $tihar = cell($hol, 3);
		check('beforeShowDay: class and tooltip applied', $tihar.hasClass('holiday') && $tihar.attr('title') === 'Tihar', $tihar.attr('class'));
		check('beforeShowDay: holiday styled red', getComputedStyle($tihar[0]).color === 'rgb(200, 16, 46)', getComputedStyle($tihar[0]).color);

		$('#d-holidays').npdatepicker('setTheme', 'dark');
		check('beforeShowDay: custom class colour survives a theme', getComputedStyle(cell($hol, 3)[0]).color === 'rgb(200, 16, 46)', getComputedStyle(cell($hol, 3)[0]).color);
		$('#d-holidays').npdatepicker('setTheme', '');

		// Week numbers
		var $wk = $('#d-weeks .datepicker-inline');
		check('calendarWeeks: week-number column', $wk.find('td.cw').length === 6);
		check('weekStart 1: Monday first', $wk.find('th.dow').first().text() === 'Mo');

		// Methods
		$('#m-set').trigger('click');
		check('method setDate(BS string)', $('#d-methods').val() === '2083-01-01');
		$('#m-get').trigger('click');
		check('method getBsDate', $('#o-methods').text() === '{"year":2083,"month":1,"day":1}', $('#o-methods').text());
		$('#m-ad').trigger('click');
		check('method setDate(AD Date) converts to BS', $('#d-methods').val() === today.year + '-' + pad(today.month) + '-' + pad(today.day), $('#d-methods').val());
		$('#m-clear').trigger('click');
		check('method clearDates', $('#d-methods').val() === '');
		$('#m-show').trigger('click'); await wait();
		check('method show', visiblePicker().length === 1);
		closeAll(); await wait();
		check('click outside hides', visiblePicker().length === 0);

		// Events
		$('#o-events').empty();
		$('#d-events').trigger('focus'); await wait();
		$p = visiblePicker();
		$p.find('.datepicker-days .next').trigger('click');
		$p.find('.datepicker-days .datepicker-switch').trigger('click');
		$p.find('.datepicker-months span.month').eq(0).trigger('click');
		cell(visiblePicker(), 5).trigger('click'); await wait();
		var log = $('#o-events').text();
		['show', 'changeMonth', 'changeViewMode', 'changeDate', 'hide'].forEach(function (ev) {
			check('event ' + ev + ' fired', log.indexOf(ev) !== -1);
		});
		check('event changeDate carries bsDate', /changeDate\s+\{"year":\d{4},"month":1,"day":5\}/.test(log));

		// Views & navigation
		var $nav = $('#d-events');
		$nav.npdatepicker('setDate', '2083-12-15');
		$nav.trigger('focus'); await wait();
		$p = visiblePicker();
		$p.find('.datepicker-days .next').trigger('click');
		check('nav: next goes from Chaitra to Baisakh of next year', $p.find('.datepicker-days .datepicker-switch').text() === 'Baisakh 2084', $p.find('.datepicker-days .datepicker-switch').text());
		$p.find('.datepicker-days .datepicker-switch').trigger('click');
		$p.find('.datepicker-months .datepicker-switch').trigger('click');
		check('nav: years view shows decade 2080-2089', $p.find('.datepicker-years .datepicker-switch').text() === '2080-2089', $p.find('.datepicker-years .datepicker-switch').text());
		$p.find('.datepicker-years .datepicker-switch').trigger('click');
		check('nav: decades view', $p.find('.datepicker-decades .datepicker-switch').text() === '2000-2090');
		$p.find('.datepicker-decades .datepicker-switch').trigger('click');
		check('nav: centuries view', $p.find('.datepicker-centuries').is(':visible'));
		check('nav: centuries outside data disabled', $p.find('.datepicker-centuries span.century[data-year="2200"]').hasClass('disabled'));
		closeAll();

		// Converter
		$('#c-bs').npdatepicker('setDate', '2083-07-15'); await wait();
		check('converter: BS -> AD', $('#c-ad').val() === '2026-11-01', $('#c-ad').val());
		$('#c-ad').val('2024-04-13').trigger('change'); await wait();
		check('converter: AD -> BS', $('#c-bs').val() === '2081-01-01', $('#c-bs').val());

		// Global theme switch
		$('[data-theme-switch] button[data-theme="nepal"]').trigger('click');
		var themed = $('*').filter(function () { var d = $(this).data('npdatepicker'); return d && d.picker; });
		check('theme switch: all demo pickers themed', themed.filter(function () { return !$(this).data('npdatepicker').picker.hasClass('npdatepicker-theme-nepal'); }).not('.theme-tile *').length === 0);
		var activeCell = $('#d-inline .datepicker-inline td.active')[0];
		check('theme nepal: selected day is flag blue', activeCell && getComputedStyle(activeCell).backgroundColor === 'rgb(0, 56, 147)', activeCell && getComputedStyle(activeCell).backgroundColor);
		check('theme nepal: header crimson', getComputedStyle($('#d-inline .datepicker-inline .datepicker-days th.datepicker-switch')[0]).backgroundColor === 'rgb(220, 20, 60)');
		$('[data-theme-switch] button[data-theme=""]').trigger('click');
		check('theme switch: default removes theme', !/npdatepicker-theme-/.test($('#d-inline .datepicker-inline').attr('class')));

		// Theme gallery uses the right classes and colours
		var expect = { material: 'rgb(53, 70, 179)', nepal: 'rgb(220, 20, 60)', dark: 'rgb(30, 34, 48)', minimal: 'rgb(255, 255, 255)' };
		$.each(expect, function (name, color) {
			var el = $('.theme-tile .picker-slot[data-theme="' + name + '"] .datepicker-inline')[0];
			var cs = name === 'material' || name === 'nepal'
				? getComputedStyle($(el).find('.datepicker-days th.datepicker-switch')[0]).backgroundColor
				: getComputedStyle(el).backgroundColor;
			check('theme ' + name + ': colours applied', cs === color, cs);
		});

		// Digits switch
		$('[data-digits-switch] button[data-digits="false"]').trigger('click');
		check('digits switch false: Latin in Nepali picker', /^\d+$/.test($('#hero td.day.today').text()), $('#hero td.day.today').text());
		check('digits switch false: input stays Latin', /^\d{4}-/.test($('#d-basic').val()), $('#d-basic').val());
		$('[data-digits-switch] button[data-digits="true"]').trigger('click');
		check('digits switch true: Devanagari in calendar, input still Latin', /^[०-९]+$/.test($('#hero td.day.today').text()) && /^\d{4}-/.test($('#d-basic').val()), $('#hero td.day.today').text() + ' / ' + $('#d-basic').val());

		// No page-level style leaks from themes
		check('themes do not restyle page tables/dropdowns', !$('style, link[rel=stylesheet]').length || getComputedStyle(document.body).backgroundColor !== '');
	} catch (e) {
		check('script error', false, e && e.stack || e);
	}
	closeAll();
	var failed = results.filter(function (r) { return !r.ok; });
	return { total: results.length, failed: failed.length, failures: failed, all: results };
})();
