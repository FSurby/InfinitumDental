const KEYS = {
  LIBRARY: 'bokheimen_library',
  FAVORITES: 'bokheimen_favorites',
  PROGRESS: 'bokheimen_progress',
  RECENT: 'bokheimen_recent',
};

function get(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage-feil:', e);
  }
}

export const storage = {
  getLibrary: () => get(KEYS.LIBRARY) || [],
  addToLibrary(book) {
    const lib = this.getLibrary();
    if (!lib.find(b => b.id === book.id)) set(KEYS.LIBRARY, [book, ...lib]);
  },
  removeFromLibrary(id) {
    set(KEYS.LIBRARY, this.getLibrary().filter(b => b.id !== id));
  },
  isInLibrary(id) {
    return this.getLibrary().some(b => b.id === id);
  },

  getFavorites: () => get(KEYS.FAVORITES) || [],
  toggleFavorite(id) {
    const favs = this.getFavorites();
    set(KEYS.FAVORITES, favs.includes(id) ? favs.filter(f => f !== id) : [id, ...favs]);
  },
  isFavorite(id) {
    return this.getFavorites().includes(id);
  },

  getProgress: (id) => ((get(KEYS.PROGRESS) || {})[id]) || 1,
  setProgress(id, page) {
    const prog = get(KEYS.PROGRESS) || {};
    set(KEYS.PROGRESS, { ...prog, [id]: page });
  },

  getRecent: () => get(KEYS.RECENT) || [],
  addToRecent(book) {
    const recent = this.getRecent().filter(b => b.id !== book.id);
    set(KEYS.RECENT, [book, ...recent].slice(0, 10));
  },
};
