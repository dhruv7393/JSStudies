// Checks the reference data for every topic:
//   1. Every entry MDN lists for the topic is present (and nothing extra).
//   2. Every entry has the required fields.
//   3. Every example runs, and every `expr; // value` line produces that value.
//   4. Every quiz card's `verify` expression is true.
// Run with: npm run check   (also runs before every build)
import { isDeepStrictEqual, inspect } from 'node:util';
import * as array from '../src/data/array.js';
import * as object from '../src/data/object.js';

// Expected entries, from each topic's MDN page (Constructor, Static methods,
// Static properties, Instance properties, Instance methods), checked November 2026.
const TOPICS = [
  {
    name: 'Array',
    data: array,
    extraField: 'holes',
    requireInstead: true,
    expected: [
      'Array',
      'from', 'fromAsync', 'isArray', 'of',
      'symbol-species',
      'constructor', 'length', 'symbol-unscopables',
      'at', 'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex',
      'findLast', 'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes', 'indexOf', 'join',
      'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift',
      'slice', 'some', 'sort', 'splice', 'toLocaleString', 'toReversed', 'toSorted', 'toSpliced',
      'toString', 'unshift', 'values', 'with', 'symbol-iterator',
    ],
  },
  {
    name: 'Object',
    data: object,
    extraField: 'props',
    requireInstead: false,
    expected: [
      'Object',
      'assign', 'create', 'defineProperties', 'defineProperty', 'entries', 'freeze', 'fromEntries',
      'getOwnPropertyDescriptor', 'getOwnPropertyDescriptors', 'getOwnPropertyNames',
      'getOwnPropertySymbols', 'getPrototypeOf', 'groupBy', 'hasOwn', 'is', 'isExtensible',
      'isFrozen', 'isSealed', 'keys', 'preventExtensions', 'seal', 'setPrototypeOf', 'values',
      'proto', 'constructor',
      '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__',
      'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf',
    ],
  },
];

const BASE_FIELDS = ['id', 'name', 'group', 'kind', 'sig', 'one', 'what', 'returns', 'changes', 'copy', 'example', 'details', 'watch', 'mdn'];
const GROUPS = ['constructor', 'static-method', 'static-property', 'instance-property', 'instance-method'];
const KINDS = ['mutates', 'copy', 'value'];
const AsyncFunction = (async () => {}).constructor;
const show = (v) => inspect(v, { depth: 5, breakLength: Infinity });
const isValue = (src) => {
  try {
    new Function(`return (${src});`);
    return true;
  } catch {
    return false;
  }
};

const errors = [];
const summary = [];

for (const topic of TOPICS) {
  const { methods, cards } = topic.data;
  const fail = (where, msg) => errors.push(`${topic.name} › ${where}: ${msg}`);

  // ── 1. Coverage ──
  const ids = methods.map((m) => m.id);
  for (const id of topic.expected) if (!ids.includes(id)) fail('coverage', `missing "${id}"`);
  for (const id of ids) if (!topic.expected.includes(id)) fail('coverage', `"${id}" is not in MDN's list`);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail('coverage', `duplicate ids: ${dupes.join(', ')}`);

  // ── 2. Fields ──
  for (const m of methods) {
    for (const f of [...BASE_FIELDS, topic.extraField]) if (m[f] === undefined || m[f] === '') fail(m.id, `missing field "${f}"`);
    if (!GROUPS.includes(m.group)) fail(m.id, `bad group "${m.group}"`);
    if (!KINDS.includes(m.kind)) fail(m.id, `bad kind "${m.kind}"`);
    if (topic.requireInstead && m.kind === 'mutates' && !m.instead) fail(m.id, 'mutating entries need an "instead" field');
    if (!/^https:\/\/developer\.mozilla\.org\/en-US\/docs\//.test(m.mdn)) fail(m.id, 'mdn link is not an MDN page');
    for (const text of [m.what, m.watch, m.returns, m[topic.extraField] ?? '', m.instead ?? '', ...(m.details ?? [])]) {
      if ((text.match(/`/g) || []).length % 2) fail(m.id, `unbalanced backticks in: ${text}`);
    }
  }

  // ── 3. Examples ──
  let checkedLines = 0;
  for (const m of methods) {
    const lines = m.example.split('\n').map((line, i) => {
      const match = line.match(/^(\s*)(.+?);\s*\/\/\s*(.+?)\s*$/);
      if (!match) return line;
      const [, indent, expr, expected] = match;
      if (/^(const|let|var|class|function|if|for|while|return)\b/.test(expr)) return line;
      if (/^[A-Z]\w*Error$/.test(expected)) {
        checkedLines++;
        return `${indent}__throws(${i + 1}, ${JSON.stringify(expr)}, () => { ${expr}; }, ${JSON.stringify(expected)});`;
      }
      if (!isValue(expected)) return line; // a note, not a value
      checkedLines++;
      return `${indent}__eq(${i + 1}, ${JSON.stringify(expr)}, (${expr}), (${expected}));`;
    });

    const __eq = (line, expr, actual, expected) => {
      if (!isDeepStrictEqual(actual, expected)) {
        fail(m.id, `example line ${line}: ${expr} gave ${show(actual)}, comment says ${show(expected)}`);
      }
    };
    const __throws = (line, expr, fn, name) => {
      try {
        fn();
        fail(m.id, `example line ${line}: ${expr} did not throw ${name}`);
      } catch (e) {
        if (e?.name !== name) fail(m.id, `example line ${line}: ${expr} threw ${e?.name}, comment says ${name}`);
      }
    };
    const quietConsole = { log() {}, info() {}, warn() {}, error() {} };

    try {
      await new AsyncFunction('__eq', '__throws', 'console', lines.join('\n'))(__eq, __throws, quietConsole);
    } catch (e) {
      fail(m.id, `example threw ${e?.name}: ${e?.message}`);
    }
  }

  // ── 4. Quiz cards ──
  const cardIds = new Set();
  for (const c of cards) {
    if (cardIds.has(c.id)) fail(`card ${c.id}`, 'duplicate id');
    cardIds.add(c.id);
    if (c.methodId !== null && !ids.includes(c.methodId)) fail(`card ${c.id}`, `unknown methodId "${c.methodId}"`);
    if (c.methodId === null && !c.mdn) fail(`card ${c.id}`, 'cards without a methodId need an mdn link');
    if (c.kind === 'choice' && !(c.answer >= 0 && c.answer < c.options.length)) fail(`card ${c.id}`, 'answer index out of range');
    if (c.kind === 'flip' && !c.answerText) fail(`card ${c.id}`, 'flip cards need answerText');
    if (!c.verify) {
      fail(`card ${c.id}`, 'missing verify expression');
      continue;
    }
    try {
      if (new Function(`return (${c.verify});`)() !== true) fail(`card ${c.id}`, `verify is not true: ${c.verify}`);
    } catch (e) {
      fail(`card ${c.id}`, `verify threw ${e?.name}: ${e?.message}`);
    }
  }

  summary.push(`${topic.name}: ${methods.length} entries, ${checkedLines} example results, ${cards.length} quiz cards`);
}

// ── Report ──
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) in the reference data:\n`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ All checks passed (every topic matches MDN's list).\n  ${summary.join('\n  ')}`);
