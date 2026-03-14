import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { supabaseAuthClient } from '../../plugins/supabase.js';

const signUpSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const signInSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/signup', async (request, reply) => {
    const payload = signUpSchema.parse(request.body);
    const { data, error } = await supabaseAuthClient.auth.signUp(payload);

    if (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send(data);
  });

  app.post('/auth/signin', async (request, reply) => {
    const payload = signInSchema.parse(request.body);
    const { data, error } = await supabaseAuthClient.auth.signInWithPassword(payload);

    if (error) {
      return reply.status(401).send({ error: error.message });
    }

    return reply.send(data);
  });
}
