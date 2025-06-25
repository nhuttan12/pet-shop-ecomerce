import { ImageStatus, ImageType } from '@common';
import { ProductImage } from '@product';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;
  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type: ImageType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  folder?: string;

  @Column({
    type: 'enum',
    enum: ImageStatus,
    nullable: true,
  })
  status?: ImageStatus;

  @Column()
  subjectId: number;

  @Column()
  subjectType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ProductImage, (productImage) => productImage.image)
  productImages: ProductImage[];
}
