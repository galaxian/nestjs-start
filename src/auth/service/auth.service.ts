import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { LoginReqDto } from '../dto/login.req';
import * as argon2 from 'argon2';
import { TokenPayload } from 'src/type';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entity/user.entity';
import * as config from 'config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(reqDto: LoginReqDto) {
    const { email, rawPassword } = reqDto;

    const verifiedUser = await this.validateUser(email, rawPassword);

    const payload: TokenPayload = await this.createTokenPayload(
      verifiedUser.id,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(payload),
    ]);
  }

  private async validateUser(
    email: string,
    rawPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    if (!this.isVerifyPassword(rawPassword, user.encrypedPassword)) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    return user;
  }

  private async isVerifyPassword(
    rawPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(rawPassword, encryptedPassword);
  }

  private async createTokenPayload(id: string): Promise<TokenPayload> {
    return {
      iss: 'server',
      sub: id,
      iat: Math.floor(Date.now() / 1000),
      jtt: uuidv4(),
    };
  }

  private async createAccessToken(tokenPayload: TokenPayload): Promise<string> {
    const jwtConfig = config.get('jwt');
    const expiresIn = jwtConfig.get('access-expire');
    const accessToken = this.jwtService.sign(tokenPayload, { expiresIn });
    return accessToken;
  }

  private async createRefreshToken(
    tokenPayload: TokenPayload,
  ): Promise<string> {
    const jwtConfig = config.get('jwt');
    const expiresIn = jwtConfig.get('refresh-expire');
    const refreshToken = this.jwtService.sign(tokenPayload, { expiresIn });
    return refreshToken;
  }
}
