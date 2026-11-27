// Array reference entries and quiz cards, checked against MDN (November 2026).
//
// Each entry:
//   id        URL-safe id, used in links like #/ref/array/slice
//   name      display name
//   group     'constructor' | 'static-method' | 'static-property' | 'instance-property' | 'instance-method'
//   kind      'mutates' | 'copy' | 'value'   (see KINDS in ./index.js)
//   sig       how you call it
//   one       one-line summary for the list (plain text)
//   what      what it does
//   returns   what you get back
//   changes   does it change the original?
//   copy      copy depth / what is copied
//   holes     how it treats empty slots in sparse arrays
//   instead   (mutating methods) the non-mutating alternative MDN suggests
//   example   code sample, shown as-is
//   details   key facts
//   watch     the most common mistake
//   mdn       MDN page
//   baseline  "Baseline: widely available since …" date from MDN, or null
//   deprecated true if MDN marks it deprecated
//
// Text in `backticks` inside prose fields is shown as inline code.
//
// EXAMPLES ARE TESTED: `npm run check` runs every example in Node.
// A line like   expr; // value   is checked: `expr` must equal `value`.
// A line like   expr; // RangeError   must throw that error.
// Comments that aren't valid JavaScript (e.g. "// logs 0 'a'") are treated as notes.

const MDN = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/';

export const methods = [
  // ───────────────────────── Constructor ─────────────────────────
  {
    id: 'Array', name: 'Array()', group: 'constructor', kind: 'copy',
    sig: 'new Array(item1, item2, …)\nnew Array(arrayLength)',
    one: 'Create an array',
    what: 'Creates a new array. Several arguments become the items. A single number sets the length and leaves every slot empty.',
    returns: 'New array', changes: 'No', copy: 'Not a copy — builds a new array',
    holes: '`Array(n)` makes n empty slots',
    example: `Array(1, 2, 3);  // [1, 2, 3]
Array('3');      // ['3']
Array(3).length; // 3
0 in Array(3);   // false
Array(1.5);      // RangeError`,
    details: [
      'Works the same with or without `new`.',
      'Only a single number argument means length. `Array(\'3\')` gives `[\'3\']`.',
      'Array literals like `[1, 2]` are the usual way to create arrays and never have the length quirk.',
      'A single number that is negative, fractional or 2³² or more throws a `RangeError`.',
    ],
    watch: '`Array(3)` gives three empty slots, not `[3]`. Use `Array.of(3)` or `[3]`.',
    mdn: MDN + 'Array', baseline: 'July 2015',
  },

  // ───────────────────────── Static methods ─────────────────────────
  {
    id: 'from', name: 'Array.from()', group: 'static-method', kind: 'copy',
    sig: 'Array.from(items, mapFn?, thisArg?)',
    one: 'Make an array from anything list-like',
    what: 'Creates a new, shallow-copied array from an iterable (string, Set, Map) or an array-like object.',
    returns: 'New array', changes: 'No', copy: 'Shallow',
    holes: 'Never sparse — missing indexes become `undefined`',
    example: `Array.from('hey');              // ['h', 'e', 'y']
Array.from(new Set([1, 1, 2])); // [1, 2]
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]
Array.from({ length: 2 });      // [undefined, undefined]`,
    details: [
      '`mapFn` runs on each item as it is added. It gets `(item, index)`.',
      '`Array.from(arr)` is one way to shallow-copy an array.',
      'Plain objects are neither iterable nor array-like. Use `Object.keys()`, `Object.values()` or `Object.entries()` for those.',
    ],
    watch: 'Shallow: objects inside are shared with the source.',
    mdn: MDN + 'from', baseline: 'September 2015',
  },
  {
    id: 'fromAsync', name: 'Array.fromAsync()', group: 'static-method', kind: 'copy',
    sig: 'Array.fromAsync(items, mapFn?, thisArg?)',
    one: 'Build an array from async data',
    what: 'Like `Array.from()`, but also accepts async iterables, and returns a Promise for the new array.',
    returns: 'Promise of a new array', changes: 'No', copy: 'Shallow',
    holes: '—',
    example: `const pending = [Promise.resolve(1), Promise.resolve(2)];
await Array.fromAsync(pending); // [1, 2]

await Array.fromAsync([1, 2], async (n) => n * 10); // [10, 20]`,
    details: [
      'Works with async iterables, normal iterables and array-likes.',
      'Awaits each value one at a time, in order. `Promise.all()` starts them all at once instead.',
      'The result of `mapFn` is awaited too.',
    ],
    watch: 'It returns a Promise, so you need `await` (or `.then()`) to get the array.',
    mdn: MDN + 'fromAsync', baseline: 'January 2024',
  },
  {
    id: 'isArray', name: 'Array.isArray()', group: 'static-method', kind: 'value',
    sig: 'Array.isArray(value)',
    one: 'Is this an array?',
    what: 'Returns `true` if `value` is an array, otherwise `false`.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied', holes: '—',
    example: `Array.isArray([]);                // true
Array.isArray({ length: 0 });     // false
Array.isArray(new Uint8Array(2)); // false
typeof [];                        // 'object'`,
    details: [
      '`typeof` cannot tell arrays from objects. Use this instead.',
      'Works for arrays from other realms (like iframes), where `instanceof Array` gives `false`.',
      'Typed arrays such as `Uint8Array` are not arrays.',
    ],
    watch: 'Array-like objects (`arguments`, a `NodeList`, `{ length: 0 }`) are not arrays. Convert them with `Array.from()` first.',
    mdn: MDN + 'isArray', baseline: 'July 2015',
  },
  {
    id: 'of', name: 'Array.of()', group: 'static-method', kind: 'copy',
    sig: 'Array.of(item1, item2, …)',
    one: 'Array from the arguments',
    what: 'Creates a new array from its arguments, however many there are and whatever type they are.',
    returns: 'New array', changes: 'No', copy: 'Not a copy — built from arguments', holes: '—',
    example: `Array.of(7);         // [7]
Array(7).length;     // 7
Array.of(1, 2);      // [1, 2]
Array.of(undefined); // [undefined]`,
    details: [
      'Avoids the `Array(n)` quirk where a single number means length.',
    ],
    watch: '`Array(3)` makes three empty slots, not `[3]`. `Array.of(3)` gives `[3]`.',
    mdn: MDN + 'of', baseline: 'September 2015',
  },

  // ───────────────────────── Static properties ─────────────────────────
  {
    id: 'symbol-species', name: 'Array[Symbol.species]', group: 'static-property', kind: 'value',
    sig: 'Array[Symbol.species]',
    one: 'Which constructor methods use for results',
    what: 'A getter that returns the constructor used when methods like `map()` or `filter()` build a new array. For `Array` it returns `Array` itself.',
    returns: 'A constructor (normally `Array`)', changes: 'No', copy: '—', holes: '—',
    example: `Array[Symbol.species] === Array; // true

class MyList extends Array {}
const list = MyList.from([1, 2, 3]);
list.map(x => x * 2) instanceof MyList; // true
list.toReversed() instanceof MyList;    // false`,
    details: [
      'It mostly matters when you subclass `Array`: `map()` on a subclass returns the subclass.',
      'Used by `concat()`, `filter()`, `flat()`, `flatMap()`, `map()`, `slice()` and `splice()`.',
      'Newer copying methods like `toReversed()` ignore it and always return a plain `Array`.',
    ],
    watch: 'MDN warns it can run arbitrary code and engines may remove it. Don\'t rely on it in your own code.',
    mdn: MDN + 'Symbol.species', baseline: 'January 2020',
  },

  // ───────────────────────── Instance properties ─────────────────────────
  {
    id: 'constructor', name: 'constructor', group: 'instance-property', kind: 'value',
    sig: 'arr.constructor',
    one: 'The function that created the array',
    what: 'Points to the function that created the array, which is `Array` for normal arrays.',
    returns: 'The `Array` function', changes: 'No', copy: '—', holes: '—',
    example: `[].constructor === Array; // true
[1, 2].constructor.name;  // 'Array'`,
    details: [
      'Every array gets it from `Array.prototype`.',
      'It can be reassigned, so it is not a reliable type check.',
    ],
    watch: 'Don\'t check `x.constructor === Array`. It can be overwritten and fails for arrays from iframes. Use `Array.isArray(x)`.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor',
    baseline: 'July 2015',
  },
  {
    id: 'length', name: 'length', group: 'instance-property', kind: 'value',
    sig: 'arr.length\narr.length = newLength',
    one: 'Number of slots; can be set',
    what: 'The number of slots in the array: one more than the highest index. You can assign to it to shorten or grow the array.',
    returns: 'A whole number from 0 to 2³² − 1', changes: 'Only when you assign to it', copy: '—',
    holes: 'Growing it adds empty slots',
    example: `const a = [1, 2, 3, 4];
a.length;  // 4

a.length = 2;
a;         // [1, 2]

a.length = 4;
a[3];      // undefined
3 in a;    // false`,
    details: [
      'Setting it smaller deletes items from the end.',
      'Setting it larger adds empty slots, not `undefined` values.',
      'Assigning to an index past the end grows `length` automatically.',
      'It counts slots, not filled items: `[ , , 1].length` is 3.',
    ],
    watch: 'An invalid length (negative, fractional, or 2³² or more) throws a `RangeError`.',
    mdn: MDN + 'length', baseline: 'July 2015',
  },
  {
    id: 'symbol-unscopables', name: '[Symbol.unscopables]', group: 'instance-property', kind: 'value', deprecated: true,
    sig: 'Array.prototype[Symbol.unscopables]',
    one: 'Method names hidden from with statements',
    what: 'An object listing newer array method names that a `with` statement should not treat as variables, so old code that used those names keeps working.',
    returns: 'Object of names set to `true`', changes: 'No', copy: '—', holes: '—',
    example: `const hidden = Array.prototype[Symbol.unscopables];
hidden.flat;                   // true
hidden.map;                    // undefined
Object.getPrototypeOf(hidden); // null`,
    details: [
      'Lists `at`, `copyWithin`, `entries`, `fill`, `find`, `findIndex`, `findLast`, `findLastIndex`, `flat`, `flatMap`, `includes`, `keys`, `toReversed`, `toSorted`, `toSpliced` and `values`.',
      '`with` statements are not allowed in strict mode, so you will rarely meet this.',
    ],
    watch: 'MDN marks it deprecated. It only exists for old code; you never need to use it.',
    mdn: MDN + 'Symbol.unscopables', baseline: null,
  },

  // ───────────────────────── Instance methods ─────────────────────────
  {
    id: 'at', name: 'at()', group: 'instance-method', kind: 'value',
    sig: 'arr.at(index)',
    one: 'Item at an index, negatives allowed',
    what: 'Returns the item at `index`. Negative numbers count back from the end.',
    returns: 'The item, or undefined', changes: 'No', copy: 'Returns the item itself',
    holes: 'Reads as `undefined`',
    example: `const a = ['x', 'y', 'z'];
a.at(0);  // 'x'
a.at(-1); // 'z'
a.at(5);  // undefined`,
    details: [
      'Cleaner than `arr[arr.length - 1]`.',
      'An index outside the array returns `undefined`.',
      'Pair it with `with()` to write at a negative index.',
    ],
    watch: '`arr[-1]` is not the same as `at(-1)`: it looks up a property named "-1".',
    mdn: MDN + 'at', baseline: 'March 2022',
  },
  {
    id: 'concat', name: 'concat()', group: 'instance-method', kind: 'copy',
    sig: 'arr.concat(value1, value2, …)',
    one: 'Join arrays together',
    what: 'Returns a new array: the original items followed by each argument. Array arguments have their items added; other values are added as-is.',
    returns: 'New array', changes: 'No', copy: 'Shallow', holes: 'Preserved',
    example: `const a = [1, 2];
a.concat([3, 4], 5); // [1, 2, 3, 4, 5]
a;                   // [1, 2]
[1].concat([[2]]);   // [1, [2]]`,
    details: [
      'Only spreads one level. Nested arrays stay nested.',
      'With no arguments it returns a shallow copy.',
      'Spread equivalent: `[...a, ...b]`.',
    ],
    watch: 'Nested arrays and objects are shared with the originals, not copied.',
    mdn: MDN + 'concat', baseline: 'July 2015',
  },
  {
    id: 'copyWithin', name: 'copyWithin()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.copyWithin(target, start, end?)',
    one: 'Copy part of the array over another part',
    what: 'Copies the items from `start` up to `end` to position `target`, overwriting what was there. The length never changes.',
    returns: 'The same array', changes: 'Yes', copy: 'None — edits in place',
    holes: 'Preserved — copied holes stay empty',
    instead: 'No single-method alternative',
    example: `[1, 2, 3, 4, 5].copyWithin(0, 3);    // [4, 5, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(1, 0, 2); // [1, 1, 2, 4, 5]`,
    details: [
      'Never grows the array. Anything that would run past the end is dropped.',
      'Overlapping ranges are handled correctly.',
      '`end` is exclusive. Negative indexes count from the end.',
    ],
    watch: 'The first argument is where to paste, not where to copy from.',
    mdn: MDN + 'copyWithin', baseline: 'September 2015',
  },
  {
    id: 'entries', name: 'entries()', group: 'instance-method', kind: 'value',
    sig: 'arr.entries()',
    one: 'Iterate [index, value] pairs',
    what: 'Returns an iterator that yields `[index, value]` pairs.',
    returns: 'Array iterator', changes: 'No', copy: 'Nothing copied — reads the live array',
    holes: 'Treated as `undefined`',
    example: `const letters = ['a', 'b'];
[...letters.entries()]; // [[0, 'a'], [1, 'b']]

for (const [i, letter] of letters.entries()) {
  console.log(i, letter);
}
// logs 0 'a', then 1 'b'`,
    details: [
      'Use it with `for…of` when you need both the index and the value.',
      'The iterator can only be used once. Call `entries()` again to loop again.',
    ],
    watch: 'It returns an iterator, not an array. Spread it (`[...arr.entries()]`) to see the pairs.',
    mdn: MDN + 'entries', baseline: 'July 2015',
  },
  {
    id: 'every', name: 'every()', group: 'instance-method', kind: 'value',
    sig: 'arr.every((item, index, array) => …)',
    one: 'Do all items pass?',
    what: 'Returns `true` if the callback returns a truthy value for every item.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `[2, 4, 6].every(n => n % 2 === 0); // true
[1, 2, 30].every(n => n < 10);     // false
[].every(n => n > 100);            // true`,
    details: [
      'Stops at the first failing item.',
      '`some()` is the opposite check: does at least one item pass?',
    ],
    watch: 'An empty array always returns `true`.',
    mdn: MDN + 'every', baseline: 'July 2015',
  },
  {
    id: 'fill', name: 'fill()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.fill(value, start?, end?)',
    one: 'Overwrite items with one value',
    what: 'Sets every slot from `start` up to, but not including, `end` to `value`.',
    returns: 'The same array', changes: 'Yes', copy: 'None — edits in place',
    holes: 'Filled like any other slot',
    instead: 'No single-method alternative',
    example: `new Array(3).fill(0);       // [0, 0, 0]
[1, 2, 3, 4].fill(9, 1, 3); // [1, 9, 9, 4]
[].fill(1);                 // []`,
    details: [
      '`end` is exclusive. Negative indexes count from the end.',
      'It never changes the length, so filling an empty array does nothing.',
      'Pairs well with `new Array(n)` to build a pre-filled array.',
    ],
    watch: '`fill({})` puts the same object in every slot. Use `Array.from({ length: n }, () => ({}))` for separate objects.',
    mdn: MDN + 'fill', baseline: 'September 2015',
  },
  {
    id: 'filter', name: 'filter()', group: 'instance-method', kind: 'copy',
    sig: 'arr.filter((item, index, array) => …)',
    one: 'Keep items that pass a test',
    what: 'Returns a new array with only the items for which the callback returns a truthy value.',
    returns: 'New array, possibly empty', changes: 'No', copy: 'Shallow',
    holes: 'Skipped — left out of the result',
    example: `const nums = [1, 2, 3, 4];
nums.filter(n => n % 2 === 0); // [2, 4]
nums.filter(n => n > 10);      // []
nums;                          // [1, 2, 3, 4]`,
    details: [
      'Returns `[]` when nothing matches, never `undefined`.',
      'Kept objects are the same references as in the original.',
      'Only need the first match? `find()` stops early.',
    ],
    watch: 'Editing an object in the result edits it in the original too.',
    mdn: MDN + 'filter', baseline: 'July 2015',
  },
  {
    id: 'find', name: 'find()', group: 'instance-method', kind: 'value',
    sig: 'arr.find((item, index, array) => …)',
    one: 'First item that matches',
    what: 'Returns the first item for which the callback returns a truthy value.',
    returns: 'The item, or undefined', changes: 'No', copy: 'Returns the item itself',
    holes: 'Treated as `undefined`',
    example: `const users = [{ id: 1 }, { id: 2 }];
users.find(u => u.id === 2); // { id: 2 }
users.find(u => u.id === 9); // undefined`,
    details: [
      'Stops at the first match.',
      '`findIndex()` returns the index instead. `findLast()` searches from the end.',
      'Returns `undefined` for "no match" and for a matching `undefined` item. Use `findIndex()` if you need to tell them apart.',
    ],
    watch: 'The returned object is the one in the array. Changing it changes the array.',
    mdn: MDN + 'find', baseline: 'September 2015',
  },
  {
    id: 'findIndex', name: 'findIndex()', group: 'instance-method', kind: 'value',
    sig: 'arr.findIndex((item, index, array) => …)',
    one: 'Index of the first match',
    what: 'Returns the index of the first item for which the callback returns a truthy value.',
    returns: 'Index, or -1', changes: 'No', copy: 'Nothing copied',
    holes: 'Treated as `undefined`',
    example: `const nums = [5, 12, 8, 130];
nums.findIndex(n => n > 10);  // 1
nums.findIndex(n => n > 500); // -1`,
    details: [
      'Stops at the first match.',
      'Use `indexOf()` when you are looking for an exact value rather than running a test.',
      '`findLastIndex()` searches from the end.',
    ],
    watch: '`if (i)` is the wrong check: -1 is truthy and 0 is falsy. Write `if (i !== -1)`.',
    mdn: MDN + 'findIndex', baseline: 'September 2015',
  },
  {
    id: 'findLast', name: 'findLast()', group: 'instance-method', kind: 'value',
    sig: 'arr.findLast((item, index, array) => …)',
    one: 'Last item that matches',
    what: 'Searches from the end and returns the first item, counting backwards, for which the callback returns a truthy value.',
    returns: 'The item, or undefined', changes: 'No', copy: 'Returns the item itself',
    holes: 'Treated as `undefined`',
    example: `const nums = [5, 12, 8, 130, 44];
nums.findLast(n => n > 45);  // 130
nums.findLast(n => n > 500); // undefined`,
    details: [
      'Searches from the end, without making a reversed copy.',
      'Use `findLastIndex()` if you need the index.',
    ],
    watch: 'It returns `undefined`, not -1, when nothing matches.',
    mdn: MDN + 'findLast', baseline: 'August 2022',
  },
  {
    id: 'findLastIndex', name: 'findLastIndex()', group: 'instance-method', kind: 'value',
    sig: 'arr.findLastIndex((item, index, array) => …)',
    one: 'Index of the last match',
    what: 'Searches from the end and returns the index of the last item for which the callback returns a truthy value.',
    returns: 'Index, or -1', changes: 'No', copy: 'Nothing copied',
    holes: 'Treated as `undefined`',
    example: `const nums = [5, 12, 50, 130, 44];
nums.findLastIndex(n => n > 45);  // 3
nums.findLastIndex(n => n > 500); // -1`,
    details: [
      'Searches from the end.',
      'Its value-returning partner is `findLast()`.',
    ],
    watch: 'Compare with -1 (`i !== -1`). `if (i)` treats index 0 as "not found".',
    mdn: MDN + 'findLastIndex', baseline: 'August 2022',
  },
  {
    id: 'flat', name: 'flat()', group: 'instance-method', kind: 'copy',
    sig: 'arr.flat(depth = 1)',
    one: 'Flatten nested arrays',
    what: 'Returns a new array with sub-array items pulled up into it, to the given depth.',
    returns: 'New array', changes: 'No', copy: 'Shallow', holes: 'Removed',
    example: `[1, [2, [3, [4]]]].flat();         // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]
[1, , 3].flat();                   // [1, 3]`,
    details: [
      'Default depth is 1. `flat(Infinity)` flattens every level.',
      'Removes empty slots at the levels it flattens.',
      'Only real arrays are flattened. Array-like objects are left as they are.',
    ],
    watch: 'Objects inside are not copied. Only the array structure is new.',
    mdn: MDN + 'flat', baseline: 'January 2020',
  },
  {
    id: 'flatMap', name: 'flatMap()', group: 'instance-method', kind: 'copy',
    sig: 'arr.flatMap((item, index, array) => …)',
    one: 'Map, then flatten one level',
    what: 'Calls the callback on each item and flattens the results by one level into a new array.',
    returns: 'New array', changes: 'No', copy: 'New array of callback results', holes: 'Skipped',
    example: `['hi there', 'bye'].flatMap(s => s.split(' ')); // ['hi', 'there', 'bye']
[1, 2, 3].flatMap(n => (n === 2 ? [] : [n]));   // [1, 3]
[1, 2].flatMap(n => [[n]]);                     // [[1], [2]]`,
    details: [
      'Same result as `map()` followed by `flat(1)`, in one step.',
      'Return `[]` to drop an item, or several items to add more than one.',
      'A non-array return value is added as a single item.',
    ],
    watch: 'Only one level is flattened. For deeper nesting use `map()` then `flat(depth)`.',
    mdn: MDN + 'flatMap', baseline: 'January 2020',
  },
  {
    id: 'forEach', name: 'forEach()', group: 'instance-method', kind: 'value',
    sig: 'arr.forEach((item, index, array) => …)',
    one: 'Run code for each item',
    what: 'Calls the callback once for each item. Returns nothing.',
    returns: 'undefined', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `['a', 'b'].forEach((letter, i) => {
  console.log(i, letter);
});
// logs 0 'a', then 1 'b'

[1, 2].forEach(n => n * 2); // undefined`,
    details: [
      'It cannot be stopped early except by throwing. Use `for…of`, `some()`, `every()` or `find()` if you need to stop.',
      'Not chainable, because it returns `undefined`.',
    ],
    watch: 'It does not wait for promises or async callbacks. Use `for…of` with `await` instead.',
    mdn: MDN + 'forEach', baseline: 'July 2015',
  },
  {
    id: 'includes', name: 'includes()', group: 'instance-method', kind: 'value',
    sig: 'arr.includes(value, fromIndex?)',
    one: 'Is this value in the array?',
    what: 'Returns `true` if the array contains `value`.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    holes: 'Treated as `undefined`',
    example: `[1, 2, 3].includes(2);       // true
['1', '2'].includes(1);       // false
[NaN].includes(NaN);         // true
[{ a: 1 }].includes({ a: 1 }); // false`,
    details: [
      'Uses SameValueZero: like `===`, except `NaN` matches `NaN`.',
      'Type matters: `\'1\'` and `1` are different.',
      'A negative `fromIndex` counts back from the end.',
    ],
    watch: 'Objects match by reference, not contents. Two look-alike objects are different values.',
    mdn: MDN + 'includes', baseline: 'August 2016',
  },
  {
    id: 'indexOf', name: 'indexOf()', group: 'instance-method', kind: 'value',
    sig: 'arr.indexOf(value, fromIndex?)',
    one: 'Index of a value',
    what: 'Returns the first index where `value` is found, comparing with `===`.',
    returns: 'Index, or -1', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `const pets = ['cat', 'dog', 'cat'];
pets.indexOf('cat');    // 0
pets.indexOf('cat', 1); // 2
pets.indexOf('fox');    // -1
[NaN].indexOf(NaN);     // -1`,
    details: [
      'Uses strict equality, so it never finds `NaN`. `includes()` does.',
      'A negative `fromIndex` counts back from the end, but the search still runs forwards.',
      '`lastIndexOf()` searches backwards.',
    ],
    watch: '`if (arr.indexOf(x))` is wrong: -1 is truthy and 0 is falsy. Use `includes()` for a yes/no check.',
    mdn: MDN + 'indexOf', baseline: 'July 2015',
  },
  {
    id: 'join', name: 'join()', group: 'instance-method', kind: 'value',
    sig: 'arr.join(separator = ",")',
    one: 'Turn into a string',
    what: 'Joins all items into one string, separated by `separator`.',
    returns: 'String', changes: 'No', copy: 'Nothing copied',
    holes: 'Become empty strings',
    example: `['a', 'b', 'c'].join('-');  // 'a-b-c'
['a', 'b', 'c'].join();     // 'a,b,c'
[1, null, 3].join();        // '1,,3'
[1, [2, 3]].join(' + ');    // '1 + 2,3'`,
    details: [
      'The default separator is a comma.',
      '`null` and `undefined` become empty strings.',
      'Nested arrays are joined with commas, whatever separator you pass.',
    ],
    watch: 'Objects become `"[object Object]"`. Map them to strings first.',
    mdn: MDN + 'join', baseline: 'July 2015',
  },
  {
    id: 'keys', name: 'keys()', group: 'instance-method', kind: 'value',
    sig: 'arr.keys()',
    one: 'Iterate the indexes',
    what: 'Returns an iterator that yields each index from 0 to `length - 1`.',
    returns: 'Array iterator', changes: 'No', copy: 'Nothing copied',
    holes: 'Included (unlike `Object.keys()`)',
    example: `const arr = ['a', , 'c'];
[...arr.keys()];  // [0, 1, 2]
Object.keys(arr); // ['0', '2']`,
    details: [
      'Yields numbers. `Object.keys()` gives strings.',
      'Includes the indexes of empty slots. `Object.keys()` skips them.',
    ],
    watch: 'It returns an iterator, not an array. Spread it or loop over it with `for…of`.',
    mdn: MDN + 'keys', baseline: 'July 2015',
  },
  {
    id: 'lastIndexOf', name: 'lastIndexOf()', group: 'instance-method', kind: 'value',
    sig: 'arr.lastIndexOf(value, fromIndex?)',
    one: 'Last index of a value',
    what: 'Searches backwards and returns the last index where `value` is found, comparing with `===`.',
    returns: 'Index, or -1', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `const pets = ['cat', 'dog', 'cat'];
pets.lastIndexOf('cat');    // 2
pets.lastIndexOf('cat', 1); // 0
pets.lastIndexOf('fox');    // -1`,
    details: [
      'Searches backwards from `fromIndex` (default: the last item).',
      'Uses `===`, so it never finds `NaN`.',
    ],
    watch: 'Compare the result with -1. `if (i)` treats index 0 as "not found".',
    mdn: MDN + 'lastIndexOf', baseline: 'July 2015',
  },
  {
    id: 'map', name: 'map()', group: 'instance-method', kind: 'copy',
    sig: 'arr.map((item, index, array) => …)',
    one: 'Transform each item',
    what: 'Calls the callback on every item and returns a new array of the results.',
    returns: 'New array, same length', changes: 'No', copy: 'New array of callback results',
    holes: 'Skipped — they stay empty in the result',
    example: `const prices = [10, 20];
prices.map(p => p * 2); // [20, 40]
prices;                 // [10, 20]

['1', '2', '3'].map(parseInt); // [1, NaN, NaN]`,
    details: [
      'The callback gets `(item, index, array)`, which is why passing `parseInt` gives odd results: the index becomes the radix.',
      'If the callback returns nothing, that slot is `undefined`. Use `filter()` or `flatMap()` to drop items.',
      'Use `forEach()` or `for…of` if you don\'t need the result.',
    ],
    watch: '`items.map(i => { i.done = true; return i })` mutates the original objects. Return `{ ...i, done: true }` instead.',
    mdn: MDN + 'map', baseline: 'July 2015',
  },
  {
    id: 'pop', name: 'pop()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.pop()',
    one: 'Remove the last item',
    what: 'Removes the last item and returns it.',
    returns: 'Removed item, or undefined', changes: 'Yes', copy: 'None — edits in place', holes: '—',
    instead: '`arr.slice(0, -1)`',
    example: `const stack = ['a', 'b', 'c'];
stack.pop(); // 'c'
stack;       // ['a', 'b']
[].pop();    // undefined`,
    details: [
      'On an empty array it returns `undefined` and does nothing.',
      '`push()` plus `pop()` gives you a stack (last in, first out).',
    ],
    watch: '`undefined` can mean "empty" or "the last item was undefined". Check `length` if it matters.',
    mdn: MDN + 'pop', baseline: 'July 2015',
  },
  {
    id: 'push', name: 'push()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.push(item1, item2, …)',
    one: 'Add items to the end',
    what: 'Adds one or more items to the end of the array and returns the new length.',
    returns: 'New length (number)', changes: 'Yes', copy: 'None — edits in place', holes: '—',
    instead: '`arr.concat([v1, v2])` or `[...arr, v1, v2]`',
    example: `const nums = [1, 2];
nums.push(3, 4); // 4
nums;            // [1, 2, 3, 4]

nums.push([5]);  // 5
nums;            // [1, 2, 3, 4, [5]]`,
    details: [
      'Each argument becomes one item, so pushing an array adds it nested.',
      '`push(...other)` adds the items of `other`, but very large arrays can exceed the argument limit. Use `concat()` or a loop for those.',
    ],
    watch: '`arr = arr.push(x)` replaces your array with a number.',
    mdn: MDN + 'push', baseline: 'July 2015',
  },
  {
    id: 'reduce', name: 'reduce()', group: 'instance-method', kind: 'value',
    sig: 'arr.reduce((acc, item, index, array) => …, initialValue)',
    one: 'Boil down to one value',
    what: 'Runs the callback on each item, left to right, carrying an accumulator along, and returns the final accumulator.',
    returns: 'Whatever the callback builds', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `[5, 10, 15].reduce((sum, n) => sum + n, 0); // 30
[5, 10, 15].reduce((sum, n) => sum + n);    // 30
[].reduce((sum, n) => sum + n, 0);          // 0
[].reduce((sum, n) => sum + n);             // TypeError`,
    details: [
      'Without `initialValue`, the first item is the starting accumulator and the callback starts at index 1.',
      'A one-item array with no `initialValue` returns that item without calling the callback.',
      'To total a property of objects, you must pass an `initialValue` such as `0`.',
    ],
    watch: 'An empty array with no `initialValue` throws a `TypeError`. Always pass one.',
    mdn: MDN + 'reduce', baseline: 'July 2015',
  },
  {
    id: 'reduceRight', name: 'reduceRight()', group: 'instance-method', kind: 'value',
    sig: 'arr.reduceRight((acc, item, index, array) => …, initialValue)',
    one: 'Reduce from right to left',
    what: 'Works like `reduce()`, but goes through the items from last to first.',
    returns: 'Whatever the callback builds', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `['a', 'b', 'c'].reduce((acc, s) => acc + s);      // 'abc'
['a', 'b', 'c'].reduceRight((acc, s) => acc + s); // 'cba'`,
    details: [
      'Without `initialValue`, the last item is the starting accumulator.',
      'All the `reduce()` rules apply.',
    ],
    watch: 'An empty array with no `initialValue` throws a `TypeError`, just like `reduce()`.',
    mdn: MDN + 'reduceRight', baseline: 'July 2015',
  },
  {
    id: 'reverse', name: 'reverse()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.reverse()',
    one: 'Reverse in place',
    what: 'Reverses the order of the items in place and returns the same array.',
    returns: 'The same array, reversed', changes: 'Yes', copy: 'None — edits in place',
    holes: 'Preserved (mirrored)',
    instead: '`toReversed()`',
    example: `const a = [1, 2, 3];
const b = a.reverse();

a;       // [3, 2, 1]
b === a; // true`,
    details: [
      'The return value is the same array, not a copy.',
      'For a reversed copy use `toReversed()` or `[...arr].reverse()`.',
    ],
    watch: '`const r = arr.reverse()` still changes `arr`.',
    mdn: MDN + 'reverse', baseline: 'July 2015',
  },
  {
    id: 'shift', name: 'shift()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.shift()',
    one: 'Remove the first item',
    what: 'Removes the first item and returns it. Every remaining item moves down one index.',
    returns: 'Removed item, or undefined', changes: 'Yes', copy: 'None — edits in place', holes: '—',
    instead: '`arr.slice(1)`',
    example: `const queue = [1, 2, 3];
queue.shift(); // 1
queue;         // [2, 3]
[].shift();    // undefined`,
    details: [
      '`push()` plus `shift()` gives you a queue (first in, first out).',
      'Because every item moves, it is slower than `pop()` on very large arrays.',
    ],
    watch: 'Any index you saved before calling `shift()` now points one item off.',
    mdn: MDN + 'shift', baseline: 'July 2015',
  },
  {
    id: 'slice', name: 'slice()', group: 'instance-method', kind: 'copy',
    sig: 'arr.slice(start?, end?)',
    one: 'Copy a portion',
    what: 'Returns a shallow copy of the items from `start` up to, but not including, `end`.',
    returns: 'New array', changes: 'No', copy: 'Shallow', holes: 'Preserved',
    example: `const a = ['a', 'b', 'c', 'd'];
a.slice(1, 3); // ['b', 'c']
a.slice(-2);   // ['c', 'd']
a.slice();     // ['a', 'b', 'c', 'd']
a.slice(9);    // []`,
    details: [
      '`end` is exclusive. Negative indexes count from the end.',
      '`slice()` with no arguments copies the whole array.',
      'Returns `[]` if `start` is past the end or `end` is at or before `start`.',
    ],
    watch: 'Shallow: nested objects and arrays are shared between the copy and the original.',
    mdn: MDN + 'slice', baseline: 'July 2015',
  },
  {
    id: 'some', name: 'some()', group: 'instance-method', kind: 'value',
    sig: 'arr.some((item, index, array) => …)',
    one: 'Does any item pass?',
    what: 'Returns `true` if the callback returns a truthy value for at least one item.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied', holes: 'Skipped',
    example: `[1, 5, 12].some(n => n > 10); // true
[1, 5].some(n => n > 10);     // false
[].some(n => true);           // false`,
    details: [
      'Stops at the first passing item.',
      '`every()` is the opposite check: do all items pass?',
    ],
    watch: 'An empty array always returns `false`.',
    mdn: MDN + 'some', baseline: 'July 2015',
  },
  {
    id: 'sort', name: 'sort()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.sort(compareFn?)',
    one: 'Sort in place',
    what: 'Sorts the items in place and returns the same array. Without `compareFn`, items are turned into strings and sorted in dictionary order.',
    returns: 'The same array, sorted', changes: 'Yes', copy: 'None — edits in place',
    holes: 'Moved to the end, after `undefined`',
    instead: '`toSorted()`',
    example: `// Default: compared as strings
[40, 1, 5, 200].sort();                // [1, 200, 40, 5]

// Numbers, smallest first: a - b
[40, 1, 5, 200].sort((a, b) => a - b); // [1, 5, 40, 200]

// Numbers, largest first: b - a
[40, 1, 5, 200].sort((a, b) => b - a); // [200, 40, 5, 1]

// Objects by a property
const people = [{ age: 30 }, { age: 18 }];
people.sort((a, b) => a.age - b.age);  // [{ age: 18 }, { age: 30 }]

// Strings, A to Z with proper accents
['é', 'z', 'a'].sort((a, b) => a.localeCompare(b)); // ['a', 'é', 'z']`,
    details: [
      '`compareFn(a, b)` returns a negative number to put `a` first, a positive number to put `b` first, or 0 to keep their order.',
      '`a - b` is negative when `a` is smaller, so small numbers go first (ascending). `b - a` flips the sign, so large numbers go first (descending).',
      'The sort is stable: items that compare equal keep their original order.',
      '`undefined` items go to the end and are never passed to `compareFn`.',
    ],
    watch: 'Always pass a `compareFn` for numbers. Use `toSorted()` if you need the original left alone.',
    mdn: MDN + 'sort', baseline: 'July 2015',
  },
  {
    id: 'splice', name: 'splice()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.splice(start, deleteCount?, item1, item2, …)',
    one: 'Remove, replace or insert anywhere',
    what: 'Removes `deleteCount` items starting at `start`, optionally inserts new items there, and returns the removed items.',
    returns: 'Array of removed items', changes: 'Yes', copy: 'None — edits in place',
    holes: 'Preserved',
    instead: '`toSpliced()`',
    example: `const m = ['Jan', 'Mar', 'Apr'];
m.splice(1, 0, 'Feb'); // []
m;                     // ['Jan', 'Feb', 'Mar', 'Apr']

m.splice(-1, 1);       // ['Apr']
m.splice(1);           // ['Feb', 'Mar']
m;                     // ['Jan']`,
    details: [
      'A negative `start` counts from the end.',
      'Leave out `deleteCount` to remove everything from `start` onward.',
      'To insert items and also remove everything after, pass `Infinity` as `deleteCount`. An explicit `undefined` counts as 0.',
    ],
    watch: 'Easy to mix up with `slice()`. `splice()` changes the array; `slice()` never does.',
    mdn: MDN + 'splice', baseline: 'July 2015',
  },
  {
    id: 'toLocaleString', name: 'toLocaleString()', group: 'instance-method', kind: 'value',
    sig: 'arr.toLocaleString(locales?, options?)',
    one: 'Locale-formatted string',
    what: 'Calls `toLocaleString()` on each item and joins the results with a separator.',
    returns: 'String', changes: 'No', copy: 'Nothing copied',
    holes: 'Become empty strings',
    example: `const prices = [1234.5, 99];
const usd = { style: 'currency', currency: 'USD' };

prices.toLocaleString('en-US');      // '1,234.5,99'
prices.toLocaleString('en-US', usd); // '$1,234.50,$99.00'`,
    details: [
      '`locales` and `options` are passed to each item, e.g. for number or date formatting.',
      'They do not change the separator. Use `Intl.ListFormat` for "a, b and c" style lists.',
      '`null` and `undefined` become empty strings.',
    ],
    watch: 'In English the separator is a comma, so numbers with thousands separators run together.',
    mdn: MDN + 'toLocaleString', baseline: 'July 2015',
  },
  {
    id: 'toReversed', name: 'toReversed()', group: 'instance-method', kind: 'copy',
    sig: 'arr.toReversed()',
    one: 'Reversed copy',
    what: 'Returns a new array with the items in reverse order. The original is unchanged.',
    returns: 'New array', changes: 'No', copy: 'Shallow',
    holes: 'Become `undefined`',
    example: `const a = [1, 2, 3];
a.toReversed(); // [3, 2, 1]
a;              // [1, 2, 3]`,
    details: [
      'The copying version of `reverse()`.',
      'Never returns a sparse array: empty slots become `undefined`.',
    ],
    watch: 'A newer method (Baseline since July 2023). Older browsers need a polyfill.',
    mdn: MDN + 'toReversed', baseline: 'July 2023',
  },
  {
    id: 'toSorted', name: 'toSorted()', group: 'instance-method', kind: 'copy',
    sig: 'arr.toSorted(compareFn?)',
    one: 'Sorted copy',
    what: 'Works like `sort()`, but returns a new sorted array and leaves the original alone.',
    returns: 'New array', changes: 'No', copy: 'Shallow',
    holes: 'Become `undefined`, sorted to the end',
    example: `const scores = [30, 5, 12];
scores.toSorted();               // [12, 30, 5]
scores.toSorted((a, b) => a - b); // [5, 12, 30]
scores.toSorted((a, b) => b - a); // [30, 12, 5]
scores;                          // [30, 5, 12]`,
    details: [
      'The copying version of `sort()`, with the same `compareFn` rules.',
      '`(a, b) => a - b` sorts numbers smallest first; `(a, b) => b - a` sorts them largest first.',
      'Never returns a sparse array: empty slots become `undefined`.',
    ],
    watch: 'Same string-based default as `sort()`, so `[30, 5, 12].toSorted()` is not numeric order.',
    mdn: MDN + 'toSorted', baseline: 'July 2023',
  },
  {
    id: 'toSpliced', name: 'toSpliced()', group: 'instance-method', kind: 'copy',
    sig: 'arr.toSpliced(start, skipCount?, item1, item2, …)',
    one: 'Copy with items removed or inserted',
    what: 'Works like `splice()`, but returns a new array and leaves the original alone.',
    returns: 'New array', changes: 'No', copy: 'Shallow',
    holes: 'Become `undefined`',
    example: `const m = ['Jan', 'Mar', 'Apr'];
m.toSpliced(1, 0, 'Feb'); // ['Jan', 'Feb', 'Mar', 'Apr']
m.toSpliced(-1, 1);       // ['Jan', 'Mar']
m;                        // ['Jan', 'Mar', 'Apr']`,
    details: [
      'The copying version of `splice()`.',
      'Unlike `splice()`, it returns the new array, not the removed items.',
      'Also a copy-style alternative to `unshift()`: `arr.toSpliced(0, 0, x)`.',
    ],
    watch: 'If you need the removed items, read them with `slice()` first.',
    mdn: MDN + 'toSpliced', baseline: 'July 2023',
  },
  {
    id: 'toString', name: 'toString()', group: 'instance-method', kind: 'value',
    sig: 'arr.toString()',
    one: 'Comma-separated string',
    what: 'Returns the items joined with commas. It calls `join()` internally.',
    returns: 'String', changes: 'No', copy: 'Nothing copied',
    holes: 'Become empty strings',
    example: `[1, 2, 'a'].toString();   // '1,2,a'
[1, [2, [3]]].toString(); // '1,2,3'
String([1, 2]);           // '1,2'`,
    details: [
      'JavaScript calls it for you when an array is used as text, e.g. `\'\' + [1, 2]`.',
      'Nested arrays look flattened.',
    ],
    watch: 'String concatenation silently turns arrays into comma lists. Use `JSON.stringify(arr)` to keep the brackets.',
    mdn: MDN + 'toString', baseline: 'July 2015',
  },
  {
    id: 'unshift', name: 'unshift()', group: 'instance-method', kind: 'mutates',
    sig: 'arr.unshift(item1, item2, …)',
    one: 'Add items to the start',
    what: 'Inserts items at the start of the array and returns the new length.',
    returns: 'New length (number)', changes: 'Yes', copy: 'None — edits in place', holes: '—',
    instead: '`arr.toSpliced(0, 0, v1, v2)` or `[v1, v2, ...arr]`',
    example: `const list = [3, 4];
list.unshift(1, 2); // 4
list;               // [1, 2, 3, 4]

const b = [3];
b.unshift(1);
b.unshift(2);
b;                  // [2, 1, 3]`,
    details: [
      'Several items in one call keep the order you pass them in.',
      'Separate calls each go to the very front, so the order ends up reversed.',
    ],
    watch: 'Like `push()`, it returns the length, not the array.',
    mdn: MDN + 'unshift', baseline: 'July 2015',
  },
  {
    id: 'values', name: 'values()', group: 'instance-method', kind: 'value',
    sig: 'arr.values()',
    one: 'Iterate the values',
    what: 'Returns an iterator that yields each item in order. It is the same function as `arr[Symbol.iterator]`.',
    returns: 'Array iterator', changes: 'No', copy: 'Nothing copied — reads the live array',
    holes: 'Treated as `undefined`',
    example: `const it = ['a', 'b'].values();
it.next(); // { value: 'a', done: false }
it.next(); // { value: 'b', done: false }
it.next(); // { value: undefined, done: true }`,
    details: [
      '`for…of` uses this behind the scenes.',
      'The iterator can only be used once, and it reads the live array, so later changes show up.',
      '`Array.prototype.values === Array.prototype[Symbol.iterator]` is `true`.',
    ],
    watch: 'Pushing to the array while looping over it with `for…of` can loop forever.',
    mdn: MDN + 'values', baseline: 'May 2018',
  },
  {
    id: 'with', name: 'with()', group: 'instance-method', kind: 'copy',
    sig: 'arr.with(index, value)',
    one: 'Copy with one item changed',
    what: 'Returns a new array with the item at `index` replaced by `value`.',
    returns: 'New array', changes: 'No', copy: 'Shallow',
    holes: 'Become `undefined`',
    example: `const a = [1, 2, 3];
a.with(1, 20);  // [1, 20, 3]
a.with(-1, 30); // [1, 2, 30]
a;              // [1, 2, 3]
a.with(5, 0);   // RangeError`,
    details: [
      'The copying version of `arr[i] = value`.',
      'A negative index counts from the end.',
      'Chainable: `arr.with(0, x).map(…)`.',
    ],
    watch: 'Unlike `arr[i] = value`, an index outside the array throws a `RangeError` instead of growing it.',
    mdn: MDN + 'with', baseline: 'July 2023',
  },
  {
    id: 'symbol-iterator', name: '[Symbol.iterator]()', group: 'instance-method', kind: 'value',
    sig: 'arr[Symbol.iterator]()',
    one: 'What makes arrays work with for…of',
    what: 'Returns the same iterator as `values()`. `for…of`, spread and destructuring call it for you.',
    returns: 'Array iterator', changes: 'No', copy: 'Nothing copied — reads the live array',
    holes: 'Treated as `undefined`',
    example: `const arr = ['a', 'b'];
arr[Symbol.iterator] === arr.values; // true
[...arr];                            // ['a', 'b']

const [first] = arr;
first;                               // 'a'`,
    details: [
      'You rarely call it directly.',
      'Any object with a `[Symbol.iterator]` method works with `for…of` and spread. That is why strings, Sets and Maps do.',
    ],
    watch: 'Each call returns a fresh iterator, but one iterator can only be looped once.',
    mdn: MDN + 'Symbol.iterator', baseline: 'September 2016',
  },
];

// Quiz cards.
//   kind: 'flip'    → show answer, then rate yourself
//   kind: 'choice'  → pick one of `options`; `answer` is the correct index
//   methodId links the card to its reference entry (null if none).
//   verify is a JavaScript expression that must be true; `npm run check` runs it.
export const cards = [
  {
    id: 'sort-mutates', methodId: 'sort', kind: 'choice', topic: 'sort()',
    q: 'Does sort() change the original array?',
    options: ['Yes, in place', 'No, it returns a copy'], answer: 0,
    explain: '`sort()` sorts in place and returns the same array. Use `toSorted()` to keep the original.',
    verify: '(() => { const a = [3, 1, 2]; const b = a.sort(); return a === b && a[0] === 1; })()',
  },
  {
    id: 'sort-strings', methodId: 'sort', kind: 'flip', topic: 'sort()',
    q: 'What does this return?',
    code: '[10, 9, 1].sort();',
    answerText: '[1, 10, 9]',
    explain: 'Without a `compareFn`, items are compared as strings, and "10" sorts before "9". Pass `(a, b) => a - b` for numbers.',
    verify: "JSON.stringify([10, 9, 1].sort()) === '[1,10,9]'",
  },
  {
    id: 'sort-desc', methodId: 'sort', kind: 'choice', topic: 'sort()',
    q: 'Which compareFn sorts numbers from largest to smallest?',
    options: ['(a, b) => a - b', '(a, b) => b - a', '(a, b) => a > b'], answer: 1,
    explain: '`compareFn` returns a negative number to put `a` first. `b - a` is negative when `a` is bigger, so bigger numbers come first. `a - b` sorts smallest first. Returning a boolean is not a valid comparator.',
    verify: "JSON.stringify([5, 40, 1].sort((a, b) => b - a)) === '[40,5,1]'",
  },
  {
    id: 'sort-asc', methodId: 'sort', kind: 'flip', topic: 'sort()',
    q: 'What does this return?',
    code: '[40, 1, 5, 200].sort((a, b) => a - b);',
    answerText: '[1, 5, 40, 200]',
    explain: '`a - b` is negative when `a` is smaller, so smaller numbers come first: ascending order.',
    verify: "JSON.stringify([40, 1, 5, 200].sort((a, b) => a - b)) === '[1,5,40,200]'",
  },
  {
    id: 'tosorted-original', methodId: 'toSorted', kind: 'choice', topic: 'toSorted()',
    q: 'After this runs, what is a?',
    code: `const a = [3, 1, 2];
const b = a.toSorted();`,
    options: ['[3, 1, 2]', '[1, 2, 3]'], answer: 0,
    explain: '`toSorted()` returns a new sorted array and leaves the original alone.',
    verify: "(() => { const a = [3, 1, 2]; a.toSorted(); return JSON.stringify(a) === '[3,1,2]'; })()",
  },
  {
    id: 'slice-shallow', methodId: 'slice', kind: 'choice', topic: 'slice()',
    q: 'After this runs, what is a[0].x?',
    code: `const a = [{ x: 1 }];
const b = a.slice();
b[0].x = 5;`,
    options: ['1', '5'], answer: 1,
    explain: '`slice()` makes a shallow copy. `a` and `b` are different arrays, but both hold the same object.',
    verify: '(() => { const a = [{ x: 1 }]; const b = a.slice(); b[0].x = 5; return a[0].x === 5; })()',
  },
  {
    id: 'splice-vs-slice', methodId: 'splice', kind: 'choice', topic: 'splice() vs slice()',
    q: 'Which one leaves the original array unchanged?',
    options: ['splice()', 'slice()'], answer: 1,
    explain: '`slice()` copies a portion. `splice()` removes or inserts items in the original array.',
    verify: "(() => { const a = [1, 2, 3]; a.slice(0, 1); const b = [1, 2, 3]; b.splice(0, 1); return a.length === 3 && b.length === 2; })()",
  },
  {
    id: 'splice-returns', methodId: 'splice', kind: 'flip', topic: 'splice()',
    q: 'What does this return?',
    code: `const a = [1, 2, 3, 4];
a.splice(1, 2);`,
    answerText: '[2, 3]',
    explain: '`splice()` returns the removed items. `a` is now `[1, 4]`.',
    verify: "(() => { const a = [1, 2, 3, 4]; const r = a.splice(1, 2); return JSON.stringify(r) === '[2,3]' && JSON.stringify(a) === '[1,4]'; })()",
  },
  {
    id: 'push-returns', methodId: 'push', kind: 'flip', topic: 'push()',
    q: 'What is len?',
    code: `const nums = [1, 2];
const len = nums.push(3);`,
    answerText: '3',
    explain: '`push()` returns the new length, not the array.',
    verify: '[1, 2].push(3) === 3',
  },
  {
    id: 'push-array', methodId: 'push', kind: 'choice', topic: 'push()',
    q: 'What is a after this?',
    code: `const a = [1];
a.push([2, 3]);`,
    options: ['[1, 2, 3]', '[1, [2, 3]]'], answer: 1,
    explain: 'Each argument becomes one item, so the array is added nested. Use `push(...[2, 3])` to add its items.',
    verify: '(() => { const a = [1]; a.push([2, 3]); return a.length === 2 && Array.isArray(a[1]); })()',
  },
  {
    id: 'unshift-order', methodId: 'unshift', kind: 'flip', topic: 'unshift()',
    q: 'What is b after this?',
    code: `const b = [3];
b.unshift(1);
b.unshift(2);`,
    answerText: '[2, 1, 3]',
    explain: 'Each call adds to the very front. One call `unshift(1, 2)` would give `[1, 2, 3]` instead.',
    verify: "(() => { const b = [3]; b.unshift(1); b.unshift(2); return JSON.stringify(b) === '[2,1,3]'; })()",
  },
  {
    id: 'includes-nan', methodId: 'includes', kind: 'choice', topic: 'includes()',
    q: 'What do these two lines return?',
    code: `[NaN].indexOf(NaN);
[NaN].includes(NaN);`,
    options: ['-1 and true', '0 and true', '-1 and false'], answer: 0,
    explain: '`indexOf()` uses `===`, and `NaN === NaN` is false. `includes()` uses SameValueZero, which treats `NaN` as equal to itself.',
    verify: '[NaN].indexOf(NaN) === -1 && [NaN].includes(NaN) === true',
  },
  {
    id: 'findindex-none', methodId: 'findIndex', kind: 'choice', topic: 'findIndex()',
    q: 'What does this return?',
    code: '[5, 12, 8].findIndex(n => n > 100);',
    options: ['undefined', '-1', 'null'], answer: 1,
    explain: '`findIndex()` returns -1 when nothing matches. `find()` returns `undefined`.',
    verify: '[5, 12, 8].findIndex(n => n > 100) === -1',
  },
  {
    id: 'find-none', methodId: 'find', kind: 'choice', topic: 'find()',
    q: 'What does this return?',
    code: '[5, 12, 8].find(n => n > 100);',
    options: ['undefined', '-1', 'null'], answer: 0,
    explain: '`find()` returns `undefined` when nothing matches. `findIndex()` returns -1.',
    verify: '[5, 12, 8].find(n => n > 100) === undefined',
  },
  {
    id: 'reduce-empty', methodId: 'reduce', kind: 'flip', topic: 'reduce()',
    q: 'What happens here?',
    code: '[].reduce((a, b) => a + b);',
    answerText: 'TypeError',
    explain: 'With no items and no `initialValue` there is nothing to start from. Pass one: `reduce(fn, 0)`.',
    verify: '(() => { try { [].reduce((a, b) => a + b); return false; } catch (e) { return e instanceof TypeError; } })()',
  },
  {
    id: 'reduce-initial', methodId: 'reduce', kind: 'flip', topic: 'reduce()',
    q: 'What does this return?',
    code: '[1, 2, 3].reduce((acc, n) => acc + n, 10);',
    answerText: '16',
    explain: 'The accumulator starts at `10`, then adds 1, 2 and 3.',
    verify: '[1, 2, 3].reduce((acc, n) => acc + n, 10) === 16',
  },
  {
    id: 'deep-copy', methodId: null, kind: 'choice', topic: 'Copying',
    q: 'Which one makes a deep copy of an array of objects?',
    options: ['[...arr]', 'arr.slice()', 'Array.from(arr)', 'structuredClone(arr)'], answer: 3,
    explain: 'Spread, `slice()` and `Array.from()` all make shallow copies. `structuredClone()` copies nested objects too. It throws a `DataCloneError` if the data contains functions.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone',
    verify: '(() => { const a = [{ x: 1 }]; const b = structuredClone(a); b[0].x = 2; const s = [...a]; return a[0].x === 1 && s[0] === a[0]; })()',
  },
  {
    id: 'every-empty', methodId: 'every', kind: 'flip', topic: 'every()',
    q: 'What does this return?',
    code: '[].every(n => n > 100);',
    answerText: 'true',
    explain: '`every()` on an empty array is always `true`, because no item fails the test.',
    verify: '[].every(n => n > 100) === true',
  },
  {
    id: 'some-empty', methodId: 'some', kind: 'flip', topic: 'some()',
    q: 'What does this return?',
    code: '[].some(n => true);',
    answerText: 'false',
    explain: '`some()` on an empty array is always `false`, because no item can pass.',
    verify: '[].some(n => true) === false',
  },
  {
    id: 'fill-shared', methodId: 'fill', kind: 'choice', topic: 'fill()',
    q: 'How many separate objects does this create?',
    code: 'const rows = new Array(3).fill({});',
    options: ['1', '3'], answer: 0,
    explain: '`fill()` puts the same object reference in every slot. Use `Array.from({ length: 3 }, () => ({}))` for three separate objects.',
    verify: '(() => { const r = new Array(3).fill({}); return r[0] === r[2]; })()',
  },
  {
    id: 'map-mutates-objects', methodId: 'map', kind: 'choice', topic: 'map()',
    q: 'Does this change the objects inside todos?',
    code: `const done = todos.map(t => {
  t.done = true;
  return t;
});`,
    options: ['Yes', 'No'], answer: 0,
    explain: '`map()` returns a new array, but this callback edits the original objects. Return `{ ...t, done: true }` instead.',
    verify: '(() => { const todos = [{ done: false }]; todos.map(t => { t.done = true; return t; }); return todos[0].done === true; })()',
  },
  {
    id: 'map-parseint', methodId: 'map', kind: 'flip', topic: 'map()',
    q: 'What does this return?',
    code: "['1', '2', '3'].map(parseInt);",
    answerText: '[1, NaN, NaN]',
    explain: '`map()` passes `(item, index)`, so `parseInt` gets the index as its radix. Use `.map(Number)` or `.map(s => parseInt(s, 10))`.',
    verify: "(() => { const r = ['1', '2', '3'].map(parseInt); return r[0] === 1 && Number.isNaN(r[1]) && Number.isNaN(r[2]); })()",
  },
  {
    id: 'array-n', methodId: 'Array', kind: 'choice', topic: 'Array()',
    q: 'What is Array(3)?',
    options: ['[3]', 'An array with 3 empty slots', '[undefined, undefined, undefined]'], answer: 1,
    explain: 'A single number sets the length and leaves the slots empty. `Array.of(3)` gives `[3]`.',
    verify: '(() => { const a = Array(3); return a.length === 3 && !(0 in a); })()',
  },
  {
    id: 'at-negative', methodId: 'at', kind: 'flip', topic: 'at()',
    q: 'What does this return?',
    code: "['x', 'y', 'z'].at(-1);",
    answerText: "'z'",
    explain: 'Negative indexes count back from the end. `arr[-1]` would be `undefined`.',
    verify: "['x', 'y', 'z'].at(-1) === 'z'",
  },
  {
    id: 'with-range', methodId: 'with', kind: 'flip', topic: 'with()',
    q: 'What happens here?',
    code: '[1, 2, 3].with(5, 0);',
    answerText: 'RangeError',
    explain: '`with()` only replaces existing positions. An index outside the array throws.',
    verify: '(() => { try { [1, 2, 3].with(5, 0); return false; } catch (e) { return e instanceof RangeError; } })()',
  },
  {
    id: 'flat-depth', methodId: 'flat', kind: 'flip', topic: 'flat()',
    q: 'What does this return?',
    code: '[1, [2, [3]]].flat();',
    answerText: '[1, 2, [3]]',
    explain: 'The default depth is 1. Use `flat(Infinity)` to flatten everything.',
    verify: "JSON.stringify([1, [2, [3]]].flat()) === '[1,2,[3]]'",
  },
  {
    id: 'concat-nested', methodId: 'concat', kind: 'choice', topic: 'concat()',
    q: 'What does this return?',
    code: '[1].concat([2, [3]]);',
    options: ['[1, 2, [3]]', '[1, 2, 3]'], answer: 0,
    explain: '`concat()` only spreads array arguments one level, so the inner `[3]` stays nested.',
    verify: "JSON.stringify([1].concat([2, [3]])) === '[1,2,[3]]'",
  },
  {
    id: 'join-null', methodId: 'join', kind: 'flip', topic: 'join()',
    q: 'What does this return?',
    code: "[1, null, 3].join('-');",
    answerText: "'1--3'",
    explain: '`null` and `undefined` become empty strings.',
    verify: "[1, null, 3].join('-') === '1--3'",
  },
  {
    id: 'length-truncate', methodId: 'length', kind: 'choice', topic: 'length',
    q: 'What is a after this?',
    code: `const a = [1, 2, 3, 4];
a.length = 2;`,
    options: ['[1, 2]', '[1, 2, 3, 4]', '[3, 4]'], answer: 0,
    explain: 'Setting `length` smaller deletes items from the end.',
    verify: "(() => { const a = [1, 2, 3, 4]; a.length = 2; return JSON.stringify(a) === '[1,2]'; })()",
  },
  {
    id: 'foreach-returns', methodId: 'forEach', kind: 'flip', topic: 'forEach()',
    q: 'What does this return?',
    code: '[1, 2].forEach(n => n * 2);',
    answerText: 'undefined',
    explain: '`forEach()` always returns `undefined`. Use `map()` to get a new array.',
    verify: '[1, 2].forEach(n => n * 2) === undefined',
  },
  {
    id: 'isarray', methodId: 'isArray', kind: 'choice', topic: 'Array.isArray()',
    q: 'Which check tells you a value is an array?',
    options: ["typeof value === 'array'", 'Array.isArray(value)', 'value instanceof Object'], answer: 1,
    explain: '`typeof []` is `\'object\'`, and plain objects are `instanceof Object` too. `Array.isArray()` is the reliable check.',
    verify: "Array.isArray([]) && typeof [] === 'object' && ({}) instanceof Object",
  },
  {
    id: 'entries-spread', methodId: 'entries', kind: 'flip', topic: 'entries()',
    q: 'What does this return?',
    code: "[...['a', 'b'].entries()];",
    answerText: "[[0, 'a'], [1, 'b']]",
    explain: '`entries()` yields `[index, value]` pairs. Spreading collects them into an array.',
    verify: `JSON.stringify([...['a', 'b'].entries()]) === '[[0,"a"],[1,"b"]]'`,
  },
];
