import { Post, PostReportStatus } from '@post';
import { User } from '@user';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('post_report')
export class PostReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.postReports, { nullable: false })
  post: Post;

  @ManyToOne(() => User, (user) => user.postReports, { nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: PostReportStatus,
    default: PostReportStatus.PENDING,
  })
  status: PostReportStatus;

  @Column('text')
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
