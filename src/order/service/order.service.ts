import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { Transactional } from 'typeorm-transactional';
import { CreaetOrderReqDto } from '../dto/create-order.req.dto';
import { OrderItemRepository } from '../repository/order-item.repository';
import { ProductRepository } from 'src/product/repository/product.repository';
import { CouponRepository } from '../repository/coupon.repository';
import { OrderItem } from '../entities/order-item.entity';
import { ShippingInfo } from '../entities/shipping-info';
import { Order } from '../entities/order.entity';
import { CreateOrderResDto } from '../dto/create-order.res.dto';
import { RefundedInfo } from '../entities/refunded-info';
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
  async createOrder(reqDto: CreaetOrderReqDto): Promise<CreateOrderResDto> {
    const itemQuantityList = reqDto.itemQuantityList;

    const order = await this.makeOrder(reqDto);
    const savedOrder = await this.orderRepository.createOrder(order);

    const orderItemList = await this.makeOrderItem(
      itemQuantityList,
      savedOrder,
    );

    this.orderItemRepository.saveOrderItemList(orderItemList);

    const response: CreateOrderResDto = {
      orderNo: savedOrder.orderNo,
      amount: savedOrder.amount,
      orderStatus: savedOrder.status,
    };

    return response;
  }

  private async makeOrder(reqDto: CreaetOrderReqDto): Promise<Order> {
    const { itemQuantityList, address, couponId } = reqDto;
    const shippingInfo = ShippingInfo.createShippingInfo(address);
    const totalAmount = await this.calculateTotalAmout(itemQuantityList);

    let coupon = null;
    // 쿠폰 결제액 반영 기능 구현해야함
    if (couponId) {
      coupon = await this.couponRepository.findCouponById(couponId);
    }

    const order = new Order();
    order.status = 'started';
    order.shippingInfo = shippingInfo;
    order.usedCoupon = coupon;
    order.refundedInfo = new RefundedInfo();
    order.createOrderNo();
    order.amount = totalAmount;

    return order;
  }

  private async makeOrderItem(
    itemQuantityList: OrderItemReqDto[],
    savedOrder: Order,
  ): Promise<OrderItem[]> {
    const orderItemList = [];
    for (const { productId, quantity } of itemQuantityList) {
      const product = await this.productRepository.findProductById(productId);

      const ordreItem = new OrderItem();
      ordreItem.product = product;
      ordreItem.quantity = quantity;
      ordreItem.order = savedOrder;
      orderItemList.push(ordreItem);
    }
    return orderItemList;
  }

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
