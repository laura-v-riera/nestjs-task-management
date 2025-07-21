/* eslint-disable @typescript-eslint/no-unsafe-call */
// FIXME: Find out why I'm getting no unsafe-call error for class-validator

import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.module';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
