import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ICommentRepo } from 'src/types/ICommentRepo';
import { Comment, CommentSchema } from 'src/types/Comment';
import { commentsTable } from 'src/services/drizzle/schema';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data) {
      const comment = await db.insert(commentsTable).values(data as Comment).returning();
      return CommentSchema.parse(comment[0]);
    },
    
    async updateCommentById(id, data) {
      const comments = await db
        .update(commentsTable)
        .set(data as Comment)
        .where(eq(commentsTable.id, id))
        .returning();
      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    },
    
    async getCommentsByPostId(postId) {
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, postId))
        .orderBy(commentsTable.createdAt);
      
      return comments.map(comment => CommentSchema.parse(comment));
    }
  };
}
