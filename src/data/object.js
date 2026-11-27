// Object reference entries and quiz cards, checked against MDN (November 2026).
// Same fields as array.js, except the fourth fact is `props` (which properties it looks at)
// instead of `holes`. See array.js for the full field list.
//
// EXAMPLES ARE TESTED: `npm run check` runs every example in Node (non-strict mode,
// like a browser console). A line like   expr; // value   must produce that value, and
// expr; // TypeError   must throw. Comments that aren't valid JavaScript are notes.

const MDN = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/';

export const methods = [
  // ───────────────────────── Constructor ─────────────────────────
  {
    id: 'Object', name: 'Object()', group: 'constructor', kind: 'copy',
    sig: 'new Object(value?)\nObject(value?)',
    one: 'Turn a value into an object',
    what: 'Turns its input into an object. `null` or `undefined` give a new empty object, an object is returned as-is, and a primitive gets wrapped.',
    returns: 'An object', changes: 'No', copy: 'Not a copy — objects come back unchanged',
    props: '—',
    example: `Object(null);                  // {}
const o = { a: 1 };
Object(o) === o;               // true
typeof Object(42);             // 'object'
Object(42) instanceof Number;  // true`,
    details: [
      'Works with or without `new`.',
      'Use an object literal `{}` to make objects; you rarely need to call `Object()`.',
      'Wrapping a primitive (`Object(42)`) gives a wrapper object, which behaves differently from the primitive in comparisons.',
    ],
    watch: '`Object(o)` does not copy `o`. It returns the very same object.',
    mdn: MDN + 'Object', baseline: 'July 2015',
  },

  // ───────────────────────── Static methods ─────────────────────────
  {
    id: 'assign', name: 'Object.assign()', group: 'static-method', kind: 'mutates',
    sig: 'Object.assign(target, ...sources)',
    one: 'Copy properties onto a target',
    what: 'Copies the own enumerable properties of each source onto `target`, then returns `target`.',
    returns: 'The target object', changes: 'Yes — the target', copy: 'Shallow — nested objects are shared',
    props: 'Own enumerable, string and symbol keys',
    instead: '`{ ...target, ...source }` builds a new object',
    example: `const target = { a: 1 };
const result = Object.assign(target, { b: 2 }, { b: 3, c: 4 });
result;            // { a: 1, b: 3, c: 4 }
result === target; // true

const src = { nested: { x: 1 } };
const copy = Object.assign({}, src);
copy.nested === src.nested; // true`,
    details: [
      'Later sources overwrite earlier ones with the same key.',
      'Getters on a source are called, and their result is copied, not the getter itself.',
      '`null` and `undefined` sources are skipped without an error.',
      'If a write fails part-way, properties already copied stay on the target.',
    ],
    watch: '`Object.assign(obj, …)` changes `obj`. Pass `{}` as the first argument to get a new object.',
    mdn: MDN + 'assign', baseline: 'September 2015',
  },
  {
    id: 'create', name: 'Object.create()', group: 'static-method', kind: 'copy',
    sig: 'Object.create(proto, propertiesObject?)',
    one: 'New object with a chosen prototype',
    what: 'Creates a new object whose prototype is `proto` (an object or `null`). The optional second argument defines properties with descriptors.',
    returns: 'New object', changes: 'No', copy: 'Nothing copied — the new object links to `proto`',
    props: '—',
    example: `const animal = { speak() { return 'Hi!'; } };
const dog = Object.create(animal);
dog.speak();                           // 'Hi!'
Object.getPrototypeOf(dog) === animal; // true
Object.keys(dog);                      // []

const p = Object.create({}, { id: { value: 1 } });
p.id;                                  // 1
Object.keys(p);                        // []

Object.create(null).toString;          // undefined`,
    details: [
      '`Object.create(null)` makes an object with no prototype, handy as a plain dictionary.',
      '`proto` must be an object or `null`, otherwise it throws a `TypeError`.',
      'For inheritance in modern code, MDN prefers `class` syntax.',
    ],
    watch: 'Properties in the second argument default to not writable, not enumerable and not configurable.',
    mdn: MDN + 'create', baseline: 'July 2015',
  },
  {
    id: 'defineProperties', name: 'Object.defineProperties()', group: 'static-method', kind: 'mutates',
    sig: 'Object.defineProperties(obj, { name: descriptor, … })',
    one: 'Define several properties precisely',
    what: 'Adds or changes several properties on `obj` at once, each with its own descriptor.',
    returns: 'The same object', changes: 'Yes', copy: 'None — edits in place',
    props: 'The keys you list',
    example: `const user = {};
Object.defineProperties(user, {
  name: { value: 'Ana', enumerable: true },
  id: { value: 7 },
});
user.name;         // 'Ana'
user.id;           // 7
Object.keys(user); // ['name']`,
    details: [
      'Each descriptor works exactly like the third argument of `Object.defineProperty()`.',
      'A descriptor can be data (`value`, `writable`) or accessor (`get`, `set`), never both.',
    ],
    watch: 'Missing flags default to `false`, so properties are read-only and hidden unless you say otherwise.',
    mdn: MDN + 'defineProperties', baseline: 'July 2015',
  },
  {
    id: 'defineProperty', name: 'Object.defineProperty()', group: 'static-method', kind: 'mutates',
    sig: 'Object.defineProperty(obj, key, descriptor)',
    one: 'Define one property precisely',
    what: 'Adds or changes one property on `obj` with exact control over whether it is writable, enumerable and configurable, or a getter/setter.',
    returns: 'The same object', changes: 'Yes', copy: 'None — edits in place',
    props: 'The key you name (string or symbol)',
    example: `const o = {};
Object.defineProperty(o, 'id', { value: 1 });
o.id = 2;       // ignored: not writable (TypeError in strict mode)
o.id;           // 1
Object.keys(o); // []

Object.defineProperty(o, 'double', {
  get() { return this.id * 2; },
  enumerable: true,
});
o.double;       // 2`,
    details: [
      '`o.a = 1` makes a writable, enumerable, configurable property. `defineProperty` defaults all three to `false`.',
      'Mixing data keys (`value`, `writable`) with accessor keys (`get`, `set`) throws a `TypeError`.',
      'Changing the attributes of a non-configurable property throws a `TypeError`.',
      'It defines the property directly, so it never calls an existing setter.',
    ],
    watch: 'Forget `enumerable: true` and the property is hidden from `Object.keys()`, spread and `JSON.stringify()`.',
    mdn: MDN + 'defineProperty', baseline: 'July 2015',
  },
  {
    id: 'entries', name: 'Object.entries()', group: 'static-method', kind: 'value',
    sig: 'Object.entries(obj)',
    one: 'List of [key, value] pairs',
    what: 'Returns an array of `[key, value]` pairs for the object\'s own enumerable string-keyed properties.',
    returns: 'New array of [key, value] pairs', changes: 'No', copy: 'Values are not copied',
    props: 'Own enumerable string keys',
    example: `const scores = { ann: 3, bob: 5 };
Object.entries(scores); // [['ann', 3], ['bob', 5]]

for (const [name, score] of Object.entries(scores)) {
  console.log(name, score);
}
// logs ann 3, then bob 5

Object.entries({ 10: 'a', 2: 'b', x: 'c' }); // [['2', 'b'], ['10', 'a'], ['x', 'c']]`,
    details: [
      'Order: integer-like keys first in ascending order, then other keys in the order they were added.',
      'Same as `for…in`, except `for…in` also visits inherited properties.',
      '`new Map(Object.entries(obj))` turns an object into a Map. `Object.fromEntries()` goes back.',
    ],
    watch: 'Keys are always strings, even when they look like numbers.',
    mdn: MDN + 'entries', baseline: 'March 2017',
  },
  {
    id: 'freeze', name: 'Object.freeze()', group: 'static-method', kind: 'mutates',
    sig: 'Object.freeze(obj)',
    one: 'Make an object fully read-only',
    what: 'Stops properties being added, removed or changed. It locks the object you pass in and returns it; it does not make a frozen copy.',
    returns: 'The same object', changes: 'Yes — locks it in place', copy: 'None',
    props: 'All own properties — one level deep',
    example: `const config = Object.freeze({ port: 80, db: { host: 'a' } });
config.port = 8080;      // ignored (TypeError in strict mode)
config.port;             // 80
Object.isFrozen(config); // true

config.db.host = 'b';    // nested objects are not frozen
config.db.host;          // 'b'`,
    details: [
      'Freezing is shallow: nested objects stay changeable unless you freeze them too.',
      'A frozen array can\'t grow: `push()` throws a `TypeError`.',
      'There is no "unfreeze". Make a copy if you need a changeable version.',
      'MDN calls it the highest integrity level: stronger than `seal()` and `preventExtensions()`.',
    ],
    watch: 'In non-strict code, writes to a frozen object fail silently. In modules and classes (strict mode) they throw a `TypeError`.',
    mdn: MDN + 'freeze', baseline: 'July 2015',
  },
  {
    id: 'fromEntries', name: 'Object.fromEntries()', group: 'static-method', kind: 'copy',
    sig: 'Object.fromEntries(iterable)',
    one: 'Build an object from [key, value] pairs',
    what: 'Creates a new object from a list (or any iterable, like a Map) of `[key, value]` pairs.',
    returns: 'New object', changes: 'No', copy: 'Values are not copied',
    props: '—',
    example: `Object.fromEntries([['a', 1], ['b', 2]]); // { a: 1, b: 2 }
Object.fromEntries(new Map([['x', 1]]));  // { x: 1 }

const prices = { tea: 2, cake: 4 };
const doubled = Object.entries(prices).map(([k, v]) => [k, v * 2]);
Object.fromEntries(doubled);              // { tea: 4, cake: 8 }

Object.fromEntries(['a', 1]);             // TypeError`,
    details: [
      'The reverse of `Object.entries()`.',
      'Pairing it with `entries()` and `map()` is the usual way to transform every value of an object.',
      'Symbol keys are allowed.',
    ],
    watch: 'Each item must itself be a pair. `Object.fromEntries([\'a\', 1])` throws a `TypeError`.',
    mdn: MDN + 'fromEntries', baseline: 'January 2020',
  },
  {
    id: 'getOwnPropertyDescriptor', name: 'Object.getOwnPropertyDescriptor()', group: 'static-method', kind: 'value',
    sig: 'Object.getOwnPropertyDescriptor(obj, key)',
    one: 'Settings of one property',
    what: 'Returns the descriptor of one own property: its value or getter/setter, and whether it is writable, enumerable and configurable.',
    returns: 'Descriptor object, or undefined', changes: 'No', copy: 'A new descriptor object',
    props: 'One own property (string or symbol key)',
    example: `const o = { a: 1 };
Object.getOwnPropertyDescriptor(o, 'a'); // { value: 1, writable: true, enumerable: true, configurable: true }
Object.getOwnPropertyDescriptor(o, 'toString'); // undefined

const t = { get now() { return 1; } };
typeof Object.getOwnPropertyDescriptor(t, 'now').get; // 'function'`,
    details: [
      'Data properties have `value` and `writable`. Accessor properties have `get` and `set`. Both have `enumerable` and `configurable`.',
      'Changing the returned object does not change the property.',
    ],
    watch: 'It only sees own properties, so inherited ones (like `toString`) give `undefined`.',
    mdn: MDN + 'getOwnPropertyDescriptor', baseline: 'July 2015',
  },
  {
    id: 'getOwnPropertyDescriptors', name: 'Object.getOwnPropertyDescriptors()', group: 'static-method', kind: 'value',
    sig: 'Object.getOwnPropertyDescriptors(obj)',
    one: 'Settings of every property',
    what: 'Returns an object holding the descriptor of every own property.',
    returns: 'New object of descriptors', changes: 'No', copy: 'New descriptor objects',
    props: 'All own properties, including non-enumerable',
    example: `const src = { a: 1, get b() { return 2; } };
Object.keys(Object.getOwnPropertyDescriptors(src)); // ['a', 'b']

// A shallow copy that keeps getters and hidden properties:
const copy = Object.create(
  Object.getPrototypeOf(src),
  Object.getOwnPropertyDescriptors(src),
);
typeof Object.getOwnPropertyDescriptor(copy, 'b').get;      // 'function'
typeof Object.getOwnPropertyDescriptor({ ...src }, 'b').get; // 'undefined'`,
    details: [
      'Combined with `Object.create()`, it copies getters, setters and non-enumerable properties, which spread and `Object.assign()` don\'t.',
      'Pass the result to `Object.defineProperties()` to apply the same settings elsewhere.',
    ],
    watch: 'The copy above is still shallow: nested objects are shared.',
    mdn: MDN + 'getOwnPropertyDescriptors', baseline: 'April 2017',
  },
  {
    id: 'getOwnPropertyNames', name: 'Object.getOwnPropertyNames()', group: 'static-method', kind: 'value',
    sig: 'Object.getOwnPropertyNames(obj)',
    one: 'All own string keys, even hidden ones',
    what: 'Returns an array of every own string key, including non-enumerable ones.',
    returns: 'New array of strings', changes: 'No', copy: 'Nothing copied',
    props: 'Own string keys, enumerable or not',
    example: `Object.getOwnPropertyNames(['a', 'b']); // ['0', '1', 'length']
Object.keys(['a', 'b']);                // ['0', '1']

const o = Object.create({ inherited: 1 }, { hidden: { value: 2 } });
o.own = 3;
Object.getOwnPropertyNames(o);          // ['hidden', 'own']`,
    details: [
      'Leaves out symbol keys. Use `Object.getOwnPropertySymbols()` for those.',
      'Leaves out inherited properties.',
      'Integer-like keys come first in ascending order, then the rest in the order they were added.',
    ],
    watch: 'It includes hidden keys like an array\'s `length`, which `Object.keys()` leaves out.',
    mdn: MDN + 'getOwnPropertyNames', baseline: 'July 2015',
  },
  {
    id: 'getOwnPropertySymbols', name: 'Object.getOwnPropertySymbols()', group: 'static-method', kind: 'value',
    sig: 'Object.getOwnPropertySymbols(obj)',
    one: 'All own symbol keys',
    what: 'Returns an array of the object\'s own symbol keys.',
    returns: 'New array of symbols', changes: 'No', copy: 'Nothing copied',
    props: 'Own symbol keys only',
    example: `const id = Symbol('id');
const user = { name: 'Ana', [id]: 7 };
Object.keys(user);                           // ['name']
Object.getOwnPropertySymbols(user).length;   // 1
Object.getOwnPropertySymbols(user)[0] === id; // true
JSON.stringify(user);                        // '{"name":"Ana"}'`,
    details: [
      'Symbol keys are skipped by `Object.keys()`, `for…in` and `JSON.stringify()`.',
      'Together with `getOwnPropertyNames()` it covers every own key. `Reflect.ownKeys()` gives both at once.',
    ],
    watch: 'Symbol keys are not private. Anyone can list them with this method.',
    mdn: MDN + 'getOwnPropertySymbols', baseline: 'September 2015',
  },
  {
    id: 'getPrototypeOf', name: 'Object.getPrototypeOf()', group: 'static-method', kind: 'value',
    sig: 'Object.getPrototypeOf(obj)',
    one: 'Read the prototype',
    what: 'Returns the object\'s prototype: the object it inherits from, or `null`.',
    returns: 'The prototype, or null', changes: 'No', copy: 'Returns the prototype itself',
    props: '—',
    example: `const proto = { greet() { return 'hi'; } };
const obj = Object.create(proto);
Object.getPrototypeOf(obj) === proto;          // true
Object.getPrototypeOf([]) === Array.prototype; // true
Object.getPrototypeOf(Object.create(null));    // null`,
    details: [
      'The standard replacement for the deprecated `__proto__` getter.',
      'Primitives are wrapped first: `Object.getPrototypeOf(\'a\') === String.prototype`.',
    ],
    watch: 'It returns the prototype object, not the class. Compare with `Array.prototype`, not `Array`.',
    mdn: MDN + 'getPrototypeOf', baseline: 'July 2015',
  },
  {
    id: 'groupBy', name: 'Object.groupBy()', group: 'static-method', kind: 'copy',
    sig: 'Object.groupBy(items, (item, index) => key)',
    one: 'Group a list into an object of arrays',
    what: 'Calls the callback on each item and groups the items into arrays under the key it returns.',
    returns: 'New object with no prototype', changes: 'No', copy: 'Groups hold the same items (not copies)',
    props: '—',
    example: `const items = [
  { name: 'apple', type: 'fruit' },
  { name: 'kale', type: 'veg' },
  { name: 'pear', type: 'fruit' },
];
const byType = Object.groupBy(items, (item) => item.type);
byType.fruit.map((i) => i.name); // ['apple', 'pear']
byType.veg.length;               // 1
byType.fruit[0] === items[0];    // true
Object.getPrototypeOf(byType);   // null`,
    details: [
      'Works on any iterable: arrays, Sets, strings and so on.',
      'Keys are strings or symbols. Use `Map.groupBy()` to group by objects or other values.',
      'Items are not copied, so changing one in a group changes it in the original list.',
    ],
    watch: 'The result has no prototype, so `byType.hasOwnProperty(\'x\')` throws. Use `Object.hasOwn(byType, \'x\')` or `\'x\' in byType`.',
    mdn: MDN + 'groupBy', baseline: 'March 2024',
  },
  {
    id: 'hasOwn', name: 'Object.hasOwn()', group: 'static-method', kind: 'value',
    sig: 'Object.hasOwn(obj, key)',
    one: 'Does it have this own property?',
    what: 'Returns `true` if `key` is a property directly on `obj`, not inherited.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: 'Own properties only (string or symbol key)',
    example: `const o = { a: 1, b: undefined };
Object.hasOwn(o, 'a');        // true
Object.hasOwn(o, 'b');        // true
Object.hasOwn(o, 'toString'); // false
'toString' in o;              // true`,
    details: [
      'The `in` operator also checks inherited properties. `hasOwn` does not.',
      'Works on objects with no prototype, where `obj.hasOwnProperty` doesn\'t exist.',
      'MDN recommends it over `hasOwnProperty()`.',
    ],
    watch: '`obj.key !== undefined` is a different check: a property can exist and hold `undefined`.',
    mdn: MDN + 'hasOwn', baseline: 'March 2022',
  },
  {
    id: 'is', name: 'Object.is()', group: 'static-method', kind: 'value',
    sig: 'Object.is(value1, value2)',
    one: 'Are these the same value?',
    what: 'Returns `true` if both values are the same value. Like `===`, except for `NaN` and `-0`.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: '—',
    example: `Object.is(NaN, NaN); // true
NaN === NaN;         // false
Object.is(0, -0);    // false
0 === -0;            // true
Object.is([], []);   // false`,
    details: [
      'No type conversion, unlike `==`.',
      'Objects are compared by reference, like `===`.',
    ],
    watch: 'You rarely need it. Use `===` normally and `Number.isNaN()` to check for `NaN`.',
    mdn: MDN + 'is', baseline: 'September 2015',
  },
  {
    id: 'isExtensible', name: 'Object.isExtensible()', group: 'static-method', kind: 'value',
    sig: 'Object.isExtensible(obj)',
    one: 'Can new properties be added?',
    what: 'Returns `true` if new properties can still be added to the object.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: '—',
    example: `const o = {};
Object.isExtensible(o); // true
Object.preventExtensions(o);
Object.isExtensible(o); // false
Object.isExtensible(1); // false`,
    details: [
      'New objects are extensible.',
      '`preventExtensions()`, `seal()` and `freeze()` all make it `false`.',
      'Primitives return `false`.',
    ],
    watch: 'Not extensible only blocks new properties. Existing ones can still change or be deleted.',
    mdn: MDN + 'isExtensible', baseline: 'July 2015',
  },
  {
    id: 'isFrozen', name: 'Object.isFrozen()', group: 'static-method', kind: 'value',
    sig: 'Object.isFrozen(obj)',
    one: 'Is the object frozen?',
    what: 'Returns `true` if the object can\'t be extended and none of its properties can be changed or removed.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: 'All own properties',
    example: `Object.isFrozen({});                           // false
Object.isFrozen(Object.freeze({ a: 1 }));      // true
Object.isFrozen(Object.preventExtensions({})); // true
Object.isFrozen('text');                       // true`,
    details: [
      'An empty object that can\'t be extended counts as frozen.',
      'A frozen object is also sealed and not extensible.',
      'Primitives return `true`.',
    ],
    watch: 'It only checks the top level. Nested objects may still be changeable.',
    mdn: MDN + 'isFrozen', baseline: 'July 2015',
  },
  {
    id: 'isSealed', name: 'Object.isSealed()', group: 'static-method', kind: 'value',
    sig: 'Object.isSealed(obj)',
    one: 'Is the object sealed?',
    what: 'Returns `true` if the object can\'t be extended and its properties can\'t be removed or reconfigured.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: 'All own properties',
    example: `const s = Object.seal({ a: 1 });
Object.isSealed(s); // true
Object.isFrozen(s); // false
s.a = 2;
s.a;                // 2`,
    details: [
      'Frozen objects are always sealed, but not the other way round.',
      'Primitives return `true`.',
    ],
    watch: 'Sealed is not frozen: existing values can still change.',
    mdn: MDN + 'isSealed', baseline: 'July 2015',
  },
  {
    id: 'keys', name: 'Object.keys()', group: 'static-method', kind: 'value',
    sig: 'Object.keys(obj)',
    one: 'List of keys',
    what: 'Returns an array of the object\'s own enumerable string keys.',
    returns: 'New array of strings', changes: 'No', copy: 'Nothing copied',
    props: 'Own enumerable string keys',
    example: `Object.keys({ b: 2, a: 1 });      // ['b', 'a']
Object.keys({ 10: 'x', 2: 'y' }); // ['2', '10']
Object.keys(['x', 'y']);          // ['0', '1']
Object.keys('hi');                // ['0', '1']`,
    details: [
      'Order: integer-like keys first in ascending order, then other keys in the order they were added.',
      'Skips inherited, non-enumerable and symbol keys.',
      'Use `Object.values()` for the values and `Object.entries()` for both.',
    ],
    watch: 'Keys are strings: `Object.keys([7])` gives `[\'0\']`, not `[0]`.',
    mdn: MDN + 'keys', baseline: 'July 2015',
  },
  {
    id: 'preventExtensions', name: 'Object.preventExtensions()', group: 'static-method', kind: 'mutates',
    sig: 'Object.preventExtensions(obj)',
    one: 'Block new properties',
    what: 'Stops new properties being added to the object. Existing properties can still be changed or deleted.',
    returns: 'The same object', changes: 'Yes — locks it in place', copy: 'None',
    props: 'Blocks new own properties',
    example: `const o = Object.preventExtensions({ a: 1 });
o.b = 2;    // ignored (TypeError in strict mode)
o.b;        // undefined
o.a = 5;
o.a;        // 5
delete o.a; // true`,
    details: [
      'The weakest lock: `preventExtensions()` < `seal()` < `freeze()`.',
      'It also stops the prototype being changed.',
      'Check it with `Object.isExtensible()`.',
    ],
    watch: 'It can\'t be undone: there is no way to make the object extensible again.',
    mdn: MDN + 'preventExtensions', baseline: 'July 2015',
  },
  {
    id: 'seal', name: 'Object.seal()', group: 'static-method', kind: 'mutates',
    sig: 'Object.seal(obj)',
    one: 'Block adding and removing properties',
    what: 'Stops properties being added or removed. Existing values can still change if they are writable.',
    returns: 'The same object', changes: 'Yes — locks it in place', copy: 'None',
    props: 'All own properties',
    example: `const s = Object.seal({ a: 1 });
s.a = 2;    // still allowed: values can change
s.b = 3;    // ignored (TypeError in strict mode)
delete s.a; // false
s;          // { a: 2 }`,
    details: [
      'Between `preventExtensions()` (no new properties) and `freeze()` (nothing changes).',
      'Check it with `Object.isSealed()`.',
    ],
    watch: 'Sealing doesn\'t make values read-only. Use `freeze()` for that.',
    mdn: MDN + 'seal', baseline: 'July 2015',
  },
  {
    id: 'setPrototypeOf', name: 'Object.setPrototypeOf()', group: 'static-method', kind: 'mutates',
    sig: 'Object.setPrototypeOf(obj, proto)',
    one: 'Change the prototype',
    what: 'Sets the object\'s prototype to another object or `null`.',
    returns: 'The same object', changes: 'Yes', copy: 'None',
    props: '—',
    instead: '`Object.create(proto)` to make a new object with that prototype',
    example: `const walker = { walk() { return 'walking'; } };
const robot = {};
Object.setPrototypeOf(robot, walker);
robot.walk(); // 'walking'

Object.setPrototypeOf(Object.freeze({}), walker); // TypeError`,
    details: [
      'Throws a `TypeError` if the object can\'t be extended, or if `proto` isn\'t an object or `null`.',
      'The standard replacement for setting `__proto__`.',
    ],
    watch: 'MDN warns that changing a prototype is very slow in every engine. Create the object with the right prototype using `Object.create()` instead.',
    mdn: MDN + 'setPrototypeOf', baseline: 'September 2015',
  },
  {
    id: 'values', name: 'Object.values()', group: 'static-method', kind: 'value',
    sig: 'Object.values(obj)',
    one: 'List of values',
    what: 'Returns an array of the object\'s own enumerable string-keyed property values.',
    returns: 'New array', changes: 'No', copy: 'Values are not copied',
    props: 'Own enumerable string keys',
    example: `Object.values({ a: 1, b: 2 });      // [1, 2]
Object.values({ 10: 'a', 2: 'b' }); // ['b', 'a']
Object.values('hi');                // ['h', 'i']`,
    details: [
      'Same order as `Object.keys()`.',
      'Skips inherited, non-enumerable and symbol keys.',
    ],
    watch: 'Objects in the result are the same objects, not copies.',
    mdn: MDN + 'values', baseline: 'March 2017',
  },

  // ───────────────────────── Instance properties ─────────────────────────
  {
    id: 'proto', name: '__proto__', group: 'instance-property', kind: 'value', deprecated: true,
    sig: 'obj.__proto__\nobj.__proto__ = proto',
    one: 'Old way to read or set the prototype',
    what: 'An accessor that reads or sets an object\'s prototype. MDN marks it deprecated.',
    returns: 'The prototype, or null', changes: 'Only when you assign to it', copy: '—',
    props: '—',
    example: `const animal = { eats: true };
// The __proto__ key in an object literal is standard and fine:
const rabbit = { __proto__: animal };
rabbit.eats;                              // true

// Reading it with obj.__proto__ is the deprecated part:
rabbit.__proto__ === animal;              // true
Object.getPrototypeOf(rabbit) === animal; // true`,
    details: [
      'Objects with no prototype (`Object.create(null)`) don\'t have it.',
      'Setting it to anything other than an object or `null` does nothing.',
      'Changing a prototype is very slow in every engine.',
    ],
    watch: 'Use `Object.getPrototypeOf()` and `Object.setPrototypeOf()` instead.',
    mdn: MDN + 'proto', baseline: null,
  },
  {
    id: 'constructor', name: 'constructor', group: 'instance-property', kind: 'value',
    sig: 'obj.constructor',
    one: 'The function that created the object',
    what: 'Points to the function that created the object, such as `Object` for `{}` or `Array` for `[]`.',
    returns: 'A constructor function', changes: 'No', copy: '—',
    props: 'Inherited from the prototype',
    example: `({}).constructor === Object;     // true
[].constructor === Array;        // true
Object.create(null).constructor; // undefined`,
    details: [
      'It can be reassigned, so it isn\'t a reliable type check.',
      'Objects with no prototype don\'t have it.',
    ],
    watch: 'Don\'t use it for type checks. Use `instanceof`, `Array.isArray()` or `typeof` instead.',
    mdn: MDN + 'constructor', baseline: 'July 2015',
  },

  // ───────────────────────── Instance methods ─────────────────────────
  {
    id: '__defineGetter__', name: '__defineGetter__()', group: 'instance-method', kind: 'mutates', deprecated: true,
    sig: 'obj.__defineGetter__(key, fn)',
    one: 'Old way to add a getter',
    what: 'Adds a getter for `key` on the object. MDN marks it deprecated.',
    returns: 'undefined', changes: 'Yes', copy: 'None',
    props: 'The key you name',
    instead: 'A `get` in an object literal, or `Object.defineProperty()`',
    example: `const o = {};
o.__defineGetter__('now', () => 42);
o.now; // 42

// Modern equivalent:
const p = { get now() { return 42; } };
p.now; // 42`,
    details: [
      'The property it creates is enumerable and configurable.',
      'Throws a `TypeError` if `fn` isn\'t a function.',
    ],
    watch: 'Deprecated: it only exists so old websites keep working.',
    mdn: MDN + '__defineGetter__', baseline: null,
  },
  {
    id: '__defineSetter__', name: '__defineSetter__()', group: 'instance-method', kind: 'mutates', deprecated: true,
    sig: 'obj.__defineSetter__(key, fn)',
    one: 'Old way to add a setter',
    what: 'Adds a setter for `key` on the object. MDN marks it deprecated.',
    returns: 'undefined', changes: 'Yes', copy: 'None',
    props: 'The key you name',
    instead: 'A `set` in an object literal, or `Object.defineProperty()`',
    example: `const o = {};
o.__defineSetter__('value', function (v) { this.saved = v; });
o.value = 5;
o.saved; // 5
o.value; // undefined`,
    details: [
      'With only a setter, reading the property gives `undefined`.',
      'Throws a `TypeError` if `fn` isn\'t a function.',
    ],
    watch: 'Deprecated: it only exists so old websites keep working.',
    mdn: MDN + '__defineSetter__', baseline: null,
  },
  {
    id: '__lookupGetter__', name: '__lookupGetter__()', group: 'instance-method', kind: 'value', deprecated: true,
    sig: 'obj.__lookupGetter__(key)',
    one: 'Old way to read a getter function',
    what: 'Returns the getter function for `key`, searching up the prototype chain. MDN marks it deprecated.',
    returns: 'The getter, or undefined', changes: 'No', copy: 'Nothing copied',
    props: 'Own or inherited (string keys only)',
    example: `const o = { get now() { return 42; } };
typeof o.__lookupGetter__('now');                     // 'function'
typeof Object.getOwnPropertyDescriptor(o, 'now').get; // 'function'`,
    details: [
      'You need it (or its replacement) because reading the property calls the getter instead of returning it.',
      'Returns `undefined` for normal data properties.',
    ],
    watch: 'Deprecated. Use `Object.getOwnPropertyDescriptor(obj, key).get`, which also works with symbols.',
    mdn: MDN + '__lookupGetter__', baseline: null,
  },
  {
    id: '__lookupSetter__', name: '__lookupSetter__()', group: 'instance-method', kind: 'value', deprecated: true,
    sig: 'obj.__lookupSetter__(key)',
    one: 'Old way to read a setter function',
    what: 'Returns the setter function for `key`, searching up the prototype chain. MDN marks it deprecated.',
    returns: 'The setter, or undefined', changes: 'No', copy: 'Nothing copied',
    props: 'Own or inherited (string keys only)',
    example: `const o = { set name(v) {} };
typeof o.__lookupSetter__('name');                     // 'function'
typeof Object.getOwnPropertyDescriptor(o, 'name').set; // 'function'`,
    details: [
      'Returns `undefined` for normal data properties.',
    ],
    watch: 'Deprecated. Use `Object.getOwnPropertyDescriptor(obj, key).set`, which also works with symbols.',
    mdn: MDN + '__lookupSetter__', baseline: null,
  },
  {
    id: 'hasOwnProperty', name: 'hasOwnProperty()', group: 'instance-method', kind: 'value',
    sig: 'obj.hasOwnProperty(key)',
    one: 'Older own-property check',
    what: 'Returns `true` if `key` is a property directly on the object, not inherited.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: 'Own properties only',
    example: `const o = { a: 1 };
o.hasOwnProperty('a');        // true
o.hasOwnProperty('toString'); // false

const bare = Object.create(null);
bare.hasOwnProperty;          // undefined
Object.hasOwn(bare, 'a');     // false`,
    details: [
      'A property holding `null` or `undefined` still counts.',
      'Objects can override it with their own `hasOwnProperty`, which breaks the check.',
    ],
    watch: 'It fails on objects with no prototype and can be overridden. MDN recommends `Object.hasOwn()` instead.',
    mdn: MDN + 'hasOwnProperty', baseline: 'July 2015',
  },
  {
    id: 'isPrototypeOf', name: 'isPrototypeOf()', group: 'instance-method', kind: 'value',
    sig: 'proto.isPrototypeOf(obj)',
    one: 'Is this in the other object\'s chain?',
    what: 'Returns `true` if this object appears anywhere in `obj`\'s prototype chain.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: 'The prototype chain of the argument',
    example: `class Animal {}
class Dog extends Animal {}
const d = new Dog();
Animal.prototype.isPrototypeOf(d); // true
d instanceof Animal;               // true
Animal.isPrototypeOf(d);           // false`,
    details: [
      'Checks the whole chain, not just the direct prototype.',
      'Returns `false` for primitives.',
      'For classes, `instanceof` is usually simpler.',
    ],
    watch: 'Call it on the prototype (`Animal.prototype.isPrototypeOf(x)`), not on the class.',
    mdn: MDN + 'isPrototypeOf', baseline: 'July 2015',
  },
  {
    id: 'propertyIsEnumerable', name: 'propertyIsEnumerable()', group: 'instance-method', kind: 'value',
    sig: 'obj.propertyIsEnumerable(key)',
    one: 'Is this own property enumerable?',
    what: 'Returns `true` if `key` is an own property that shows up in `Object.keys()`, spread and `for…in`.',
    returns: 'true or false', changes: 'No', copy: 'Nothing copied',
    props: 'Own properties only',
    example: `const arr = [1];
arr.propertyIsEnumerable(0);                 // true
arr.propertyIsEnumerable('length');          // false
({ a: 1 }).propertyIsEnumerable('toString'); // false`,
    details: [
      'Inherited properties always give `false`, even though `for…in` visits enumerable inherited ones.',
      'Built-in properties are usually not enumerable.',
      'MDN notes `Object.getOwnPropertyDescriptor(obj, key)?.enumerable` does the same job.',
    ],
    watch: 'A missing property also gives `false`, so you can\'t tell "missing" from "hidden" with this alone.',
    mdn: MDN + 'propertyIsEnumerable', baseline: 'July 2015',
  },
  {
    id: 'toLocaleString', name: 'toLocaleString()', group: 'instance-method', kind: 'value',
    sig: 'obj.toLocaleString()',
    one: 'Locale-aware string (calls toString)',
    what: 'Returns a string for the object. The base version just calls `toString()`; types like Number, Date and Array override it with locale formatting.',
    returns: 'String', changes: 'No', copy: 'Nothing copied',
    props: '—',
    example: `({}).toLocaleString();            // '[object Object]'
(1234.5).toLocaleString('en-US'); // '1,234.5'
[1000, 2].toLocaleString('en-US'); // '1,000,2'`,
    details: [
      'It exists so every object has a `toLocaleString()`, even if it doesn\'t format anything.',
      'Overrides take `locales` and `options` arguments; the base version takes none.',
    ],
    watch: 'On a plain object it gives the same unhelpful `\'[object Object]\'` as `toString()`.',
    mdn: MDN + 'toLocaleString', baseline: 'July 2015',
  },
  {
    id: 'toString', name: 'toString()', group: 'instance-method', kind: 'value',
    sig: 'obj.toString()',
    one: 'String form of the object',
    what: 'Returns a string for the object. The base version gives `"[object Type]"`; many types override it.',
    returns: 'String', changes: 'No', copy: 'Nothing copied',
    props: '—',
    example: `({}).toString();                             // '[object Object]'
Object.prototype.toString.call([]);          // '[object Array]'
Object.prototype.toString.call(null);        // '[object Null]'
String({ toString() { return 'custom'; } }); // 'custom'`,
    details: [
      'JavaScript calls it when an object is turned into a string, e.g. in a template literal.',
      '`Object.prototype.toString.call(x)` reveals the built-in type of `x`.',
      'An object can set `Symbol.toStringTag` to change the `Type` part.',
    ],
    watch: 'Printing an object with `+` gives `\'[object Object]\'`. Use `JSON.stringify()` or `console.log()` to see its contents.',
    mdn: MDN + 'toString', baseline: 'July 2015',
  },
  {
    id: 'valueOf', name: 'valueOf()', group: 'instance-method', kind: 'value',
    sig: 'obj.valueOf()',
    one: 'Primitive value of the object',
    what: 'Returns the object\'s primitive value. The base version just returns the object itself; Number, Date and others override it.',
    returns: 'A primitive, or the object itself', changes: 'No', copy: 'Nothing copied',
    props: '—',
    example: `const o = {};
o.valueOf() === o;                         // true
+new Date(0);                              // 0
const price = { valueOf() { return 42; } };
price + 1;                                 // 43
+{};                                       // NaN`,
    details: [
      'Maths and comparisons call `valueOf()` first. String conversion calls `toString()` first.',
      '`Symbol.toPrimitive`, if an object has it, takes priority over both.',
    ],
    watch: 'Plain objects return themselves, so `+{}` falls back to `toString()` (`\'[object Object]\'`) and gives `NaN`.',
    mdn: MDN + 'valueOf', baseline: 'July 2015',
  },
];

// Quiz cards (same format as array.js).
export const cards = [
  {
    id: 'assign-mutates', methodId: 'assign', kind: 'choice', topic: 'Object.assign()',
    q: 'After this runs, is a changed?',
    code: `const a = { x: 1 };
const b = Object.assign(a, { y: 2 });`,
    options: ['Yes — a and b are the same object', 'No — b is a new object'], answer: 0,
    explain: '`Object.assign()` writes into its first argument and returns it. Use `Object.assign({}, a, …)` or `{ ...a, y: 2 }` for a new object.',
    verify: '(() => { const a = { x: 1 }; const b = Object.assign(a, { y: 2 }); return a === b && a.y === 2; })()',
  },
  {
    id: 'spread-shallow', methodId: 'assign', kind: 'choice', topic: 'Copying objects',
    q: 'After this runs, what is src.inner.n?',
    code: `const src = { inner: { n: 1 } };
const copy = { ...src };
copy.inner.n = 5;`,
    options: ['1', '5'], answer: 1,
    explain: 'Spread and `Object.assign()` make shallow copies, so `copy.inner` and `src.inner` are the same object. Use `structuredClone(src)` for a deep copy.',
    verify: '(() => { const src = { inner: { n: 1 } }; const copy = { ...src }; copy.inner.n = 5; return src.inner.n === 5; })()',
  },
  {
    id: 'freeze-shallow', methodId: 'freeze', kind: 'flip', topic: 'Object.freeze()',
    q: 'What is config.db.host at the end?',
    code: `const config = Object.freeze({ db: { host: 'a' } });
config.db.host = 'b';`,
    answerText: "'b'",
    explain: '`freeze()` is shallow. The nested `db` object isn\'t frozen, so it can still change.',
    verify: "(() => { const c = Object.freeze({ db: { host: 'a' } }); c.db.host = 'b'; return c.db.host === 'b'; })()",
  },
  {
    id: 'freeze-strict', methodId: 'freeze', kind: 'choice', topic: 'Object.freeze()',
    q: 'In a module (strict mode), what happens on the second line?',
    code: `const o = Object.freeze({ x: 1 });
o.x = 2;`,
    options: ['It is silently ignored', 'It throws a TypeError', 'o.x becomes 2'], answer: 1,
    explain: 'Strict mode turns the silent failure into a `TypeError`. Modules and classes are always strict.',
    verify: "(() => { 'use strict'; try { const o = Object.freeze({ x: 1 }); o.x = 2; return false; } catch (e) { return e instanceof TypeError; } })()",
  },
  {
    id: 'seal-vs-freeze', methodId: 'seal', kind: 'choice', topic: 'seal() vs freeze()',
    q: 'Which one still lets you change existing values?',
    options: ['Object.seal()', 'Object.freeze()'], answer: 0,
    explain: 'Sealing blocks adding and removing properties, but writable values can still change. Freezing blocks everything.',
    verify: '(() => { const s = Object.seal({ a: 1 }); s.a = 2; const f = Object.freeze({ a: 1 }); f.a = 2; return s.a === 2 && f.a === 1; })()',
  },
  {
    id: 'keys-order', methodId: 'keys', kind: 'flip', topic: 'Object.keys()',
    q: 'What does this return?',
    code: "Object.keys({ b: 1, 2: 1, a: 1, 1: 1 });",
    answerText: "['1', '2', 'b', 'a']",
    explain: 'Integer-like keys come first in ascending order, then the other keys in the order they were added.',
    verify: "JSON.stringify(Object.keys({ b: 1, 2: 1, a: 1, 1: 1 })) === '[\"1\",\"2\",\"b\",\"a\"]'",
  },
  {
    id: 'keys-strings', methodId: 'keys', kind: 'choice', topic: 'Object.keys()',
    q: 'What does Object.keys([7, 8]) return?',
    options: ["['0', '1']", '[0, 1]', '[7, 8]'], answer: 0,
    explain: 'Object keys are always strings, even for array indexes.',
    verify: "JSON.stringify(Object.keys([7, 8])) === '[\"0\",\"1\"]'",
  },
  {
    id: 'getownnames-length', methodId: 'getOwnPropertyNames', kind: 'flip', topic: 'Object.getOwnPropertyNames()',
    q: 'What does this return?',
    code: "Object.getOwnPropertyNames(['a']);",
    answerText: "['0', 'length']",
    explain: 'Unlike `Object.keys()`, it includes non-enumerable keys such as an array\'s `length`.',
    verify: "JSON.stringify(Object.getOwnPropertyNames(['a'])) === '[\"0\",\"length\"]'",
  },
  {
    id: 'is-nan', methodId: 'is', kind: 'flip', topic: 'Object.is()',
    q: 'What does this return?',
    code: 'Object.is(NaN, NaN);',
    answerText: 'true',
    explain: '`Object.is()` treats `NaN` as equal to itself, unlike `===`.',
    verify: 'Object.is(NaN, NaN) === true && (NaN === NaN) === false',
  },
  {
    id: 'is-zero', methodId: 'is', kind: 'choice', topic: 'Object.is()',
    q: 'What does Object.is(0, -0) return?',
    options: ['true', 'false'], answer: 1,
    explain: '`Object.is()` tells `0` and `-0` apart. `0 === -0` is `true`.',
    verify: 'Object.is(0, -0) === false && 0 === -0',
  },
  {
    id: 'hasown-vs-in', methodId: 'hasOwn', kind: 'choice', topic: 'Object.hasOwn()',
    q: "What do these two lines return for o = {}?",
    code: `'toString' in o;
Object.hasOwn(o, 'toString');`,
    options: ['true and false', 'false and false', 'true and true'], answer: 0,
    explain: '`in` also looks at inherited properties. `Object.hasOwn()` only looks at the object itself.',
    verify: "(() => { const o = {}; return ('toString' in o) === true && Object.hasOwn(o, 'toString') === false; })()",
  },
  {
    id: 'defineproperty-hidden', methodId: 'defineProperty', kind: 'flip', topic: 'Object.defineProperty()',
    q: 'What does the last line return?',
    code: `const o = {};
Object.defineProperty(o, 'id', { value: 1 });
Object.keys(o);`,
    answerText: '[]',
    explain: '`enumerable` defaults to `false`, so the property is hidden from `Object.keys()`.',
    verify: "(() => { const o = {}; Object.defineProperty(o, 'id', { value: 1 }); return Object.keys(o).length === 0 && o.id === 1; })()",
  },
  {
    id: 'create-null', methodId: 'create', kind: 'choice', topic: 'Object.create()',
    q: 'What is Object.create(null).toString?',
    options: ['A function', 'undefined', "'[object Object]'"], answer: 1,
    explain: 'An object created with a `null` prototype inherits nothing, not even `toString`.',
    verify: 'Object.create(null).toString === undefined',
  },
  {
    id: 'fromentries', methodId: 'fromEntries', kind: 'flip', topic: 'Object.fromEntries()',
    q: 'What does this return?',
    code: "Object.fromEntries([['a', 1], ['b', 2]]);",
    answerText: '{ a: 1, b: 2 }',
    explain: '`fromEntries()` turns `[key, value]` pairs into an object. It is the reverse of `Object.entries()`.',
    verify: "JSON.stringify(Object.fromEntries([['a', 1], ['b', 2]])) === '{\"a\":1,\"b\":2}'",
  },
  {
    id: 'groupby-proto', methodId: 'groupBy', kind: 'choice', topic: 'Object.groupBy()',
    q: 'What is the prototype of the object Object.groupBy() returns?',
    options: ['Object.prototype', 'null', 'Array.prototype'], answer: 1,
    explain: 'The result has a `null` prototype, so methods like `hasOwnProperty` aren\'t available on it.',
    verify: 'Object.getPrototypeOf(Object.groupBy([1], (n) => "x")) === null',
  },
  {
    id: 'tostring-call', methodId: 'toString', kind: 'flip', topic: 'toString()',
    q: 'What does this return?',
    code: 'Object.prototype.toString.call([]);',
    answerText: "'[object Array]'",
    explain: 'Calling the base `toString()` directly reveals the built-in type. `[].toString()` would give `\'\'`.',
    verify: "Object.prototype.toString.call([]) === '[object Array]' && [].toString() === ''",
  },
  {
    id: 'valueof-plus', methodId: 'valueOf', kind: 'flip', topic: 'valueOf()',
    q: 'What does this return?',
    code: '+{ valueOf() { return 5; } };',
    answerText: '5',
    explain: 'Converting to a number calls `valueOf()` first.',
    verify: '+{ valueOf() { return 5; } } === 5',
  },
  {
    id: 'new-object-choice', methodId: 'assign', kind: 'choice', topic: 'Copying objects',
    q: 'Which one leaves a unchanged?',
    options: ['Object.assign(a, b)', '{ ...a, ...b }'], answer: 1,
    explain: 'Spread builds a new object. `Object.assign(a, b)` writes `b`\'s properties into `a`.',
    verify: '(() => { const a = { x: 1 }; const r = { ...a, ...{ y: 2 } }; return r !== a && !("y" in a); })()',
  },
  {
    id: 'setprototypeof-instead', methodId: 'setPrototypeOf', kind: 'choice', topic: 'Object.setPrototypeOf()',
    q: 'MDN warns that changing a prototype is slow. What should you use instead?',
    options: ['Object.create(proto)', 'Object.assign(obj, proto)', 'Object.freeze(obj)'], answer: 0,
    explain: 'Create the object with the right prototype from the start using `Object.create()`.',
    verify: '(() => { const proto = { a: 1 }; return Object.getPrototypeOf(Object.create(proto)) === proto; })()',
  },
  {
    id: 'proto-deprecated', methodId: 'proto', kind: 'choice', topic: '__proto__',
    q: 'Which is the recommended way to read an object\'s prototype?',
    options: ['obj.__proto__', 'Object.getPrototypeOf(obj)', 'obj.constructor'], answer: 1,
    explain: 'The `__proto__` accessor is deprecated. `obj.constructor` is the constructor function, not the prototype.',
    verify: '(() => { const o = {}; return Object.getPrototypeOf(o) === Object.prototype && o.constructor === Object; })()',
  },
];
