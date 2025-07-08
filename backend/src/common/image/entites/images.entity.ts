import { ImageStatus } from '@images/enums/image-status.enum';
import { ImageType } from '@images/enums/image-type.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  subjectID: number;

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
}
