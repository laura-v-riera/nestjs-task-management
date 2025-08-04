import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  describe('signUp', () => {
    it('calls UsersRepository.createUser and successfully creates a user', async () => {
      const authCredentialsDto = {
        username: 'testUser',
        password: 'testPass',
      };
      await authService.signUp(authCredentialsDto);
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        authCredentialsDto,
      );
    });
  });
});
