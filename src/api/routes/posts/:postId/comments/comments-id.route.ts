import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UpdateCommentReqSchema } from '../../../schemas/UpdateCommentReqSchema';
import { updateComment } from 'src/controllers/comment/update-comment';
import { CommentSchema } from 'src/types/Comment';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.put('/', {
    schema: {
      params: z.object({
        commentId: z.string().uuid()
      }),
      body: UpdateCommentReqSchema,
      response: {
        200: CommentSchema
      }
    }
  }, async (req) => {
    const comment = await updateComment({
      commentRepo: fastify.repos.commentRepo,
      id: req.params.commentId,
      data: req.body
    });
    return comment;
  });
};

export default routes;
