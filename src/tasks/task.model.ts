export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

// This limits the type of possible status for a task
export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
