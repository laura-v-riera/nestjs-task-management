import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findTaskById: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  id: 'userId',
  username: 'testUser',
  password: 'testPassword',
  tasks: [],
};

const mockTask: Task[] = [
  {
    id: 'taskId',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.OPEN,
    user: mockUser,
  },
];

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: jest.Mocked<TasksRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue(mockTask);
      const result = await tasksService.getTasks({}, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findTaskById and returns the task', async () => {
      tasksRepository.findTaskById.mockResolvedValue(mockTask[0]);
      const result = await tasksService.getTaskById('taskId', mockUser);
      expect(result).toEqual(mockTask[0]);
    });
    it('throws an error if task not found', async () => {
      tasksRepository.findTaskById.mockResolvedValue(null);
      await expect(
        tasksService.getTaskById('taskId', mockUser),
      ).rejects.toThrow(`Task with ID "taskId" not found`);
    });
  });

  describe('createTask', () => {
    it('calls TasksRepository.createTask and returns the result', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      tasksRepository.createTask.mockResolvedValue(mockTask[0]);
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask[0]);
    });
  });

  describe('deleteTaskById', () => {
    it('calls TasksRepository.deleteTask and deletes the task', async () => {
      tasksRepository.deleteTask.mockResolvedValue({
        affected: 1,
      } as DeleteResult);
      await tasksService.deleteTaskById('taskId', mockUser);
      expect(tasksRepository.deleteTask).toHaveBeenCalledWith(
        'taskId',
        mockUser,
      );
    });
    it('throws an error if task not found', async () => {
      tasksRepository.deleteTask.mockResolvedValue({
        affected: 0,
      } as DeleteResult);
      await expect(
        tasksService.deleteTaskById('taskId', mockUser),
      ).rejects.toThrow(`Task with ID "taskId" not found`);
    });
  });

  describe('updateTaskStatus', () => {
    it('updates the task status and returns the updated task', async () => {
      const updatedTask = { ...mockTask[0], status: TaskStatus.DONE };
      tasksRepository.findTaskById.mockResolvedValue(mockTask[0]);
      tasksRepository.save.mockResolvedValue(updatedTask);
      const result = await tasksService.updateTaskStatus(
        'taskId',
        TaskStatus.DONE,
        mockUser,
      );
      expect(result).toEqual(updatedTask);
    });
    it('throws an error if task not found', async () => {
      tasksRepository.findTaskById.mockResolvedValue(null);
      await expect(
        tasksService.updateTaskStatus('taskId', TaskStatus.DONE, mockUser),
      ).rejects.toThrow(`Task with ID "taskId" not found`);
    });
  });
});
