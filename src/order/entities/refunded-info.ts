import { Column } from 'typeorm';

export class RefundedInfo {
  @Column({ type: 'text' })
  refundedReason: string;

  @Column({ type: 'decimal' })
  refundedAmount: number;

  @Column({ type: 'timestamp' })
  refundedAt: Date;
}
