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
import { AutoMap } from '@automapper/classes';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column('text', { name: 'voucher_code' })
  @AutoMap()
  voucherCode: string;

  @Column({
    type: 'enum',
    enum: VoucherStatus,
  })
  @AutoMap()
  status: VoucherStatus;

  @Column('int')
  @AutoMap()
  discount: number;

  @Column('timestamp', {
    name: 'expire_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @AutoMap()
  expireAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => VoucherMapping, (voucherMapping) => voucherMapping.voucher)
  voucherMapping: VoucherMapping[];

  @OneToMany(() => Order, (order) => order.voucher)
  orders: Order[];
}
