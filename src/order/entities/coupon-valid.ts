import { Column } from 'typeorm';

export class CouponValidInfo {
  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;
}
