export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  due_date: string;
}

export type TaskStatus = Task['status'];