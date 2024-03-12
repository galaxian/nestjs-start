import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CouponService } from './service/coupon.service';
import { CouponRepository } from './repository/coupon.repository';
import { CouponController } from './controller/coupon.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, Order, OrderItem])],
  providers: [CouponService, CouponRepository],
  controllers: [CouponController],
})
export class OrderModule {}
