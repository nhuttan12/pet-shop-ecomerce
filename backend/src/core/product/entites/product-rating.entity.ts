import { AutoMap } from '@automapper/classes';
import { Product } from '@product/entites/products.entity';
import { RatingStatus } from '@product/enums/product-rating.enum';
import { User } from '@user/entites/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_rating')
export class ProductRating {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @AutoMap(() => User)
  user: User;

  @Column('int', { name: 'star_rated' })
  @AutoMap()
  starRated: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  @AutoMap(() => Product)
  product: Product;

  @Column({
    type: 'enum',
    enum: RatingStatus,
    default: RatingStatus.ACTIVE,
  })
  @AutoMap()
  status: RatingStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
