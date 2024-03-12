import { BaseEntity } from 'src/utils/entity/base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  quantity: number;

  @ManyToOne(() => Product)
  product: Relation<Product>;

  @ManyToOne(() => Order)
  order: Relation<Order>;
}
