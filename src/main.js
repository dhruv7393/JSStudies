import './styles.css';
import { renderReference } from './views/reference.js';
import { renderQuiz } from './views/quiz.js';
import { getTopic, defaultTopicId } from './data/index.js';

// Hash routes:
//   #/ref/<topic>/<method>   e.g. #/ref/array/slice
//   #/quiz/<topic>           e.g. #/quiz/array
const views = { ref: renderReference, quiz: renderQuiz };
const main = document.querySelector('#main');
let current = null;

function parseHash() {
  const [view, topic, item] = location.hash.replace(/^#\/?/, '').split('/');
  return {
    view: views[view] ? view : 'ref',
    topic: getTopic(topic) ? topic : defaultTopicId,
    item: item || null,
  };
}

function updateNav(route) {
  document.querySelectorAll('[data-view]').forEach((link) => {
    const on = link.dataset.view === route.view;
    link.classList.toggle('is-active', on);
    if (on) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
    link.href = `#/${link.dataset.view}/${route.topic}`;
  });
  document.querySelector('.brand').href = `#/ref/${route.topic}`;
}

function render() {
  const route = parseHash();
  updateNav(route);

  // Same screen and topic: let the view update in place (keeps search text and scroll).
  const key = `${route.view}/${route.topic}`;
  if (current?.key === key && current.update) {
    current.update(route);
    return;
  }

  main.replaceChildren();
  current = { key, ...views[route.view](main, route) };
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
