-- Enable pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN indexes for faster text search
CREATE INDEX "idx_posts_title_trgm" ON "posts" USING GIN ("title" gin_trgm_ops);
CREATE INDEX "idx_posts_description_trgm" ON "posts" USING GIN ("description" gin_trgm_ops);