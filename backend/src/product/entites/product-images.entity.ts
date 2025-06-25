import { Image } from '@common';
import { Product } from 'product/entites';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productImages, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Image, { nullable: false })
  @JoinColumn({ name: 'image_id' })
  image: Image;

  @Column({ type: 'varchar', length: 255, nullable: true })
  folder?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
