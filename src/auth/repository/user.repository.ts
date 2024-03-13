import { EntityManager, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
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

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  async createUser(signupUser: User): Promise<User> {
    return this.save(signupUser);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return await this.findOneBy({ id });
  }
}
