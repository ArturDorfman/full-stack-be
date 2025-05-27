import { ICommentRepo } from 'src/types/ICommentRepo';
import { IPostRepo } from 'src/types/IPostRepo';
import { Comment } from 'src/types/Comment';
import { HttpError } from 'src/api/errors/HttpError';

export async function createComment({ commentRepo, postRepo, postId, data }: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  postId: string;
  data: Partial<Comment>;
}) {
  const post = await postRepo.getPostById(postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const comment = await commentRepo.createComment({ ...data, postId });
  return comment;
}
