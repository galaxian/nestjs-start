import { User } from 'src/auth/entity/user.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export type PayType = 'card' | 'cash';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  payType: PayType;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  orderNo: string;

  @Column({ type: 'varchar', length: 50 })
  orderId: string;

  @Column({ type: 'tinyint', default: null, nullable: true })
  paySuccess: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentKey: string;

  @Column({ type: 'text', nullable: true })
  failReason: string;

  @Column({ type: 'text', nullable: true })
  cancelReason: string;

  @ManyToOne(() => User)
  user: User;
}
