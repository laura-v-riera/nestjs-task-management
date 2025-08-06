import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from './user/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, UsersRepository, JwtStrategy],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') as string,
        signOptions: {
          expiresIn: '1h', //TODO: delete token if signed in again or signed out
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
