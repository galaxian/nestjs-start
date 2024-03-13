import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CouponService } from './service/coupon.service';
import { CouponRepository } from './repository/coupon.repository';
import { CouponController } from './controller/coupon.controller';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { OrderRepository } from './repository/order.repository';
import { OrderItemRepository } from './repository/order-item.repository';
import { ProductRepository } from 'src/product/repository/product.repository';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, Order, OrderItem, Product])],
  providers: [
    CouponService,
    CouponRepository,
    OrderService,
    OrderRepository,
    OrderItemRepository,
    ProductRepository,
  ],
  controllers: [CouponController, OrderController],
})
export class OrderModule {}
