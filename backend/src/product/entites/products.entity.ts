import { Brand } from '@brand';
import { CartDetail } from '@cart';
import { CategoryMapping } from '@category';
import { OrderDetail } from '@order';
import { ProductRating } from '@product';
import { WishlistMapping } from '@wishlist';
import { ProductStatus } from 'product/enums';
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

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  price: number;

  @ManyToOne(() => Brand, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({
    type: 'enum',
    enum: ProductStatus,
  })
  status: ProductStatus;

  @Column('int')
  stocking: number;

  @Column('int')
  discount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];

  @OneToMany(
    () => CategoryMapping,
    (categoryMapping) => categoryMapping.product,
  )
  categoriesMapping: CategoryMapping[];

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.product)
  cartDetails: CartDetail[];

  @OneToMany(
    () => WishlistMapping,
    (wishlistMapping) => wishlistMapping.product,
    { nullable: true },
  )
  wishlistMappings: WishlistMapping[];

  @OneToMany(() => ProductRating, (productRating) => productRating.product)
  productRating: ProductRating[];
}
