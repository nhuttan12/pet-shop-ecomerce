import { Cart, CartDetailStatus } from '@cart';
import { Product } from '@product';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('cart_details')
export class CartDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartDetails, { nullable: false })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('int')
  price: number;

  @Column({
    type: 'enum',
    enum: CartDetailStatus,
  })
  status: CartDetailStatus;
}
