import { User } from 'src/auth/entity/user.entity';
import { BaseEntity } from 'src/utils/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  availablePoint: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: Relation<User>;

  earnPoint(amount: number) {
    this.availablePoint += amount;
  }

  usePoint(amount: number) {
    this.availablePoint -= amount;
  }

  isAvailable(usedPoint: number): boolean {
    if (this.availablePoint < 0 || this.availablePoint < usedPoint) {
      return false;
    }
    return true;
  }
}
