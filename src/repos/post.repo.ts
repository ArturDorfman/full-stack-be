import { eq, getTableColumns, count, desc, asc, or, ilike, gte } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
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

    async getPosts({ limit, offset, search, sortBy = 'createdAt', sortDirection = 'desc', minComments }) {
      const baseQuery = db
        .select({
          ...getTableColumns(postsTable),
          commentsCount: count(commentsTable.id)
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id);

      const getSortExpression = () => {
        if (sortBy === 'title') {
          return sortDirection === 'asc'
            ? asc(postsTable.title)
            : desc(postsTable.title);
        }

        if (sortBy === 'commentsCount') {
          return sortDirection === 'asc'
            ? asc(count(commentsTable.id))
            : desc(count(commentsTable.id));
        }

        return sortDirection === 'asc'
          ? asc(postsTable.createdAt)
          : desc(postsTable.createdAt);
      };

      const getWhereConditions = (search?: string) => {
        const whereConditions = [];

        if (search) {
          whereConditions.push(
            ilike(postsTable.title, `%${search}%`),
            ilike(postsTable.description, `%${search}%`)
          );
        }

        return whereConditions;
      };

      const getPostsWithCountsQuery = (query: any, whereConditions: SQL<unknown>[]) => {
        if (whereConditions.length > 0) {
          return query.where(or(...whereConditions));
        }

        return query;
      };

      const getPostsByCommentsCountQuery = (query: any, minComments?: number) => {
        if (minComments) {
          return query.having(gte(count(commentsTable.id), minComments));
        }

        return query;
      };

      const whereConditions = getWhereConditions(search);

      const postsWithCountsQuery = getPostsWithCountsQuery(
        baseQuery.orderBy(getSortExpression()).limit(limit).offset(offset),
        whereConditions
      );

      const postsWithCounts = getPostsByCommentsCountQuery(postsWithCountsQuery, minComments);

      // ============= TOTAL COUNT =============
      const getSimpleCountQuery = (whereConditions: SQL<unknown>[]) => {
        const query = db
          .select({ count: count() })
          .from(postsTable);

        if (whereConditions.length > 0) {
          return query.where(or(...whereConditions));
        }

        return query;
      };

      const getMinCommentsCountQuery = (whereConditions: SQL<unknown>[], minComments: number) => {
        // This creates a query that returns only the IDs of posts that have at least the minimum number of comments.
        const subquery = db
          // Selects only the post IDs
          .select({ id: postsTable.id })
          // Specifies the posts table as the main table
          .from(postsTable)
          // Joins with the comments table to access comment data
          .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
          // Groups results by post ID so we can count comments per post
          .groupBy(postsTable.id)
          // Filters to only include posts with at least minComments comments
          .having(gte(count(commentsTable.id), minComments));

        const filteredSubquery = whereConditions.length > 0
          ? subquery.where(or(...whereConditions))
          : subquery;

        return db
          // Creates a query that will count rows
          .select({ count: count() })
          // Uses our filtered subquery as the source table
          // The subquery is given an alias 'filtered_posts' to reference it in the outer query
          .from(filteredSubquery.as('filtered_posts'));
      };

      const totalCountQuery = minComments
        ? getMinCommentsCountQuery(whereConditions, minComments)
        : getSimpleCountQuery(whereConditions);

      const [postsWithCountsResult, totalResult] = await Promise.all([
        postsWithCounts,
        totalCountQuery
      ]);

      const total = totalResult[0]?.count || 0;
      const posts = PostWithCommentsCountSchema.array().parse(postsWithCountsResult);

      return { posts, total };
    }
  };
}
