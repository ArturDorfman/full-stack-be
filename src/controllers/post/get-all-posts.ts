import { IPostRepo } from 'src/types/IPostRepo';

export async function getAllPosts({ postRepo }: {
  postRepo: IPostRepo;
}) {
  const posts = await postRepo.getAllPosts();
  return posts;
}
