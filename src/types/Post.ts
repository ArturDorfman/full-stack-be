import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Post = z.infer<typeof PostSchema>;

export const PostWithCommentsCountSchema = PostSchema.extend({
  commentsCount: z.number()
});

export type PostWithCommentsCount = z.infer<typeof PostWithCommentsCountSchema>;
