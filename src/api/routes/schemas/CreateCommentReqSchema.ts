import { z } from 'zod';

export const CreateCommentReqSchema = z.object({
  text: z.string().min(1, 'Comment text is required')
});
