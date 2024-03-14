import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { Transactional } from 'typeorm-transactional';
import { CreatePaymentReqDto } from '../dto/create-payment.req.dto';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { OrderRepository } from 'src/order/repository/order.repository';
import { Order } from 'src/order/entities/order.entity';
import { CreatePaymentResDto } from '../dto/create-payment.res.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly configService: ConfigService,
  ) {}

  @Transactional()
  async createPaymentToToss(
    reqDto: CreatePaymentReqDto,
    certifiedUser: User,
  ): Promise<CreatePaymentResDto> {
    const { payType, amount, orderNo } = reqDto;
    const order = await this.orderRepository.findOrderByOrderNo(orderNo);
    await this.validate(order, certifiedUser, amount);
  }

  private async validate(order: Order, certifiedUser: User, amount: number) {
    if (amount < 1000) {
      throw new BadRequestException('결제 금액은 1000원 이상부터 가능합니다.');
    }

    if (!(order.user.id === certifiedUser.id)) {
      throw new BadRequestException('본인의 주문정보가 아닙니다.');
    }

    if (!(order.amount === amount)) {
      throw new BadRequestException(
        '결제 금액과 주문 금액이 일치하지 않습니다.',
      );
    }
  }
}
