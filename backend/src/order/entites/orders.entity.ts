import { OrderDetail } from '@order/entites/order-details.entity';
import { OrderStatus } from '@order/enums/order-status.enum';
import { PaymentMethod } from '@order/enums/payment-method.enum';
import { ShippingMethod } from '@order/enums/shipping_method.enum';
import { User } from '@user/entites/users.entity';
import { Voucher } from '@voucher/entities/vouchers.entity';
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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.orders, { nullable: false })
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

  @ManyToOne(() => Voucher, (voucher: Voucher) => voucher.orders, {
    nullable: true,
  })
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

  @OneToMany(() => OrderDetail, (orderDetail: OrderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
