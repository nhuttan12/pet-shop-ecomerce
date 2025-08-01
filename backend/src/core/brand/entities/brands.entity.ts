import { BrandStatus } from '@brand/enums/brand-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@product/entites/products.entity';
import { AutoMap } from '@automapper/classes';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 45 })
  @AutoMap()
  name: string;

  @Column({
    type: 'enum',
    enum: BrandStatus,
  })
  @AutoMap()
  status: BrandStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  // Quan hệ 1-n với Product
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
