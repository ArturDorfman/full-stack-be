import { ICommentRepo } from 'src/types/ICommentRepo';
import { IPostRepo } from 'src/types/IPostRepo';
import { HttpError } from 'src/api/errors/HttpError';

export async function getCommentsByPostId({ commentRepo, postRepo, postId }: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  postId: string;
}) {
  const post = await postRepo.getPostById(postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const comments = await commentRepo.getCommentsByPostId(postId);
  return comments;
}
