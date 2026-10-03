/**
 * A damped spring, integrated with semi-implicit Euler at 240 Hz substeps so it
 * behaves the same at 60 and 120 Hz. Values from the prototype (DIRECTION.md):
 *   light  k=170 c=26  critically damped, settles in about 0.3 s
 *   lens   k=520 c=40  ζ≈0.88, a hair of overshoot (x and width)
 *   lift   k=340 c=30
 */
export interface Spring {
  /** current value */
  x: number;
  /** velocity per second */
  v: number;
  /** target */
  t: number;
  k: number;
  c: number;
}

export const SPRING = {
  light: { k: 170, c: 26 },
  lens: { k: 520, c: 40 },
  lift: { k: 340, c: 30 }
} as const;

export function createSpring(value: number, { k, c }: { k: number; c: number }): Spring {
  return { x: value, v: 0, t: value, k, c };
}

const STEP = 1 / 240;

/** Advances one spring by dt seconds. Returns true while it is still moving; snaps to the target once settled. */
export function stepSpring(s: Spring, dt: number, epsX = 0.02, epsV = 0.05): boolean {
  const n = Math.max(1, Math.ceil(dt / STEP));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += (-s.k * (s.x - s.t) - s.c * s.v) * h;
    s.x += s.v * h;
  }
  const moving = Math.abs(s.x - s.t) > epsX || Math.abs(s.v) > epsV;
  if (!moving) {
    s.x = s.t;
    s.v = 0;
  }
  return moving;
}

/** Jumps a spring to a value with no motion. */
export function snapSpring(s: Spring, value = s.t): void {
  s.x = s.t = value;
  s.v = 0;
}
