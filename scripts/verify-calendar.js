#!/usr/bin/env node
// Compares the month lengths in src/nepali-datepicker.js with the calendar
// shown on hamropatro.com for the given BS years (hamropatro covers 2000-2100).
//   npm run verify-calendar -- 2084 2085
// Fetches 12 pages per year with a short pause between requests; needs Node 18+.
'use strict';
const fs = require('fs');
const path = require('path');

const years = process.argv.slice(2).map(Number).filter((y) => y >= 2000 && y <= 2100);
if (!years.length) {
	console.error('usage: npm run verify-calendar -- <year> [year…]   (BS 2000-2100)');
	process.exit(2);
}

const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'nepali-datepicker.js'), 'utf8');
const table = {};
const rowRe = /^\s*(\d{4}):\s*\[([\d,\s]+)\],?\s*$/gm;
let m;
while ((m = rowRe.exec(src))) table[m[1]] = m[2].split(',').map((s) => Number(s.trim()));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function monthLength(year, month) {
	const res = await fetch(`https://www.hamropatro.com/calendar/${year}/${month}`, {
		headers: { 'User-Agent': 'nepali-bs-datepicker verify-calendar (https://github.com/meoptimus/nepali-bs-datepicker)' }
	});
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${year}/${month}`);
	const html = await res.text();
	const re = new RegExp(`\\?d=${year}-${month}-(\\d+)"`, 'g');
	let k, max = 0;
	while ((k = re.exec(html))) max = Math.max(max, Number(k[1]));
	if (!max) throw new Error(`no day cells found for ${year}/${month}`);
	return max;
}

(async () => {
	let differ = 0;
	for (const y of years) {
		const hp = [];
		for (let mo = 1; mo <= 12; mo++) {
			hp.push(await monthLength(y, mo));
			await sleep(300);
		}
		const ours = table[y];
		const diffs = ours ? hp.map((v, i) => (v !== ours[i] ? i + 1 : 0)).filter(Boolean) : [];
		if (!ours) console.log(`${y}: not in table — hamropatro [${hp.join(', ')}]`);
		else if (diffs.length) { differ++; console.log(`${y}: DIFFERS in month(s) ${diffs.join(', ')}\n      hamropatro [${hp.join(', ')}]\n      table      [${ours.join(', ')}]`); }
		else console.log(`${y}: ok [${hp.join(', ')}]`);
	}
	process.exit(differ ? 1 : 0);
})().catch((e) => {
	console.error(e.message);
	process.exit(1);
});
