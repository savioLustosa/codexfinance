import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const createProjectSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().default(''),
  dueDate: z.string().datetime().optional()
});

export async function projectRoutes(app: FastifyInstance) {
  app.get('/projects/:workspaceId', { preHandler: [requireAuth] }, async (request) => {
    const params = z.object({ workspaceId: z.string().uuid() }).parse(request.params);

    const { rows } = await pool.query(
      `SELECT id, workspace_id, name, description, status, start_date, due_date
       FROM project
       WHERE workspace_id = $1
       ORDER BY created_at DESC`,
      [params.workspaceId]
    );

    return rows;
  });

  app.post('/projects', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = createProjectSchema.parse(request.body);

    const { rows } = await pool.query(
      `INSERT INTO project (workspace_id, name, description, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, workspace_id, name, description, status, start_date, due_date`,
      [payload.workspaceId, payload.name, payload.description, payload.dueDate ?? null]
    );

    return reply.code(201).send(rows[0]);
  });
}
