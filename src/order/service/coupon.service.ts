import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CreateCouponReqDto } from '../dto/create-coupon.req.dto';
import { CouponTypeInfo } from '../entities/coupon-type';
import { CouponValidInfo } from '../entities/coupon-valid';
import { Coupon } from '../entities/coupon.entity';
import { CouponRepository } from '../repository/coupon.repository';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository) {}

  @Transactional()
  async createCoupon(reqDto: CreateCouponReqDto): Promise<void> {
    const { couponType, value, validFrom, validUntil } = reqDto;

    const couponTypeInfo = CouponTypeInfo.createCouponType(couponType, value);
    const couponValidInfo = CouponValidInfo.createCouponValidInfo(
      validFrom,
      validUntil,
    );

    const coupon = new Coupon();
    coupon.couponTypeInfo = couponTypeInfo;
    coupon.couponValidInfo = couponValidInfo;

    await this.couponRepository.createCoupon(coupon);
  }
}
