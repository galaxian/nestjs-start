import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { Transactional } from 'typeorm-transactional';
import { CreaetOrderReqDto } from '../dto/create-order.req.dto';
import { OrderItemRepository } from '../repository/order-item.repository';
import { ProductRepository } from 'src/product/repository/product.repository';
import { CouponRepository } from '../repository/coupon.repository';
import { CreateOrderResDto } from '../dto/create-order.res.dto';
import { OrderItemReqDto } from '../dto/order-item.req.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
  ) {}

  @Transactional()
  async createOrder(reqDto: CreaetOrderReqDto): Promise<CreateOrderResDto> {}

  private async calculateTotalAmout(
    itemQuantityList: OrderItemReqDto[],
  ): Promise<number> {
    let totalAmount = 0;
    for (const { productId, quantity } of itemQuantityList) {
      const product = await this.productRepository.findProductById(productId);
      totalAmount += product.price * quantity;
    }
    return totalAmount;
  }
}
