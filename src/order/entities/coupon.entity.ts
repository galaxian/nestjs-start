import { BaseEntity } from 'src/utils/entity/base.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CouponTypeInfo } from './coupon-type';
import { CouponValidInfo } from './coupon-valid';
import { User } from 'src/auth/entity/user.entity';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column((type) => CouponTypeInfo)
  couponTypeInfo: CouponTypeInfo;

  @Column((type) => CouponValidInfo)
  couponValidInfo: CouponValidInfo;

  // 인증 및 인가 구현 후 nullable: false
  @ManyToOne(() => User, { nullable: true })
  user: Relation<User>;
}
