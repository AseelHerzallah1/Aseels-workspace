/** How many starter chips to show in chat (rotating on pick). */
export const SUGGESTED_VISIBLE_COUNT = 4;

/** How many starter cards to show on the home welcome grid. */
export const SUGGESTED_HOME_COUNT = 6;

export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick an initial random subset from the pool. */
export function initVisibleStarters(pool, count = SUGGESTED_VISIBLE_COUNT) {
  if (!pool?.length) return [];
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
}

/** Initialize chat starters, skipping questions already asked or shown on home. */
export function initVisibleStartersExcluding(pool, excludeTexts, count = SUGGESTED_VISIBLE_COUNT) {
  if (!pool?.length) return [];
  const exclude = new Set(excludeTexts);
  const candidates = pool.filter((s) => !exclude.has(s.text));
  return shuffleArray(candidates).slice(0, Math.min(count, candidates.length));
}

/**
 * Remove the picked starter and swap in one unused question from the pool.
 * Falls back to fewer visible chips when the pool is exhausted.
 */
export function replaceStarter(visible, pool, pickedText, sessionUsed) {
  sessionUsed.add(pickedText);
  const remaining = visible.filter((s) => s.text !== pickedText);
  const taken = new Set([...sessionUsed, ...remaining.map((s) => s.text)]);
  const candidates = pool.filter((s) => !taken.has(s.text));

  if (!candidates.length) return remaining;

  const next = candidates[Math.floor(Math.random() * candidates.length)];
  return [...remaining, next];
}
