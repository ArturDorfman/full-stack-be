import { Comment } from './Comment';

export interface ICommentRepo {
  createComment(data: Partial<Comment>): Promise<Comment>;
  updateCommentById(id: string, data: Partial<Comment>): Promise<Comment | null>;
  getCommentsByPostId(postId: string): Promise<Comment[]>;
}
