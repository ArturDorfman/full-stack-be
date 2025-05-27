import { z } from 'zod';
import { PostSchema } from './Post';
import { CommentSchema } from './Comment';

export const PostWithCommentsSchema = PostSchema.extend({
  comments: z.array(CommentSchema)
});

export type TPostWithComments = z.infer<typeof PostWithCommentsSchema>;
