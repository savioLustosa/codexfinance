import { createProjectSchema } from '@cedex/shared/src/index.js';
import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../shared/auth.js';
import { supabase } from '../../plugins/supabase.js';

export async function projectRoutes(app: FastifyInstance) {
  app.get('/projects', { preHandler: [requireAuth] }, async (request, reply) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', request.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      return reply.status(500).send({ error: error.message });
    }

    return data;
  });

  app.post('/projects', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = createProjectSchema.parse(request.body);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: payload.name,
        description: payload.description,
        status: payload.status,
        start_date: payload.startDate,
        end_date: payload.endDate,
        team_id: payload.teamId,
        owner_id: request.user!.id
      })
      .select('*')
      .single();

    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send(data);
  });
}
