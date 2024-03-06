import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';

class MockUserRepository {
  findOneByEmail(email: string) {
    return Promise.resolve(null);
  }

  createUser(user: any) {
    return Promise.resolve();
  }
}

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useClass: MockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('회원가입 성공', async () => {
      const reqDto = {
        email: 'test@example.com',
        rawPassword: 'password123',
        phone: '123-4567-8901',
      };

      const findOneByEmailSpy = jest
        .spyOn(userRepository, 'findOneByEmail')
        .mockResolvedValueOnce(null);

      const createUserSpy = jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValueOnce(null);

      await service.createUser(reqDto);

      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(findOneByEmailSpy).toHaveBeenCalledTimes(1);
      expect(findOneByEmailSpy).toHaveBeenCalledWith(reqDto.email);
    });
  });
});
