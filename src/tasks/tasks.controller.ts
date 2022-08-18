import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
  //   if (Object.keys(filterDTO).length) {
  //     return this.tasksService.getTasksWithFilters(filterDTO);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  @Get()
  public getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  public getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  // @Post()
  // public createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
  //   return this.tasksService.createTask(createTaskDto);
  // }

  // @Delete('/:id')
  // public removeTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.removeTaskById(id);
  // }

  // @Patch('/:id/:status')
  // public updateTaskById(
  //   @Param() id,
  //   @Body() updateTaskDTO: UpdateTaskStatusDTO,
  // ) {
  //   const { status } = updateTaskDTO;
  //   return this.tasksService.updateTaskStatusById(id, status);
  // }
}
