import { AutoMap } from '@automapper/classes';
import { RoleStatus } from '@role/enums/role-status.enum';
import { User } from '@user/entites/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 45 })
  @AutoMap()
  name: string;

  @Column({
    type: 'enum',
    enum: RoleStatus,
  })
  @AutoMap()
  status: RoleStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  // Quan hệ 1-n với User
  @OneToMany(() => User, (user: User) => user.role)
  users: User[];
}
