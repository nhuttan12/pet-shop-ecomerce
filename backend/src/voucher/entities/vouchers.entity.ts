import { Order } from '@order/entites/orders.entity';
import { VoucherStatus } from '@voucher/enums/vouchers-status.enum';
import { VoucherMapping } from './voucher-mapping.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

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
