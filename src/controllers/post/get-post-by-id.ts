import { IPostRepo } from 'src/types/IPostRepo';

export async function getPostById({ postRepo, id }: {
  postRepo: IPostRepo;
  id: string;
}) {
  const result = await postRepo.getPostByIdWithComments(id);
  if (!result) {
    throw new Error(`Post with id ${id} not found`);
  }
  return result;
}
