import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UpdatePostReqSchema } from '../../schemas/UpdatePostReqSchema';
import { GetPostByIdRespSchema } from '../../schemas/GetPostByIdRespSchema';
import { UpdatePostRespSchema } from '../../schemas/UpdatePostRespSchema';
import { updatePost } from 'src/controllers/post/update-post';
import { getPostById } from 'src/controllers/post/get-post-by-id';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetPostByIdRespSchema
      }
    }
  }, async (req) => {
    const post = await getPostById({
      postRepo: fastify.repos.postRepo,
      id: req.params.postId
    });

    return post;
  });

  fastify.patch('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      body: UpdatePostReqSchema,
      response: {
        200: UpdatePostRespSchema
      }
    }
  }, async (req) => {
    const post = await updatePost({
      postRepo: fastify.repos.postRepo,
      id: req.params.postId,
      data: req.body
    });

    return post;
  });
};

export default routes;
