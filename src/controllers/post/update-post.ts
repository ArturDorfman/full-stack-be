import { HttpError } from 'src/api/errors/HttpError';
import { IPostRepo } from 'src/types/IPostRepo';
import { TPost } from 'src/types/Post';

export async function updatePost({ postRepo, id, data }: {
  postRepo: IPostRepo;
  id: string;
  data: Partial<TPost>;
}) {
  const post = await postRepo.updatePostById(id, data);
  if (!post) {
    throw new HttpError(404, 'Post not found');
  }
  return post;
}
