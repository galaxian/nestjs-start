import { Body, Controller, Post } from '@nestjs/common';
import { CreateCouponReqDto } from '../dto/create-coupon.req.dto';
import { CouponService } from '../service/coupon.service';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async createCoupon(
    @Body() createCouponReqDto: CreateCouponReqDto,
  ): Promise<ResponseDto<unknown>> {
    await this.couponService.createCoupon(createCouponReqDto);
    const result = new ResponseDto(201, null, null);
    return result;
  }
}
