import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class  TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public createTask(createTaskDto: CreateTaskDTO): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  public getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  public removeTaskById(id: string) {
    const removedTask = this.tasks.find((task) => task.id === id);

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return removedTask;
  }

  public updateTaskStatusById(updateTaskDTO: UpdateTaskDTO): Task {
    const taskToBeUpdated = this.tasks.find(
      (task) => task.id === updateTaskDTO.id,
    );
    taskToBeUpdated.status = updateTaskDTO.status;

    return taskToBeUpdated;
  }
}
