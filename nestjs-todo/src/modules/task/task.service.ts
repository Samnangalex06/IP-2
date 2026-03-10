import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return await this.tasksRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({
      where: { id: parseInt(id) },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepo.create({
      name: createTaskDto.name,
      description: createTaskDto.description,
      user: { id: createTaskDto.userId } as User,
    });
    return await this.tasksRepo.save(task);
  }

  async updateTask(id: string, updateData: Partial<Task>): Promise<Task> {
    const task = await this.getTask(id);
    Object.assign(task, updateData);
    return await this.tasksRepo.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepo.delete(parseInt(id));
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
