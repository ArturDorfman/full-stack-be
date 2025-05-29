import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';
import { HttpError } from 'src/api/errors/HttpError';

export async function updateComment({ commentRepo, id, postId, data }: {
  commentRepo: ICommentRepo;
  id: string;
  postId: string;
  data: Partial<Comment>;
}) {
  const comment = await commentRepo.updateCommentById(id, postId, data);

  if (!comment) {
    throw new HttpError(404, 'Comment not found or does not belong to the specified post');
  }

  return comment;
}
