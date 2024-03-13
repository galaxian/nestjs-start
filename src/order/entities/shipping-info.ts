import { Column } from 'typeorm';

export type ShippingStatus =
  | 'ordered'
  | 'shipping'
  | 'shipped'
  | 'delivering'
  | 'delivered';

export class ShippingInfo {
  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  status: ShippingStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shppingCompany: string;

  static createShippingInfo(address: string): ShippingInfo {
    const shippingInfo = new ShippingInfo();
    shippingInfo.address = address;
    shippingInfo.status = 'ordered';
    return shippingInfo;
  }
}
