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
import { AutoMap } from '@automapper/classes';

@Entity('post_edit_request')
export class PostEditRequest {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Post, (post) => post.postEditRequest, { nullable: false })
  @AutoMap(() => Post)
  post: Post;

  @ManyToOne(() => User, (user) => user.postEditRequestAsEmployee, {
    nullable: false,
  })
  @JoinColumn({ name: 'employee_id' })
  @AutoMap(() => User)
  employee: User;

  @Column({
    type: 'enum',
    enum: PostEditRequestStatus,
    default: PostEditRequestStatus.PENDING,
  })
  @AutoMap()
  status: PostEditRequestStatus;

  @Column('text', { name: 'content_suggested', nullable: true })
  @AutoMap()
  contentSuggested?: string;

  @Column('text')
  @AutoMap()
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  @AutoMap()
  resolvedAt?: Date;
}
