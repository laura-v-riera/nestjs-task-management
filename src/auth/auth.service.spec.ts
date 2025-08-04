import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersRepository = module.get(UsersRepository);

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
});
