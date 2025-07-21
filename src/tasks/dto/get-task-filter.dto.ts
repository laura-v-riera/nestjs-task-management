/* eslint-disable @typescript-eslint/no-unsafe-call */
// FIXME: Find out why I'm getting no unsafe-call error for class-validator

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
