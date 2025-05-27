import { TPost } from './Post';
import { TPostWithCommentsCount } from './PostWithCommentsCount';
import { TPostWithComments } from './PostWithComments';

export interface IPostRepo {
  createPost(data: Partial<TPost>): Promise<TPost>;
  updatePostById(id: string, data: Partial<TPost>): Promise<TPost | null>;
  getPostById(id: string): Promise<TPost | null>;
  getPostByIdWithComments(id: string): Promise<TPostWithComments | null>;
  getAllPosts(): Promise<TPostWithCommentsCount[]>;
}
