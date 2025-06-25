import { User } from '@user';
import { RatingStatus } from '@product-rating';
import { Product } from '@product';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('product_rating') // Đổi tên bảng cho phù hợp (không dùng dấu '-')
export class ProductRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int', { name: 'star_rated' })
  starRated: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    type: 'enum',
    enum: RatingStatus,
    default: RatingStatus.ACTIVE,
  })
  status: RatingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
