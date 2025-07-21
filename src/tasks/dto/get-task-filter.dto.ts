import { TaskStatus } from '../task.module';

export class GetTaskFilterDto {
  status?: TaskStatus;
  search?: string;
}
