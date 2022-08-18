import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task-status.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        }
      });
    }

    return tasks;
  }

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
    const found = this.tasks.find((task) => task.id === id);

    if (!found) throw new NotFoundException(`Task with id ${id} not found`);

    return found;
  }

  public removeTaskById(id: string) {
    const removedTask = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task !== this.getTaskById(id));

    return removedTask;
  }

  public updateTaskStatusById(updateTaskDTO: UpdateTaskDTO): Task {
    const taskToBeUpdated = this.getTaskById(updateTaskDTO.id);
    taskToBeUpdated.status = updateTaskDTO.status;

    return taskToBeUpdated;
  }
}
