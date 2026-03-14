import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().default(''),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']).default('todo'),
  assigneeId: z.string().uuid().nullable().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done'])
});

export async function taskRoutes(app: FastifyInstance) {
  app.get('/tasks/:projectId', { preHandler: [requireAuth] }, async (request) => {
    const params = z.object({ projectId: z.string().uuid() }).parse(request.params);
    const { rows } = await pool.query(
      `SELECT id, project_id, title, description, status, priority, due_date, assignee_id
       FROM task
       WHERE project_id = $1
       ORDER BY created_at ASC`,
      [params.projectId]
    );
    return rows;
  });

  app.post('/tasks', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = createTaskSchema.parse(request.body);
    const { rows } = await pool.query(
      `INSERT INTO task (project_id, title, description, status, priority, assignee_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, project_id, title, description, status, priority, due_date, assignee_id`,
      [payload.projectId, payload.title, payload.description, payload.status, payload.priority, payload.assigneeId ?? null]
    );
    return reply.code(201).send(rows[0]);
  });

  app.patch('/tasks/:taskId/status', { preHandler: [requireAuth] }, async (request) => {
    const params = z.object({ taskId: z.string().uuid() }).parse(request.params);
    const payload = updateStatusSchema.parse(request.body);

    const { rows } = await pool.query(
      `UPDATE task
       SET status = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, project_id, title, status, priority`,
      [params.taskId, payload.status]
    );
    return rows[0];
  });
}
