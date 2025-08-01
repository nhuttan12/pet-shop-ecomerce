import { AutoMap } from '@automapper/classes';
import { ContactStatus } from '@contact/enums/contact-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @AutoMap()
  name: string;

  @Column({ type: 'varchar', length: 100 })
  @AutoMap()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @AutoMap()
  title: string;

  @Column({ type: 'text' })
  @AutoMap()
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
  })
  @AutoMap()
  status: ContactStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;
}
