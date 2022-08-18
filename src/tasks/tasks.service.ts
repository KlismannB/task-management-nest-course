import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  @InjectRepository(Task)
  private taskRepository: Repository<Task>;

  public async getTasksWithFilters(
    filterDTO: GetTasksFilterDTO,
  ): Promise<Task[]> {
    const { status, search } = filterDTO;

    let tasks = await this.getAllTasks();

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

  public async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  public async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });
    
    this.taskRepository.save(task);

    return task;
  }

  public async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return found;
  }

  // public removeTaskById(id: string) {
  //   const removedTask = this.getTaskById(id);

  //   this.tasks = this.tasks.filter((task) => task !== this.getTaskById(id));

  //   return removedTask;
  // }

  // public updateTaskStatusById(id: string, status: TaskStatus): Task {
  //   const taskToBeUpdated = this.getTaskById(id);
  //   taskToBeUpdated.status = status;

  //   return taskToBeUpdated;
  // }
}
