#!/usr/bin/env node
// Builds dist/ from src/: a readable copy and a minified copy of the plugin,
// plus the theme stylesheet.
'use strict';
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');

async function build() {
	fs.mkdirSync(path.join(dist, 'js'), { recursive: true });
	fs.mkdirSync(path.join(dist, 'css'), { recursive: true });

	const code = fs.readFileSync(path.join(src, 'nepali-datepicker.js'), 'utf8');
	fs.writeFileSync(path.join(dist, 'js', 'nepali-datepicker.js'), code);

	const min = await minify(code, {
		compress: true,
		mangle: true,
		format: { comments: /^!/ }
	});
	fs.writeFileSync(path.join(dist, 'js', 'nepali-datepicker.min.js'), min.code + '\n');

	fs.copyFileSync(path.join(src, 'nepali-datepicker-material.css'), path.join(dist, 'css', 'nepali-datepicker-material.css'));

	console.log('built dist/js/nepali-datepicker.js, dist/js/nepali-datepicker.min.js (' + Math.round(min.code.length / 1024) + ' KB), dist/css/nepali-datepicker-material.css');
}

build().catch(function (err) {
	console.error(err);
	process.exit(1);
});
