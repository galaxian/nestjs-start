import { BaseEntity } from 'src/utils/entity/base.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { RefundedInfo } from './refunded-info';
import { ShippingInfo } from './shipping-info';
import { Coupon } from './coupon.entity';
import { User } from 'src/auth/entity/user.entity';

export type OrderStatus = 'started' | 'paid' | 'refunded';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  orderNo: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  status: OrderStatus;

  @Column((type) => RefundedInfo)
  refundedInfo: RefundedInfo;

  @Column((type) => ShippingInfo)
  shippingInfo: ShippingInfo;

  @OneToOne(() => Coupon, { nullable: true })
  usedCoupon: Relation<Coupon>;

  // 인증 및 인가 구현 후 nullable: false
  @ManyToOne(() => User, { nullable: true })
  user: Relation<User>;
}
