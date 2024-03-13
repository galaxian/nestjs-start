import { OrderItemReqDto } from './order-item.req.dto';

export class CreaetOrderReqDto {
  itemQuantityList: OrderItemReqDto[];
  address: string;
  couponId?: string;
  usedPoint?: number;
}
