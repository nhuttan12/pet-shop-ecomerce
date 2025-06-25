import { BrandStatus } from '@brand';
import { Product } from '@product';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({
    type: 'enum',
    enum: BrandStatus,
  })
  status: BrandStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Quan hệ 1-n với Product
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
