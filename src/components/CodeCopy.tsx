'use client';

import { useEffect, useRef } from 'react';

const LABEL = '복사';
const DONE = '복사됨';
const FAILED = '복사 실패';
const RESET_MS = 1600;

const ICON_COPY =
  '<svg class="cc-icon cc-icon--copy" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="5.25" y="5.25" width="8" height="8" rx="1.75"/><path d="M10.75 5.25V4a1.75 1.75 0 0 0-1.75-1.75H4A1.75 1.75 0 0 0 2.25 4v5A1.75 1.75 0 0 0 4 10.75h1.25"/></svg>';
const ICON_DONE =
  '<svg class="cc-icon cc-icon--done" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Clipboard API where allowed (secure contexts); otherwise a hidden textarea + execCommand. */
async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* permission denied or not focused: try the legacy path */
    }
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
  document.body.append(area);
  const focused = document.activeElement as HTMLElement | null;
  area.select();
  area.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } finally {
    area.remove();
    focused?.focus({ preventScroll: true });
  }
  if (!ok) throw new Error('copy failed');
}

/**
 * Enables the copy buttons that the Markdown pipeline renders (hidden) in each
 * code block toolbar: `.code-block > .code-block__bar > button[data-code-copy]`
 * next to `pre.shiki`. Without JS they stay hidden. The result is announced through
 * one polite live region ("복사됨"), and the button shows a check for a moment.
 */
export function CodeCopy({ scope = '[data-article]' }: { scope?: string }) {
  const liveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(scope);
    if (!root) return;

    const buttons = [...root.querySelectorAll<HTMLButtonElement>('button[data-code-copy]')];
    const timers = new Map<HTMLButtonElement, number>();

    const render = (button: HTMLButtonElement, state: 'idle' | 'done' | 'failed') => {
      const text = state === 'done' ? DONE : state === 'failed' ? FAILED : LABEL;
      button.innerHTML = `${state === 'done' ? ICON_DONE : ICON_COPY}<span class="cc-label">${text}</span>`;
      if (state === 'idle') delete button.dataset.state;
      else button.dataset.state = state;
    };

    const onClick = async (event: MouseEvent) => {
      const button = event.currentTarget as HTMLButtonElement;
      const pre = button.closest('.code-block')?.querySelector('pre');
      if (!pre) return;
      const live = liveRef.current;
      let state: 'done' | 'failed' = 'done';
      try {
        await copyText((pre.textContent ?? '').replace(/\n$/, ''));
      } catch {
        state = 'failed';
      }
      render(button, state);
      if (live) {
        // Clear first so a second copy of the same block is announced again.
        live.textContent = '';
        window.setTimeout(() => (live.textContent = state === 'done' ? DONE : FAILED), 40);
      }
      window.clearTimeout(timers.get(button));
      timers.set(
        button,
        window.setTimeout(() => render(button, 'idle'), RESET_MS)
      );
    };

    for (const button of buttons) {
      render(button, 'idle');
      const lang = button.closest('.code-block')?.querySelector('.code-block__lang')?.textContent?.trim();
      button.setAttribute('aria-label', lang ? `${lang} 코드 복사` : '코드 복사');
      button.hidden = false;
      button.addEventListener('click', onClick);
    }
    return () => {
      for (const button of buttons) {
        button.removeEventListener('click', onClick);
        button.hidden = true;
        button.removeAttribute('aria-label');
        delete button.dataset.state;
        button.textContent = LABEL;
      }
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [scope]);

  return <span ref={liveRef} className="sr-only" role="status" aria-live="polite" />;
}
