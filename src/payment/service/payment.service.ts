import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { Transactional } from 'typeorm-transactional';
import { CreatePaymentReqDto } from '../dto/create-payment.req.dto';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/repository/user.repository';
import { OrderRepository } from 'src/order/repository/order.repository';
import { Order } from 'src/order/entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentResDto } from '../dto/create-payment.res.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

    const payment = new Payment();
    payment.amount = amount;
    payment.payType = payType;
    payment.orderNo = orderNo;
    payment.orderId = order.id;
    payment.user = certifiedUser;

    const savedPayment = await this.paymentRepository.createPayment(payment);

    const response = new CreatePaymentResDto();
    response.amount = savedPayment.amount;
    response.customerEmail = savedPayment.user.email;
    response.customerName = savedPayment.user.id;
    response.orderId = savedPayment.orderId;
    response.orderNo = savedPayment.orderNo;
    response.payType = savedPayment.payType;
    response.successUrl = this.configService.get<string>('SUCCESS_URL');
    response.failUrl = this.configService.get<string>('FAIL_URL');

    return response;
  }

  @Transactional()
  async tossPaymentSuccess(
    amount: number,
    orderId: string,
    paymentKey: string,
  ) {
    const payment = await this.verifyPayment(orderId, amount);
    const result = await this.requestPaymentAccept(paymentKey, orderId, amount);
  }

  private async requestPaymentAccept(
    paymentKey: string,
    orderId: string,
    amount: number,
  ) {
    const paymentData = {
      paymentKey,
      amount,
      orderId,
    };
    const tossApiAddress =
      'https://api.tosspayments.com/v1/payments/confirm' + paymentKey;

    const secretEncode = await this.base64Encode();

    try {
      const result = await axios.post(tossApiAddress, paymentData, {
        headers: {
          Authorization: secretEncode,
          'Content-Type': 'application/json',
        },
      });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  private async base64Encode(): Promise<string> {
    const secret = this.configService.get<string>('TOSS_SECRET_KEY');
    return Buffer.from(secret + ':', 'utf-8').toString('base64');
  }

  private async verifyPayment(
    orderId: string,
    amount: number,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findPaymentByOrderId(orderId);
    if (!payment) {
      throw new BadRequestException('주문의 결제 정보가 없습니다.');
    }
    if (payment.amount !== amount) {
      throw new BadRequestException(
        '주문 총액과 결제 총액이 일치하지 않습니다.',
      );
    }
    return payment;
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
