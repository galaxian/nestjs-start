import { Column } from 'typeorm';

export type CouponType = 'fixed' | 'flat';

export class CouponTypeInfo {
  @Column({ type: 'varchar', length: 50 })
  couponType: CouponType;

  @Column({ type: 'int' })
  value: number;

  static createCouponType(type: CouponType, value: number) {
    const typeInfo = new CouponTypeInfo();
    typeInfo.couponType = type;
    typeInfo.value = value;
    return typeInfo;
  }
}
