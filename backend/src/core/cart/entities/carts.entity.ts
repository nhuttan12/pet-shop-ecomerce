import { CartStatus } from '@cart/enums/cart-status.enum';
import { User } from '@user/entites/users.entity';
import { CartDetail } from './cart-details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => User, (user) => user.carts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @AutoMap(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
  })
  @AutoMap()
  status: CartStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart)
  cartDetails: CartDetail[];
}
