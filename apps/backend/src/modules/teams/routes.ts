import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../../shared/auth.js';
import { supabase } from '../../plugins/supabase.js';

const createTeamSchema = z.object({
  name: z.string().min(2).max(100)
});

export async function teamRoutes(app: FastifyInstance) {
  app.get('/teams', { preHandler: [requireAuth] }, async (request, reply) => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('owner_id', request.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return data;
  });

  app.post('/teams', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = createTeamSchema.parse(request.body);

    const { data, error } = await supabase
      .from('teams')
      .insert({ name: payload.name, owner_id: request.user!.id })
      .select('*')
      .single();

    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send(data);
  });
}
