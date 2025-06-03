import { IPostRepo } from 'src/types/IPostRepo';
import { TGetPostsQuery } from 'src/api/routes/schemas/PaginationQuerySchema';

type TGetPostsParams = TGetPostsQuery & { postRepo: IPostRepo; }

export async function getPosts({
  postRepo,
  limit = 10,
  page = 1,
  search,
  sortBy = 'createdAt',
  sortDirection = 'desc',
  minComments
}: TGetPostsParams) {
  const offset = (page - 1) * limit;

  const { posts, total } = await postRepo.getPosts({
    limit,
    offset,
    search,
    sortBy,
    sortDirection,
    minComments
  });

  return {
    posts,
    meta: { total, limit, offset, page, sortBy, sortDirection }
  };
}
