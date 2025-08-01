import { AutoMap } from '@automapper/classes';
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
  @AutoMap()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @AutoMap()
  name: string;

  @Column('text')
  @AutoMap()
  description: string;

  @Column('int')
  @AutoMap()
  price: number;

  @ManyToOne(() => Brand, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  @AutoMap(() => Brand)
  brand: Brand;

  @Column({
    type: 'enum',
    enum: ProductStatus,
  })
  @AutoMap()
  status: ProductStatus;

  @Column('int')
  @AutoMap()
  stocking: number;

  @Column('int')
  @AutoMap()
  discount: number;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
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
  @AutoMap()
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
