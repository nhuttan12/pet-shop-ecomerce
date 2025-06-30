import { CategoryMapping, CategoryStatus } from '@category';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
  })
  status: CategoryStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CategoryMapping, (mapping) => mapping.category)
  categoriesMapping: CategoryMapping[];
}
