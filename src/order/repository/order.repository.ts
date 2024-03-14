import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      orderRepository.target,
      orderRepository.manager,
      orderRepository.queryRunner,
    );
  }

  async createOrder(order: Order): Promise<Order> {
    return await this.save(order);
  }

  async findOrderByOrderNo(orderNo: string): Promise<Order> {
    return await this.findOne({
      where: {
        orderNo,
      },
      relations: ['user'],
    });
  }
}
