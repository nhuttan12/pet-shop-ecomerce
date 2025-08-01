import { CategoryStatus } from '@category/enums/categories-status.enum';
import { CategoryMapping } from './categories-mapping.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ type: 'varchar', length: 45 })
  @AutoMap()
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryStatus,
  })
  @AutoMap()
  status: CategoryStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => CategoryMapping, (mapping) => mapping.category)
  @AutoMap(() => [CategoryMapping])
  categoriesMapping: CategoryMapping[];
}
