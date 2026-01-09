export interface TaskRead {
  id: string;
  title: string;
  description?: string;
  status: 'to-do' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
  user_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: 'to-do' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'to-do' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string; // ISO date string
}