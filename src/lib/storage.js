// localStorage can be missing or throw (private mode, blocked storage),
// so every read and write is guarded and the app works without it.

export function load(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Progress just won't persist.
  }
}
