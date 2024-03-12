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

  @Column({ type: 'varchar', length: 100 })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 50 })
  shppingCompany: string;
}
