# JS Ref

A personal JavaScript reference with quiz cards. For each method it shows what it does, how to call it, whether it changes the original or makes a (shallow) copy, key details, a common mistake, and a link to MDN.

Built with [Vite](https://vite.dev) and plain JavaScript. No backend: quiz progress is saved in your browser's `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Project layout

```
index.html            page shell (top bar + <main>)
src/main.js           hash router: #/ref/<topic>/<method>, #/quiz/<topic>
src/views/reference.js  reference screen (search, filters, detail)
src/views/quiz.js       quiz screen (flip + multiple-choice cards)
src/data/index.js     list of topics and tag definitions
src/data/array.js     Array entries and quiz cards
src/data/object.js    Object entries and quiz cards
src/lib/              small helpers (escaping, storage, icons)
src/styles.css        all styles, light and dark
render.yaml           Render deploy config
```

## Accuracy check

Each topic covers every entry on its MDN page (constructor, static methods and properties, instance properties and methods), and each entry was checked against its own MDN page:

- **Array**: 48 entries, 32 quiz cards
- **Object**: 36 entries, 20 quiz cards

```bash
npm run check
```

This runs every example in Node. A line like `a.at(-1); // 'z'` must really produce `'z'`, and `a.with(5, 0); // RangeError` must really throw. Every quiz card's `verify` expression must be true, and the list of entries must match MDN's. `npm run build` runs the check first, so a wrong example stops the deploy.

## Add a new topic (e.g. Date)

1. Copy `src/data/object.js` to `src/data/date.js` and replace `methods` and `cards`. Keep the same fields.
2. In `src/data/index.js`, import it and replace the `{ id: 'date', ..., soon: true }` entry with a full entry. Each topic sets its own tag labels (`kinds`), its fourth fact (`extraFact`, e.g. "Empty slots" for Array, "Which properties" for Object) and its copy box.
3. Add it to `TOPICS` in `scripts/check-data.mjs` with MDN's list of entries, then run `npm run check`.

In prose fields (`what`, `details`, `watch`, `explain`), wrap code in backticks to show it as inline code.

## Deploy to Render

The repo includes `render.yaml`, so Render can set itself up:

1. Push this folder to a GitHub (or GitLab) repo.
2. In the Render dashboard choose **New → Blueprint** and pick the repo. Render reads `render.yaml` and creates a static site.

Or set it up by hand with **New → Static Site**:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Every push to the main branch redeploys the site.
