import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CouponRepository extends Repository<Coupon> {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: CouponRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      couponRepository.target,
      couponRepository.manager,
      couponRepository.queryRunner,
    );
  }

  async createCoupon(coupon: Coupon) {
    await this.save(coupon);
  }

  async findCouponById(id: string): Promise<Coupon> {
    return await this.findOneBy({ id });
  }
}
