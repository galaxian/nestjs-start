import { BaseEntity } from 'src/utils/entity/base.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ApiAccessLog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column()
  ip: string;

  @Column()
  endpoint: string;

  @Column()
  accessedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  user: Relation<User>;
}
