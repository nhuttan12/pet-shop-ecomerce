import { AutoMap } from '@automapper/classes';
import { Order } from '@order/entites/orders.entity';
import { Product } from '@product/entites/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.orderDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  @AutoMap(() => Order)
  order: Order;

  @ManyToOne(() => Product, (product: Product) => product.orderDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  @AutoMap(() => Product)
  product: Product;

  @Column('int')
  @AutoMap()
  quantity: number;

  @Column('int')
  @AutoMap()
  price: number;

  @Column('int', { name: 'total_price' })
  @AutoMap()
  totalPrice: number;
}
