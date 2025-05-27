import { z } from 'zod';
import { PostWithCommentsCountSchema } from 'src/types/PostWithCommentsCount';

export const GetAllPostsRespSchema = z.array(PostWithCommentsCountSchema);
