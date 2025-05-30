import { eq, getTableColumns, count, desc, asc, or, ilike } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/IPostRepo';
import { TPost, PostSchema } from 'src/types/Post';
import { PostWithCommentsCountSchema } from 'src/types/PostWithCommentsCount';
import { PostWithCommentsSchema } from 'src/types/PostWithComments';
import { postsTable, commentsTable } from 'src/services/drizzle/schema';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const post = await db
        .insert(postsTable)
        .values(data as TPost)
        .returning();

      return PostSchema.parse(post[0]);
    },

    async updatePostById(id, data) {
      const posts = await db
        .update(postsTable)
        .set(data as TPost)
        .where(eq(postsTable.id, id))
        .returning();

      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async getPostById(id) {
      const post = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id));

      return post.length > 0 ? PostSchema.parse(post[0]) : null;
    },

    async getPostByIdWithComments(id) {
      const post = await db
        .select({
          ...getTableColumns(postsTable),
          comments: commentsTable
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .where(eq(postsTable.id, id));

      return post.length > 0
        ? PostWithCommentsSchema.parse({
          ...post[0],
          comments: post.flatMap(p => p.comments).filter(Boolean)
        })
        : null;
    },

    async getPosts({ limit, offset, search, sortBy = 'createdAt', sortDirection = 'desc' }) {
      const baseQuery = db
        .select({
          ...getTableColumns(postsTable),
          commentsCount: count(commentsTable.id)
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId));

      const getSortExpression = () => {
        if (sortBy === 'title') {
          return sortDirection === 'asc' ? asc(postsTable.title) : desc(postsTable.title);
        }

        if (sortBy === 'commentsCount') {
          return sortDirection === 'asc' ? asc(count(commentsTable.id)) : desc(count(commentsTable.id));
        }

        return sortDirection === 'asc' ? asc(postsTable.createdAt) : desc(postsTable.createdAt);
      };

      const postsWithCounts = search
        ? baseQuery
          .where(
            or(
              ilike(postsTable.title, `%${search}%`),
              ilike(postsTable.description, `%${search}%`)
            )
          )
          .groupBy(postsTable.id)
          .orderBy(getSortExpression())
          .limit(limit)
          .offset(offset)
        : baseQuery
          .groupBy(postsTable.id)
          .orderBy(getSortExpression())
          .limit(limit)
          .offset(offset);

      // Build the total count query with the same search filter if provided
      const totalCountBaseQuery = db
        .select({ count: count() })
        .from(postsTable);

      const totalCount = search
        ? totalCountBaseQuery
          .where(
            or(
              ilike(postsTable.title, `%${search}%`),
              ilike(postsTable.description, `%${search}%`)
            )
          )
        : totalCountBaseQuery;

      const [postsWithCountsResult, totalResult] = await Promise.all([
        postsWithCounts,
        totalCount
      ]);

      const total = totalResult[0]?.count || 0;
      const posts = PostWithCommentsCountSchema.array().parse(postsWithCountsResult);

      return { posts, total };
    }
  };
}
