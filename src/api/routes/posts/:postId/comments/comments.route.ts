import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreateCommentReqSchema } from '../../../schemas/CreateCommentReqSchema';
import { GetCommentsByPostIdRespSchema } from '../../../schemas/GetCommentsByPostIdRespSchema';
import { createComment } from 'src/controllers/comment/create-comment';
import { getCommentsByPostId } from 'src/controllers/comment/get-comments-by-post-id';
import { CommentSchema } from 'src/types/Comment';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      body: CreateCommentReqSchema,
      response: {
        200: CommentSchema
      }
    }
  }, async (req) => {
    const comment = await createComment({
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      data: req.body
    });
    return comment;
  });

  fastify.get('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetCommentsByPostIdRespSchema
      }
    }
  }, async (req) => {
    const comments = await getCommentsByPostId({
      commentRepo: fastify.repos.commentRepo,
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
    return comments;
  });
};

export default routes;
