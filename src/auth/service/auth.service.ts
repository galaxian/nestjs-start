import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { LoginReqDto } from '../dto/login.req';
import * as argon2 from 'argon2';
import { TokenPayload } from 'src/type';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginResDto } from '../dto/login.res';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(reqDto: LoginReqDto): Promise<LoginResDto> {
    const { email, rawPassword } = reqDto;

    const verifiedUser = await this.validateUser(email, rawPassword);

    const payload: TokenPayload = await this.createTokenPayload(
      verifiedUser.id,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
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
    if (!rawPassword || !encryptedPassword) {
      return false;
    }
    return await argon2.verify(encryptedPassword, rawPassword);
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
    const expiresIn = process.env.ACCESSEXPIRE;
    const secret = process.env.ACCESSSECRET;
    const accessToken = this.jwtService.sign(tokenPayload, {
      expiresIn,
      secret,
    });
    return accessToken;
  }

  private async createRefreshToken(
    tokenPayload: TokenPayload,
  ): Promise<string> {
    const expiresIn = process.env.REFRESHEXPIRE;
    const secret = process.env.REFRESHSECRET;
    const refreshToken = this.jwtService.sign(tokenPayload, {
      expiresIn,
      secret,
    });
    return refreshToken;
  }
}
