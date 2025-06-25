import { RoleStatus } from '@role';
import { User } from '@user';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({
    type: 'enum',
    enum: RoleStatus,
  })
  status: RoleStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Quan hệ 1-n với User
  // Đảm bảo entity User có trường 'role' với @ManyToOne
  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
