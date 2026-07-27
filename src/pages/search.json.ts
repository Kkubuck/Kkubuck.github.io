import type { APIRoute } from 'astro';
import { getAllPosts, getPostUrl } from '../lib/content';

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
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  });
};
