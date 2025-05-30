import { IPostRepo } from 'src/types/IPostRepo';

export async function getPosts({
  postRepo,
  limit = 10,
  offset = 0
}: {
  postRepo: IPostRepo;
  limit?: number;
  offset?: number;
}) {
  const { posts, total } = await postRepo.getPosts({ limit, offset });

  const page = Math.floor(offset / limit) + 1;
  // const totalPages = Math.ceil(total / limit);

  return {
    posts,
    meta: { total, limit, offset, page }
  };
}
