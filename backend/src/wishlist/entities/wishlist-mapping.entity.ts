import { Product } from '@product';
import { Wishlist, WishlistStatus } from '@wishlist';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wishlists_mapping')
export class WishlistMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.wishlistMappings, {
    nullable: false,
  })
  wishlist: Wishlist;

  @ManyToOne(() => Product, (product) => product.wishlistMappings, {
    nullable: false,
  })
  product: Product;

  @Column({
    type: 'enum',
    enum: WishlistStatus,
    default: WishlistStatus.ACTIVE,
  })
  status: WishlistStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
