import type { APIRoute } from 'astro';
import { getResearch } from '../../lib/research';
export const GET: APIRoute = async () => new Response(JSON.stringify(await getResearch()), {headers:{'Content-Type':'application/json; charset=utf-8'}});
