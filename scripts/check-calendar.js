#!/usr/bin/env node
// Validates the Bikram Sambat month table in src/nepali-datepicker.js.
// Run after editing the table: `npm run check-calendar`.
'use strict';
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'nepali-datepicker.js');
const src = fs.readFileSync(file, 'utf8');

const rows = {};
const rowRe = /^\s*(\d{4}):\s*\[([\d,\s]+)\],?\s*$/gm;
let m;
while ((m = rowRe.exec(src))) {
	const year = Number(m[1]);
	if (rows[year]) fail(`year ${year} appears twice`);
	rows[year] = m[2].split(',').map((s) => Number(s.trim()));
}

const years = Object.keys(rows).map(Number).sort((a, b) => a - b);
if (!years.length) fail('no calendar rows found');

const epoch = /epoch:\s*\{\s*year:\s*(\d{4})/.exec(src);
if (!epoch || Number(epoch[1]) !== years[0])
	fail(`epoch year must equal the first year in the table (${years[0]})`);

const warnings = [];
for (let i = 0; i < years.length; i++) {
	const y = years[i];
	if (i > 0 && y !== years[i - 1] + 1) fail(`years must be contiguous: ${years[i - 1]} is followed by ${y}`);
	const months = rows[y];
	if (months.length !== 12) fail(`${y} has ${months.length} months, expected 12`);
	months.forEach((d, idx) => {
		if (!Number.isInteger(d) || d < 29 || d > 32) fail(`${y} month ${idx + 1} has ${d} days, expected 29-32`);
	});
	const total = months.reduce((a, b) => a + b, 0);
	if (total < 365 || total > 366) warnings.push(`${y} has ${total} days (a BS year normally has 365 or 366)`);
}

for (const w of warnings) console.warn('warning: ' + w);
console.log(`calendar ok: BS ${years[0]}-${years[years.length - 1]} (${years.length} years)`);

function fail(msg) {
	console.error('calendar error: ' + msg);
	process.exit(1);
}
