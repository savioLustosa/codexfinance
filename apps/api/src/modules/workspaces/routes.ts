import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const createWorkspaceSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/)
});

export async function workspaceRoutes(app: FastifyInstance) {
  app.get('/workspaces', { preHandler: [requireAuth] }, async (request) => {
    const userId = request.user.sub as string;
    const { rows } = await pool.query(
      `SELECT w.id, w.name, w.slug, w.plan
       FROM workspace w
       JOIN workspace_member wm ON wm.workspace_id = w.id
       WHERE wm.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );
    return rows;
  });

  app.post('/workspaces', { preHandler: [requireAuth] }, async (request, reply) => {
    const userId = request.user.sub as string;
    const payload = createWorkspaceSchema.parse(request.body);

    const { rows } = await pool.query(
      `WITH created_workspace AS (
        INSERT INTO workspace (name, slug, owner_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, slug, plan
      )
      INSERT INTO workspace_member (workspace_id, user_id, role)
      SELECT id, $3, 'owner' FROM created_workspace
      RETURNING workspace_id`,
      [payload.name, payload.slug, userId]
    );

    return reply.code(201).send({ workspaceId: rows[0]?.workspace_id });
  });
}
