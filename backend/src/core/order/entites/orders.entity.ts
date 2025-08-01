import { AutoMap } from '@automapper/classes';
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
  @AutoMap()
  id: number;

  @ManyToOne(() => User, (user: User) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @AutoMap()
  user: User;

  @Column('double', { name: 'total_price' })
  @AutoMap()
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
  })
  @AutoMap()
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: ShippingMethod,
    name: 'shipping_method',
  })
  @AutoMap()
  shippingMethod: ShippingMethod;

  @ManyToOne(() => Voucher, (voucher: Voucher) => voucher.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'voucher_id' })
  @AutoMap(() => Voucher)
  voucher?: Voucher;

  @Column({ length: 255 })
  @AutoMap()
  address: string;

  @Column({ length: 255 })
  @AutoMap()
  zipCode: string;

  @Column({ length: 45 })
  @AutoMap()
  city: string;

  @Column({ length: 45 })
  @AutoMap()
  country: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  @AutoMap()
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => OrderDetail, (orderDetail: OrderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
