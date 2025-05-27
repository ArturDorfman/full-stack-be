import { IPostRepo } from 'src/types/IPostRepo';
import { Post } from 'src/types/Post';

export async function createPost({ postRepo, data }: {
  postRepo: IPostRepo;
  data: Partial<Post>;
}) {
  const post = await postRepo.createPost(data);
  return post;
}
