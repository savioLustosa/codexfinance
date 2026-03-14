export type Role = 'owner' | 'admin' | 'manager' | 'member';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed';
  startDate: string;
  dueDate: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  assigneeId: string | null;
}
