import { TokenPayload } from 'src/type';
import { UserRepository } from '../repository/user.repository';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

class MockUserRepository {
  findOneByEmail(email: string) {
    return Promise.resolve(null);
  }
}

class MockJwtService {
  sign(payload: TokenPayload, option: { expiresIn: number; secret: string }) {
    return Promise.resolve();
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
});
