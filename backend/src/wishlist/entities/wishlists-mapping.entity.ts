import { Product } from '@product';
import { Wishlist } from '@wishlist';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wishlists_mapping')
export class WishlistsMapping {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
