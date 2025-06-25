import { User } from '@user';
import { WishlistStatus } from '@wishlist';
import { WishlistsMapping } from '@wishlist/entities/wishlists-mapping.entity';
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

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wishlists, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => WishlistsMapping,
    (wishlistsMapping) => wishlistsMapping.wishlist,
    { nullable: false },
  )
  @JoinColumn({ name: 'wishlist_id' })
  wishlistMappings: WishlistsMapping[];

  @Column({
    type: 'enum',
    enum: WishlistStatus,
  })
  status: WishlistStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
