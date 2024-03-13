import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './security/jwt.strategy';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESSSECRET'),
        signOptions: { expiresIn: configService.get<string>('ACCESSEXPIRE') },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    OrderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, UserRepository, JwtStrategy],
  exports: [UserRepository, JwtStrategy, AuthService],
})
export class AuthModule {}
