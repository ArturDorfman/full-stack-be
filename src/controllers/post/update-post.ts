import { IPostRepo } from 'src/types/IPostRepo';
import { Post } from 'src/types/Post';

export async function updatePost({ postRepo, id, data }: {
  postRepo: IPostRepo;
  id: string;
  data: Partial<Post>;
}) {
  const post = await postRepo.updatePostById(id, data);
  if (!post) {
    throw new Error(`Post with id ${id} not found`);
  }
  return post;
}
