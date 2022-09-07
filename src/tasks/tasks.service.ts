import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
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
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDTO;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where(user);

    if (status) {
      query.andWhere('task.status == :status', { status: status });
    }

    if (search) {
      //
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  public async getAllTasks(user: User): Promise<Task[]> {
    return this.taskRepository.find({ where: { user } });
  }

  public async createTask(
    createTaskDto: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
      user,
    });

    this.taskRepository.save(task);

    return task;
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return found;
  }

  public async removeTaskById(id: string, user: User): Promise<void> {
    const removedTask = await this.taskRepository.delete({ id, user  });

    if (removedTask.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  public async updateTaskStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
