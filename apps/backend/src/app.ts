import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { healthRoutes } from './modules/health/routes.js';
import { authRoutes } from './modules/auth/routes.js';
import { projectRoutes } from './modules/projects/routes.js';
import { taskRoutes } from './modules/tasks/routes.js';
import { teamRoutes } from './modules/teams/routes.js';
import { userRoutes } from './modules/users/routes.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true, credentials: true });
  app.register(helmet);

  app.register(healthRoutes, { prefix: '/api' });
  app.register(authRoutes, { prefix: '/api' });
  app.register(userRoutes, { prefix: '/api' });
  app.register(teamRoutes, { prefix: '/api' });
  app.register(projectRoutes, { prefix: '/api' });
  app.register(taskRoutes, { prefix: '/api' });

  return app;
}
