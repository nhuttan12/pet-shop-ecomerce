import { Category } from '@category/entities/categories.entity';
import { CategoryMappingStatus } from '@category/enums/categories-mapping-status.enum';
import { Product } from '@product/entites/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories_mapping')
export class CategoryMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product: Product) => product.categoriesMapping, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(
    () => Category,
    (category: Category) => category.categoriesMapping,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({
    type: 'enum',
    enum: CategoryMappingStatus,
    default: CategoryMappingStatus.ACTIVE,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
