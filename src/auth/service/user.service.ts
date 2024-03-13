import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import * as argon2 from 'argon2';
import { User } from '../entity/user.entity';
import { CreateUserReqDto } from '../dto/create-user.req';
import { Transactional } from 'typeorm-transactional';
import { PointRepository } from 'src/order/repository/point.repository';
import { Point } from 'src/order/entities/point.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly pointRepository: PointRepository,
  ) {}

  @Transactional()
  async createUser(reqDto: CreateUserReqDto): Promise<void> {
    const findUser = await this.userRepository.findOneByEmail(reqDto.email);
    if (findUser) {
      throw new BadRequestException('중복된 회원이 존재합니다.');
    }
    const hashPassword = await argon2.hash(reqDto.rawPassword);

    const user = new User();
    user.email = reqDto.email;
    user.encrypedPassword = hashPassword;
    user.phone = reqDto.phone;

    const savedUser = await this.userRepository.createUser(user);

    const userPoint = new Point();
    userPoint.user = savedUser;

    await this.pointRepository.createUserPoint(userPoint);
  }
}
