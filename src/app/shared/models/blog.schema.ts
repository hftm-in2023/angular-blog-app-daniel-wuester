import { z } from 'zod';

export const BlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  createdAt: z.string().datetime().or(z.string())
});

export type Blog = z.infer<typeof BlogSchema>;
