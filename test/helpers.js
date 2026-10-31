'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const SRC = process.env.NPDP_FILE || path.join(__dirname, '..', 'src', 'nepali-datepicker.js');
const JQUERY = process.env.JQUERY_FILE || require.resolve('jquery/dist/jquery.js');

// Fresh DOM + jQuery + plugin for every call, so tests do not share state.
function setup(html) {
	const dom = new JSDOM('<!doctype html><html><body>' + (html || '') + '</body></html>', {
		runScripts: 'outside-only',
		pretendToBeVisual: true
	});
	const { window } = dom;
	window.eval(fs.readFileSync(JQUERY, 'utf8'));
	window.eval(fs.readFileSync(SRC, 'utf8'));
	return { window, $: window.jQuery };
}

module.exports = { setup };

// Objects created inside the jsdom window have a different Object prototype,
// so compare plain JSON copies.
function same(actual, expected, msg) {
	require('node:assert').deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected, msg);
}

module.exports.same = same;
