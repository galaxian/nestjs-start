import { Column } from 'typeorm';

export class CouponValidInfo {
  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  static createCouponValidInfo(validFrom: Date, validUntil: Date) {
    const validInfo = new CouponValidInfo();
    validInfo.validFrom = validFrom;
    validInfo.validUntil = validUntil;
    return validInfo;
  }
}
