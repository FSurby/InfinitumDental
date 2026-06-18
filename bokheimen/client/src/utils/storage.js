const KEYS = {
  LIBRARY: 'bokheimen_library',
  FAVORITES: 'bokheimen_favorites',
  PROGRESS: 'bokheimen_progress',
  RECENT: 'bokheimen_recent',
};

function get(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn(e); }
}

export const storage = {
  // ── Bibliotek ──────────────────────────────────────────────────────────
  getLibrary: () => get(KEYS.LIBRARY) || [],
  addToLibrary(book) {
    const lib = this.getLibrary();
    if (!lib.find(b => b.id === book.id)) set(KEYS.LIBRARY, [book, ...lib]);
  },
  removeFromLibrary(id) {
    set(KEYS.LIBRARY, this.getLibrary().filter(b => b.id !== id));
  },
  isInLibrary(id) { return this.getLibrary().some(b => b.id === id); },

  // ── Favoritter ────────────────────────────────────────────────────────
  getFavorites: () => get(KEYS.FAVORITES) || [],
  toggleFavorite(id) {
    const f = this.getFavorites();
    set(KEYS.FAVORITES, f.includes(id) ? f.filter(x => x !== id) : [id, ...f]);
  },
  isFavorite(id) { return this.getFavorites().includes(id); },

  // ── Lesefremdrift ─────────────────────────────────────────────────────
  getProgress: (id) => ((get(KEYS.PROGRESS) || {})[id]) || 1,
  setProgress(id, page) {
    const p = get(KEYS.PROGRESS) || {};
    set(KEYS.PROGRESS, { ...p, [id]: page });
  },

  // ── Nylig lest ────────────────────────────────────────────────────────
  getRecent: () => get(KEYS.RECENT) || [],
  addToRecent(book) {
    const r = this.getRecent().filter(b => b.id !== book.id);
    set(KEYS.RECENT, [book, ...r].slice(0, 10));
  },
};
