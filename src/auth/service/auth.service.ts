import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { LoginReqDto } from '../dto/login.req';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(reqDto: LoginReqDto) {
    const { email, rawPassword } = reqDto;

    await this.validateUser(email);
  }

  private async validateUser(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }
  }
}
