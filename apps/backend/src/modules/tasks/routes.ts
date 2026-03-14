import { createTaskSchema } from '@cedex/shared/src/index.js';
import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../shared/auth.js';
import { supabase } from '../../plugins/supabase.js';

export async function taskRoutes(app: FastifyInstance) {
  app.get('/tasks', { preHandler: [requireAuth] }, async (request, reply) => {
    const { projectId } = request.query as { projectId?: string };

    let query = supabase.from('tasks').select('*').eq('owner_id', request.user!.id).order('created_at', { ascending: false });
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return data;
  });

  app.post('/tasks', { preHandler: [requireAuth] }, async (request, reply) => {
    const payload = createTaskSchema.parse(request.body);

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        owner_id: request.user!.id,
        project_id: payload.projectId,
        title: payload.title,
        description: payload.description,
        assignee_id: payload.assigneeId,
        due_date: payload.dueDate,
        priority: payload.priority
      })
      .select('*')
      .single();

    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send(data);
  });
}
