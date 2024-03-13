import { BadRequestException, Injectable } from '@nestjs/common';
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
import { User } from 'src/auth/entity/user.entity';
import { PointRepository } from '../repository/point.repository';
import { CouponValidInfo } from '../entities/coupon-valid';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly pointRepository: PointRepository,
  ) {}

  @Transactional()
  async createOrder(
    reqDto: CreaetOrderReqDto,
    certifiedUser: User,
  ): Promise<CreateOrderResDto> {
    const itemQuantityList = reqDto.itemQuantityList;

    const order = await this.makeOrder(reqDto, certifiedUser);
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

  private async makeOrder(
    reqDto: CreaetOrderReqDto,
    certifiedUser: User,
  ): Promise<Order> {
    const { itemQuantityList, address, couponId, usedPoint } = reqDto;
    const shippingInfo = ShippingInfo.createShippingInfo(address);
    const totalAmount = await this.calculateTotalAmout(itemQuantityList);

    const couponDiscount = couponId
      ? await this.applyCoupon(totalAmount, couponId, certifiedUser.id)
      : 0;

    const pointDiscount = usedPoint
      ? await this.applyPoint(usedPoint, certifiedUser.id)
      : 0;

    const applyDiscountTotalAmount =
      totalAmount - (couponDiscount + pointDiscount);

    const coupon = await this.couponRepository.findCouponById(couponId);

    const order = new Order();
    order.status = 'started';
    order.shippingInfo = shippingInfo;
    order.usedCoupon = coupon;
    order.refundedInfo = new RefundedInfo();
    order.createOrderNo();
    order.amount = applyDiscountTotalAmount;
    order.user = certifiedUser;
    order.usedPoint = pointDiscount;

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

  private async applyCoupon(
    totalAmount: number,
    couponId: string,
    userId: string,
  ): Promise<number> {
    const coupon = await this.couponRepository.findCouponByIdAndUserId(
      couponId,
      userId,
    );

    if (!coupon) {
      throw new BadRequestException('존재하지 않는 쿠폰입니다.');
    }

    const { couponValidInfo, couponTypeInfo } = coupon;

    if (!couponValidInfo.isValid()) {
      throw new BadRequestException('사용 불가한 쿠폰입니다.');
    }

    if (couponTypeInfo.couponType === 'fixed') {
      const usedCouponValidInfo = new CouponValidInfo();
      usedCouponValidInfo.validFrom = couponValidInfo.validFrom;
      usedCouponValidInfo.validUntil = couponValidInfo.validUntil;
      usedCouponValidInfo.usedAt = new Date();
      coupon.couponValidInfo = usedCouponValidInfo;

      await this.couponRepository.save(coupon);
      return (totalAmount * couponTypeInfo.value) / 100;
    } else if (couponTypeInfo.couponType === 'flat') {
      const usedCouponValidInfo = new CouponValidInfo();
      usedCouponValidInfo.validFrom = couponValidInfo.validFrom;
      usedCouponValidInfo.validUntil = couponValidInfo.validUntil;
      usedCouponValidInfo.usedAt = new Date();
      coupon.couponValidInfo = usedCouponValidInfo;

      await this.couponRepository.save(coupon);
      return couponTypeInfo.value;
    }

    return 0;
  }

  private async applyPoint(usedPoint: number, userId: string): Promise<number> {
    const userPoint = await this.pointRepository.findPointByUserId(userId);

    if (userPoint.isAvailable(usedPoint)) {
      throw new BadRequestException('포인트가 부족합니다.');
    }

    userPoint.usePoint(usedPoint);
    await this.pointRepository.save(userPoint);

    return usedPoint;
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
