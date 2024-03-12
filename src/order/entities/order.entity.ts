import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RefundedInfo } from './refunded-info';
import { ShippingInfo } from './shipping-info';
import { Coupon } from './coupon.entity';

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
  usedCoupon: Coupon;
}
