'use client';

import { useEffect, useState } from 'react';
import { onToggleTheme } from '@/lib/chrome-events';
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme';
import { MoonIcon, SunIcon } from './icons';

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null; // storage can be unavailable (private windows, blocked site data)
  }
}

const current = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

/** Browser chrome (Safari's tab bar, Android's status bar) follows the chosen theme too. */
function syncThemeColor() {
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
  if (!paper) return;
  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-chosen]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.dataset.chosen = '';
    // First in <head>: of several theme-color metas, the first that applies wins.
    document.head.prepend(meta);
  }
  meta.content = paper;
}

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => unknown };

/**
 * Applies a theme. With View Transitions the whole page crossfades (the root
 * snapshot pair, timed in overlays.css); under reduced motion, or where the API is
 * missing, the switch is instant.
 */
function applyTheme(theme: Theme, animate: boolean) {
  const update = () => {
    document.documentElement.dataset.theme = theme;
    syncThemeColor();
  };
  const doc = document as ViewTransitionDocument;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('reduced');
  if (animate && !reduced && typeof doc.startViewTransition === 'function') doc.startViewTransition(update);
  else update();
}

/**
 * Flips data-theme on <html> and remembers the choice under localStorage['theme'].
 * The initial theme is set before first paint by the inline head script
 * (src/lib/theme.ts); until the reader picks one, the page follows the system.
 */
function toggle() {
  const next: Theme = current() === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    /* the choice still applies to this page */
  }
}

export function ThemeToggle({ className = 'icon-button theme-toggle' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(current());
    syncThemeColor();
    const media = matchMedia('(prefers-color-scheme: dark)');
    const follow = (event: MediaQueryListEvent) => {
      if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
    };
    media.addEventListener('change', follow);
    // Keep the label in step whoever flips the theme (this button, toggleTheme(), the system).
    const watch = new MutationObserver(() => setTheme(current()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // toggleTheme() from src/lib/chrome-events lets other controls flip the theme too.
    const off = onToggleTheme(toggle);
    return () => {
      media.removeEventListener('change', follow);
      watch.disconnect();
      off();
    };
  }, []);

  const label = theme === 'dark' ? '라이트 모드로 전환' : theme === 'light' ? '다크 모드로 전환' : '테마 전환';

  // Both icons are rendered; CSS shows the one matching data-theme, so the
  // server HTML is correct before hydration.
  return (
    <button className={className} type="button" onClick={toggle} aria-label={label} title={label}>
      <SunIcon className="icon-sun" />
      <MoonIcon className="icon-moon" />
    </button>
  );
}
