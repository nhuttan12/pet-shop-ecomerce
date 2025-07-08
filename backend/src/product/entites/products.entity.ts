import { Brand } from '@brand/entities/brands.entity';
import { CartDetail } from '@cart/entities/cart-details.entity';
import { CategoryMapping } from '@category/entities/categories-mapping.entity';
import { OrderDetail } from '@order/entites/order-details.entity';
import { ProductRating } from '@product/entites/product-rating.entity';
import { ProductStatus } from '@product/enums/product-status.enum';
import { WishlistMapping } from '@wishlist/entities/wishlist-mapping.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
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

  @OneToMany(
    () => OrderDetail,
    (orderDetail: OrderDetail) => orderDetail.product,
  )
  orderDetails: OrderDetail[];

  @OneToMany(
    () => CategoryMapping,
    (categoryMapping: CategoryMapping) => categoryMapping.product,
  )
  categoriesMapping: CategoryMapping[];

  @OneToMany(() => CartDetail, (cartDetail: CartDetail) => cartDetail.product)
  cartDetails: CartDetail[];

  @OneToMany(
    () => WishlistMapping,
    (wishlistMapping: WishlistMapping) => wishlistMapping.product,
    { nullable: true },
  )
  wishlistMappings: WishlistMapping[];

  @OneToMany(
    () => ProductRating,
    (productRating: ProductRating) => productRating.product,
  )
  productRating: ProductRating[];
}
