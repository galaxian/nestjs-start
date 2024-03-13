import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreaetOrderReqDto } from '../dto/create-order.req.dto';
import { OrderService } from '../service/order.service';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateOrderResDto } from '../dto/create-order.res.dto';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderReqDto: CreaetOrderReqDto,
    @Req() req: Request,
  ): Promise<ResponseDto<CreateOrderResDto>> {
    const certifiedUser: any = req.user;
    const data = await this.orderService.createOrder(
      createOrderReqDto,
      certifiedUser,
    );
    const result = new ResponseDto(201, null, data);
    return result;
  }
}
