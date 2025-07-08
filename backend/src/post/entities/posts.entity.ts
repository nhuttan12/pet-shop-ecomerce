import { PostStatus } from '@post/enums/posts-status.enum';
import { User } from '@user/entites/users.entity';
import { PostEditRequest } from './post-edit-request.entity';
import { PostReport } from './post-report.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  author: User;

  @Column({
    type: 'enum',
    enum: PostStatus,
  })
  status: PostStatus;

  @Column({ name: 'has_pending_edit_request', type: 'boolean', default: false })
  hasPendingEditRequest: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PostEditRequest, (editRequest) => editRequest.post)
  postEditRequest: PostEditRequest[];

  @OneToMany(() => PostReport, (postReport) => postReport.post)
  postReports: PostReport[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
