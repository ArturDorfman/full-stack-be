import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';
import { HttpError } from 'src/api/errors/HttpError';

export async function updateComment({ commentRepo, id, data }: {
  commentRepo: ICommentRepo;
  id: string;
  data: Partial<Comment>;
}) {
  const comment = await commentRepo.updateCommentById(id, data);

  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  return comment;
}
