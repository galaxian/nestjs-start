import { OrderStatus } from '../entities/order.entity';

export class CreateOrderResDto {
  orderNo: string;
  amount: number;
  orderStatus: OrderStatus;
}
