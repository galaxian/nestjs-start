import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Point } from '../entities/point.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PointRepository extends Repository<Point> {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      pointRepository.target,
      pointRepository.manager,
      pointRepository.queryRunner,
    );
  }

  async findPointByUserId(userId: string): Promise<Point> {
    return await this.findOne({ where: { user: { id: userId } } });
  }
}
