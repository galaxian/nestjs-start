import { PayType } from '../entities/payment.entity';

export class CreatePaymentReqDto {
  payType: PayType;
  amount: number;
  orderNo: string;
}
