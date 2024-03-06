import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import * as argon2 from 'argon2';
import { User } from '../entity/user.entity';
import { CreateUserReqDto } from '../dto/create-user.req';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

    await this.userRepository.createUser(user);
  }
}
