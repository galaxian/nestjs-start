import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      orderItemRepository.target,
      orderItemRepository.manager,
      orderItemRepository.queryRunner,
    );
  }

  async createOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    return await this.save(orderItem);
  }

  async saveOrderItemList(orderItemList: OrderItem[]) {
    await this.entityManager.save(orderItemList);
  }
}
