import { CartDetail, CartStatus } from '@cart';
import { User } from '@user';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.carts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
  })
  status: CartStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.cart)
  cartDetails: CartDetail[];
}
