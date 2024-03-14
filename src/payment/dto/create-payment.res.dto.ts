import { PayType } from '../entities/payment.entity';

export class CreatePaymentResDto {
  payType: PayType;
  amount: number;
  orderNo: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
}
