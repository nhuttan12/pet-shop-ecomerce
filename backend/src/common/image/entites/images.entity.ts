import { AutoMap } from '@automapper/classes';
import { ImageStatus } from '@images/enums/image-status.enum';
import { ImageType } from '@images/enums/image-type.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column('text')
  @AutoMap()
  url: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  @AutoMap()
  type: ImageType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @AutoMap()
  folder?: string;

  @Column({
    type: 'enum',
    enum: ImageStatus,
    nullable: true,
  })
  @AutoMap()
  status?: ImageStatus;

  @Column({
    nullable: true,
  })
  @AutoMap()
  subjectID: number;

  @Column({
    nullable: true,
  })
  @AutoMap()
  subjectType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @AutoMap()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @AutoMap()
  updatedAt: Date;
}
