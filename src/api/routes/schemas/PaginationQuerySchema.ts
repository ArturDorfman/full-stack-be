import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().optional()
});

export type TPaginationQuery = z.infer<typeof PaginationQuerySchema>;
