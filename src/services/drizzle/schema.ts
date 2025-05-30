import { uuid, pgTable, varchar, timestamp, text, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const entityTable = pgTable('entities', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

// POST AND COMMENT TABLES
export const postsTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
}, ({ title, description }) => ({
  titleIdx: index('idx_posts_title_trgm').on(title),
  descriptionIdx: index('idx_posts_description_trgm').on(description)
}));

export const commentsTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  text: text().notNull(),
  postId: uuid().notNull().references(() => postsTable.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

export const postsRelations = relations(postsTable, ({ many }) => ({
  comments: many(commentsTable)
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id]
  })
}));
