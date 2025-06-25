import { Cart } from '@cart';
import { Order } from '@order';
import { Post, PostEditRequest, PostReport } from '@post';
import { Role } from '@role';
import { UserDetail, UserStatus } from '@user';
import { Voucher, VoucherMapping } from '@voucher';
import { Wishlist } from '@wishlist';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100, nullable: true })
  name?: string;

  @Column({ length: 100, unique: true })
  email: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Quan hệ 1-1 với UserDetail
  @OneToOne(() => UserDetail, (userDetail) => userDetail.user)
  userDetail: UserDetail;

  // Quan hệ 1-n với Order
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Quan hệ 1-n với Cart
  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  // Quan hệ 1-n với Wishlist
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  // Quan hệ 1-n với ProductRating (customerRating)
  @OneToMany(() => ProductRating, (rating) => rating.user)
  customerRating: ProductRating[];

  // Quan hệ 1-n với VoucherMapping
  @OneToMany(() => VoucherMapping, (mapping) => mapping.user)
  voucherMapping: VoucherMapping[];

  // Quan hệ 1-n với Post
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  // Quan hệ 1-n với PostEditRequest
  @OneToMany(() => PostEditRequest, (request) => request.employee)
  postEditRequest: PostEditRequest[];

  // Quan hệ 1-n với PostReport
  @OneToMany(() => PostReport, (report) => report.user)
  postReports: PostReport[];
}
