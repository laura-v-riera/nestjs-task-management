/* eslint-disable @typescript-eslint/no-unsafe-call */
// FIXME: Find out why I'm getting no unsafe-call error for class-validator

import { IsNotEmpty } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
