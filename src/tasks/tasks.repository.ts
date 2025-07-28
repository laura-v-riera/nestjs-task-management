import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksRepository {
  constructor(@InjectRepository(Task) private repository: Repository<Task>) {}

  private logger = new Logger('TasksRepository');
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.repository.create({
      ...createTaskDto,
      status: TaskStatus.OPEN,
      user: user,
    });
    await this.repository.save(task);
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
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

    query.andWhere('task.userId = :userId', { userId: user.id });

    try {
      const result = await query.getMany();
      this.logger.debug(
        `Retrieved tasks for user ${user.username}. Filter: ${JSON.stringify(filterDto)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve tasks for user ${user.username}. Filter: ${JSON.stringify(filterDto)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException();
    }
  }

  async findTaskById(id: string, user: User): Promise<Task | null> {
    return this.repository.findOne({ where: { id, user } });
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<DeleteResult> {
    return this.repository.delete({ id, user });
  }
}
