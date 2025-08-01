import { PostReportStatus } from '@post/enums/post-report-status.enum';
import { User } from '@user/entites/users.entity';
import { Post } from './posts.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity('post_report')
export class PostReport {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Post, (post) => post.postReports, { nullable: false })
  @AutoMap(() => Post)
  post: Post;

  @ManyToOne(() => User, (user) => user.postReports, { nullable: false })
  @AutoMap(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: PostReportStatus,
    default: PostReportStatus.PENDING,
  })
  @AutoMap()
  status: PostReportStatus;

  @Column('text')
  @AutoMap()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;
}
