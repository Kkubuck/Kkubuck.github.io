import { getPosts, searchIndex } from '@/lib/posts';

export const dynamic = 'force-static';

/** Fetched lazily by the search dialog. Same payload shape as the old search.json. */
export function GET() {
  return new Response(JSON.stringify(searchIndex(getPosts())), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
