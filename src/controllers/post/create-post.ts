import { IPostRepo } from 'src/types/IPostRepo';
import { TPost } from 'src/types/Post';

export async function createPost({ postRepo, data }: {
  postRepo: IPostRepo;
  data: Partial<TPost>;
}) {
  const post = await postRepo.createPost(data);
  return post;
}
