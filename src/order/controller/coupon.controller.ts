import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCouponReqDto } from '../dto/create-coupon.req.dto';
import { CouponService } from '../service/coupon.service';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCoupon(
    @Body() createCouponReqDto: CreateCouponReqDto,
    @Req() req: Request,
  ): Promise<ResponseDto<unknown>> {
    const certifiedUser: any = req.user;
    await this.couponService.createCoupon(createCouponReqDto, certifiedUser);
    const result = new ResponseDto(201, null, null);
    return result;
  }
}
