import { Test } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersRepository } from '../../src/auth/user/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: 'userId',
  username: 'testUser',
  password: 'hashedPassword',
  tasks: [],
};

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

const mockJwtService = () => ({
  sign: jest.fn(),
});

const authCredentialsDto = {
  username: 'testUser',
  password: 'testPassword',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeAll(async () => {
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
      await authService.signUp(authCredentialsDto);
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        authCredentialsDto,
      );
    });
  });

  describe('signIn', () => {
    it('calls UsersRepository.findOne and returns an access token', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('accessToken');

      const result = await authService.signIn(authCredentialsDto);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        authCredentialsDto.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        authCredentialsDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: authCredentialsDto.username,
      });
      expect(result).toEqual({ accessToken: 'accessToken' });
    });

    it('throws UnauthorizedException if credentials are invalid', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(authCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
