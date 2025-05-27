import { z } from 'zod';
import { PostWithCommentsCountSchema } from 'src/types/Post';

export const GetAllPostsRespSchema = z.array(PostWithCommentsCountSchema);
