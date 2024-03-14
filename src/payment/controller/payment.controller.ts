import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CreatePaymentReqDto } from '../dto/create-payment.req.dto';
import { Request } from 'express';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreatePaymentResDto } from '../dto/create-payment.res.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/payment')
  async createPaymentToToss(
    @Body() reqDto: CreatePaymentReqDto,
    @Req() req: Request,
  ): Promise<ResponseDto<CreatePaymentResDto>> {
    const certifiedUser: any = req.user;
    const data = await this.paymentService.createPaymentToToss(
      reqDto,
      certifiedUser,
    );
    const result = new ResponseDto(201, null, data);
    return result;
  }
}
