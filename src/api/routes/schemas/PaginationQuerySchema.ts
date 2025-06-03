import { z } from 'zod';
import { SortByEnum, SortOrderEnum } from './SortingSchema';

export const GetPostsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().optional(),
  sortBy: SortByEnum.default('createdAt'),
  sortDirection: SortOrderEnum.default('desc'),
  minComments: z.coerce.number().int().min(0).optional()
});

export type TGetPostsQuery = z.infer<typeof GetPostsQuerySchema>;
