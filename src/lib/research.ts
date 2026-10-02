import { additions, reviewAnnotations, groups, features, RESEARCH_UPDATED, type ResearchPaper } from '../data/research';
import { getPostsByKind, getPostUrl } from './content';
import { projectFeatures, similarity } from './projection';

export async function getResearch() {
  const posts = await getPostsByKind('paper');
  const reviews: ResearchPaper[] = posts.map(post => {
    const annotation = reviewAnnotations[post.data.slug];
    if (!annotation) throw new Error(`Missing research annotation: ${post.data.slug}`);
    return { id: post.data.slug, ...annotation, title: post.data.title,
      year: post.data.paperYear || post.data.pubDate.getFullYear(), venue: post.data.venue || 'Archive',
      summary: post.data.summary || post.data.description, source: post.data.sourceUrl || getPostUrl(post),
      review: getPostUrl(post), question: post.data.takeaways.at(-1) || '원문과 기존 리뷰에서 연구 가정과 비교 조건을 확인한다.',
      preprint: /arxiv/i.test(post.data.venue || ''), evidence: 'Existing archive review · topic coding based on review metadata' };
  });
  const papers = [...reviews, ...additions].sort((a, b) => a.id.localeCompare(b.id));
  const projection = projectFeatures(papers.map(p => features.map(f => Number(p.features.includes(f)))));
  const spans = [0, 1].map(axis => {
    const values = projection.points.map(p => p[axis]!);
    return { min: Math.min(...values), range: Math.max(...values) - Math.min(...values) || 1 };
  });
  const nodes = papers.map((paper, i) => {
    const group = groups.find(g => g.id === paper.group)!;
    const peers = papers.filter(p => p.group === paper.group);
    const index = peers.findIndex(p => p.id === paper.id);
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt((index + 0.5) / peers.length);
    const raw = projection.points[i]!;
    // Identical feature vectors need a small, disclosed display offset.
    const identical = papers.slice(0, i).filter((p) => features.every(f => p.features.includes(f) === paper.features.includes(f))).length;
    const offset = identical ? Math.sqrt(identical) * 13 : 0;
    return { ...paper, color: group.color,
      topic: [group.x + Math.cos(angle) * 104 * radius, group.y + Math.sin(angle) * 65 * radius],
      pca: [95 + (raw[0]! - spans[0]!.min) / spans[0]!.range * 710 + Math.cos(identical * 2.4) * offset,
        450 - (raw[1]! - spans[1]!.min) / spans[1]!.range * 350 + Math.sin(identical * 2.4) * offset],
      coordinates: raw };
  });
  const edges: { source: string; target: string; weight: number }[] = [];
  const pairs = new Set<string>();
  nodes.forEach(a => nodes.filter(b => a.id !== b.id).map(b => ({ b, score: similarity(a.features, b.features) }))
    .sort((a, b) => b.score - a.score || a.b.id.localeCompare(b.b.id)).slice(0, 3).forEach(({ b, score }) => {
      const pair = [a.id, b.id].sort().join('|');
      if (score >= 0.5 && !pairs.has(pair)) { pairs.add(pair); edges.push({ source: a.id, target: b.id, weight: score }); }
    }));
  return { updated: RESEARCH_UPDATED, nodes, edges, groups, features, projection,
    method: 'Manually annotated binary research descriptors; mean-centered covariance PCA. Topic colors are editorial categories. Edges are up to three Jaccard neighbors (>= 0.5), not citations. Display offsets separate identical descriptors. All projections use the full corpus and remain fixed under filtering.' };
}
export type Research = Awaited<ReturnType<typeof getResearch>>;
