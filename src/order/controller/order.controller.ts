import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreaetOrderReqDto } from '../dto/create-order.req.dto';
import { OrderService } from '../service/order.service';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateOrderResDto } from '../dto/create-order.res.dto';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(
    @Body() createOrderReqDto: CreaetOrderReqDto,
  ): Promise<ResponseDto<CreateOrderResDto>> {
    const data = await this.orderService.createOrder(createOrderReqDto);
    const result = new ResponseDto(201, null, data);
    return result;
  }
}
