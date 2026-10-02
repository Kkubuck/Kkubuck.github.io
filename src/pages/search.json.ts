import type { APIRoute } from 'astro';
import { getAllPosts, getPostUrl } from '../lib/content';
import { additions, RESEARCH_UPDATED } from '../data/research';
import { withBase } from '../lib/paths';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const payload = posts.map((post) => ({
    title: post.data.title,
    summary: post.data.summary || post.data.description,
    tags: post.data.tags,
    kind: post.data.kind,
    // getPostUrl applies BASE_URL, so results stay clickable on a project-path
    // deployment as well as at the domain root.
    url: getPostUrl(post),
    date: post.data.pubDate.toISOString(),
    venue: post.data.venue
  }));
  const references = additions.map(paper => ({ title: `${paper.short} — ${paper.title}`, summary: paper.summary, tags: paper.features,
    kind: 'reference', url: `${withBase('/research/')}?paper=${paper.id}`, date: RESEARCH_UPDATED, venue: paper.venue }));
  return new Response(JSON.stringify([...payload, ...references]), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  });
};
