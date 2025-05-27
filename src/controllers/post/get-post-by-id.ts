import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/IPostRepo';

export async function getPostById({ postRepo, id }: {
  postRepo: IPostRepo;
  id: string;
}) {
  const result = await postRepo.getPostByIdWithComments(id);
  if (!result) {
    throw new HttpError(404, 'Post not found');
  }
  return result;
}
