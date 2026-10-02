/** Deterministic covariance PCA of centered binary editorial descriptors.
 * No abstracts, embeddings, citations or performance scores enter this model.
 * Axis signs are fixed by the largest absolute loading for stable builds.
 */
export function projectFeatures(rows: number[][]) {
  if (rows.length < 2 || !rows[0]?.length) throw new Error('PCA needs at least two feature rows.');
  const n = rows.length, d = rows[0].length;
  if (rows.some(row => row.length !== d || row.some(x => !Number.isFinite(x)))) throw new Error('Invalid feature matrix.');
  const means = Array.from({ length: d }, (_, j) => rows.reduce((s, row) => s + row[j]!, 0) / n);
  const centered = rows.map(row => row.map((x, j) => x - means[j]!));
  const covariance = Array.from({ length: d }, (_, a) => Array.from({ length: d }, (_, b) =>
    centered.reduce((s, row) => s + row[a]! * row[b]!, 0) / (n - 1)));
  const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
  const multiply = (v: number[]) => covariance.map(row => dot(row, v));
  const vectors: number[][] = [];
  const values: number[] = [];
  for (let axis = 0; axis < 2; axis++) {
    let v = Array.from({ length: d }, (_, j) => Math.sin(j + 1 + axis * 0.7));
    for (let step = 0; step < 300; step++) {
      let next = multiply(v);
      for (const previous of vectors) {
        const overlap = dot(next, previous);
        next = next.map((x, j) => x - overlap * previous[j]!);
      }
      const length = Math.sqrt(dot(next, next));
      v = length > 1e-12 ? next.map(x => x / length) : next.map(() => 0);
    }
    const dominant = v.reduce((best, x, i) => Math.abs(x) > Math.abs(v[best]!) ? i : best, 0);
    if (v[dominant]! < 0) v = v.map(x => -x);
    values.push(Math.max(0, dot(v, multiply(v))));
    vectors.push(v);
  }
  const total = covariance.reduce((s, row, j) => s + row[j]!, 0);
  return { points: centered.map(row => vectors.map(v => dot(row, v))), loadings: vectors,
    variance: values.map(v => total > 0 ? v / total : 0), means };
}

export function similarity(a: readonly string[], b: readonly string[]) {
  const union = new Set([...a, ...b]);
  return union.size ? a.filter(x => b.includes(x)).length / union.size : 0;
}
