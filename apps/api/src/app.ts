import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import jwt from '@fastify/jwt';
import { env } from './config/env.js';
import { healthRoutes } from './modules/health/routes.js';
import { authRoutes } from './modules/auth/routes.js';
import { workspaceRoutes } from './modules/workspaces/routes.js';
import { projectRoutes } from './modules/projects/routes.js';
import { taskRoutes } from './modules/tasks/routes.js';
import { teamRoutes } from './modules/team/routes.js';

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(sensible);
  app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true
  });
  app.register(jwt, {
    secret: env.JWT_SECRET
  });

  app.register(healthRoutes, { prefix: '/api' });
  app.register(authRoutes, { prefix: '/api' });
  app.register(workspaceRoutes, { prefix: '/api' });
  app.register(projectRoutes, { prefix: '/api' });
  app.register(taskRoutes, { prefix: '/api' });
  app.register(teamRoutes, { prefix: '/api' });

  return app;
};
