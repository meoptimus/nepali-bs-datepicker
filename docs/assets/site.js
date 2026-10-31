/* Docs site helpers.
 * Each demo's code lives in a <script type="text/demo"> block: it is shown in
 * the card's code panel and executed as-is, so the snippet is always the code
 * that runs. */
(function ($) {
	'use strict';

	var allPickers = [];

	// Keep dropdowns above the sticky header and controls bar of this site
	$.fn.npdatepicker.defaults.zIndexOffset = 1000;

	function runDemos() {
		$('script[type="text/demo"]').each(function () {
			var code = $.trim($(this).text().replace(/^\n+/, '')),
				lines = code.split('\n'),
				indent = Math.min.apply(Math, $.map(lines.slice(1), function (l) {
					return l.trim() ? l.match(/^\t*/)[0].length : 999;
				}).concat([999]));
			if (indent && indent < 999)
				code = $.map(lines, function (l, i) { return i ? l.slice(indent) : l; }).join('\n');
			var $card = $(this).closest('.card');
			if ($card.length) {
				var $details = $('<details><summary>Code</summary><pre><code></code></pre></details>');
				var markup = $card.find('.card-body .demo-markup').html();
				var shown = (markup ? '<!-- HTML -->\n' + dedent(markup) + '\n\n// JavaScript\n' : '') + code;
				$details.find('code').text(shown);
				$card.append($details);
			}
			try {
				new Function('$', code)($);
			} catch (e) {
				console.error('Demo failed:', e);
			}
		});
	}

	function dedent(html) {
		var lines = html.replace(/^\n+|\s+$/g, '').split('\n');
		var indent = Math.min.apply(Math, $.map(lines, function (l) {
			return l.trim() ? l.match(/^\t*/)[0].length : 999;
		}));
		return $.map(lines, function (l) { return l.slice(indent); }).join('\n');
	}

	function collectPickers() {
		allPickers = $('*').filter(function () {
			return !!$(this).data('npdatepicker');
		}).not('.theme-tile *').toArray();
	}

	function setTheme(theme) {
		collectPickers();
		$.each(allPickers, function (i, el) {
			$(el).npdatepicker('setTheme', theme);
		});
		try { localStorage.setItem('npdp-theme', theme); } catch (e) {}
	}

	function setDigits(value) {
		collectPickers();
		$.each(allPickers, function (i, el) {
			$(el).npdatepicker('setUnicodeDigits', value);
		});
	}

	function bindSegmented() {
		$('[data-digits-switch] button').on('click', function () {
			var $b = $(this), v = String($b.data('digits'));
			$b.siblings().attr('aria-pressed', 'false');
			$b.attr('aria-pressed', 'true');
			setDigits(v === 'true');
		});
		$('[data-theme-switch] button').on('click', function () {
			var $b = $(this);
			$b.siblings().attr('aria-pressed', 'false');
			$b.attr('aria-pressed', 'true');
			setTheme($b.data('theme'));
		});
		var saved = '';
		try { saved = localStorage.getItem('npdp-theme') || ''; } catch (e) {}
		if (saved) $('[data-theme-switch] button[data-theme="' + saved + '"]').trigger('click');
	}

	function bindTabs() {
		$('.tabs').each(function () {
			var $tabs = $(this), $panels = $tabs.nextAll('.tab-panel').slice(0, $tabs.find('button').length);
			$tabs.find('button').on('click', function () {
				var i = $(this).index();
				$tabs.find('button').attr('aria-selected', 'false');
				$(this).attr('aria-selected', 'true');
				$panels.attr('hidden', true).eq(i).removeAttr('hidden');
			}).first().trigger('click');
		});
	}

	window.npdpSite = { setTheme: setTheme, setDigits: setDigits };

	$(function () {
		runDemos();
		bindSegmented();
		bindTabs();
	});
})(jQuery);
