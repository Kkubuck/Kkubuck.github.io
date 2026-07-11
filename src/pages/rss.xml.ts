import rss from '@astrojs/rss';
import { SITE } from '../data/site';
import { getAllPosts, getPostPath } from '../lib/content';

export async function GET(context: { site?: URL }) {
  const posts = await getAllPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site || SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary || post.data.description,
      pubDate: post.data.pubDate,
      link: getPostPath(post),
      categories: post.data.tags,
      author: SITE.author
    })),
    customData: '<language>en-us</language>'
  });
}
