import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().default(''),
    summary: z.string().default(''),
    subtitle: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    slug: z.string().min(1),
    kind: z.enum(['paper', 'note']),
    lang: z.string().default('ko'),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    sourceUrl: z.url().optional(),
    sourceBlog: z.string().optional(),
    legacyUrl: z.string().optional(),
    tistoryId: z.union([z.string(), z.number()]).optional(),
    tistoryCategory: z.string().optional(),
    venue: z.string().optional(),
    paperYear: z.coerce.number().int().optional(),
    authors: z.string().optional(),
    reviewedOn: z.coerce.date().optional(),
    pdfUrl: z.url().optional(),
    codeUrl: z.url().optional(),
    doi: z.string().optional(),
    takeaways: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts };
