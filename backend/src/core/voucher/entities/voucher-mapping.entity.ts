import { User } from '@user/entites/users.entity';
import { Voucher } from './vouchers.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('voucher_mapping')
export class VoucherMapping {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => User, (user) => user.voucherMapping, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @AutoMap(() => User)
  user: User;

  @ManyToOne(() => Voucher, (voucher) => voucher.voucherMapping, {
    nullable: false,
  })
  @JoinColumn({ name: 'voucher_id' })
  @AutoMap(() => Voucher)
  voucher: Voucher;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;
}
