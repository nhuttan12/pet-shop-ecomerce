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
import { Comment } from '@comment/entities/comments.entity';
import { AutoMap } from '@automapper/classes';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 255 })
  @AutoMap()
  title: string;

  @Column('text')
  @AutoMap()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @AutoMap(() => User)
  author: User;

  @Column({
    type: 'enum',
    enum: PostStatus,
  })
  @AutoMap()
  status: PostStatus;

  @Column({ name: 'has_pending_edit_request', type: 'boolean', default: false })
  @AutoMap()
  hasPendingEditRequest: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  @OneToMany(() => PostEditRequest, (editRequest) => editRequest.post)
  postEditRequest: PostEditRequest[];

  @OneToMany(() => PostReport, (postReport) => postReport.post)
  postReports: PostReport[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  comments: Comment[];
}
