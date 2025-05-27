import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IPostRepo } from 'src/types/IPostRepo';
import { Post, PostSchema, PostWithCommentsCountSchema } from 'src/types/Post';
import { postsTable, commentsTable } from 'src/services/drizzle/schema';
import { CommentSchema } from 'src/types/Comment';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data) {
      const post = await db.insert(postsTable).values(data as Post).returning();
      return PostSchema.parse(post[0]);
    },

    async updatePostById(id, data) {
      const posts = await db
        .update(postsTable)
        .set(data as Post)
        .where(eq(postsTable.id, id))
        .returning();
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async getPostById(id) {
      const posts = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id));
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    },

    async getPostByIdWithComments(id) {
      const post = await this.getPostById(id);

      if (!post) {
        return null;
      }

      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, id));

      return {
        post,
        comments: comments.map(comment => CommentSchema.parse(comment))
      };
    },

    async getAllPosts() {
      const postsWithCounts = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          description: postsTable.description,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt,
          commentsCount: sql<number>`COUNT(${commentsTable.id})::int`
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id)
        .orderBy(postsTable.createdAt);

      return postsWithCounts.map(post => {
        const parsedPost = {
          ...post,
          createdAt: post.createdAt instanceof Date
            ? post.createdAt
            : new Date(String(post.createdAt)),
          updatedAt: post.updatedAt instanceof Date
            ? post.updatedAt
            : new Date(String(post.updatedAt))
        };
        return PostWithCommentsCountSchema.parse(parsedPost);
      });
    }
  };
}
