import { TaskStatus } from '../task.model';

export interface UpdateTaskDTO {
  id: string;
  status: TaskStatus;
}
