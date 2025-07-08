import { User } from '@user/entites/users.entity';
import { WishlistStatus } from '@wishlist/enums/wishlist-status.enum';
import { WishlistMapping } from './wishlist-mapping.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
  CreateDateColumn,
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
    () => WishlistMapping,
    (wishlistMapping) => wishlistMapping.wishlist,
    { nullable: false },
  )
  @JoinColumn({ name: 'wishlist_id' })
  wishlistMappings: WishlistMapping[];

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
