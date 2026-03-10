import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  @Post('/')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id/done')
  markTaskAsDone(@Param('id') id: string) {
    return this.taskService.updateTask(id, {
      completedAt: new Date(),
    });
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Param('id') id: string) {
    return this.taskService.updateTask(id, {
      completedAt: null,
    });
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
