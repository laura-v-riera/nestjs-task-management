import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksRepository {
  constructor(@InjectRepository(Task) private repository: Repository<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.repository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
    });
    await this.repository.save(task);
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const query = this.repository.createQueryBuilder('task');

    if (filterDto.status) {
      query.andWhere('task.status = :status', { status: filterDto.status });
    }

    if (filterDto.search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${filterDto.search}%` },
      );
    }

    return query.getMany();
  }

  async findTaskById(id: string): Promise<Task | null> {
    return this.repository.findOne({ where: { id } });
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
