import { CartDetailStatus } from '@cart/enums/cart-detail-status.enum';
import { Product } from '@product/entites/products.entity';
import { Cart } from './carts.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('cart_details')
export class CartDetail {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartDetails, { nullable: false })
  @JoinColumn({ name: 'cart_id' })
  @AutoMap(() => Cart)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartDetails, {
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

  @Column({
    type: 'enum',
    enum: CartDetailStatus,
  })
  @AutoMap()
  status: CartDetailStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
