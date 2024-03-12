import { CouponType } from '../entities/coupon-type';

export class CreateCouponReqDto {
  couponType: CouponType;
  value: number;
  validFrom: string;
  validUntil: string;
}
