import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createComment } from 'src/controllers/comment/create-comment';
import { getCommentsByPostId } from 'src/controllers/comment/get-comments-by-post-id';
import { CreateCommentReqSchema } from '../../../schemas/CreateCommentReqSchema';
import { GetCommentsByPostIdRespSchema } from '../../../schemas/GetCommentsByPostIdRespSchema';
import { CreateCommentRespSchema } from '../../../schemas/CreateCommentRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      body: CreateCommentReqSchema,
      response: {
        200: CreateCommentRespSchema
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
