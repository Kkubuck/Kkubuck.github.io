'use client';

import { useEffect, type ReactNode } from 'react';
import { getGlassLight } from './store';

/**
 * Starts the page's single light (pointer / key light, one rAF loop) as early as
 * hydration allows and keeps it for the whole session: it sits in the root layout,
 * so client navigations never restart it. The store itself is a lazy singleton
 * (getGlassLight), so <Glass> elements that mount before this effect still find it.
 */
export function GlassLightProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const light = getGlassLight();
    if (!light) return;
    // Text metrics change when Pretendard arrives; re-shade once it has.
    document.fonts?.ready.then(() => light.refreshAll()).catch(() => undefined);
  }, []);
  return children;
}
