import { Order } from '@order';
import { VoucherMapping } from '@voucher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoucherStatus } from 'voucher/enums';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'voucher_code' })
  voucherCode: string;

  @Column({
    type: 'enum',
    enum: VoucherStatus,
  })
  status: VoucherStatus;

  @Column('int')
  discount: number;

  @Column('timestamp', {
    name: 'expire_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  expireAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => VoucherMapping, (voucherMapping) => voucherMapping.voucher)
  voucherMapping: VoucherMapping[];

  @OneToMany(() => Order, (order) => order.voucher)
  orders: Order[];
}
