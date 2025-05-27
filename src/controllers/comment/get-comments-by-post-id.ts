import { ICommentRepo } from 'src/types/ICommentRepo';
import { IPostRepo } from 'src/types/IPostRepo';

export async function getCommentsByPostId({ commentRepo, postRepo, postId }: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  postId: string;
}) {
  const post = await postRepo.getPostById(postId);
  if (!post) {
    throw new Error(`Post with id ${postId} not found`);
  }

  const comments = await commentRepo.getCommentsByPostId(postId);
  return comments;
}
