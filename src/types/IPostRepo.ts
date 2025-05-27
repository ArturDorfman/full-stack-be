import { Post, PostWithCommentsCount } from './Post';
import { Comment } from './Comment';

export interface IPostRepo {
  createPost(data: Partial<Post>): Promise<Post>;
  updatePostById(id: string, data: Partial<Post>): Promise<Post | null>;
  getPostById(id: string): Promise<Post | null>;
  getPostByIdWithComments(id: string): Promise<{ post: Post, comments: Comment[] } | null>;
  getAllPosts(): Promise<PostWithCommentsCount[]>;
}
