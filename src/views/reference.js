import { topics, getTopic, GROUPS } from '../data/index.js';
import { esc, prose } from '../lib/html.js';
import { icons } from '../lib/icons.js';

const GROUP_BADGE = {
  constructor: 'Constructor',
  'static-method': 'Static',
  'static-property': 'Static property',
  'instance-property': 'Property',
};

// Search text and filter survive switching between methods and views.
const uiState = {};

const groupLabel = (id) => GROUPS.find((g) => g.id === id)?.label ?? id;
const matchFilter = (m, f) => f === 'all' || m.kind === f;
const matchQuery = (m, q) =>
  !q || [m.name, m.one, m.copy, m.what, groupLabel(m.group)].join(' ').toLowerCase().includes(q);
const narrow = () => window.matchMedia('(max-width: 759px)').matches;

export function renderReference(root, route) {
  const topic = getTopic(route.topic);
  const KINDS = topic.kinds;
  const FILTERS = [{ id: 'all', label: 'All' }, ...Object.entries(KINDS).map(([id, k]) => ({ id, label: k.label }))];
  const badge = (kind) => `<span class="badge badge--${kind}">${esc(KINDS[kind].label)}</span>`;
  const topicGroups = GROUPS.filter((g) => topic.methods.some((m) => m.group === g.id));
  const ui = (uiState[topic.id] ??= { query: '', filter: 'all' });
  let selectedId = null;
  let scrollOnSelect = false;

  const view = document.createElement('div');
  view.className = 'ref';
  view.innerHTML = `
    <aside class="sidebar">
      <nav class="side-block" aria-labelledby="globals-label">
        <h2 class="label" id="globals-label">Globals</h2>
        <ul class="topics">${topics.map((t) => topicItem(t, topic)).join('')}</ul>
      </nav>
      <nav class="side-block" aria-labelledby="sections-label">
        <h2 class="label" id="sections-label">On this page</h2>
        <ul class="topics sections"></ul>
      </nav>
      <section class="side-block legend" aria-labelledby="legend-label">
        <h2 class="label" id="legend-label">Reading the tags</h2>
        ${Object.entries(KINDS)
          .map(([k, v]) => `<div class="legend__row">${badge(k)}<span>${esc(v.hint)}</span></div>`)
          .join('')}
      </section>
      <section class="side-block panel copy-box" aria-labelledby="copy-label">
        <h2 id="copy-label">Shallow vs deep copy</h2>
        <p>${esc(topic.copyBox.intro)}</p>
        <span class="copy-box__kind">Shallow</span>
        <code class="copy-box__code">${esc(topic.copyBox.shallow)}</code>
        <span class="copy-box__kind">Deep</span>
        <code class="copy-box__code">${esc(topic.copyBox.deep)}</code>
        <p class="copy-box__note">${prose('`structuredClone()` throws a `DataCloneError` if the data contains functions.')}</p>
      </section>
    </aside>

    <section class="list-col" aria-labelledby="topic-title">
      <div class="topic-head">
        <span class="label">${esc(topic.kind)}</span>
        <h1 id="topic-title" class="mono">${esc(topic.name)}</h1>
        <p>${prose(topic.blurb)} <a href="${esc(topic.mdn)}" target="_blank" rel="noopener noreferrer">MDN overview<span class="sr-only"> (opens in a new tab)</span></a></p>
      </div>
      <label class="search">
        ${icons.search}
        <span class="sr-only">Search ${esc(topic.name)} reference</span>
        <input type="search" placeholder="Search, e.g. copy, sort, length" autocomplete="off" spellcheck="false" value="${esc(ui.query)}" />
      </label>
      <div class="chips" role="group" aria-label="Filter by what it does"></div>
      <div class="method-groups"></div>
      <p class="empty" hidden>Nothing matches. Try a different word or clear the filter.</p>
    </section>

    <article class="detail panel" aria-labelledby="detail-title"></article>
  `;
  root.append(view);

  const $ = (sel) => view.querySelector(sel);
  const input = $('.search input');
  const chipsEl = $('.chips');
  const groupsEl = $('.method-groups');
  const sectionsEl = $('.sections');
  const emptyEl = $('.empty');
  const detailEl = $('.detail');

  const query = () => ui.query.trim().toLowerCase();
  const visible = () => topic.methods.filter((m) => matchFilter(m, ui.filter) && matchQuery(m, query()));

  function drawChips() {
    chipsEl.innerHTML = FILTERS.map((f) => {
      const count = topic.methods.filter((m) => matchFilter(m, f.id) && matchQuery(m, query())).length;
      const on = f.id === ui.filter;
      return `<button type="button" class="chip${on ? ' is-on' : ''}" data-filter="${f.id}" aria-pressed="${on}">
        ${esc(f.label)} <span class="chip__count">${count}</span></button>`;
    }).join('');
  }

  function drawList() {
    const items = visible();
    emptyEl.hidden = items.length > 0;

    groupsEl.innerHTML = topicGroups.map((g) => {
      const inGroup = items.filter((m) => m.group === g.id);
      if (!inGroup.length) return '';
      return `<section class="method-group" aria-labelledby="group-${g.id}">
        <h2 class="group-head label" id="group-${g.id}">${esc(g.label)} <span class="group-head__count">${inGroup.length}</span></h2>
        <ul class="method-list">${inGroup.map(methodItem).join('')}</ul>
      </section>`;
    }).join('');

    sectionsEl.innerHTML = topicGroups.map((g) => {
      const count = items.filter((m) => m.group === g.id).length;
      return `<li><button type="button" class="topic topic--button" data-jump="${g.id}"${count ? '' : ' disabled'}>
        <span>${esc(g.label)}</span><span class="topic__meta">${count}</span></button></li>`;
    }).join('');
  }

  function methodItem(m) {
    const on = m.id === selectedId;
    return `<li>
      <a class="method${on ? ' is-selected' : ''}" href="#/ref/${topic.id}/${encodeURIComponent(m.id)}"${on ? ' aria-current="true"' : ''}>
        <span class="method__text">
          <span class="method__name mono">${esc(m.name)}</span>
          <span class="method__one">${esc(m.one)}</span>
        </span>
        ${badge(m.kind)}
      </a>
    </li>`;
  }

  function drawDetail() {
    const m = topic.methods.find((x) => x.id === selectedId);
    if (!m) return;
    document.title = `${m.name} — ${topic.name} — JS Ref`;
    const changesClass = m.changes === 'Yes' ? 'is-mutates' : m.changes === 'No' ? 'is-safe' : '';

    detailEl.innerHTML = `
      <div class="detail__head">
        <div class="detail__title">
          <h2 id="detail-title" class="mono">${esc(m.name)}</h2>
          ${badge(m.kind)}
          ${GROUP_BADGE[m.group] ? `<span class="badge badge--outline">${esc(GROUP_BADGE[m.group])}</span>` : ''}
          ${m.deprecated ? '<span class="badge badge--deprecated">Deprecated</span>' : ''}
        </div>
        <code class="sig">${esc(m.sig)}</code>
        <p class="lead">${prose(m.what)}</p>
      </div>

      <dl class="facts">
        <div class="fact"><dt>Returns</dt><dd>${prose(m.returns)}</dd></div>
        <div class="fact"><dt>Changes original?</dt><dd class="${changesClass}">${esc(m.changes)}</dd></div>
        <div class="fact"><dt>Copy</dt><dd>${esc(m.copy)}</dd></div>
        <div class="fact"><dt>${esc(topic.extraFact.label)}</dt><dd>${prose(m[topic.extraFact.field])}</dd></div>
      </dl>

      ${m.instead ? `<p class="instead"><strong>Non-mutating alternative:</strong> ${prose(m.instead)}</p>` : ''}

      <section class="detail__section">
        <h3>How to use it</h3>
        <pre class="code"><code>${esc(m.example)}</code></pre>
      </section>

      <section class="detail__section">
        <h3>Key details</h3>
        <ul class="details">${m.details.map((d) => `<li>${prose(d)}</li>`).join('')}</ul>
      </section>

      <div class="watch">
        ${icons.warning}
        <div>
          <strong>Watch out</strong>
          <p>${prose(m.watch)}</p>
        </div>
      </div>

      <div class="detail__actions">
        <a class="btn btn--primary" href="${esc(m.mdn)}" target="_blank" rel="noopener noreferrer">
          Read on MDN ${icons.external}<span class="sr-only">(opens in a new tab)</span>
        </a>
        <a class="btn" href="#/quiz/${topic.id}">Quiz me on ${esc(topic.name)}</a>
        ${m.baseline ? `<span class="baseline">Baseline: widely available since ${esc(m.baseline)}</span>` : ''}
      </div>
    `;
  }

  function select(id) {
    const known = topic.methods.some((m) => m.id === id);
    selectedId = known ? id : topic.methods[0].id;
    drawList();
    drawDetail();
    if (scrollOnSelect && narrow()) detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    scrollOnSelect = false;
  }

  input.addEventListener('input', () => {
    ui.query = input.value;
    drawChips();
    drawList();
  });

  chipsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    ui.filter = btn.dataset.filter;
    drawChips();
    drawList();
  });

  groupsEl.addEventListener('click', (e) => {
    if (e.target.closest('.method')) scrollOnSelect = true;
  });

  sectionsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jump]');
    if (!btn) return;
    view.querySelector(`#group-${btn.dataset.jump}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  drawChips();
  select(route.item ? decodeURIComponent(route.item) : null);

  return {
    update(next) {
      select(next.item ? decodeURIComponent(next.item) : null);
    },
  };
}

function topicItem(t, current) {
  if (t.soon) {
    return `<li><span class="topic is-soon"><span class="mono">${esc(t.name)}</span><span class="topic__meta">Soon</span></span></li>`;
  }
  const on = t.id === current.id;
  return `<li><a class="topic${on ? ' is-active' : ''}" href="#/ref/${t.id}"${on ? ' aria-current="page"' : ''}>
    <span class="mono">${esc(t.name)}</span><span class="topic__meta">${t.methods.length} entries</span></a></li>`;
}
