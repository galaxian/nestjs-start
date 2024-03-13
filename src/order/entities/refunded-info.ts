import { Column } from 'typeorm';

export class RefundedInfo {
  @Column({ type: 'text', nullable: true })
  refundedReason: string;

  @Column({ type: 'decimal', nullable: true })
  refundedAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;
}
