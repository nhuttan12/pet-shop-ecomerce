import {
  OrderDetail,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
} from '@order';
import { User } from '@user';
import { Voucher } from '@voucher';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int', { name: 'total_price' })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: ShippingMethod,
    name: 'shipping_method',
  })
  shippingMethod: ShippingMethod;

  @ManyToOne(() => Voucher, (voucher) => voucher.orders, { nullable: true })
  @JoinColumn({ name: 'voucher_id' })
  voucher?: Voucher;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 45 })
  city: string;

  @Column({ length: 45 })
  country: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
