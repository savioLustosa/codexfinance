import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pool } from '../../db/pool.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const result = await pool.query(
      'SELECT id, email, full_name FROM app_user WHERE email = $1 AND password_hash = crypt($2, password_hash)',
      [email, password]
    );

    if (!result.rows[0]) {
      return reply.unauthorized('Credenciais inválidas.');
    }

    const user = result.rows[0];
    const token = app.jwt.sign({ sub: user.id, email: user.email });

    return { token, user };
  });
}
