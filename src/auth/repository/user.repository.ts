import { EntityManager, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async createUser(signupUser: User): Promise<User> {
    return this.save(signupUser);
  }
}
