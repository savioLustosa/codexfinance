import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../db/pool.js';
import { requireAuth } from '../../middleware/auth.js';

const inviteSchema = z.object({
  workspaceId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'member']).default('member')
});

export async function teamRoutes(app: FastifyInstance) {
  app.get('/team/:workspaceId', { preHandler: [requireAuth] }, async (request) => {
    const params = z.object({ workspaceId: z.string().uuid() }).parse(request.params);
    const { rows } = await pool.query(
      `SELECT wm.user_id, wm.role, au.full_name, au.email
       FROM workspace_member wm
       JOIN app_user au ON au.id = wm.user_id
       WHERE wm.workspace_id = $1
       ORDER BY au.full_name ASC`,
      [params.workspaceId]
    );
    return rows;
  });

  app.post('/team/invite', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = inviteSchema.parse(request.body);
    const { rows } = await pool.query(
      `INSERT INTO workspace_invite (workspace_id, invited_email, role, invited_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, invited_email, role, status, created_at`,
      [payload.workspaceId, payload.email, payload.role, request.user.sub]
    );

    return reply.code(201).send(rows[0]);
  });
}
