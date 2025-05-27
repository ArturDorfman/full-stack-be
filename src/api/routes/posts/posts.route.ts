import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreatePostReqSchema } from '../schemas/CreatePostReqSchema';
import { GetPostByIdRespSchema } from '../schemas/GetPostByIdRespSchema';
import { GetAllPostsRespSchema } from '../schemas/GetAllPostsRespSchema';
import { createPost } from 'src/controllers/post/create-post';
import { getAllPosts } from 'src/controllers/post/get-all-posts';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      body: CreatePostReqSchema,
      response: {
        200: GetPostByIdRespSchema.pick({ post: true })
      }
    }
  }, async (req) => {
    const post = await createPost({
      postRepo: fastify.repos.postRepo,
      data: req.body
    });
    return { post };
  });

  fastify.get('/', {
    schema: {
      response: {
        200: GetAllPostsRespSchema
      }
    }
  }, async () => {
    const posts = await getAllPosts({
      postRepo: fastify.repos.postRepo
    });
    return posts;
  });
};

export default routes;
