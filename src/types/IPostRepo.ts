import { TPost } from './Post';
import { TPostWithCommentsCount } from './PostWithCommentsCount';
import { TPostWithComments } from './PostWithComments';
import { TGetPostsQuery } from '../api/routes/schemas/PaginationQuerySchema';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPost>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPost | null>;
  getPostById(id: string): Promise<TPost | null>;
  getPostByIdWithComments(id: string): Promise<TPostWithComments | null>;
  getPosts(params: Omit<TGetPostsQuery, 'page'> & { offset: number }): Promise<{
    posts: TPostWithCommentsCount[];
    total: number
  }>;
}
