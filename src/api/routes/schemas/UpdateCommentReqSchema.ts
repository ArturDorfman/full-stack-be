import { z } from 'zod';

export const UpdateCommentReqSchema = z.object({
  text: z.string().min(1, 'Comment text is required')
});
