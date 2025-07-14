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
import { AutoMap } from '@automapper/classes';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => User, (user) => user.wishlists, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @AutoMap(() => User)
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
  @AutoMap()
  status: WishlistStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
