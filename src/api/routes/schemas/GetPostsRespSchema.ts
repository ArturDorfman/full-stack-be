import { z } from 'zod';
import { PostWithCommentsCountSchema } from 'src/types/PostWithCommentsCount';
import { SortByEnum, SortOrderEnum } from './SortingSchema';

export const GetPostsRespSchema = z.object({
  posts: z.array(PostWithCommentsCountSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number(),
    sortBy: SortByEnum,
    sortDirection: SortOrderEnum
  })
});
