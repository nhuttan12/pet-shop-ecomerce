import { AutoMap } from '@automapper/classes';
import { Cart } from '@cart/entities/carts.entity';
import { Comment } from '@comment/entities/comments.entity';
import { Order } from '@order/entites/orders.entity';
import { PostEditRequest } from '@post/entities/post-edit-request.entity';
import { PostReport } from '@post/entities/post-report.entity';
import { Post } from '@post/entities/posts.entity';
import { ProductRating } from '@product/entites/product-rating.entity';
import { Role } from '@role/entities/roles.entity';
import { UserDetail } from '@user/entites/user-details.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import { VoucherMapping } from '@voucher/entities/voucher-mapping.entity';
import { Wishlist } from '@wishlist/entities/wishlists.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 45, unique: true })
  @AutoMap()
  username: string;

  @Column({ length: 255 })
  @AutoMap()
  password: string;

  @Column({ length: 100, nullable: true })
  @AutoMap()
  name?: string;

  @Column({ length: 100, unique: true })
  @AutoMap()
  email: string;

  @ManyToOne(() => Role, (role: Role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  @AutoMap(() => Role)
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  @AutoMap()
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  // Quan hệ 1-1 với UserDetail
  @OneToOne(() => UserDetail, (userDetail: UserDetail) => userDetail.user)
  @AutoMap(() => UserDetail)
  userDetail: UserDetail;

  // Quan hệ 1-n với Order
  @OneToMany(() => Order, (order: Order) => order.user)
  orders: Order[];

  // Quan hệ 1-n với Cart
  @OneToMany(() => Cart, (cart: Cart) => cart.user)
  carts: Cart[];

  // Quan hệ 1-n với Wishlist
  @OneToMany(() => Wishlist, (wishlist: Wishlist) => wishlist.user)
  wishlists: Wishlist[];

  // Quan hệ 1-n với ProductRating (customerRating)
  @OneToMany(() => ProductRating, (rating: ProductRating) => rating.user)
  customerRating: ProductRating[];

  // Quan hệ 1-n với VoucherMapping
  @OneToMany(() => VoucherMapping, (mapping: VoucherMapping) => mapping.user)
  voucherMapping: VoucherMapping[];

  // Quan hệ 1-n với Post
  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];

  // Quan hệ 1-n với PostEditRequest
  @OneToMany(
    () => PostEditRequest,
    (request: PostEditRequest) => request.employee,
  )
  postEditRequestAsEmployee: PostEditRequest[];

  // Quan hệ 1-n với PostReport
  @OneToMany(() => PostReport, (report: PostReport) => report.user)
  postReports: PostReport[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Comment[];
}
