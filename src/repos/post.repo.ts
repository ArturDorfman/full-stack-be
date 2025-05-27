import { eq, getTableColumns, count } from 'drizzle-orm';
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

    async getAllPosts() {
      const postsWithCounts = await db
        .select({
          ...getTableColumns(postsTable),
          commentsCount: count(commentsTable.id)
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id)
        .orderBy(postsTable.createdAt);

      return PostWithCommentsCountSchema.array().parse(postsWithCounts);
    }
  };
}
