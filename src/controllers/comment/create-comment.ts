import { ICommentRepo } from 'src/types/ICommentRepo';
import { IPostRepo } from 'src/types/IPostRepo';
import { Comment } from 'src/types/Comment';

export async function createComment({ commentRepo, postRepo, postId, data }: {
  commentRepo: ICommentRepo;
  postRepo: IPostRepo;
  postId: string;
  data: Partial<Comment>;
}) {
  const post = await postRepo.getPostById(postId);
  if (!post) {
    throw new Error(`Post with id ${postId} not found`);
  }

  const comment = await commentRepo.createComment({ ...data, postId });
  return comment;
}
