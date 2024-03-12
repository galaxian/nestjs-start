import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CouponTypeInfo } from './coupon-type';
import { CouponValidInfo } from './coupon-valid';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column((type) => CouponTypeInfo)
  couponTypeInfo: CouponTypeInfo;

  @Column((type) => CouponValidInfo)
  couponValidInfo: CouponValidInfo;
}
