import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.repository.create({ username, password: hashedPassword });

    try {
      await this.repository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException(
          `Error creating user: ${error.message}`,
        );
      }
    }
  }

  async findOne(username: string): Promise<User> {
    const user = await this.repository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }
}
