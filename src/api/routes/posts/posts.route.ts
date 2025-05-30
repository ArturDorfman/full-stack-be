import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreatePostReqSchema } from '../schemas/CreatePostReqSchema';
import { GetPostsRespSchema } from '../schemas/GetPostsRespSchema';
import { PaginationQuerySchema } from '../schemas/PaginationQuerySchema';
import { PostWithCommentsCountSchema } from 'src/types/PostWithCommentsCount';
import { createPost } from 'src/controllers/post/create-post';
import { getPosts } from 'src/controllers/post/get-posts';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      body: CreatePostReqSchema,
      response: {
        200: PostWithCommentsCountSchema
      }
    }
  }, async (req) => {
    const post = await createPost({
      postRepo: fastify.repos.postRepo,
      data: req.body
    });
    return { ...post, commentsCount: 0 };
  });

  fastify.get('/', {
    schema: {
      querystring: PaginationQuerySchema,
      response: {
        200: GetPostsRespSchema
      }
    }
  }, async (request) => {
    const { limit, offset, search, sortBy, sortDirection } = request.query;

    const result = await getPosts({
      postRepo: fastify.repos.postRepo,
      limit,
      offset,
      search,
      sortBy,
      sortDirection
    });

    return result;
  });
};

export default routes;
