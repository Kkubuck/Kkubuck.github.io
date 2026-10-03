/**
 * Hook points between the shell (dock) and the overlays (⌘K search, theme).
 *
 * The dock only announces intent; whoever owns the overlay listens. Window events
 * keep the two sides decoupled (no shared React context, no import cycle), and
 * plain [data-search-open] buttons rendered by server components keep working.
 *
 *   openSearch()            dock search button, shortcuts owned elsewhere
 *   searchIntent()          pointerenter / focus on the search button: prefetch /search.json
 *   toggleTheme()           dock theme button (ThemeToggle implements it by default)
 *
 *   const off = onOpenSearch(() => dialog.showModal());  // in an effect; call off() on cleanup
 */

const EVENTS = {
  openSearch: 'kk:open-search',
  searchIntent: 'kk:search-intent',
  toggleTheme: 'kk:toggle-theme'
} as const;

type ChromeEvent = keyof typeof EVENTS;

function emit(name: ChromeEvent): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENTS[name]));
}

function on(name: ChromeEvent, listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => listener();
  window.addEventListener(EVENTS[name], handler);
  return () => window.removeEventListener(EVENTS[name], handler);
}

export const openSearch = (): void => emit('openSearch');
export const onOpenSearch = (listener: () => void): (() => void) => on('openSearch', listener);

export const searchIntent = (): void => emit('searchIntent');
export const onSearchIntent = (listener: () => void): (() => void) => on('searchIntent', listener);

export const toggleTheme = (): void => emit('toggleTheme');
export const onToggleTheme = (listener: () => void): (() => void) => on('toggleTheme', listener);
