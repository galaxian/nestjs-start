import { TokenPayload } from 'src/type';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { LoginReqDto } from '../dto/login.req';
import { User } from '../entity/user.entity';
import { LoginResDto } from '../dto/login.res';
import * as config from 'config';
import * as argon2 from 'argon2';

class MockUserRepository {
  findOneByEmail(email: string) {
    return Promise.resolve(null);
  }
}

class MockJwtService {
  sign(payload: TokenPayload, option: { expiresIn: number; secret: string }) {
    return Promise.resolve(null);
  }
}

describe('authService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useClass: MockJwtService },
        { provide: UserRepository, useClass: MockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('로그인 성공', async () => {
      //given
      const findUser: User = {
        id: 'uuid',
        email: 'test@example.com',
        encrypedPassword: 'password123',
        phone: null,
        createdAt: null,
        lastModifiedAt: null,
      };

      const loginReqDto: LoginReqDto = {
        email: 'test@example.com',
        rawPassword: 'password123',
      };

      const findOneByEmailSpy = jest
        .spyOn(userRepository, 'findOneByEmail')
        .mockResolvedValueOnce(findUser);

      const mockConfigValue = {
        accessSecret: 'mockAccessSecret',
        accessExpire: 1000,
        refreshSecret: 'mockRefreshSecret',
        refreshexpire: 3000,
      };

      const mockConfig = jest
        .spyOn(config, 'get')
        .mockReturnValue(JSON.stringify(mockConfigValue));

      const mockSign = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const mockArgon = jest
        .spyOn(argon2, 'verify')
        .mockResolvedValueOnce(true);

      //when
      const result: LoginResDto = await authService.login(loginReqDto);

      //then
      expect(result.accessToken).toEqual('access-token');
      expect(result.refreshToken).toEqual('refresh-token');

      expect(mockConfig).toHaveBeenCalledTimes(2);
      expect(mockSign).toHaveBeenCalledTimes(2);
    });

    it('email로 db 조회 실패 시 로그인 실패', async () => {
      //given
      const loginReqDto: LoginReqDto = {
        email: 'invalid Mail',
        rawPassword: 'password123',
      };

      const findOneByEmailSpy = jest
        .spyOn(userRepository, 'findOneByEmail')
        .mockResolvedValueOnce(null);

      //when
      //then
      await expect(authService.login(loginReqDto)).rejects.toThrowError();
    });
  });
});
