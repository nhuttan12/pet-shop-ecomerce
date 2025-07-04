import { Comment } from '@comment';
import { PostEditRequest, PostReport, PostStatus } from '@post';
import { User } from '@user';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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
