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

@Entity('voucher_mapping')
export class VoucherMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.voucherMapping, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Voucher, (voucher) => voucher.voucherMapping, {
    nullable: false,
  })
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
