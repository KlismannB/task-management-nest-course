import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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

    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status == :status', { status: status });
    }

    if (search) {
      //
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
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
    const found = await this.taskRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return found;
  }

  public async removeTaskById(id: string): Promise<void> {
    const removedTask = await this.taskRepository.delete(id);

    if (removedTask.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  public async updateTaskStatusById(
    id: string,
    status: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
