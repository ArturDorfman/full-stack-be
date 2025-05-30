import { PostWithCommentsCountSchema } from 'src/types/PostWithCommentsCount';
import { z } from 'zod';

export const GetPostsRespSchema = z.object({
  posts: z.array(PostWithCommentsCountSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number()
  })
});
