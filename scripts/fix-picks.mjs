import { readFile, writeFile } from 'node:fs/promises';

const f = 'scripts/.retail-picks.json';
let s = await readFile(f, 'utf8');
s = s.replace(/^\uFEFF/, '');
const p = JSON.parse(s);
await writeFile(f, JSON.stringify(p, null, 2));

const keys = p.map((x) => x.key);
const pids = p.map((x) => String(x.pid));
const dupK = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))];
const dupP = [...new Set(pids.filter((k, i) => pids.indexOf(k) !== i))];
console.log(`count ${p.length} dupKeys ${JSON.stringify(dupK)} dupPids ${JSON.stringify(dupP)}`);