import { BaseEntity } from 'src/utils/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ type: 'int' })
  usedPoint: number;

  @Column({ type: 'varchar', length: 100 })
  status: OrderStatus;

  @Column((type) => RefundedInfo)
  refundedInfo: RefundedInfo;

  @Column((type) => ShippingInfo)
  shippingInfo: ShippingInfo;

  @OneToOne(() => Coupon, { nullable: true })
  @JoinColumn()
  usedCoupon: Relation<Coupon>;

  // 인증 및 인가 구현 후 nullable: false
  @ManyToOne(() => User)
  user: Relation<User>;

  createOrderNo() {
    const date = new Date();
    const dateFormat = `${date.getFullYear()}${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(
      date.getHours(),
    ).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(
      date.getSeconds(),
    ).padStart(2, '0')}`;
    const randomString = Array.from(
      { length: 15 },
      () => Math.random().toString(36)[2] || '0',
    ).join('');
    this.orderNo = `${dateFormat}_${randomString.toUpperCase()}`;
  }
}
