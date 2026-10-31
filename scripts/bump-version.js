#!/usr/bin/env node
// Bumps the version everywhere it appears and adds a CHANGELOG section.
//   npm run bump -- 2.0.2              exact version
//   npm run bump -- patch              2.0.1 -> 2.0.2  (also: minor, major)
//   npm run bump -- patch --dry-run    only show what would change
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const target = args.find((a) => !a.startsWith('--'));
if (!target) {
	console.error('usage: npm run bump -- <version|patch|minor|major> [--dry-run]');
	process.exit(2);
}

const pkgPath = path.join(root, 'package.json');
const old = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;

function nextVersion(v, kind) {
	const [a, b, c] = v.split('.').map(Number);
	if (kind === 'major') return (a + 1) + '.0.0';
	if (kind === 'minor') return a + '.' + (b + 1) + '.0';
	if (kind === 'patch') return a + '.' + b + '.' + (c + 1);
	if (!/^\d+\.\d+\.\d+$/.test(kind)) throw new Error('not a version: ' + kind);
	return kind;
}
const nu = nextVersion(old, target);
if (nu === old) {
	console.error('already at ' + old);
	process.exit(1);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const edits = [
	['src/nepali-datepicker.js', [
		[new RegExp('Nepali Datepicker v' + esc(old) + ' '), 'Nepali Datepicker v' + nu + ' '],
		[new RegExp("version = '" + esc(old) + "'"), "version = '" + nu + "'"]
	]],
	['README.md', [
		[new RegExp('@meoptimus/nepali-bs-datepicker@' + esc(old), 'g'), '@meoptimus/nepali-bs-datepicker@' + nu]
	]],
	['docs/documentation.html', [
		[new RegExp('@meoptimus/nepali-bs-datepicker@' + esc(old), 'g'), '@meoptimus/nepali-bs-datepicker@' + nu],
		[new RegExp('nepali-bs-datepicker@v' + esc(old), 'g'), 'nepali-bs-datepicker@v' + nu]
	]],
	['docs/index.html', [
		[new RegExp('<span class="badge">v' + esc(old) + '</span>'), '<span class="badge">v' + nu + '</span>']
	]]
];

const changed = ['package.json, package-lock.json'];
for (const [file, pairs] of edits) {
	const p = path.join(root, file);
	let s = fs.readFileSync(p, 'utf8'), n = 0;
	for (const [re, to] of pairs) {
		const count = (s.match(new RegExp(re.source, 'g')) || []).length;
		if (!count) {
			console.error('warning: ' + file + ': nothing matched ' + re);
			continue;
		}
		n += count;
		s = s.replace(re, to);
	}
	if (n) {
		changed.push(file + ' (' + n + ' place' + (n > 1 ? 's' : '') + ')');
		if (!dry) fs.writeFileSync(p, s);
	}
}

const clPath = path.join(root, 'CHANGELOG.md');
let cl = fs.readFileSync(clPath, 'utf8');
if (!cl.includes('## [' + nu + ']')) {
	const i = cl.indexOf('\n## [');
	if (i < 0) throw new Error('CHANGELOG.md has no version sections');
	const today = new Date().toISOString().slice(0, 10);
	cl = cl.slice(0, i + 1) + '## [' + nu + '] - ' + today + '\n\n### Fixed\n- (describe the change)\n\n' + cl.slice(i + 1);
	changed.push('CHANGELOG.md (new section — fill it in)');
	if (!dry) fs.writeFileSync(clPath, cl);
}

if (!dry) execSync('npm version ' + nu + ' --no-git-tag-version', { cwd: root, stdio: 'ignore' });

console.log((dry ? '[dry run] would bump ' : 'bumped ') + old + ' -> ' + nu + ':\n  ' + changed.join('\n  '));
console.log('\nnext:' +
	'\n  1. write the CHANGELOG.md entry for [' + nu + ']' +
	'\n  2. npm test && npm run build' +
	'\n  3. git add -A && git commit -m "' + nu + ': <what changed>"' +
	'\n  4. git tag -a v' + nu + ' -m "Nepali Datepicker ' + nu + '" && git push origin main && git push origin v' + nu +
	'\n  5. in PowerShell: npm.cmd publish --access public');
