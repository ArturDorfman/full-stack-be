import { IPostRepo } from 'src/types/IPostRepo';

export async function getPosts({
  postRepo,
  limit = 10,
  offset = 0,
  search
}: {
  postRepo: IPostRepo;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { posts, total } = await postRepo.getPosts({ limit, offset, search });

  const page = Math.floor(offset / limit) + 1;

  return {
    posts,
    meta: { total, limit, offset, page }
  };
}
