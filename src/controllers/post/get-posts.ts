import { IPostRepo } from 'src/types/IPostRepo';
import { TGetPostsQuery } from 'src/api/routes/schemas/PaginationQuerySchema';

type TGetPostsParams = TGetPostsQuery & { postRepo: IPostRepo; }

export async function getPosts({
  postRepo,
  limit = 10,
  offset = 0,
  search,
  sortBy = 'createdAt',
  sortDirection = 'desc',
  minComments
}: TGetPostsParams) {
  const { posts, total } = await postRepo.getPosts({
    limit,
    offset,
    search,
    sortBy,
    sortDirection,
    minComments
  });

  const page = Math.floor(offset / limit) + 1;

  return {
    posts,
    meta: { total, limit, offset, page, sortBy, sortDirection }
  };
}
