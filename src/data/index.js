// Registry of topics. To add a new one (e.g. Date):
//   1. Create src/data/date.js exporting `methods` and `cards` in the same shape as array.js.
//   2. Import it below and replace its `soon: true` entry.
//   3. Add its expected entry list to scripts/check-data.mjs and run `npm run check`.
import * as array from './array.js';

export const KINDS = {
  mutates: { label: 'Mutates', hint: 'Changes the array you call it on.' },
  copy: { label: 'New array', hint: 'Leaves the original alone and gives back a new array.' },
  value: { label: 'Returns value', hint: 'Reads the array and returns an item, index, boolean, string or iterator.' },
};

// Sections, in the order MDN lists them.
export const GROUPS = [
  { id: 'constructor', label: 'Constructor' },
  { id: 'static-method', label: 'Static methods' },
  { id: 'static-property', label: 'Static properties' },
  { id: 'instance-property', label: 'Instance properties' },
  { id: 'instance-method', label: 'Instance methods' },
];

export const topics = [
  {
    id: 'array',
    name: 'Array',
    kind: 'Global object',
    blurb: 'Ordered, zero-indexed, resizable lists. Arrays are objects, so `b = a` copies the reference, not the items.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    methods: array.methods,
    cards: array.cards,
  },
  { id: 'string', name: 'String', soon: true },
  { id: 'number', name: 'Number', soon: true },
  { id: 'date', name: 'Date', soon: true },
  { id: 'object', name: 'Object', soon: true },
  { id: 'map-set', name: 'Map & Set', soon: true },
  { id: 'promise', name: 'Promise', soon: true },
  { id: 'math', name: 'Math', soon: true },
];

export const defaultTopicId = 'array';

export function getTopic(id) {
  return topics.find((t) => t.id === id && !t.soon) || null;
}
