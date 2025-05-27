import { z } from 'zod';
import { PostSchema } from 'src/types/Post';
import { CommentSchema } from 'src/types/Comment';

export const GetPostByIdRespSchema = z.object({
  post: PostSchema,
  comments: z.array(CommentSchema)
});
