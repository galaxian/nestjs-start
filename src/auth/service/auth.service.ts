import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { LoginReqDto } from '../dto/login.req';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(reqDto: LoginReqDto) {
    const { email, rawPassword } = reqDto;

    await this.validateUser(email, rawPassword);
  }

  private async validateUser(email: string, rawPassword: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    if (!this.isVerifyPassword(rawPassword, user.encrypedPassword)) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
  }

  private async isVerifyPassword(
    rawPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(rawPassword, encryptedPassword);
  }
}
