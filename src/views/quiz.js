import { topics, getTopic } from '../data/index.js';
import { esc, prose } from '../lib/html.js';
import { icons } from '../lib/icons.js';
import { load, save } from '../lib/storage.js';

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function renderQuiz(root, route) {
  const topic = getTopic(route.topic);
  const storeKey = `jsref:quiz:${topic.id}`;
  const byId = new Map(topic.cards.map((c) => [c.id, c]));
  const methodById = new Map(topic.methods.map((m) => [m.id, m]));
  const total = topic.cards.length;

  const fresh = (shuffle = false) => {
    const ids = topic.cards.map((c) => c.id);
    return { order: shuffle ? shuffled(ids) : ids, i: 0, results: [], revealed: false, picked: null };
  };

  // Resume a saved session, unless the deck has changed since it was saved.
  let s = (() => {
    const saved = load(storeKey);
    if (!saved || !Array.isArray(saved.order)) return fresh();
    const sameDeck = saved.order.length === total && saved.order.every((id) => byId.has(id));
    return sameDeck ? { ...fresh(), ...saved } : fresh();
  })();

  const view = document.createElement('div');
  view.className = 'quiz';
  root.append(view);
  document.title = `${topic.name} quiz — JS Ref`;

  function set(patch, focusSelector) {
    s = { ...s, ...patch };
    save(storeKey, s);
    draw();
    if (focusSelector) view.querySelector(focusSelector)?.focus();
  }

  function advance(ok) {
    const card = byId.get(s.order[s.i]);
    set(
      { i: s.i + 1, revealed: false, picked: null, results: [...s.results, { id: card.id, ok }] },
      '#card-question',
    );
  }

  view.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const card = byId.get(s.order[s.i]);
    switch (el.dataset.action) {
      case 'reveal':
        set({ revealed: true }, '[data-action="rate"][data-ok="true"]');
        break;
      case 'pick':
        if (!s.revealed) set({ picked: Number(el.dataset.idx), revealed: true }, '[data-action="next"]');
        break;
      case 'rate':
        advance(el.dataset.ok === 'true');
        break;
      case 'next':
        advance(s.picked === card.answer);
        break;
      case 'restart':
        set(fresh(false), '#card-question');
        break;
      case 'shuffle':
        set(fresh(true), '#card-question');
        break;
    }
  });

  function draw() {
    const done = s.i >= total;
    const got = s.results.filter((r) => r.ok).length;
    const again = s.results.length - got;
    const missed = [...new Set(s.results.filter((r) => !r.ok).map((r) => byId.get(r.id)?.methodId))]
      .filter((id) => methodById.has(id));

    view.innerHTML = `
      <aside class="sidebar">
        <nav class="side-block" aria-labelledby="decks-label">
          <h2 class="label" id="decks-label">Decks</h2>
          <ul class="topics">${topics.map((t) => deckItem(t, topic)).join('')}</ul>
        </nav>

        <section class="side-block panel" aria-labelledby="session-label">
          <h2 id="session-label">This session</h2>
          <div class="stats">
            <div class="stat stat--got"><span class="stat__num">${got}</span><span>Got it</span></div>
            <div class="stat stat--again"><span class="stat__num">${again}</span><span>Again</span></div>
            <div class="stat"><span class="stat__num">${total - s.results.length}</span><span>Left</span></div>
          </div>
          ${missed.length ? `
            <div class="review">
              <span class="review__label">To review</span>
              <div class="review__list">
                ${missed.map((id) => `<a class="pill mono" href="#/ref/${topic.id}/${encodeURIComponent(id)}">${esc(methodById.get(id).name)}</a>`).join('')}
              </div>
            </div>` : ''}
          <button type="button" class="btn btn--ghost btn--small" data-action="shuffle">${icons.shuffle} Shuffle and restart</button>
        </section>
      </aside>

      <section class="quiz-main" aria-labelledby="deck-title">
        <div class="deck-head">
          <div class="deck-head__row">
            <h1 id="deck-title">${esc(topic.name)} — all methods</h1>
            <span class="deck-head__count">${done ? `${total} of ${total}` : `Card ${s.i + 1} of ${total}`}</span>
          </div>
          <div class="progress" role="progressbar" aria-label="Deck progress" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${s.results.length}">
            <div class="progress__bar" style="width: ${Math.round((s.results.length / total) * 100)}%"></div>
          </div>
        </div>
        ${done ? doneCard(got, again) : cardView(byId.get(s.order[s.i]))}
      </section>
    `;
  }

  function cardView(card) {
    const method = methodById.get(card.methodId);
    const mdn = card.mdn || method?.mdn;
    const isChoice = card.kind === 'choice';
    const right = s.picked === card.answer;

    const options = isChoice
      ? `<div class="options">${card.options
          .map((label, idx) => {
            let state = '';
            let mark = '';
            if (s.revealed) {
              if (idx === card.answer) { state = ' is-correct'; mark = 'Correct'; }
              else if (idx === s.picked) { state = ' is-wrong'; mark = 'Your pick'; }
              else state = ' is-dim';
            }
            return `<button type="button" class="option${state}" data-action="pick" data-idx="${idx}"${s.revealed ? ' aria-disabled="true"' : ''}>
              <span class="mono">${esc(label)}</span><span class="option__mark">${mark}</span></button>`;
          })
          .join('')}</div>`
      : '';

    const answer = s.revealed
      ? `<div class="answer" role="status">
          ${isChoice
            ? `<strong class="answer__verdict ${right ? 'is-right' : 'is-wrong'}">${right ? 'Right.' : 'Not quite.'}</strong>`
            : `<span class="label">Answer</span><span class="answer__text mono">${esc(card.answerText)}</span>`}
          <p>${prose(card.explain)}</p>
          <div class="answer__links">
            ${mdn ? `<a href="${esc(mdn)}" target="_blank" rel="noopener noreferrer">Read on MDN ${icons.external}<span class="sr-only">(opens in a new tab)</span></a>` : ''}
            ${method ? `<a href="#/ref/${topic.id}/${encodeURIComponent(method.id)}">Open ${esc(method.name)} in the reference</a>` : ''}
          </div>
        </div>`
      : '';

    let actions = '';
    if (!isChoice && !s.revealed) {
      actions = `<div class="card__actions card__actions--prompt">
          <p class="hint">Say your answer out loud, then flip the card.</p>
          <button type="button" class="btn btn--primary btn--large" data-action="reveal">${icons.flip} Show answer</button>
        </div>`;
    } else if (!isChoice && s.revealed) {
      actions = `<div class="card__actions card__actions--rate">
          <button type="button" class="btn btn--again btn--large" data-action="rate" data-ok="false">Again</button>
          <button type="button" class="btn btn--got btn--large" data-action="rate" data-ok="true">Got it</button>
        </div>`;
    } else if (isChoice && s.revealed) {
      actions = `<div class="card__actions card__actions--next">
          <button type="button" class="btn btn--primary btn--large" data-action="next">Next card</button>
        </div>`;
    }

    return `<article class="card">
        <div class="card__meta">
          <span class="card__topic mono">${esc(card.topic)}</span>
          <span class="label">${isChoice ? 'Multiple choice' : 'Flip card'}</span>
        </div>
        <h2 id="card-question" class="card__q" tabindex="-1">${esc(card.q)}</h2>
        ${card.code ? `<pre class="code code--large"><code>${esc(card.code)}</code></pre>` : ''}
        ${options}
        ${answer}
        ${actions}
      </article>`;
  }

  function doneCard(got, again) {
    const message = again
      ? 'Cards you marked "Again" are listed under To review. Open them in the reference, then run the deck again.'
      : 'Clean sweep. Try the deck again tomorrow to make it stick.';
    return `<article class="card card--done">
        <span class="label">Deck finished</span>
        <h2 id="card-question" class="score" tabindex="-1">${got} / ${total}</h2>
        <p>${esc(message)}</p>
        <div class="card__actions card__actions--done">
          <button type="button" class="btn btn--primary btn--large" data-action="restart">Restart deck</button>
          <button type="button" class="btn btn--large" data-action="shuffle">${icons.shuffle} Shuffle and restart</button>
          <a class="btn btn--large" href="#/ref/${topic.id}">Back to reference</a>
        </div>
      </article>`;
  }

  draw();
  return {};
}

function deckItem(t, current) {
  if (t.soon || !t.cards?.length) {
    return `<li><span class="topic is-soon"><span>${esc(t.name)}</span><span class="topic__meta">Soon</span></span></li>`;
  }
  const on = t.id === current.id;
  return `<li><a class="topic${on ? ' is-active' : ''}" href="#/quiz/${t.id}"${on ? ' aria-current="page"' : ''}>
    <span>${esc(t.name)}</span><span class="topic__meta">${t.cards.length} cards</span></a></li>`;
}
