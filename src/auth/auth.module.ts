import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  providers: [AuthService, UsersRepository],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
