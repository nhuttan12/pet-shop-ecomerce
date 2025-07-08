import { PostEditRequestStatus } from '@post/enums/post-edit-request-status.enum';
import { User } from '@user/entites/users.entity';
import { Post } from './posts.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('post_edit_request')
export class PostEditRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.postEditRequest, { nullable: false })
  post: Post;

  @ManyToOne(() => User, (user) => user.postEditRequestAsEmployee, {
    nullable: false,
  })
  @JoinColumn({ name: 'employee_id' })
  employee: User;

  @Column({
    type: 'enum',
    enum: PostEditRequestStatus,
    default: PostEditRequestStatus.PENDING,
  })
  status: PostEditRequestStatus;

  @Column('text', { name: 'content_suggested', nullable: true })
  contentSuggested?: string;

  @Column('text')
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt?: Date;
}
