import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const shared = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  status: z.string().optional(),
  featured: z.boolean().default(false),
  constellation: z.object({ featured: z.boolean().default(false), links: z.array(z.string()).default([]) }).optional()
});
export const collections = {
  work: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }), schema: shared }),
  projects: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }), schema: shared })
};
