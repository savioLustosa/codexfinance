import { FastifyReply, FastifyRequest } from 'fastify';
import { supabaseAuthClient } from '../plugins/supabase.js';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token ausente.' });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseAuthClient.auth.getUser(token);

  if (error || !data.user) {
    return reply.status(401).send({ error: 'Token inválido.' });
  }

  request.user = {
    id: data.user.id,
    email: data.user.email ?? ''
  };
}
