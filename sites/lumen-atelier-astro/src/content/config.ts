import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.number(),
    roles: z.array(z.string()),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    excerpt: z.string(),
    outcomes: z.array(
      z.object({
        metric: z.string(),
        value: z.string(),
        description: z.string(),
      })
    ).optional(),
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      title: z.string(),
    }).optional(),
    featured: z.boolean().default(false),
  }),
});

const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    readingTime: z.number(),
  }),
});

export const collections = { projects, journal };
