import { z } from 'zod';

export const SortByEnum = z.enum(['title', 'createdAt', 'commentsCount']);
export const SortOrderEnum = z.enum(['asc', 'desc']);

// export type TSortBy = z.infer<typeof SortByEnum>;
// export type TSortOrder = z.infer<typeof SortOrderEnum>;
