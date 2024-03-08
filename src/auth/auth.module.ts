import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.ACCESSSECRET,
        signOptions: { expiresIn: process.env.ACCESSEXPIRE },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, UserRepository],
  exports: [AuthService, UserService, UserRepository],
})
export class AuthModule {}
