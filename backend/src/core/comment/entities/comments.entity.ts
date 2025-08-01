import { AutoMap } from '@automapper/classes';
import { CommentStatus } from '@comment/enums/comment-status.enum';
import { Post } from '@post/entities/posts.entity';
import { User } from '@user/entites/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  content: string;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.ACTIVE,
  })
  @AutoMap()
  status: CommentStatus;

  @CreateDateColumn({ name: 'created_at' })
  @AutoMap()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @AutoMap()
  updatedAt: Date;

  // 👉 Relations

  @ManyToOne(() => User, (user: User) => user.comments)
  @JoinColumn({ name: 'user_id' })
  @AutoMap()
  user: User;

  @ManyToOne(() => Post, (post: Post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  @AutoMap()
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  @AutoMap()
  parentComment: Comment | null;

  // 👇 optional reverse relation (not required unless needed)
  @OneToMany(() => Comment, (comment: Comment) => comment.parentComment)
  children: Comment[];
}
