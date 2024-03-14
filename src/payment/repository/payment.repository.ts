import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
  constructor(
    @InjectRepository(Payment)
    private readonly orderRepository: Repository<Payment>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      orderRepository.target,
      orderRepository.manager,
      orderRepository.queryRunner,
    );
  }

  async createPayment(payment: Payment): Promise<Payment> {
    return await this.save(payment);
  }

  async findPaymentByOrderId(orderId: string): Promise<Payment> {
    return await this.findOne({ where: { orderId } });
  }
}
