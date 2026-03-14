import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../shared/auth.js';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: [requireAuth] }, async (request) => {
    return {
      id: request.user?.id,
      email: request.user?.email
    };
  });
}
