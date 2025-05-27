import { z } from 'zod';

export const UpdatePostReqSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional().nullable()
});
