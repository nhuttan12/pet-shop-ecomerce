import { Order } from '@order';
import { Product } from '@product';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderDetails, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('int')
  price: number;

  @Column('int', { name: 'total_price' })
  totalPrice: number;
}
