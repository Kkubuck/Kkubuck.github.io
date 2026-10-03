/** localStorage key for an explicit theme choice ("light" | "dark"). */
export const THEME_STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark';

/** Paper colours (globals.css --paper): the browser chrome (theme-color) follows the theme. */
export const PAPER: Record<Theme, string> = { light: '#f5f5f2', dark: '#0e0e10' };

/**
 * Inline script for <head>: resolves the theme before first paint so the page
 * never flashes. A stored choice wins; otherwise the system setting is used — also
 * when storage itself is unavailable (blocked cookies, some private modes), which is
 * why the storage read has its own try. A stored choice also gets its
 * <meta name="theme-color"> now (first in <head>, so it wins over the media-query
 * metas), so Safari's tab bar matches the page before hydration.
 * It also marks <html class="js">, which CSS uses to show JS-only controls
 * (search, theme) and the segmented lens; without JS they stay hidden.
 */
export const themeInitScript = `(() => {
  const root = document.documentElement;
  root.classList.add('js');
  let stored = null;
  try {
    stored = localStorage.getItem('${THEME_STORAGE_KEY}');
  } catch {}
  let theme = stored === 'light' || stored === 'dark' ? stored : null;
  if (theme) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = theme === 'dark' ? '${PAPER.dark}' : '${PAPER.light}';
    meta.setAttribute('data-chosen', '');
    document.head.prepend(meta);
  } else {
    try {
      theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      theme = 'light';
    }
  }
  root.dataset.theme = theme;
})();`;
