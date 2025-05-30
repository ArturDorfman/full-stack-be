import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreatePostReqSchema } from '../schemas/CreatePostReqSchema';
import { GetAllPostsRespSchema } from '../schemas/GetAllPostsRespSchema';
import { PostWithCommentsCountSchema } from 'src/types/PostWithCommentsCount';
import { createPost } from 'src/controllers/post/create-post';
import { getAllPosts } from 'src/controllers/post/get-all-posts';

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
