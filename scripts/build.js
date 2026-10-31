#!/usr/bin/env node
// Builds dist/ from src/:
//   dist/js/nepali-datepicker(.min).js
//   dist/css/themes/<name>(.min).css        one file per theme
//   dist/css/nepali-datepicker-themes(.min).css   all themes in one file
'use strict';
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const pkg = require(path.join(root, 'package.json'));

// Number of times the theme class is repeated: one more class than
// bootstrap-datepicker's most specific selector (5 classes).
const THEME_CLASS_REPEAT = 4;

function minifyCss(css) {
	return css
		.replace(/\/\*(?!!)[\s\S]*?\*\//g, '')
		.replace(/\s+/g, ' ')
		.replace(/\s*([{}:;,>])\s*/g, '$1')
		.replace(/;}/g, '}')
		.trim() + '\n';
}

function buildThemes() {
	const dir = path.join(src, 'themes');
	const template = fs.readFileSync(path.join(dir, '_template.css'), 'utf8')
		.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
	const names = fs.readdirSync(dir)
		.filter((f) => f.endsWith('.css') && !f.startsWith('_'))
		.map((f) => f.slice(0, -4))
		.sort();

	fs.mkdirSync(path.join(dist, 'css', 'themes'), { recursive: true });
	const banner = (what) => '/*!\n * Nepali Datepicker v' + pkg.version + ' — ' + what + '\n * Licensed under the Apache License v2.0\n */\n';
	const all = [];
	for (const name of names) {
		const vars = fs.readFileSync(path.join(dir, name + '.css'), 'utf8');
		const prefix = '.datepicker' + ('.npdatepicker-theme-' + name).repeat(THEME_CLASS_REPEAT);
		const css = vars.trim() + '\n\n' + template.replace(/__P__/g, prefix);
		all.push(css);
		const out = banner(name + ' theme') + css;
		fs.writeFileSync(path.join(dist, 'css', 'themes', name + '.css'), out);
		fs.writeFileSync(path.join(dist, 'css', 'themes', name + '.min.css'), minifyCss(out));
	}
	const bundle = banner('all themes (' + names.join(', ') + ')') + all.join('\n\n');
	fs.writeFileSync(path.join(dist, 'css', 'nepali-datepicker-themes.css'), bundle);
	fs.writeFileSync(path.join(dist, 'css', 'nepali-datepicker-themes.min.css'), minifyCss(bundle));
	return names;
}

async function build() {
	fs.mkdirSync(path.join(dist, 'js'), { recursive: true });

	const code = fs.readFileSync(path.join(src, 'nepali-datepicker.js'), 'utf8');
	if (code.indexOf('v' + pkg.version + ' ') === -1)
		throw new Error('Version in the src/nepali-datepicker.js header does not match package.json (' + pkg.version + ')');
	fs.writeFileSync(path.join(dist, 'js', 'nepali-datepicker.js'), code);

	const min = await minify(code, {
		compress: true,
		mangle: true,
		format: { comments: /^!/ }
	});
	fs.writeFileSync(path.join(dist, 'js', 'nepali-datepicker.min.js'), min.code + '\n');

	const themes = buildThemes();
	console.log('built js (' + Math.round(min.code.length / 1024) + ' KB min) and themes: ' + themes.join(', '));
}

build().catch(function (err) {
	console.error(err);
	process.exit(1);
});
