import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment } from 'src/types/Comment';

export async function updateComment({ commentRepo, id, data }: {
  commentRepo: ICommentRepo;
  id: string;
  data: Partial<Comment>;
}) {
  // Ensure we're not changing the postId
  const { postId, ...updateData } = data;
  
  const comment = await commentRepo.updateCommentById(id, updateData);
  if (!comment) {
    throw new Error(`Comment with id ${id} not found`);
  }
  
  return comment;
}
