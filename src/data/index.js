// Registry of topics. To add a new one (e.g. Date):
//   1. Create src/data/date.js exporting `methods` and `cards` in the same shape as array.js.
//   2. Import it below and replace its `soon: true` entry with a full entry.
//   3. Add it to TOPICS in scripts/check-data.mjs and run `npm run check`.
import * as array from './array.js';
import * as object from './object.js';

// Sections, in the order MDN lists them. Empty sections are hidden.
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
    kinds: {
      mutates: { label: 'Mutates', hint: 'Changes the array you call it on.' },
      copy: { label: 'New array', hint: 'Leaves the original alone and gives back a new array.' },
      value: { label: 'Returns value', hint: 'Reads the array and returns an item, index, boolean, string or iterator.' },
    },
    extraFact: { field: 'holes', label: 'Empty slots' },
    copyBox: {
      shallow: '[...arr]  arr.slice()  Array.from(arr)',
      deep: 'structuredClone(arr)',
      intro: 'A shallow copy is a new outer array holding the same inner objects. A deep copy duplicates the inner objects too.',
    },
    methods: array.methods,
    cards: array.cards,
  },
  {
    id: 'object',
    name: 'Object',
    kind: 'Global object',
    blurb: 'Collections of key–value properties. Almost everything in JavaScript is an object, and `b = a` copies the reference, not the properties.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
    kinds: {
      mutates: { label: 'Mutates', hint: 'Changes the object you pass in (or call it on).' },
      copy: { label: 'Creates', hint: 'Builds a new object and leaves the input alone.' },
      value: { label: 'Inspects', hint: 'Reads the object and returns a value, list, boolean or string.' },
    },
    extraFact: { field: 'props', label: 'Which properties' },
    copyBox: {
      shallow: '{ ...obj }  Object.assign({}, obj)',
      deep: 'structuredClone(obj)',
      intro: 'A shallow copy is a new outer object holding the same nested objects. A deep copy duplicates the nested objects too.',
    },
    methods: object.methods,
    cards: object.cards,
  },
  { id: 'string', name: 'String', soon: true },
  { id: 'number', name: 'Number', soon: true },
  { id: 'date', name: 'Date', soon: true },
  { id: 'map-set', name: 'Map & Set', soon: true },
  { id: 'promise', name: 'Promise', soon: true },
  { id: 'math', name: 'Math', soon: true },
];

export const defaultTopicId = 'array';

export function getTopic(id) {
  return topics.find((t) => t.id === id && !t.soon) || null;
}
