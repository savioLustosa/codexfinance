import { z } from 'zod';

export const projectStatusSchema = z.enum(['backlog', 'active', 'blocked', 'done']);

export const createProjectSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().max(1500).optional(),
  status: projectStatusSchema.default('backlog'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teamId: z.string().uuid()
});

export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
