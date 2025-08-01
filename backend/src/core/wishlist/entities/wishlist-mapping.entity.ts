import { Product } from '@product/entites/products.entity';
import { WishlistStatus } from '@wishlist/enums/wishlist-status.enum';
import { Wishlist } from './wishlists.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('wishlists_mapping')
export class WishlistMapping {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.wishlistMappings, {
    nullable: false,
  })
  @AutoMap(() => Wishlist)
  wishlist: Wishlist;

  @ManyToOne(() => Product, (product) => product.wishlistMappings, {
    nullable: false,
  })
  @AutoMap(() => Product)
  product: Product;

  @Column({
    type: 'enum',
    enum: WishlistStatus,
    default: WishlistStatus.ACTIVE,
  })
  @AutoMap()
  status: WishlistStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
