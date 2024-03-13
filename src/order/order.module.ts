import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CouponService } from './service/coupon.service';
import { CouponRepository } from './repository/coupon.repository';
import { CouponController } from './controller/coupon.controller';
import { Point } from './entities/point.entity';
import { PointService } from './service/point.service';
import { PointRepository } from './repository/point.repository';
import { PointController } from './controller/point.controller';
import { OrderService } from './service/order.service';
import { OrderRepository } from './repository/order.repository';
import { OrderItemRepository } from './repository/order-item.repository';
import { OrderController } from './controller/order.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forFeature([Coupon, Order, OrderItem, Point]),
  ],
  providers: [
    CouponService,
    CouponRepository,
    PointService,
    OrderService,
    OrderRepository,
    OrderItemRepository,
    PointRepository,
  ],
  controllers: [CouponController, OrderController, PointController],
  exports: [
    OrderRepository,
    OrderItemRepository,
    CouponRepository,
    PointRepository,
  ],
})
export class OrderModule {}
