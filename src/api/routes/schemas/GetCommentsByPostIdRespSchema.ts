import { z } from 'zod';
import { CommentSchema } from 'src/types/Comment';

export const GetCommentsByPostIdRespSchema = z.array(CommentSchema);
